package com.emoney.nfcbalance.nfc;

import android.nfc.tech.IsoDep;
import android.util.Log;

import java.io.IOException;

/**
 * Pembaca protokol ISO 7816-4 / ISO-DEP untuk kartu e-money Indonesia
 * (Mandiri e-Money, BCA Flazz, BNI TapCash, BRI Brizzi, dan Bank DKI JakCard).
 * 100% OFFLINE langsung membaca memori chip smartcard tanpa koneksi internet.
 */
public class IsoDepReader {

    private static final String TAG = "IsoDepReader";

    // 1. MANDIRI E-MONEY
    // AID Standard: A0 00 00 00 18 30 00 01
    private static final byte[] CMD_SELECT_MANDIRI_STD = ByteUtils.hexStringToByteArray("00A4040008A00000001830000100");
    private static final byte[] CMD_SELECT_MANDIRI_ALT = ByteUtils.hexStringToByteArray("00A4040008000000000000000100");
    // Baca Record 1 SFI 4: 00 B2 01 04 00
    private static final byte[] CMD_READ_MANDIRI_REC1   = ByteUtils.hexStringToByteArray("00B2010400");
    // Fallback Direct Balance: 00 B5 00 00 0A
    private static final byte[] CMD_READ_MANDIRI_B5     = ByteUtils.hexStringToByteArray("00B500000A");

    // 2. BCA FLAZZ (Gen 2 & Gen 1)
    // AID Gen 2: A0 00 00 00 18 0F 00 00 01 80 01
    private static final byte[] CMD_SELECT_FLAZZ_GEN2   = ByteUtils.hexStringToByteArray("00A404000BA0000000180F000001800100");
    // AID Gen 1: A0 00 00 00 03 86 98 07 01
    private static final byte[] CMD_SELECT_FLAZZ_GEN1   = ByteUtils.hexStringToByteArray("00A4040009A0000000038698070100");
    // Select File 0200: 00 A4 01 00 02 02 00
    private static final byte[] CMD_SELECT_FLAZZ_FILE   = ByteUtils.hexStringToByteArray("00A40100020200");
    // Read Binary 81: 00 B0 81 00 8E
    private static final byte[] CMD_READ_FLAZZ_BIN81    = ByteUtils.hexStringToByteArray("00B081008E");
    // Get Balance: 80 32 00 03 04 00 00 00 00
    private static final byte[] CMD_GET_FLAZZ_BALANCE   = ByteUtils.hexStringToByteArray("803200030400000000");

    // 3. BNI TAPCASH
    // AID: 11 22 33 44 55 66
    private static final byte[] CMD_SELECT_TAPCASH      = ByteUtils.hexStringToByteArray("00A404000611223344556600");
    // Get Balance: 90 32 03 00 00
    private static final byte[] CMD_GET_TAPCASH_BALANCE = ByteUtils.hexStringToByteArray("9032030000");

    // 4. BRI BRIZZI
    // Select App 0x000001: 90 5A 00 00 03 01 00 00 00
    private static final byte[] CMD_SELECT_BRIZZI_APP   = ByteUtils.hexStringToByteArray("905A00000301000000");
    // Read Value File 0: 90 6C 00 00 01 00 00
    private static final byte[] CMD_READ_BRIZZI_VALUE   = ByteUtils.hexStringToByteArray("906C0000010000");

