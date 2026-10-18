/**
 * BRI Brizzi DESFire 3DES Authentication Engine
 * Implementasi kriptografi 100% murni JavaScript tanpa dependensi native,
 * kompatibel dengan React Native, Expo, dan Hermes engine.
 */

// Permutation Tables
const IP = [
  58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7
];

const IP_INV = [
  40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25
];

const PC1 = [
  57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4
];

const PC2 = [
  14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10,
  23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
];

const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

const E = [
  32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1
];

const P = [
  16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10,
  2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25
];

const S_BOXES = [
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
  ],
  [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
  ],
  [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
  ],
  [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
  ],
  [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
  ],
  [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
  ],
  [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
  ],
  [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
  ]
];

function bytesToBits(bytes) {
  const bits = [];
  for (let i = 0; i < bytes.length; i++) {
    for (let b = 7; b >= 0; b--) {
      bits.push((bytes[i] >> b) & 1);
    }
  }
  return bits;
}

function bitsToBytes(bits) {
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bits[i + b];
    }
    bytes.push(byte);
  }
  return bytes;
}

function permute(bits, table) {
  return table.map(idx => bits[idx - 1]);
}

function generateSubkeys(keyBits) {
  const key56 = permute(keyBits, PC1);
  let c = key56.slice(0, 28);
  let d = key56.slice(28, 56);
  const subkeys = [];

  for (let i = 0; i < 16; i++) {
    const shift = SHIFTS[i];
    c = c.slice(shift).concat(c.slice(0, shift));
    d = d.slice(shift).concat(d.slice(0, shift));
    subkeys.push(permute(c.concat(d), PC2));
  }
  return subkeys;
}

function feistel(r, subkey) {
  const er = permute(r, E);
  const xor = er.map((bit, idx) => bit ^ subkey[idx]);
  const sOutput = [];

  for (let i = 0; i < 8; i++) {
    const block = xor.slice(i * 6, (i + 1) * 6);
    const row = (block[0] << 1) | block[5];
    const col = (block[1] << 3) | (block[2] << 2) | (block[3] << 1) | block[4];
    const val = S_BOXES[i][row][col];
    for (let b = 3; b >= 0; b--) {
      sOutput.push((val >> b) & 1);
    }
  }
  return permute(sOutput, P);
}

function desBlock(blockBytes, keyBytes, encrypt = true) {
  const bits = permute(bytesToBits(blockBytes), IP);
  let l = bits.slice(0, 32);
  let r = bits.slice(32, 64);
  const subkeys = generateSubkeys(bytesToBits(keyBytes));
  if (!encrypt) subkeys.reverse();

  for (let i = 0; i < 16; i++) {
    const f = feistel(r, subkeys[i]);
    const nextR = l.map((bit, idx) => bit ^ f[idx]);
    l = r;
    r = nextR;
  }
  return bitsToBytes(permute(r.concat(l), IP_INV));
}

function hexToBytes(hex) {
  const clean = hex.replace(/[^0-9A-Fa-f]/g, '');
  const bytes = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.substr(i, 2), 16));
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => (b & 0xff).toString(16).padStart(2, '0').toUpperCase())
    .join('');
}

function des3Block(blockBytes, keyBytes, encrypt = true) {
  const k1 = keyBytes.slice(0, 8);
  const k2 = keyBytes.slice(8, 16);
  const k3 = keyBytes.length >= 24 ? keyBytes.slice(16, 24) : k1;

  if (encrypt) {
    const s1 = desBlock(blockBytes, k1, true);
    const s2 = desBlock(s1, k2, false);
    return desBlock(s2, k3, true);
  } else {
    const s1 = desBlock(blockBytes, k3, false);
    const s2 = desBlock(s1, k2, true);
    return desBlock(s2, k1, false);
  }
}

function des3Cbc(dataBytes, keyBytes, ivBytes, encrypt = true) {
  const result = [];
  let iv = ivBytes.slice(0, 8);

  for (let offset = 0; offset < dataBytes.length; offset += 8) {
    const block = dataBytes.slice(offset, offset + 8);
    if (encrypt) {
      const xored = block.map((b, i) => b ^ iv[i]);
      const enc = des3Block(xored, keyBytes, true);
      result.push(...enc);
      iv = enc;
    } else {
      const dec = des3Block(block, keyBytes, false);
      const xored = dec.map((b, i) => b ^ iv[i]);
      result.push(...xored);
      iv = block;
    }
  }
  return result;
}

function des3EcbDecrypt(dataBytes, keyBytes) {
  const k1 = keyBytes.slice(0, 8);
  const k2 = keyBytes.slice(8, 16);
  const s1 = desBlock(dataBytes, k1, false);
  const s2 = desBlock(s1, k2, true);
  return desBlock(s2, k1, false);
}

function rotateLeftHex(hexStr) {
  return hexStr.substring(2) + hexStr.substring(0, 2);
}

/**
 * Menghitung cryptogram challenge response untuk membuka register saldo Brizzi.
 * @param {string} cardNumber 16 digit nomor kartu fisik
 * @param {string} tagUid Hex string UID NFC kartu (ISO 14443-4)
 * @param {string} rndBHex 16 karakter hex (8 bytes) random challenge dari kartu
 * @returns {string} 32 karakter hex (16 bytes) respon untuk dikirim ke APDU 90 AF
 */
export function generateBrizziAuthResponse(cardNumber, tagUid, rndBHex) {
  const cleanCardNum = cardNumber && cardNumber.length >= 16 ? cardNumber.substring(0, 16) : '5379000000000000';
  const cleanUid = tagUid ? tagUid.replace(/[^0-9A-Fa-f]/g, '') : '00000000000000';
  const cleanRndB = rndBHex ? rndBHex.substring(0, 16) : '0000000000000000';

  const zeroIv = hexToBytes('0000000000000000');
  const masterKey = hexToBytes('C152153D5807784C721A433B5B59636D');

  const seed1 = hexToBytes('8DC0DC40FE1DC582CF7099E2AACFBC10');
  const seed2 = hexToBytes('3C37029CA595FE4E7E62FCB2F7909B2C');

  // Dekripsi Seed 1 & Seed 2 dengan Master Key
  const keyC = des3Cbc(seed1, masterKey, zeroIv, false).slice(0, 16);
  const keyD = des3Cbc(seed2, masterKey, zeroIv, false).slice(0, 16);

  // Derivasi Key kartu: CardNumber + UID + 'FF'
  const kua = hexToBytes(cleanCardNum + cleanUid + 'FF');
  const kub = des3Cbc(kua, keyC, zeroIv, true).slice(0, 16);

  const kuc = hexToBytes('0000030080000000');
  const kue = des3Cbc(kub, keyD, kuc, true).slice(0, 16);

  // Sesi DESFire EV1 Challenge-Response
  const rndBBytes = hexToBytes(cleanRndB);
  const rndBDec = des3EcbDecrypt(rndBBytes, kue);
  const str1 = rotateLeftHex(bytesToHex(rndBDec.map((b, i) => b ^ zeroIv[i])));

  const rndABytes = hexToBytes('1122334455667788');
  const str2Bytes = des3EcbDecrypt(rndABytes.map((b, i) => b ^ rndBBytes[i]), kue);
  const str2Hex = bytesToHex(str2Bytes);

  const str1Bytes = hexToBytes(str1);
  const str3Bytes = des3EcbDecrypt(str1Bytes.map((b, i) => b ^ str2Bytes[i]), kue);
  const str3Hex = bytesToHex(str3Bytes);

  return (str2Hex + str3Hex).toUpperCase();
}
