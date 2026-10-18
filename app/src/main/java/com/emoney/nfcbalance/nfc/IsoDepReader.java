package com.emoney.nfcbalance.nfc;

import android.nfc.tech.IsoDep;
import android.util.Log;

import java.io.IOException;
import java.util.Arrays;

/**
 * Pembaca protokol ISO 7816-4 / ISO-DEP untuk kartu e-money Indonesia
 * (Mandiri e-Money, BCA Flazz, BNI TapCash, BRI Brizzi, dan Bank DKI JakCard).
 * 100% OFFLINE langsung membaca memori chip smartcard tanpa koneksi internet.
 */
public class IsoDepReader {

    private static final String TAG = "IsoDepReader";

    // 1. MANDIRI E-MONEY
    private static final byte[] CMD_SELECT_MANDIRI_STD = ByteUtils.hexStringToByteArray("00A4040008A00000001830000100");
    private static final byte[] CMD_SELECT_MANDIRI_ALT = ByteUtils.hexStringToByteArray("00A4040008000000000000000100");
    private static final byte[] CMD_READ_MANDIRI_REC1   = ByteUtils.hexStringToByteArray("00B2010400");
    private static final byte[] CMD_READ_MANDIRI_B5     = ByteUtils.hexStringToByteArray("00B500000A");
    private static final byte[] CMD_READ_MANDIRI_NUM    = ByteUtils.hexStringToByteArray("00B300003F");

    // 2. BCA FLAZZ (Gen 2 & Gen 1)
    private static final byte[] CMD_SELECT_FLAZZ_GEN2   = ByteUtils.hexStringToByteArray("00A404000BA0000000180F000001800100");
    private static final byte[] CMD_SELECT_FLAZZ_GEN2_NOLE = ByteUtils.hexStringToByteArray("00A404000BA0000000180F0000018001");
    private static final byte[] CMD_SELECT_FLAZZ_GEN1   = ByteUtils.hexStringToByteArray("00A4040009A0000000038698070100");
    private static final byte[] CMD_SELECT_FLAZZ_FILE   = ByteUtils.hexStringToByteArray("00A40100020200");
    private static final byte[] CMD_READ_FLAZZ_BIN81    = ByteUtils.hexStringToByteArray("00B081008E");
    private static final byte[] CMD_GET_FLAZZ_BALANCE   = ByteUtils.hexStringToByteArray("803200030400000000");

    // 3. BNI TAPCASH (AID Resmi dan Alternatif)
    // Primary AID: A0 00 42 4E 49 10 00 01 (42 4E 49 = "BNI")
    private static final byte[] CMD_SELECT_TAPCASH_PRIMARY = ByteUtils.hexStringToByteArray("00A4040008A000424E4910000100");
    private static final byte[] CMD_SELECT_TAPCASH_SEC     = ByteUtils.hexStringToByteArray("00A4040008A000424E4999999900");
    private static final byte[] CMD_SELECT_TAPCASH_LEGACY  = ByteUtils.hexStringToByteArray("00A404000611223344556600");
    private static final byte[] CMD_SELECT_TAPCASH_ISO     = ByteUtils.hexStringToByteArray("00A4040007A000000003101000");
    private static final byte[] CMD_GET_TAPCASH_BALANCE    = ByteUtils.hexStringToByteArray("9032030000");

    // 4. BRI BRIZZI (DESFire EV1)
    private static final byte[] CMD_SELECT_BRIZZI_APP1  = ByteUtils.hexStringToByteArray("905A00000301000000");
    private static final byte[] CMD_SELECT_BRIZZI_APP3  = ByteUtils.hexStringToByteArray("905A00000303000000");
    private static final byte[] CMD_READ_BRIZZI_FILE0   = ByteUtils.hexStringToByteArray("90BD0000070000000017000000");
    private static final byte[] CMD_READ_BRIZZI_VALUE   = ByteUtils.hexStringToByteArray("906C0000010000");
    private static final byte[] CMD_AUTH_BRIZZI_APP3    = ByteUtils.hexStringToByteArray("900A0000010000");

    // 5. BANK DKI JAKCARD
    private static final byte[] CMD_SELECT_JAKCARD      = ByteUtils.hexStringToByteArray("00A404000F315449432E4943415348303101010000");
    private static final byte[] CMD_READ_JAKCARD_BALANCE= ByteUtils.hexStringToByteArray("904C000004");

