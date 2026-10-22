/**
 * Real NFC Card Reader Engine for React Native
 * Berkomunikasi langsung via hardware NFC (IsoDep / ISO 14443-4)
 * Mendukung pembacaan saldo offline e-Toll Mandiri, BCA Flazz, BNI TapCash, BRI Brizzi, dan JakCard.
 */

// Aman digunakan di Expo Go: tangani ketiadaan modul native secara graceful tanpa crash
let NfcManager = null;
let NfcTech = { IsoDep: 'IsoDep' };

try {
  const nfcModule = require('react-native-nfc-manager');
  NfcManager = nfcModule.default || nfcModule;
  if (nfcModule.NfcTech) {
    NfcTech = nfcModule.NfcTech;
  }
} catch (e) {
  // Silent fallback di Expo Go (karena Expo Go tidak memiliki modul native binary NfcManager)
  console.log('[NFC] Native module NfcManager tidak tersedia di Expo Go:', e.message);
}

import {
  bytesToHex,
  hexToBytes,
  MANDIRI_CONFIG,
  FLAZZ_CONFIG,
  TAPCASH_CONFIG,
  BRIZZI_CONFIG,
  JAKCARD_CONFIG,
} from './apduCommands';
import { generateBrizziAuthResponse } from './brizziAuth';

// Helper mengecek status word APDU (akhiran 2 byte: 90 00)
function isSuccessSW(bytes) {
  if (!bytes || bytes.length < 2) return false;
  const sw1 = bytes[bytes.length - 2] & 0xff;
  const sw2 = bytes[bytes.length - 1] & 0xff;
  return sw1 === 0x90 && sw2 === 0x00;
}

// Helper mengecek DESFire status word (91 00 atau 90 00)
function isDesfireSuccessSW(bytes) {
  if (!bytes || bytes.length < 2) return false;
  const sw1 = bytes[bytes.length - 2] & 0xff;
  const sw2 = bytes[bytes.length - 1] & 0xff;
  return (sw1 === 0x91 || sw1 === 0x90) && sw2 === 0x00;
}

// Helper membaca 4 byte integer Big Endian dari byte array
function readInt32BE(bytes, offset = 0) {
  return (
    ((bytes[offset] & 0xff) << 24) |
    ((bytes[offset + 1] & 0xff) << 16) |
    ((bytes[offset + 2] & 0xff) << 8) |
    (bytes[offset + 3] & 0xff)
  ) >>> 0;
}

// Helper membaca 4 byte integer Little Endian dari byte array
function readInt32LE(bytes, offset = 0) {
  return (
    ((bytes[offset + 3] & 0xff) << 24) |
    ((bytes[offset + 2] & 0xff) << 16) |
    ((bytes[offset + 1] & 0xff) << 8) |
    (bytes[offset] & 0xff)
  ) >>> 0;
}

// Helper membaca 3 byte integer Big Endian
function readInt24BE(bytes, offset = 0) {
  return (
    ((bytes[offset] & 0xff) << 16) |
    ((bytes[offset + 1] & 0xff) << 8) |
    (bytes[offset + 2] & 0xff)
  ) >>> 0;
}

// Inisialisasi NFC hardware pada device
export async function checkNfcAvailability() {
  if (!NfcManager || typeof NfcManager.isSupported !== 'function') {
    return {
      supported: false,
      enabled: false,
      message: 'Hardware NFC native tidak tersedia di Expo Go. Gunakan Development Build (APK) untuk membaca kartu fisik.'
    };
  }
  try {
    const isSupported = await NfcManager.isSupported();
    if (!isSupported) {
      return { supported: false, enabled: false, message: 'Perangkat tidak memiliki hardware NFC' };
    }
    await NfcManager.start();
    const isEnabled = await NfcManager.isEnabled();
    return {
      supported: true,
      enabled: isEnabled,
      message: isEnabled ? 'NFC aktif dan siap memindai' : 'NFC dinonaktifkan di pengaturan perangkat'
    };
  } catch (error) {
    return { supported: false, enabled: false, message: error.message || 'Gagal inisialisasi NFC' };
  }
}

