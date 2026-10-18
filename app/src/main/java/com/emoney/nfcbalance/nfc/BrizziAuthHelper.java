package com.emoney.nfcbalance.nfc;

import java.security.spec.AlgorithmParameterSpec;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * Helper untuk autentikasi 3DES kartu BRI Brizzi (MIFARE DESFire EV1).
 * Menggunakan algoritma diversifikasi key dari UID dan nomor kartu
 * untuk membuka kunci Value File / Purse saldo Brizzi.
 */
public class BrizziAuthHelper {

    private String cardTagUid;
    private String derivedKeyPart1;
    private String derivedKeyPart2;
    private String sessionChallenge;
    private String sessionKey = "";

    private static String getZeroIv() {
        return "0000000000000000";
    }

    private static String rotateHex(String hex) {
        if (hex.length() < 16) return hex;
        return hex.substring(2, 16) + hex.substring(0, 2);
    }

    private String getMasterKeyPart1() {
        try {
            byte[] enc = stringToByteArray("8DC0DC40FE1DC582CF7099E2AACFBC10");
            byte[] key = stringToByteArray("C152153D5807784C721A433B5B59636D");
            byte[] res = desEcbDecrypt(enc, key);
            return toHexString(res).substring(0, 32);
        } catch (Exception e) {
            return "";
        }
    }

    private String getMasterKeyPart2() {
        try {
            byte[] enc = stringToByteArray("3C37029CA595FE4E7E62FCB2F7909B2C");
            byte[] key = stringToByteArray("C152153D5807784C721A433B5B59636D");
            byte[] res = desEcbDecrypt(enc, key);
            return toHexString(res).substring(0, 32);
        } catch (Exception e) {
            return "";
        }
    }

    private void derivePart1() {
        try {
            byte[] res = des3CbcDecrypt(stringToByteArray(rotateHex(this.cardTagUid)), getMasterKeyPart1(), getZeroIv());
            this.derivedKeyPart1 = toHexString(res).substring(0, 32);
        } catch (Exception ignored) {}
    }

    private void derivePart2() {
        try {
            byte[] res = des3CbcDecrypt(stringToByteArray(rotateHex(this.derivedKeyPart1)), getMasterKeyPart2(), this.derivedKeyPart2);
            this.sessionKey = toHexString(res);
        } catch (Exception ignored) {}
    }

    public void init(String cardTagUid, String keySeed, String challengeRndB) {
        this.cardTagUid = cardTagUid;
        this.derivedKeyPart2 = keySeed;
        this.sessionChallenge = challengeRndB;
        derivePart1();
        derivePart2();
    }

    public String generateChallengeResponse() {
        try {
            byte[] partA = des3CbcDecrypt(stringToByteArray(des3EncryptBlock(this.sessionChallenge, this.sessionKey)), getZeroIv());
            String str1 = rotateHex(toHexString(partA));

            byte[] partB = stringToByteArray("1122334455667788");
            byte[] xorB = xorBytes(partB, stringToByteArray(this.sessionChallenge));
            String str2 = des3EncryptBlock(toHexString(xorB), this.sessionKey);

            byte[] xorC = xorBytes(stringToByteArray(str1), stringToByteArray(str2));
            String str3 = des3EncryptBlock(toHexString(xorC), this.sessionKey);

            return (str2 + str3).toUpperCase();
        } catch (Exception e) {
            return "";
        }
    }

    public static byte[] stringToByteArray(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return data;
    }

    public static String toHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X", b & 0xFF));
        }
        return sb.toString();
    }

    private static byte[] desEcbDecrypt(byte[] data, byte[] keyBytes) {
        try {
            SecretKeySpec key = new SecretKeySpec(keyBytes, "DES");
            Cipher cipher = Cipher.getInstance("DES/ECB/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, key);
            return cipher.doFinal(data);
        } catch (Exception e) {
            return new byte[0];
        }
    }

    private static byte[] des3CbcDecrypt(byte[] data, String keyHex, String ivHex) {
        try {
            byte[] keyBytes = prepareDes3Key(keyHex);
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "DESede");
            AlgorithmParameterSpec iv = new IvParameterSpec(stringToByteArray(ivHex));
            Cipher cipher = Cipher.getInstance("DESede/CBC/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, keySpec, iv);
            return cipher.doFinal(data);
        } catch (Exception e) {
            return new byte[0];
        }
    }

    private static byte[] des3CbcDecrypt(byte[] data, String ivHex) {
        return des3CbcDecrypt(data, "00000000000000000000000000000000", ivHex);
    }

    private static String des3EncryptBlock(String dataHex, String keyHex) {
        try {
            String k1 = keyHex.substring(0, 16);
            String k2 = keyHex.substring(16, 32);

            byte[] b1 = desEcbDecrypt(stringToByteArray(dataHex), stringToByteArray(k1));
            byte[] b2 = desEcbEncrypt(b1, stringToByteArray(k2));
            byte[] b3 = desEcbDecrypt(b2, stringToByteArray(k1));
            return toHexString(b3);
        } catch (Exception e) {
            return "";
        }
    }

    private static byte[] desEcbEncrypt(byte[] data, byte[] keyBytes) {
        try {
            SecretKeySpec key = new SecretKeySpec(keyBytes, "DES");
            Cipher cipher = Cipher.getInstance("DES/ECB/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return cipher.doFinal(data);
        } catch (Exception e) {
            return new byte[0];
        }
    }

    private static byte[] prepareDes3Key(String keyHex) {
        if (keyHex.length() == 48) {
            return stringToByteArray(keyHex);
        } else if (keyHex.length() == 32) {
            return stringToByteArray(keyHex + keyHex.substring(0, 16));
        } else if (keyHex.length() == 16) {
            return stringToByteArray(keyHex + keyHex + keyHex);
        }
        return stringToByteArray("000000000000000000000000000000000000000000000000");
    }

    private static byte[] xorBytes(byte[] a, byte[] b) {
        byte[] res = new byte[a.length];
        for (int i = 0; i < a.length; i++) {
            res[i] = (byte) (a[i] ^ b[i % b.length]);
        }
        return res;
    }
}