    public static class IsoResult {
        public String detectedIssuer = null;
        public boolean balanceFound = false;
        public long balance = 0;
        public boolean isSecurityProtected = false;
        public String parsedCardNumber = null;
    }

    /**
     * Membaca kartu pintar perbankan Indonesia via IsoDep
     */
    public static IsoResult readIsoDep(IsoDep isoDep) {
        IsoResult result = new IsoResult();

        // 1. Coba Bank Mandiri e-Money
        if (tryMandiri(isoDep, result)) return result;

        // 2. Coba BCA Flazz (Gen 2 & Gen 1)
        if (tryFlazz(isoDep, result)) return result;

        // 3. Coba BNI TapCash
        if (tryTapCash(isoDep, result)) return result;

        // 4. Coba BRI Brizzi
        if (tryBrizzi(isoDep, result)) return result;

        // 5. Coba Bank DKI JakCard
        if (tryJakCard(isoDep, result)) return result;

        return result;
    }

    private static boolean tryMandiri(IsoDep isoDep, IsoResult result) {
        try {
            byte[] resp = isoDep.transceive(CMD_SELECT_MANDIRI_STD);
            if (!isStatusOk(resp)) {
                resp = isoDep.transceive(CMD_SELECT_MANDIRI_ALT);
            }

            if (isStatusOk(resp)) {
                result.detectedIssuer = "Mandiri e-Money";
                Log.d(TAG, "Mandiri e-Money selected successfully");

                // Metode A: Read Record 1 SFI 4 (00 B2 01 04 00)
                try {
                    byte[] recResp = isoDep.transceive(CMD_READ_MANDIRI_REC1);
                    if (isStatusOk(recResp) && recResp.length >= 18) {
                        long bal = ByteUtils.bytesToLongBigEndian(recResp, 12, 4);
                        if (bal >= 0 && bal <= 20_000_000) {
                            result.balance = bal;
                            result.balanceFound = true;
                            String hex = ByteUtils.toHexString(recResp);
                            if (hex.length() >= 32) {
                                result.parsedCardNumber = ByteUtils.formatCardNumber(hex.substring(0, 16));
                            }
                            return true;
                        }
                    }
                } catch (Exception e) {
                    Log.d(TAG, "Mandiri Rec1 failed: " + e.getMessage());
                }

                // Metode B: Direct 00 B5 00 00 0A (Little Endian)
                try {
                    byte[] b5Resp = isoDep.transceive(CMD_READ_MANDIRI_B5);
                    if (isStatusOk(b5Resp) && b5Resp.length >= 6) {
                        long bal = ByteUtils.bytesToLongLittleEndian(b5Resp, 0, 4);
                        if (bal >= 0 && bal <= 20_000_000) {
                            result.balance = bal;
                            result.balanceFound = true;
                            return true;
                        }
                    }
                } catch (Exception e) {
                    Log.d(TAG, "Mandiri 00B5 failed: " + e.getMessage());
                }

                // Coba nomor kartu via 00 B3
                try {
                    byte[] numResp = isoDep.transceive(CMD_READ_MANDIRI_NUM);
                    if (isStatusOk(numResp) && numResp.length >= 10) {
                        result.parsedCardNumber = ByteUtils.formatCardNumber(ByteUtils.toHexString(Arrays.copyOfRange(numResp, 0, 8)));
                    }
                } catch (Exception ignored) {}

                result.balanceFound = true;
                return true;
            }
        } catch (Exception e) {
            Log.d(TAG, "tryMandiri error: " + e.getMessage());
        }
        return false;
    }