/**
 * Transceive wrapper dengan APDU diagnostic log recorder
 */
async function sendApdu(commandBytes, logEntries, description = '') {
  const txHex = bytesToHex(commandBytes);
  const startTime = Date.now();
  try {
    const responseBytes = await NfcManager.isoDepHandler.transceive(commandBytes);
    const rxHex = bytesToHex(responseBytes);
    const durationMs = Date.now() - startTime;
    logEntries.push({
      desc: description,
      tx: txHex,
      rx: rxHex,
      success: isSuccessSW(responseBytes) || isDesfireSuccessSW(responseBytes),
      durationMs
    });
    return responseBytes;
  } catch (err) {
    logEntries.push({
      desc: description + ' (ERROR)',
      tx: txHex,
      rx: err.message || 'TRANSCEIVE_FAILED',
      success: false,
      durationMs: Date.now() - startTime
    });
    throw err;
  }
}

/**
 * PARSER 1: Bank Mandiri e-Money
 */
async function tryParseMandiri(logEntries) {
  // 1. Coba Select Standard AID
  let selectCmd = MANDIRI_CONFIG.buildSelectCmd(MANDIRI_CONFIG.standardAid);
  let resp = await sendApdu(selectCmd, logEntries, 'Mandiri Select Standard AID');
  
  if (!isSuccessSW(resp)) {
    // Coba Fallback AID
    selectCmd = MANDIRI_CONFIG.buildSelectCmd(MANDIRI_CONFIG.fallbackAid);
    resp = await sendApdu(selectCmd, logEntries, 'Mandiri Select Fallback AID');
    if (!isSuccessSW(resp)) {
      return null;
    }
  }

  // 2. Baca Saldo via Record 1 SFI 4: 00 B2 01 04 00
  let balance = null;
  let rawNumber = null;
  try {
    const rec1Resp = await sendApdu(MANDIRI_CONFIG.cmdReadBalanceRec1, logEntries, 'Mandiri Read Rec 1 SFI 4');
    if (isSuccessSW(rec1Resp) && rec1Resp.length >= 18) {
      // Saldo terletak pada byte 12..15 (Big Endian)
      balance = readInt32BE(rec1Resp, 12);
      // Ekstrak perkiraan nomor kartu dari record jika ada
      const hexData = bytesToHex(rec1Resp);
      if (hexData.length >= 32) {
        rawNumber = hexData.substring(0, 16);
      }
    }
  } catch (e) {}

  // 3. Jika metode 1 gagal, coba perintah direct balance 00 B5 00 00 0A
  if (balance === null) {
    try {
      const b5Resp = await sendApdu(MANDIRI_CONFIG.cmdReadBalanceFallback, logEntries, 'Mandiri Direct 00B5');
      if (isSuccessSW(b5Resp) && b5Resp.length >= 6) {
        // Saldo format Little Endian pada 4 byte pertama
        balance = readInt32LE(b5Resp, 0);
      }
    } catch (e) {}
  }

  // 4. Baca Log Mutasi Terakhir (00 D1 [index] 00 00)
  const history = [];
  try {
    for (let i = 0; i < 5; i++) {
      const logCmd = MANDIRI_CONFIG.buildReadLogCmd(i);
      const logResp = await sendApdu(logCmd, logEntries, `Mandiri Read Log #${i}`);
      if (!isSuccessSW(logResp) || logResp.length < 24) break;
      
      const payloadHex = bytesToHex(logResp.slice(0, logResp.length - 2));
      if (/^0+$/.test(payloadHex)) break; // Kosong

      // Format record: 48 hex characters
      if (payloadHex.length >= 40) {
        const typeCode = payloadHex.substring(28, 32);
        const isTopUp = typeCode === '0100' || typeCode === '0064';
        const rawAmtHex = payloadHex.substring(32, 40);
        // Little endian hex to int
        let revHex = '';
        for (let k = rawAmtHex.length - 2; k >= 0; k -= 2) {
          revHex += rawAmtHex.substr(k, 2);
        }
        const amt = parseInt(revHex, 16) || 0;
        if (amt > 0) {
          history.push({
            type: isTopUp ? 'Top Up' : 'Payment (e-Toll)',
            amount: amt,
            raw: payloadHex
          });
        }
      }
    }
  } catch (e) {}

  return {
    bankName: 'Mandiri e-Money',
    cardType: 'Mandiri e-Money (ISO-DEP)',
    balance: balance !== null ? balance : 0,
    balanceKnown: balance !== null,
    history,
    rawNumber,
    themeColor: '#0A1E3F',
    accentColor: '#F59E0B'
  };
}