    // 5. BANK DKI JAKCARD
    // AID: 31 54 49 43 2E 49 43 41 53 48 30 31 01 01 00
    private static final byte[] CMD_SELECT_JAKCARD      = ByteUtils.hexStringToByteArray("00A404000F315449432E4943415348303101010000");
    // Read Balance: 90 4C 00 00 04
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
                        // Saldo 4 byte integer Big Endian pada byte 12..15
                        long bal = ByteUtils.bytesToLongBigEndian(recResp, 12, 4);
                        if (bal >= 0 && bal <= 20_000_000) {
                            result.balance = bal;
                            result.balanceFound = true;
                            // Ekstrak nomor kartu jika ada di record
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

                result.isSecurityProtected = true;
                return true;
            }
        } catch (Exception e) {
            Log.d(TAG, "tryMandiri error: " + e.getMessage());
        }
        return false;
    }

    private static boolean tryFlazz(IsoDep isoDep, IsoResult result) {
        try {
            // Coba Gen 2 dulu, lalu Gen 1
            byte[] resp = isoDep.transceive(CMD_SELECT_FLAZZ_GEN2);
            boolean isGen2 = true;
            if (!isStatusOk(resp)) {
                resp = isoDep.transceive(CMD_SELECT_FLAZZ_GEN1);
                isGen2 = false;
            }

            if (isStatusOk(resp)) {
                result.detectedIssuer = isGen2 ? "BCA Flazz (Gen 2)" : "BCA Flazz (Gen 1)";
                Log.d(TAG, "BCA Flazz selected successfully");

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
                    byte[] balResp = isoDep.transceive(CMD_GET_FLAZZ_BALANCE);
                    if (balResp != null && balResp.length >= 5) {
                        // Byte 1..3 Big Endian
                        long bal = ByteUtils.bytesToLongBigEndian(balResp, 1, 3);
                        if (bal >= 0 && bal <= 20_000_000) {
                            result.balance = bal;
                            result.balanceFound = true;
                            return true;
                        }
                    }
                }

                result.isSecurityProtected = true;
                return true;
            }
        } catch (Exception e) {
            Log.d(TAG, "tryFlazz error: " + e.getMessage());
        }
        return false;
    }

    private static boolean tryTapCash(IsoDep isoDep, IsoResult result) {
        try {
            byte[] resp = isoDep.transceive(CMD_SELECT_TAPCASH);
            if (isStatusOk(resp)) {
                result.detectedIssuer = "BNI TapCash";
                Log.d(TAG, "BNI TapCash selected successfully");

                // Get Balance: 90 32 03 00 00
                byte[] balResp = isoDep.transceive(CMD_GET_TAPCASH_BALANCE);
                if (isStatusOk(balResp) && balResp.length >= 5) {
                    // Byte 2..4 Big Endian
                    long bal = ByteUtils.bytesToLongBigEndian(balResp, 2, 3);
                    if (bal >= 0 && bal <= 20_000_000) {
                        result.balance = bal;
                        result.balanceFound = true;
                        return true;
                    }
                }

                result.isSecurityProtected = true;
                return true;
            }
        } catch (Exception e) {
            Log.d(TAG, "tryTapCash error: " + e.getMessage());
        }
        return false;
    }

    private static boolean tryBrizzi(IsoDep isoDep, IsoResult result) {
        try {
            // Select App: 90 5A 00 00 03 01 00 00 00
            byte[] resp = isoDep.transceive(CMD_SELECT_BRIZZI_APP);
            if (isStatusOk(resp)) {
                result.detectedIssuer = "BRI Brizzi";
                Log.d(TAG, "BRI Brizzi selected successfully");

                // Read Value File: 90 6C 00 00 01 00 00
                byte[] valResp = isoDep.transceive(CMD_READ_BRIZZI_VALUE);
                if (isStatusOk(valResp) && valResp.length >= 6) {
                    // Byte 0..3 Little Endian
                    long bal = ByteUtils.bytesToLongLittleEndian(valResp, 0, 4);
                    if (bal >= 0 && bal <= 20_000_000) {
                        result.balance = bal;
                        result.balanceFound = true;
                        return true;
                    }
                }

                result.isSecurityProtected = true;
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
                    // Byte 0..3 Big Endian
                    long bal = ByteUtils.bytesToLongBigEndian(balResp, 0, 4);
                    if (bal >= 0 && bal <= 20_000_000) {
                        result.balance = bal;
                        result.balanceFound = true;
                        return true;
                    }
                }

                result.isSecurityProtected = true;
                return true;
            }
        } catch (Exception e) {
            Log.d(TAG, "tryJakCard error: " + e.getMessage());
        }
        return false;
    }

    private static boolean isStatusOk(byte[] resp) {
        if (resp == null || resp.length < 2) return false;
        int len = resp.length;
        byte sw1 = resp[len - 2];
        byte sw2 = resp[len - 1];
        return (sw1 == (byte) 0x90 && sw2 == (byte) 0x00) ||
               (sw1 == (byte) 0x91 && sw2 == (byte) 0x00) ||
               (sw1 == (byte) 0x61) ||
               (sw1 == (byte) 0x90);
    }
}