    private static boolean tryFlazz(IsoDep isoDep, IsoResult result) {
        try {
            // Coba Gen 2 dulu
            byte[] resp = isoDep.transceive(CMD_SELECT_FLAZZ_GEN2);
            boolean isGen2 = true;
            if (!isStatusOk(resp)) {
                resp = isoDep.transceive(CMD_SELECT_FLAZZ_GEN2_NOLE);
            }
            if (!isStatusOk(resp)) {
                resp = isoDep.transceive(CMD_SELECT_FLAZZ_GEN1);
                isGen2 = false;
            }

            if (isStatusOk(resp)) {
                result.detectedIssuer = isGen2 ? "BCA Flazz (Gen 2)" : "BCA Flazz (Gen 1)";
                Log.d(TAG, "BCA Flazz selected successfully (" + (isGen2 ? "Gen 2" : "Gen 1") + ")");

                // Select File 0200
                byte[] fileResp = isoDep.transceive(CMD_SELECT_FLAZZ_FILE);
                if (isStatusOk(fileResp)) {
                    // Read Binary 81
                    byte[] binResp = isoDep.transceive(CMD_READ_FLAZZ_BIN81);
                    if (isStatusOk(binResp) && binResp.length >= 8) {
                        String hex = ByteUtils.toHexString(binResp);
                        if (hex.length() >= 16) {
                            result.parsedCardNumber = ByteUtils.formatCardNumber(hex.substring(0, 16));
                        }
                    }

                    // Ambil Saldo: 80 32 00 03 04 00 00 00 00
                    try {
                        byte[] balResp = isoDep.transceive(CMD_GET_FLAZZ_BALANCE);
                        if (balResp != null && balResp.length >= 4) {
                            long bal = ByteUtils.bytesToLongBigEndian(balResp, 1, 3);
                            if (bal >= 0 && bal <= 20_000_000) {
                                result.balance = bal;
                                result.balanceFound = true;
                                return true;
                            }
                        }
                    } catch (Exception e) {
                        Log.d(TAG, "Flazz 80 32 balance read failed: " + e.getMessage());
                    }

                    // Fallback balance 80 5C 00 02 04
                    try {
                        byte[] fbResp = isoDep.transceive(ByteUtils.hexStringToByteArray("805C000204"));
                        if (isStatusOk(fbResp) && fbResp.length >= 4) {
                            long bal = ByteUtils.bytesToLongBigEndian(fbResp, 0, 4);
                            if (bal >= 0 && bal <= 20_000_000) {
                                result.balance = bal;
                                result.balanceFound = true;
                                return true;
                            }
                        }
                    } catch (Exception ignored) {}

                    // Fallback balance 80 5C 00 01 04
                    try {
                        byte[] fbResp2 = isoDep.transceive(ByteUtils.hexStringToByteArray("805C000104"));
                        if (isStatusOk(fbResp2) && fbResp2.length >= 4) {
                            long bal = ByteUtils.bytesToLongBigEndian(fbResp2, 0, 4);
                            if (bal >= 0 && bal <= 20_000_000) {
                                result.balance = bal;
                                result.balanceFound = true;
                                return true;
                            }
                        }
                    } catch (Exception ignored) {}
                }

                result.balanceFound = true;
                return true;
            }
        } catch (Exception e) {
            Log.d(TAG, "tryFlazz error: " + e.getMessage());
        }
        return false;
    }

    private static boolean tryTapCash(IsoDep isoDep, IsoResult result) {
        try {
            // Coba urutan AID BNI TapCash
            byte[] resp = isoDep.transceive(CMD_SELECT_TAPCASH_PRIMARY);
            if (!isStatusOk(resp)) {
                resp = isoDep.transceive(CMD_SELECT_TAPCASH_SEC);
            }
            if (!isStatusOk(resp)) {
                resp = isoDep.transceive(CMD_SELECT_TAPCASH_LEGACY);
            }
            if (!isStatusOk(resp)) {
                resp = isoDep.transceive(CMD_SELECT_TAPCASH_ISO);
            }

            if (isStatusOk(resp)) {
                result.detectedIssuer = "BNI TapCash";
                Log.d(TAG, "BNI TapCash selected successfully");

                // Get Balance: 90 32 03 00 00
                try {
                    byte[] balResp = isoDep.transceive(CMD_GET_TAPCASH_BALANCE);
                    if (isStatusOk(balResp) && balResp.length >= 5) {
                        long bal = ByteUtils.bytesToLongBigEndian(balResp, 2, 3);
                        if ((balResp[2] & 0x80) != 0) {
                            bal |= 0xFF000000L;
                        }
                        bal = bal & 0x7FFFFFFFL;
                        if (bal >= 0 && bal <= 20_000_000) {
                            result.balance = bal;
                            result.balanceFound = true;
                        }

                        // Ekstrak 8 byte nomor kartu pada offset 8..15
                        if (balResp.length >= 16) {
                            byte[] cardNumBytes = Arrays.copyOfRange(balResp, 8, 16);
                            result.parsedCardNumber = ByteUtils.formatCardNumber(ByteUtils.toHexString(cardNumBytes));
                        }
                        return true;
                    }
                } catch (Exception e) {
                    Log.d(TAG, "TapCash 90 32 03 failed: " + e.getMessage());
                }

                // Fallback Read Binary: 00 B0 00 00 10
                try {
                    byte[] binResp = isoDep.transceive(ByteUtils.hexStringToByteArray("00B0000010"));
                    if (isStatusOk(binResp) && binResp.length >= 5) {
                        long bal = ByteUtils.bytesToLongBigEndian(binResp, 1, 3);
                        if (bal >= 0 && bal <= 20_000_000) {
                            result.balance = bal;
                            result.balanceFound = true;
                            return true;
                        }
                    }
                } catch (Exception ignored) {}

                result.balanceFound = true;
                return true;
            }
        } catch (Exception e) {
            Log.d(TAG, "tryTapCash error: " + e.getMessage());
        }
        return false;
    }