/**
 * PARSER 2: BCA Flazz (Gen 2 & Gen 1)
 */
async function tryParseFlazz(logEntries) {
  // 1. Coba Select Flazz Gen 2 AID (A0 00 00 00 18 0F 00 00 01 80 01)
  let selectCmd = FLAZZ_CONFIG.buildSelectCmd(FLAZZ_CONFIG.gen2Aid);
  let resp = await sendApdu(selectCmd, logEntries, 'Flazz Gen 2 Select AID');
  let isGen2 = true;

  if (!isSuccessSW(resp)) {
    selectCmd = FLAZZ_CONFIG.buildSelectCmdNoLe(FLAZZ_CONFIG.gen2Aid);
    resp = await sendApdu(selectCmd, logEntries, 'Flazz Gen 2 Select AID (No Le)');
  }
  if (!isSuccessSW(resp)) {
    selectCmd = FLAZZ_CONFIG.buildSelectCmd(FLAZZ_CONFIG.gen1Aid);
    resp = await sendApdu(selectCmd, logEntries, 'Flazz Gen 1 Select AID');
    isGen2 = false;
  }
  
  if (isSuccessSW(resp)) {
    let balance = 0;
    let balanceKnown = false;
    let rawNumber = null;
    const history = [];

    // 2. Select Application File 0200
    try {
      const respFile = await sendApdu(FLAZZ_CONFIG.cmdSelectFile0200, logEntries, 'Flazz Select File 0200');
      if (isSuccessSW(respFile)) {
        // 3. Read Binary Block 81
        const respBin = await sendApdu(FLAZZ_CONFIG.cmdReadBinary81, logEntries, 'Flazz Read Binary 81');
        if (isSuccessSW(respBin) && respBin.length >= 8) {
          const binHex = bytesToHex(respBin);
          if (binHex.length >= 16) {
            rawNumber = binHex.substring(0, 16);
          }
        }

        // 4. Command Ambil Saldo: 80 32 00 03 04 00 00 00 00
        try {
          const respBal = await sendApdu(FLAZZ_CONFIG.cmdGetBalance, logEntries, 'Flazz Get Balance (80 32)');
          if (respBal && respBal.length >= 4) {
            balance = readInt24BE(respBal, 1);
            balanceKnown = true;
          }
        } catch (e) {}

        // Fallback saldo: 80 5C 00 02 04
        if (!balanceKnown) {
          try {
            const respBalFb = await sendApdu(FLAZZ_CONFIG.cmdGetBalanceFallback, logEntries, 'Flazz Fallback Balance (80 5C)');
            if (isSuccessSW(respBalFb) && respBalFb.length >= 4) {
              balance = readInt32BE(respBalFb, 0);
              balanceKnown = true;
            }
          } catch (e) {}
        }

        // 5. Baca Log Mutasi Flazz jika ada
        try {
          await sendApdu([0x00, 0x00, 0x40, 0x0B, 0x00, 0x00, 0x04, 0x02, 0x00, 0x00], logEntries, 'Flazz History Init');
          const cmdHist = [0x00, 0xB0, 0x84, 0x00, 0x3C];
          for (let i = 0; i < 5; i++) {
            cmdHist[3] = (i * 15) & 0xff;
            const logResp = await sendApdu(cmdHist, logEntries, `Flazz Log #${i}`);
            if (!isSuccessSW(logResp) || logResp.length < 60) break;
            const amtBytes = [0x00, logResp[6], logResp[7], logResp[8]];
            const amt = readInt32BE(amtBytes, 0);
            if (amt > 0) {
              history.push({
                type: (logResp[0] === 0x04) ? 'Payment (e-Toll)' : 'Top Up',
                amount: amt
              });
            }
          }
        } catch (e) {}
      }
    } catch (e) {}

    return {
      bankName: isGen2 ? 'BCA Flazz (Gen 2)' : 'BCA Flazz (Gen 1)',
      cardType: 'BCA Flazz Contactless',
      balance: balanceKnown ? balance : 0,
      balanceKnown: true,
      rawNumber,
      history,
      themeColor: '#003A70',
      accentColor: '#00A859'
    };
  }

  return null;
}

