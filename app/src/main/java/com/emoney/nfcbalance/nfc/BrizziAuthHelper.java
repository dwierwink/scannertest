package com.emoney.nfcbalance.nfc;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * Helper autentikasi 3DES kartu BRI Brizzi (MIFARE DESFire EV1).
 * Implementasi kriptografi resmi yang terbukti bekerja membuka register saldo Brizzi.
 */
public class BrizziAuthHelper {

    private String kua;
    private String kub;
    private String kuc;
    private String kud;
    private String kue = "";
    private String kuf = "";

    private String kustringb() {
        return "0000000000000000";
    }

    private String kustringb(String paramString) {
        StringBuilder localStringBuilder = new StringBuilder();
        localStringBuilder.append(paramString.substring(2, 16));
        localStringBuilder.append(paramString.substring(0, 2));
        return localStringBuilder.toString();
    }

    private String kustringc() {
        try {
            return kustringa(kustringa(stringToByteArray("8DC0DC40FE1DC582CF7099E2AACFBC10"), "C152153D5807784C721A433B5B59636D", kustringb())).substring(0, 32);
        } catch (Exception localException) {
            return "";
        }
    }

    private String kustringd() {
        try {
            return kustringa(kustringa(stringToByteArray("3C37029CA595FE4E7E62FCB2F7909B2C"), "C152153D5807784C721A433B5B59636D", kustringb())).substring(0, 32);
        } catch (Exception localException) {
            return "";
        }
    }

    private void kustringe() {
        try {
            this.kub = kustringa(kustringb(this.kua, kustringc(), kustringb())).substring(0, 32);
        } catch (Exception ignored) {}
    }

    private void kustringf() {
        try {
            this.kue = kustringa(kustringb(this.kub, kustringd(), this.kuc));
        } catch (Exception ignored) {}
    }

    public static byte[] stringToByteArray(String paramString) {
        int k = paramString.length();
        byte[] arrayOfByte = new byte[k / 2];
        for (int i = 0; i < k - 1; i += 2) {
            arrayOfByte[i / 2] = ((byte) (Integer.parseInt(paramString.substring(i, i + 2), 16) & 0xFF));
        }
        return arrayOfByte;
    }

    /**
     * Menghasilkan 32-karakter (16-byte) challenge response untuk dikirimkan
     * ke kartu Brizzi via APDU: 90 AF 00 00 10 [response] 00
     */
    public String kustringa() {
        try {
            String str1 = kustringb(kustringa(kustringa(stringToByteArray(kustringa(kustringc(this.kud, this.kue))), stringToByteArray(kustringb()))));
            String str2 = kustringa(kustringc(kustringa(kustringa(stringToByteArray("1122334455667788"), stringToByteArray(this.kud))), this.kue));
            StringBuilder localStringBuilder = new StringBuilder();
            localStringBuilder.append(str2);
            localStringBuilder.append(kustringa(kustringc(kustringa(kustringa(stringToByteArray(str1), stringToByteArray(str2))), this.kue)));
            return localStringBuilder.toString();
        } catch (Exception localException) {
            return "";
        }
    }

    public String kustringa(byte[] paramArrayOfByte) {
        StringBuilder str = new StringBuilder();
        for (byte b : paramArrayOfByte) {
            String hex = Integer.toHexString(b & 0xFF);
            if (hex.length() == 1) {
                str.append("0");
            }
            str.append(hex);
        }
        return str.toString().toUpperCase();
    }

    public void init(String paramString1, String paramString2, String paramString3) {
        this.kua = paramString1;
        this.kuc = paramString2;
        this.kud = paramString3;
        kustringe();
        kustringf();
    }

    public byte[] kustringa(String paramString1, String paramString2) {
        SecretKeySpec keySpec = new SecretKeySpec(stringToByteArray(paramString2), "DES");
        try {
            Cipher localCipher = Cipher.getInstance("DES/ECB/NoPadding");
            localCipher.init(Cipher.ENCRYPT_MODE, keySpec);
            return localCipher.doFinal(stringToByteArray(paramString1));
        } catch (Exception e) {
            return new byte[0];
        }
    }

    public byte[] kustringa(byte[] paramArrayOfByte, String paramString1, String paramString2) {
        byte[] keyBytes;
        if (paramString1.length() == 48) {
            keyBytes = stringToByteArray(paramString1);
        } else if (paramString1.length() == 32) {
            keyBytes = stringToByteArray(paramString1 + paramString1.substring(0, 16));
        } else if (paramString1.length() == 16) {
            keyBytes = stringToByteArray(paramString1 + paramString1 + paramString1);
        } else {
            keyBytes = stringToByteArray("00000000000000000000000000000000");
        }
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "DESede");
        IvParameterSpec ivSpec = new IvParameterSpec(stringToByteArray(paramString2));
        try {
            Cipher localCipher = Cipher.getInstance("DESede/CBC/NoPadding");
            localCipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
            return localCipher.doFinal(paramArrayOfByte);
        } catch (Exception e) {
            return new byte[0];
        }
    }

    public byte[] kustringa(byte[] paramArrayOfByte1, byte[] paramArrayOfByte2) {
        byte[] arrayOfByte = new byte[paramArrayOfByte1.length];
        if (paramArrayOfByte2.length == 0) {
            throw new IllegalArgumentException("empty security key");
        }
        int i = 0;
        for (int j = 0; j < paramArrayOfByte1.length; j++) {
            arrayOfByte[j] = ((byte) (paramArrayOfByte1[j] ^ paramArrayOfByte2[i]));
            i++;
            if (i >= paramArrayOfByte2.length) {
                i = 0;
            }
        }
        return arrayOfByte;
    }

    public byte[] kustringb(String paramString1, String paramString2) {
        SecretKeySpec keySpec = new SecretKeySpec(stringToByteArray(paramString2), "DES");
        try {
            Cipher localCipher = Cipher.getInstance("DES/ECB/NoPadding");
            localCipher.init(Cipher.DECRYPT_MODE, keySpec);
            return localCipher.doFinal(stringToByteArray(paramString1));
        } catch (Exception e) {
            return new byte[0];
        }
    }

    public byte[] kustringb(String paramString1, String paramString2, String paramString3) {
        byte[] keyBytes;
        if (paramString2.length() == 48) {
            keyBytes = stringToByteArray(paramString2);
        } else if (paramString2.length() == 32) {
            keyBytes = stringToByteArray(paramString2 + paramString2.substring(0, 16));
        } else if (paramString2.length() == 16) {
            keyBytes = stringToByteArray(paramString2 + paramString2 + paramString2);
        } else {
            keyBytes = stringToByteArray("00000000000000000000000000000000");
        }
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "DESede");
        IvParameterSpec ivSpec = new IvParameterSpec(stringToByteArray(paramString3));
        try {
            Cipher localCipher = Cipher.getInstance("DESede/CBC/NoPadding");
            localCipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
            return localCipher.doFinal(stringToByteArray(paramString1));
        } catch (Exception e) {
            return new byte[0];
        }
    }

    public byte[] kustringc(String paramString1, String paramString2) {
        String str = paramString2.substring(0, 16);
        String str2 = paramString2.substring(16, 32);
        try {
            return stringToByteArray(kustringa(kustringb(kustringa(kustringa(kustringa(kustringb(paramString1, str)), str2)), str)));
        } catch (Exception e) {
            return new byte[0];
        }
    }
}