    private static boolean tryBrizzi(IsoDep isoDep, IsoResult result) {
        try {
            // Tag UID (hex string uppercase)
            String tagId = ByteUtils.toHexString(isoDep.getTag().getId());

            // 1. Select App 1: 90 5A 00 00 03 01 00 00 00
            byte[] resp = isoDep.transceive(CMD_SELECT_BRIZZI_APP1);
            if (!isStatusOk(resp)) {
                resp = isoDep.transceive(ByteUtils.hexStringToByteArray("905A00000300000100"));
            }

            if (isStatusOk(resp)) {
                result.detectedIssuer = "BRI Brizzi";
                Log.d(TAG, "BRI Brizzi selected successfully");

                String rawCardNumber = null;
                // 2. Baca File 0 untuk nomor kartu (Brizzid: 90 BD 00 00 07 00 00 00 00 17 00 00 00)
                try {
                    byte[] cardInfoResp = isoDep.transceive(CMD_READ_BRIZZI_FILE0);
                    String hexFile0 = ByteUtils.toHexString(cardInfoResp);
                    if (hexFile0.length() >= 22) {
                        rawCardNumber = hexFile0.substring(6, 22);
                        result.parsedCardNumber = ByteUtils.formatCardNumber(rawCardNumber);
                    }
                } catch (Exception e) {
                    Log.d(TAG, "Brizzi File 0 read error: " + e.getMessage());
                }

                // 3. Baca File 1 untuk status kartu (Brizzie: 90 BD 00 00 07 01 00 00 00 20 00 00 00)
                try {
                    isoDep.transceive(ByteUtils.hexStringToByteArray("90BD0000070100000020000000"));
                } catch (Exception ignored) {}

                // 4. Select App 3 (Brizzic: 90 5A 00 00 03 03 00 00 00)
                isoDep.transceive(CMD_SELECT_BRIZZI_APP3);

                // 5. Send Auth (Brizzif: 90 0A 00 00 01 00 00)
                try {
                    byte[] authResp = isoDep.transceive(CMD_AUTH_BRIZZI_APP3);
                    String authHex = ByteUtils.toHexString(authResp);
                    if (authHex.endsWith("91AF")) {
                        String rndB = authHex.substring(0, authHex.length() - 4);
                        String cardNumForAuth = (rawCardNumber != null && !rawCardNumber.isEmpty()) ? rawCardNumber : "5379000000000000";

                        BrizziAuthHelper authHelper = new BrizziAuthHelper();
                        authHelper.init(cardNumForAuth + tagId + "FF", "0000030080000000", rndB);
                        String challengeRespHex = authHelper.kustringa();

                        if (challengeRespHex.length() >= 32) {
                            byte[] authStep2 = ByteUtils.hexStringToByteArray("90AF000010" + challengeRespHex.substring(0, 32) + "00");
                            byte[] authFinalResp = isoDep.transceive(authStep2);
                            Log.d(TAG, "Brizzi Auth Step 2 response: " + ByteUtils.toHexString(authFinalResp));
                        }
                    }
                } catch (Exception e) {
                    Log.d(TAG, "Brizzi Auth error: " + e.getMessage());
                }

                // 6. Read File 3 (Brizzii: 90 BD 00 00 07 03 00 00 00 07 00 00 00)
                // Pada protokol resmi Brizzi, pembacaan File 3 WAJIB sebelum 90 6C
                String strFile3 = "";
                try {
                    byte[] f3Resp = isoDep.transceive(ByteUtils.hexStringToByteArray("90BD0000070300000007000000"));
                    strFile3 = ByteUtils.toHexString(f3Resp);
                    Log.d(TAG, "Brizzi File 3 response: " + strFile3);
                } catch (Exception ignored) {}

                // 7. Read Value File (Brizzih: 90 6C 00 00 01 00 00)
                long parsedBal = -1;
                try {
                    byte[] valResp = isoDep.transceive(CMD_READ_BRIZZI_VALUE);
                    String strVal = ByteUtils.toHexString(valResp);
                    Log.d(TAG, "Brizzi Value response: " + strVal);

                    if (strVal.length() >= 8) {
                        String hexVal = strVal.substring(0, 8);
                        String revHex = ByteUtils.reverseHexPairs(hexVal);
                        long bal = Long.parseLong(revHex, 16);
                        if (bal >= 0 && bal <= 20_000_000) {
                            parsedBal = bal;
                        }
                    }
                } catch (Exception e) {
                    Log.d(TAG, "Brizzi 90 6C error: " + e.getMessage());
                }

                // 8. Jika 90 6C belum dapat saldo valid, ekstrak dari File 3 jika ada
                if (parsedBal <= 0 && strFile3.length() >= 8 && !strFile3.startsWith("00000000")) {
                    try {
                        String hexVal = strFile3.substring(0, 8);
                        String revHex = ByteUtils.reverseHexPairs(hexVal);
                        long candidate = Long.parseLong(revHex, 16);
                        if (candidate > 0 && candidate <= 20_000_000) {
                            parsedBal = candidate;
                        }
                    } catch (Exception ignored) {}
                }

                // 9. Fallback ke App 1 Transaction Log (90 BB 00 00 07 01 00 00 00 00 00 00 00)
                if (parsedBal <= 0) {
                    try {
                        isoDep.transceive(CMD_SELECT_BRIZZI_APP1);
                        byte[] logResp = isoDep.transceive(ByteUtils.hexStringToByteArray("90BB0000070100000000000000"));
                        String logHex = ByteUtils.toHexString(logResp);
                        if (logHex.length() >= 52) {
                            String amtHex = logHex.substring(46, 52);
                            String revHex = ByteUtils.reverseHexPairs(amtHex);
                            long candidate = Long.parseLong(revHex, 16);
                            if (candidate > 0 && candidate <= 20_000_000) {
                                parsedBal = candidate;
                            }
                        }
                    } catch (Exception ignored) {}
                }

                // 10. Fallback direct 90 6C di App 1 jika varian kartu lama
                if (parsedBal <= 0) {
                    try {
                        isoDep.transceive(CMD_SELECT_BRIZZI_APP1);
                        byte[] valResp1 = isoDep.transceive(CMD_READ_BRIZZI_VALUE);
                        if (isStatusOk(valResp1) && valResp1.length >= 6) {
                            long candidate = ByteUtils.bytesToLongLittleEndian(valResp1, 0, 4);
                            if (candidate > 0 && candidate <= 20_000_000) {
                                parsedBal = candidate;
                            }
                        }
                    } catch (Exception ignored) {}
                }

                if (parsedBal >= 0) {
                    result.balance = parsedBal;
                    result.balanceFound = true;
                } else {
                    result.balance = 0;
                    result.balanceFound = true;
                }
                return true;
            }
        } catch (Exception e) {
            Log.d(TAG, "tryBrizzi error: " + e.getMessage());
        }
        return false;
    }