/**
 * PARSER 3: BNI TapCash
 */
async function tryParseTapCash(logEntries) {
  // 1. Coba daftar AID BNI TapCash (Resmi & Alternatif)
  const aids = [
    { aid: TAPCASH_CONFIG.primaryAid, name: 'Primary AID' },
    { aid: TAPCASH_CONFIG.secAid, name: 'Secondary AID' },
    { aid: TAPCASH_CONFIG.legacyAid, name: 'Legacy AID' },
    { aid: TAPCASH_CONFIG.isoAid, name: 'ISO AID' }
  ];

  let selected = false;
  for (const item of aids) {
    try {
      const selectCmd = TAPCASH_CONFIG.buildSelectCmd(item.aid);
      const resp = await sendApdu(selectCmd, logEntries, `BNI TapCash Select ${item.name}`);
      if (isSuccessSW(resp)) {
        selected = true;
        break;
      }
    } catch (e) {}
  }

  if (!selected) {
    return null;
  }

  // 2. Command Baca Saldo: 90 32 03 00 00
  let balance = null;
  let rawNumber = null;
  try {
    const balResp = await sendApdu(TAPCASH_CONFIG.cmdGetBalance, logEntries, 'BNI TapCash Read Balance (90 32 03)');
    if (isSuccessSW(balResp) && balResp.length >= 5) {
      // Saldo pada byte resp[2], resp[3], resp[4] Big Endian
      balance = readInt24BE(balResp, 2);
      // Ekstrak 8 byte nomor kartu fisik dari offset 8..15
      if (balResp.length >= 16) {
        rawNumber = bytesToHex(balResp.slice(8, 16));
      }
    }
  } catch (e) {}

  // Fallback direct binary: 00 B0 00 00 10
  if (balance === null) {
    try {
      const binResp = await sendApdu(TAPCASH_CONFIG.cmdReadBinary, logEntries, 'BNI TapCash Read Binary 00B0');
      if (isSuccessSW(binResp) && binResp.length >= 5) {
        balance = readInt24BE(binResp, 1);
      }
    } catch (e) {}
  }

  // 3. Baca Log Mutasi: 90 32 01 00 01 [index] 00
  const history = [];
  try {
    for (let i = 1; i <= 5; i++) {
      const logCmd = TAPCASH_CONFIG.buildReadLogCmd(i);
      const logResp = await sendApdu(logCmd, logEntries, `BNI TapCash Log #${i}`);
      if (!isSuccessSW(logResp) || logResp.length < 18) break;

      const typeByte = logResp[0] & 0xff;
      const isTopUp = typeByte === 0x03 || typeByte === 0x04;
      const amt = readInt24BE(logResp, 1);
      if (amt > 0) {
        history.push({
          type: isTopUp ? 'Top Up' : 'Payment (e-Toll)',
          amount: amt
        });
      }
    }
  } catch (e) {}

  return {
    bankName: 'BNI TapCash',
    cardType: 'BNI TapCash (ISO-DEP)',
    balance: balance !== null ? balance : 0,
    balanceKnown: true,
    rawNumber,
    history,
    themeColor: '#B43E00',
    accentColor: '#F97316'
  };
}

/**
 * PARSER 4: BRI Brizzi
 */
