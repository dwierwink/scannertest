package com.emoney.nfcbalance.nfc;

import java.text.NumberFormat;
import java.util.Locale;

public class ByteUtils {

    private static final char[] HEX_CHARS = "0123456789ABCDEF".toCharArray();

    /**
     * Konversi byte array ke String Hexadecimal (e.g. "04:A2:38:B1")
     */
    public static String toHexStringWithColon(byte[] bytes) {
        if (bytes == null || bytes.length == 0) return "";
        StringBuilder sb = new StringBuilder(bytes.length * 3);
        for (int i = 0; i < bytes.length; i++) {
            int v = bytes[i] & 0xFF;
            sb.append(HEX_CHARS[v >>> 4]);
            sb.append(HEX_CHARS[v & 0x0F]);
            if (i < bytes.length - 1) {
                sb.append(":");
            }
        }
        return sb.toString();
    }

    /**
     * Konversi byte array ke String Hexadecimal polos tanpa pemisah (e.g. "04A238B1")
     */
    public static String toHexString(byte[] bytes) {
        if (bytes == null || bytes.length == 0) return "";
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            int v = b & 0xFF;
            sb.append(HEX_CHARS[v >>> 4]);
            sb.append(HEX_CHARS[v & 0x0F]);
        }
        return sb.toString();
    }

    /**
     * Konversi Hex string ke byte array
     */
    public static byte[] hexStringToByteArray(String hex) {
        if (hex == null) return new byte[0];
        hex = hex.replaceAll("[^0-9A-Fa-f]", "");
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return data;
    }

    /**
     * Membaca 4 byte integer little-endian (standar DESFire balance)
     */
    public static long bytesToLongLittleEndian(byte[] bytes, int offset, int length) {
        long result = 0;
        for (int i = 0; i < length && (offset + i) < bytes.length; i++) {
            result |= ((long) (bytes[offset + i] & 0xFF)) << (8 * i);
        }
        return result;
    }

    /**
     * Membaca 4 byte integer big-endian
     */
    public static long bytesToLongBigEndian(byte[] bytes, int offset, int length) {
        long result = 0;
        for (int i = 0; i < length && (offset + i) < bytes.length; i++) {
            result = (result << 8) | (bytes[offset + i] & 0xFF);
        }
        return result;
    }

    /**
     * Format angka ke format mata uang Rupiah (e.g. "Rp 75.000")
     */
    public static String formatRupiah(long amount) {
        NumberFormat nf = NumberFormat.getNumberInstance(new Locale("id", "ID"));
        return "Rp " + nf.format(amount);
    }

    /**
     * Format nomor kartu 16 digit menjadi 4 kelompok bertitik / spasi dengan masking tengah
     * (e.g. "6032 •••• •••• 1290")
     */
    public static String formatCardNumber(String raw) {
        if (raw == null || raw.isEmpty()) return "-";
        String clean = raw.replaceAll("[^0-9A-Za-z]", "");
        if (clean.length() >= 16) {
            String prefix = clean.substring(0, 4);
            String suffix = clean.substring(clean.length() - 4);
            return prefix + " •••• •••• " + suffix;
        } else if (clean.length() >= 8) {
            String prefix = clean.substring(0, 4);
            String suffix = clean.substring(clean.length() - 4);
            return prefix + " •••• " + suffix;
        } else {
            return clean;
        }
    }

    /**
     * Membalik urutan pasangan hex byte (Little Endian ke Big Endian)
     * e.g. "A00F0000" -> "00000FA0"
     */
    public static String reverseHexPairs(String hex) {
        if (hex == null || hex.isEmpty()) return "";
        StringBuilder sb = new StringBuilder(hex.length());
        for (int i = hex.length() - 2; i >= 0; i -= 2) {
            sb.append(hex.substring(i, i + 2));
        }
        return sb.toString();
    }
}
