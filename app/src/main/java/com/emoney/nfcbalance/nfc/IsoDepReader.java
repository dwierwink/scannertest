package com.emoney.nfcbalance.nfc;

import android.nfc.tech.IsoDep;
import android.util.Log;

import java.io.IOException;

/**
 * Pembaca protokol ISO 7816-4 untuk kartu e-money Indonesia (Mandiri, Flazz, TapCash, Brizzi).
 */
public class IsoDepReader {

    private static final String TAG = "IsoDepReader";

    // Daftar AID populer kartu uang elektronik di Indonesia
    private static final byte[] AID_MANDIRI_1 = ByteUtils.hexStringToByteArray("00A4040008A00000000300000000");
    private static final byte[] AID_MANDIRI_2 = ByteUtils.hexStringToByteArray("00A4040007F000000018400000");
    private static final byte[] AID_FLAZZ_1   = ByteUtils.hexStringToByteArray("00A4040008A00000000386980700");
    private static final byte[] AID_FLAZZ_2   = ByteUtils.hexStringToByteArray("00A4040009A0000000038698070100");
    private static final byte[] AID_TAPCASH   = ByteUtils.hexStringToByteArray("00A4040007A000000003101000");
    private static final byte[] AID_BRIZZI    = ByteUtils.hexStringToByteArray("00A4040008A00000000300000100");
    private static final byte[] AID_JAKCARD   = ByteUtils.hexStringToByteArray("00A4040007A000000003202000");

    public static class IsoResult {
        public String detectedIssuer = "Kartu e-Money";
        public boolean balanceFound = false;
        public long balance = 0;
        public boolean isSecurityProtected = false;
        public String parsedCardNumber = null;
    }

    /**
     * Menguji deteksi dan pembacaan saldo pada kartu berbasis ISO-DEP
     */
    public static IsoResult readIsoDep(IsoDep isoDep) {
        IsoResult result = new IsoResult();

        try {
            // Uji Mandiri e-Money
            if (checkAndRead(isoDep, AID_MANDIRI_1, "Mandiri e-Money", result)) return result;
            if (checkAndRead(isoDep, AID_MANDIRI_2, "Mandiri e-Money", result)) return result;

            // Uji BCA Flazz
            if (checkAndRead(isoDep, AID_FLAZZ_1, "BCA Flazz", result)) return result;
            if (checkAndRead(isoDep, AID_FLAZZ_2, "BCA Flazz", result)) return result;

            // Uji BNI TapCash
            if (checkAndRead(isoDep, AID_TAPCASH, "BNI TapCash", result)) return result;

            // Uji BRI Brizzi
            if (checkAndRead(isoDep, AID_BRIZZI, "BRI Brizzi", result)) return result;

            // Uji JakCard
            if (checkAndRead(isoDep, AID_JAKCARD, "Bank DKI JakCard", result)) return result;

        } catch (Exception e) {
            Log.e(TAG, "Error during IsoDep communication", e);
        }

        return result;
    }

    private static boolean checkAndRead(IsoDep isoDep, byte[] selectAidCmd, String issuerName, IsoResult result) {
        try {
            byte[] response = isoDep.transceive(selectAidCmd);
            if (isStatusOk(response)) {
                result.detectedIssuer = issuerName;
                Log.d(TAG, issuerName + " application selected successfully!");

                // Coba perintah baca saldo (Read Record / Read Binary)
                // Command: READ RECORD 1 (00 B2 01 0C 00)
                byte[] readRecordCmd = new byte[]{(byte) 0x00, (byte) 0xB2, (byte) 0x01, (byte) 0x0C, (byte) 0x00};
                byte[] recordResp = isoDep.transceive(readRecordCmd);

                if (isStatusOk(recordResp) && recordResp.length >= 6) {
                    long bal = extractBalance(recordResp);
                    if (bal >= 0 && bal <= 20_000_000) {
                        result.balance = bal;
                        result.balanceFound = true;
                        return true;
                    }
                }

                // Command alternatif: READ BINARY (00 B0 00 00 10)
                byte[] readBinCmd = new byte[]{(byte) 0x00, (byte) 0xB0, (byte) 0x00, (byte) 0x00, (byte) 0x10};
                byte[] binResp = isoDep.transceive(readBinCmd);

                if (isStatusOk(binResp) && binResp.length >= 6) {
                    long bal = extractBalance(binResp);
                    if (bal >= 0 && bal <= 20_000_000) {
                        result.balance = bal;
                        result.balanceFound = true;
                        return true;
                    }
                }

                // Jika AID berhasil di-select tapi pembacaan saldo ditolak dengan proteksi enkripsi bank
                result.isSecurityProtected = true;
                return true;
            }
        } catch (IOException e) {
            Log.d(TAG, "Command failed for " + issuerName + ": " + e.getMessage());
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
               (sw1 == (byte) 0x61); // 61 xx (Normal response with xx bytes available)
    }

    private static long extractBalance(byte[] data) {
        // Coba parsing 4 byte integer little endian & big endian
        long valLittle = ByteUtils.bytesToLongLittleEndian(data, 0, 4);
        if (valLittle > 0 && valLittle <= 20_000_000) {
            return valLittle;
        }
        long valBig = ByteUtils.bytesToLongBigEndian(data, 0, 4);
        if (valBig > 0 && valBig <= 20_000_000) {
            return valBig;
        }
        return 0;
    }
}