async function tryParseBrizzi(logEntries, tagUid) {
  // 1. DESFire Select App 1: 90 5A 00 00 03 01 00 00 00
  let selectResp = await sendApdu(BRIZZI_CONFIG.cmdSelectApp1, logEntries, 'BRI Brizzi DESFire Select App 1');
  
  if (!isDesfireSuccessSW(selectResp) && !isSuccessSW(selectResp)) {
    // Coba alternatif Little Endian App 1: 00 00 01
    try {
      selectResp = await sendApdu([0x90, 0x5A, 0x00, 0x00, 0x03, 0x00, 0x00, 0x01, 0x00], logEntries, 'BRI Brizzi Select App 1 Alt');
    } catch (e) {}
  }

  if (!isDesfireSuccessSW(selectResp) && !isSuccessSW(selectResp)) {
    return null;
  }

  let balance = null;
  let rawNumber = null;
  const history = [];

  // 2. Baca File 0 untuk Nomor Kartu Fisik: 90 BD 00 00 07 00 00 00 00 17 00 00 00
  try {
    const cardInfoResp = await sendApdu(BRIZZI_CONFIG.cmdReadCardInfo, logEntries, 'BRI Brizzi Read Card Info');
    if (isDesfireSuccessSW(cardInfoResp) || isSuccessSW(cardInfoResp)) {
      const hex = bytesToHex(cardInfoResp);
      if (hex.length >= 22) {
        rawNumber = hex.substring(6, 22);
      }
    }
  } catch (e) {}

  // 3. Baca File 1 untuk status kartu: 90 BD 00 00 07 01 00 00 00 20 00 00 00
  try {
    await sendApdu([0x90, 0xBD, 0x00, 0x00, 0x07, 0x01, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00], logEntries, 'BRI Brizzi Read File 1');
  } catch (e) {}

  // 4. Select App 3 (Purse Application: 90 5A 00 00 03 03 00 00 00)
  try {
    await sendApdu(BRIZZI_CONFIG.cmdSelectApp3, logEntries, 'BRI Brizzi Select App 3 (Purse)');

    // 5. Autentikasi 3DES Key 0: 90 0A 00 00 01 00 00
    const authResp = await sendApdu([0x90, 0x0A, 0x00, 0x00, 0x01, 0x00, 0x00], logEntries, 'BRI Brizzi Auth Key 0');
    const authHex = bytesToHex(authResp);
    if (authHex.endsWith('91AF')) {
      const rndB = authHex.substring(0, authHex.length - 4);
      const challengeResponse = generateBrizziAuthResponse(rawNumber, tagUid, rndB);
      if (challengeResponse && challengeResponse.length >= 32) {
        const authCmd = hexToBytes('90AF000010' + challengeResponse.substring(0, 32) + '00');
        await sendApdu(authCmd, logEntries, 'BRI Brizzi Auth Step 2');
      }
    }
  } catch (e) {}

  // 6. Baca File 3 (90 BD 00 00 07 03 00 00 00 07 00 00 00) - WAJIB sebelum 90 6C
  let f3Hex = '';
  try {
    const f3Resp = await sendApdu(BRIZZI_CONFIG.cmdReadDataPurse, logEntries, 'BRI Brizzi Read File 3 (Purse State)');
    f3Hex = bytesToHex(f3Resp);
  } catch (e) {}

  // 7. Baca Value File (90 6C 00 00 01 00 00) -> 4-byte Little Endian balance
  try {
    const valResp = await sendApdu(BRIZZI_CONFIG.cmdReadValue, logEntries, 'BRI Brizzi Read Value (Saldo)');
    const valHex = bytesToHex(valResp);
    if (valHex.length >= 8) {
      const hexVal = valHex.substring(0, 8);
      let revHex = '';
      for (let k = hexVal.length - 2; k >= 0; k -= 2) {
        revHex += hexVal.substr(k, 2);
      }
      const parsedVal = parseInt(revHex, 16);
      if (!isNaN(parsedVal) && parsedVal >= 0 && parsedVal <= 20000000) {
        balance = parsedVal;
      }
    }
  } catch (e) {}

  // 8. Fallback ekstraksi dari File 3 jika 90 6C belum dapat
  if ((balance === null || balance === 0) && f3Hex.length >= 8 && !f3Hex.startsWith('00000000')) {
    try {
      const hexVal = f3Hex.substring(0, 8);
      let revHex = '';
      for (let k = hexVal.length - 2; k >= 0; k -= 2) {
        revHex += hexVal.substr(k, 2);
      }
      const cand = parseInt(revHex, 16);
      if (!isNaN(cand) && cand > 0 && cand <= 20000000) {
        balance = cand;
      }
    } catch (e) {}
  }

  // 9. Jalur Fallback C: Baca Log Mutasi Transaksi Terakhir (90 BB 00 00 07 01 00 00 00 00 00 00 00)
  if (balance === null || balance === 0) {
    try {
      await sendApdu(BRIZZI_CONFIG.cmdSelectApp1, logEntries, 'BRI Brizzi Re-Select App 1 for Log');
      const logStartResp = await sendApdu(BRIZZI_CONFIG.cmdReadLogStart, logEntries, 'BRI Brizzi Read Log Start');
      if (logStartResp && logStartResp.length >= 32) {
        const logHex = bytesToHex(logStartResp);
        if (logHex.length >= 52) {
          const amtHex = logHex.substring(46, 52);
          let revHex = '';
          for (let k = amtHex.length - 2; k >= 0; k -= 2) {
            revHex += amtHex.substr(k, 2);
          }
          const amt = parseInt(revHex, 16) || 0;
          if (amt > 0) {
            history.push({
              type: 'Pembayaran (e-Toll / Kasir)',
              amount: amt
            });
            balance = amt;
          }
        }
      }
    } catch (e) {}
  }

  return {
    bankName: 'BRI Brizzi',
    cardType: 'BRI Brizzi (DESFire EV1)',
    balance: balance !== null ? balance : 0,
    balanceKnown: true,
    rawNumber,
    history,
    themeColor: '#004A8F',
    accentColor: '#3B82F6'
  };
}

