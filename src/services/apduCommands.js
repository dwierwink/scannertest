/**
 * Kumpulan Spesifikasi APDU dan Identifier Kartu Uang Elektronik Indonesia
 * Diadopsi dari riset open-source GitHub (muhakmal/osp-kue-reader & agusibrahim/prepaidcard_reader)
 * Berjalan 100% OFFLINE langsung pada chip kartu smartcard ISO/IEC 14443-4 (IsoDep).
 */

// Helper konversi hex string ke byte array (Array of integers 0..255)
export function hexToBytes(hex) {
  const cleanHex = hex.replace(/\s+/g, '');
  const bytes = [];
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes.push(parseInt(cleanHex.substr(i, 2), 16));
  }
  return bytes;
}

// Helper konversi byte array ke hex string kapital
export function bytesToHex(bytes) {
  if (!bytes) return '';
  return Array.from(bytes)
    .map(b => (b & 0xff).toString(16).padStart(2, '0').toUpperCase())
    .join('');
}

// Format Rupiah standar
export function formatRupiah(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return 'Rp 0';
  return 'Rp ' + Math.floor(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * 1. MANDIRI E-MONEY
 * Chip: MIFARE DESFire EV1/EV2 / SmartMX (ISO-DEP)
 */
export const MANDIRI_CONFIG = {
  name: 'Mandiri e-Money',
  bank: 'Bank Mandiri',
  standardAid: hexToBytes('A0 00 00 00 18 30 00 01'),
  fallbackAid: hexToBytes('00 00 00 00 00 00 00 01'),
  // Perintah Select AID: 00 A4 04 00 08 [AID] 00
  buildSelectCmd: (aid) => [0x00, 0xA4, 0x04, 0x00, aid.length, ...aid, 0x00],
  // Perintah Baca Record 1 SFI 4: 00 B2 01 04 00
  cmdReadBalanceRec1: [0x00, 0xB2, 0x01, 0x04, 0x00],
  // Fallback direct balance: 00 B5 00 00 0A
  cmdReadBalanceFallback: [0x00, 0xB5, 0x00, 0x00, 0x0A],
  // Perintah Baca Log Transaksi (0..31): 00 D1 [index] 00 00
  buildReadLogCmd: (index) => [0x00, 0xD1, index & 0xff, 0x00, 0x00],
};

/**
 * 2. BCA FLAZZ (Gen 1 & Gen 2)
 * Chip: ISO 14443-4 Contactless Smart Card
 */
export const FLAZZ_CONFIG = {
  name: 'BCA Flazz',
  bank: 'Bank BCA',
  gen2Aid: hexToBytes('A0 00 00 00 18 0F 00 00 01 80 01'),
  gen1Aid: hexToBytes('A0 00 00 00 03 86 98 07 01'),
  buildSelectCmd: (aid) => [0x00, 0xA4, 0x04, 0x00, aid.length, ...aid, 0x00],
  buildSelectCmdNoLe: (aid) => [0x00, 0xA4, 0x04, 0x00, aid.length, ...aid],
  // Select Application File 0200
  cmdSelectFile0200: [0x00, 0xA4, 0x01, 0x00, 0x02, 0x02, 0x00],
  // Read Binary Block: 00 B0 81 00 8E
  cmdReadBinary81: [0x00, 0xB0, 0x81, 0x00, 0x8E],
  // Get Balance: 80 32 00 03 04 00 00 00 00
  cmdGetBalance: [0x80, 0x32, 0x00, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00],
  // Fallback direct balance: 80 5C 00 02 04
  cmdGetBalanceFallback: [0x80, 0x5C, 0x00, 0x02, 0x04],
  cmdGetBalanceFallback2: [0x80, 0x5C, 0x00, 0x01, 0x04],
};

/**
 * 3. BNI TAPCASH
 * Chip: ISO-DEP Contactless Card
 */
export const TAPCASH_CONFIG = {
  name: 'BNI TapCash',
  bank: 'Bank BNI',
  primaryAid: hexToBytes('A0 00 42 4E 49 10 00 01'),
  secAid: hexToBytes('A0 00 42 4E 49 99 99 99'),
  legacyAid: hexToBytes('11 22 33 44 55 66'),
  isoAid: hexToBytes('A0 00 00 00 03 10 10'),
  buildSelectCmd: (aid) => [0x00, 0xA4, 0x04, 0x00, aid.length, ...aid, 0x00],
  // Get Balance: 90 32 03 00 00 (Byte 2..4 Big Endian, Byte 8..15 Nomor Kartu)
  cmdGetBalance: [0x90, 0x32, 0x03, 0x00, 0x00],
  // Fallback Read Binary: 00 B0 00 00 10
  cmdReadBinary: [0x00, 0xB0, 0x00, 0x00, 0x10],
  // Read Transaction Log: 90 32 01 00 01 [index] 00
  buildReadLogCmd: (index) => [0x90, 0x32, 0x01, 0x00, 0x01, index & 0xff, 0x00],
};

/**
 * 4. BRI BRIZZI
 * Chip: MIFARE DESFire EV1 (ISO-DEP)
 */
export const BRIZZI_CONFIG = {
  name: 'BRI Brizzi',
  bank: 'Bank BRI',
  // DESFire Select Application 0x000001 (App 1): 90 5A 00 00 03 01 00 00 00
  cmdSelectApp1: [0x90, 0x5A, 0x00, 0x00, 0x03, 0x01, 0x00, 0x00, 0x00],
  // DESFire Select Application 0x000003 (App 3 Purse): 90 5A 00 00 03 03 00 00 00
  cmdSelectApp3: [0x90, 0x5A, 0x00, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00],
  // Read Card Info (File 0): 90 BD 00 00 07 00 00 00 00 17 00 00 00
  cmdReadCardInfo: [0x90, 0xBD, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x17, 0x00, 0x00, 0x00],
  // DESFire Read Value File 0: 90 6C 00 00 01 00 00
  cmdReadValue: [0x90, 0x6C, 0x00, 0x00, 0x01, 0x00, 0x00],
  // Read Purse Data File: 90 BD 00 00 07 03 00 00 00 07 00 00 00
  cmdReadDataPurse: [0x90, 0xBD, 0x00, 0x00, 0x07, 0x03, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00],
  // Read Log Start: 90 BB 00 00 07 01 00 00 00 00 00 00 00
  cmdReadLogStart: [0x90, 0xBB, 0x00, 0x00, 0x07, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
  // Read Log Next: 90 AF 00 00 00
  cmdReadLogNext: [0x90, 0xAF, 0x00, 0x00, 0x00],
};

/**
 * 5. BANK DKI JAKCARD
 * Chip: ISO-DEP Contactless
 */
export const JAKCARD_CONFIG = {
  name: 'JakCard',
  bank: 'Bank DKI',
  aid: hexToBytes('31 54 49 43 2E 49 43 41 53 48 30 31 01 01 00'),
  buildSelectCmd: (aid) => [0x00, 0xA4, 0x04, 0x00, aid.length, ...aid, 0x00],
  // Read Balance: 90 4C 00 00 04
  cmdGetBalance: [0x90, 0x4C, 0x00, 0x00, 0x04],
};