    private static boolean tryJakCard(IsoDep isoDep, IsoResult result) {
        try {
            byte[] resp = isoDep.transceive(CMD_SELECT_JAKCARD);
            if (isStatusOk(resp)) {
                result.detectedIssuer = "Bank DKI JakCard";
                Log.d(TAG, "JakCard selected successfully");

                // Read Balance: 90 4C 00 00 04
                byte[] balResp = isoDep.transceive(CMD_READ_JAKCARD_BALANCE);
                if (isStatusOk(balResp) && balResp.length >= 6) {
                    long bal = ByteUtils.bytesToLongBigEndian(balResp, 0, 4);
                    if (bal >= 0 && bal <= 20_000_000) {
                        result.balance = bal;
                        result.balanceFound = true;
                        return true;
                    }
                }

                result.balanceFound = true;
                return true;
            }
        } catch (Exception e) {
            Log.d(TAG, "tryJakCard error: " + e.getMessage());
        }
        return false;
    }

    public static boolean isStatusOk(byte[] resp) {
        if (resp == null || resp.length < 2) return false;
        int len = resp.length;
        byte sw1 = resp[len - 2];
        byte sw2 = resp[len - 1];
        return (sw1 == (byte) 0x90 && sw2 == (byte) 0x00) ||
               (sw1 == (byte) 0x91 && sw2 == (byte) 0x00) ||
               (sw1 == (byte) 0x91 && sw2 == (byte) 0xAF) ||
               (sw1 == (byte) 0x61) ||
               (sw1 == (byte) 0x90);
    }
}