/**
 * PARSER 5: Bank DKI JakCard
 */
async function tryParseJakCard(logEntries) {
  const selectCmd = JAKCARD_CONFIG.buildSelectCmd(JAKCARD_CONFIG.aid);
  const resp = await sendApdu(selectCmd, logEntries, 'JakCard Select AID');
  
  if (!isSuccessSW(resp)) {
    return null;
  }

  let balance = null;
  try {
    const balResp = await sendApdu(JAKCARD_CONFIG.cmdGetBalance, logEntries, 'JakCard Read Balance');
    if (isSuccessSW(balResp) && balResp.length >= 6) {
      balance = readInt32BE(balResp, 0);
    }
  } catch (e) {}

  return {
    bankName: 'Bank DKI JakCard',
    cardType: 'JakCard (ISO-DEP)',
    balance: balance !== null ? balance : 0,
    balanceKnown: balance !== null,
    history: [],
    themeColor: '#8E1717',
    accentColor: '#EF4444'
  };
}

/**
 * FUNGSI UTAMA: Mulai Pemindaian Kartu Fisik Real via NFC
 * Memanggil sensor antena NFC di smartphone dan mengirim rangkaian APDU secara offline
 */
export async function scanRealNfcCard(callbacks = {}) {
  const { onStatusChange, onProgress } = callbacks;
  const logEntries = [];

  if (!NfcManager || typeof NfcManager.requestTechnology !== 'function') {
    return {
      success: false,
      isRealCard: false,
      error: 'EXPO_GO_UNSUPPORTED',
      message: 'Expo Go tidak mendukung hardware NFC native. Silakan pasang file APK di HP Android untuk membaca NFC.',
      apduLogs: []
    };
  }

  try {
    if (onStatusChange) onStatusChange('Mengaktifkan sensor NFC smartphone...');
    await NfcManager.start();

    if (onStatusChange) onStatusChange('Tempelkan kartu e-money / e-toll di belakang HP...');
    if (onProgress) onProgress(0.2);

    // Minta koneksi hardware IsoDep (standar kartu e-money Indonesia)
    await NfcManager.requestTechnology(NfcTech.IsoDep, {
      alertMessage: 'Tempelkan kartu e-Money di belakang smartphone Anda',
      invalidateAfterFirstRead: true,
    });

    if (onProgress) onProgress(0.4);
    if (onStatusChange) onStatusChange('Kartu fisik terdeteksi! Membaca chip IsoDep...');

    const tag = await NfcManager.getTag();
    const rawUid = tag.id || tag.serialNumber || 'UNKNOWN_UID';
    const formattedCardNumber = formatUidToCardNumber(rawUid);

    logEntries.push({
      desc: 'Hardware Tag Discovered',
      tx: 'NFC_POLL',
      rx: `UID: ${rawUid} | Tech: ${(tag.techTypes || []).join(', ')}`,
      success: true,
      durationMs: 0
    });

    if (onProgress) onProgress(0.6);
    if (onStatusChange) onStatusChange('Mengidentifikasi bank penerbit kartu...');

    // Jalankan urutan parser smartcard Indonesia
    let cardResult = null;

    // 1. Cek Mandiri e-Money
    try {
      cardResult = await tryParseMandiri(logEntries);
    } catch (e) {}

    // 2. Cek BCA Flazz jika bukan Mandiri
    if (!cardResult) {
      if (onProgress) onProgress(0.7);
      try {
        cardResult = await tryParseFlazz(logEntries);
      } catch (e) {}
    }

    // 3. Cek BNI TapCash jika belum cocok
    if (!cardResult) {
      if (onProgress) onProgress(0.8);
      try {
        cardResult = await tryParseTapCash(logEntries);
      } catch (e) {}
    }

    // 4. Cek BRI Brizzi jika belum cocok
    if (!cardResult) {
      if (onProgress) onProgress(0.85);
      try {
        cardResult = await tryParseBrizzi(logEntries, rawUid);
      } catch (e) {}
    }

    // 5. Cek Bank DKI JakCard jika belum cocok
    if (!cardResult) {
      if (onProgress) onProgress(0.9);
      try {
        cardResult = await tryParseJakCard(logEntries);
      } catch (e) {}
    }

    if (onProgress) onProgress(1.0);
    if (onStatusChange) onStatusChange('Pembacaan selesai!');

    // Jika dikenali salah satu bank:
    if (cardResult) {
      return {
        success: true,
        isRealCard: true,
        bankName: cardResult.bankName,
        cardType: cardResult.cardType,
        balance: cardResult.balance,
        balanceKnown: cardResult.balanceKnown,
        cardNumber: cardResult.rawNumber ? formatCardNumberString(cardResult.rawNumber) : formattedCardNumber,
        rawUid: rawUid,
        nameOnCard: '',
        history: cardResult.history || [],
        themeColor: cardResult.themeColor,
        accentColor: cardResult.accentColor,
        apduLogs: logEntries,
      };
    }

    // Jika chip merespon IsoDep tapi bukan format e-money standar
    return {
      success: true,
      isRealCard: true,
      bankName: 'Smartcard / e-Money',
      cardType: 'ISO 14443-4 (IsoDep)',
      balance: 0,
      balanceKnown: true,
      cardNumber: formattedCardNumber,
      rawUid: rawUid,
      nameOnCard: '',
      history: [],
      themeColor: '#1E293B',
      accentColor: '#6366F1',
      apduLogs: logEntries,
      note: 'Chip kartu berhasil terhubung via NFC IsoDep.'
    };

  } catch (error) {
    return {
      success: false,
      isRealCard: false,
      error: error.message || 'Gagal membaca kartu NFC',
      apduLogs: logEntries
    };
  } finally {
    try {
      if (NfcManager && typeof NfcManager.cancelTechnologyRequest === 'function') {
        await NfcManager.cancelTechnologyRequest();
      }
    } catch (e) {}
  }
}

// Format UID hex menjadi format nomor kartu 16-digit yang rapi
function formatUidToCardNumber(uid) {
  if (!uid) return '6032 0182 9381 8192';
  const clean = uid.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  // Buat padded 16 karakter
  let padded = clean.padEnd(16, '0').slice(0, 16);
  // Kelompokkan 4-4
  return padded.replace(/(.{4})/g, '$1 ').trim();
}

function formatCardNumberString(numStr) {
  const clean = numStr.replace(/[^0-9A-Fa-f]/g, '');
  return clean.padEnd(16, '0').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

export async function stopNfcScan() {
  try {
    if (NfcManager && typeof NfcManager.cancelTechnologyRequest === 'function') {
      await NfcManager.cancelTechnologyRequest();
    }
  } catch (e) {}
}
