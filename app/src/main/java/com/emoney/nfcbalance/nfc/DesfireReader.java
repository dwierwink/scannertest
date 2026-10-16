package com.emoney.nfcbalance.nfc;

import android.nfc.tech.IsoDep;
import android.util.Log;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Pembaca protokol khusus MIFARE DESFire EV1 / EV2 melalui wrapper APDU ISO-DEP.
 */
public class DesfireReader {

    private static final String TAG = "DesfireReader";

    // DESFire wrapped command codes
    private static final byte CLA_DESFIRE = (byte) 0x90;
    private static final byte CMD_SELECT_APP = (byte) 0x5A;
    private static final byte CMD_GET_APP_IDS = (byte) 0x6A;
    private static final byte CMD_GET_FILE_IDS = (byte) 0x6F;
    private static final byte CMD_GET_VALUE = (byte) 0x6C;
    private static final byte CMD_READ_DATA = (byte) 0xBD;
    private static final byte CMD_ADDITIONAL_FRAME = (byte) 0xAF;

    public static class DesfireResult {
        public boolean isDesfire = false;
        public boolean balanceFound = false;
        public long balance = 0;
        public List<String> appIds = new ArrayList<>();
        public String parsedCardNumber = null;
    }

    /**
     * Memeriksa dan membaca data dari kartu MIFARE DESFire
     */
    public static DesfireResult readDesfire(IsoDep isoDep) {
        DesfireResult result = new DesfireResult();

        try {
            // 1. Coba pilih Master Application (00 00 00)
            byte[] selectRootCmd = new byte[]{
                    CLA_DESFIRE, CMD_SELECT_APP, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00
            };
            byte[] rootResp = isoDep.transceive(selectRootCmd);
            
            // Cek status DESFire (biasanya diakhiri dengan 91 00 atau status word 90 00)
            if (!isSuccess(rootResp)) {
                Log.d(TAG, "Not a standard DESFire card or select root failed");
                return result;
            }

            result.isDesfire = true;
            Log.d(TAG, "DESFire root selected successfully");

            // 2. Dapatkan daftar Application IDs (AIDs)
            byte[] getAidsCmd = new byte[]{
                    CLA_DESFIRE, CMD_GET_APP_IDS, 0x00, 0x00, 0x00
            };
            byte[] aidsResp = isoDep.transceive(getAidsCmd);
            
            List<byte[]> appList = new ArrayList<>();
            if (isSuccess(aidsResp) && aidsResp.length > 2) {
                int aidDataLen = aidsResp.length - 2; // Kurangi 2 byte status di akhir
                for (int i = 0; i + 2 < aidDataLen; i += 3) {
                    byte[] aid = new byte[]{aidsResp[i], aidsResp[i + 1], aidsResp[i + 2]};
                    appList.add(aid);
                    result.appIds.add(ByteUtils.toHexString(aid));
                    Log.d(TAG, "Found DESFire AID: " + ByteUtils.toHexString(aid));
                }
            }

            // 3. Iterasi setiap aplikasi untuk mencari Value File (Saldo)
            // Jika appList kosong, coba AID standar e-money seperti 00 00 01 atau 01 00 00
            if (appList.isEmpty()) {
                appList.add(new byte[]{0x01, 0x00, 0x00});
                appList.add(new byte[]{0x00, 0x00, 0x01});
                appList.add(new byte[]{0x02, 0x00, 0x00});
                appList.add(new byte[]{(byte) 0xF0, 0x18, 0x40});
            }

            for (byte[] aid : appList) {
                // Select Application
                byte[] selectAppCmd = new byte[]{
                        CLA_DESFIRE, CMD_SELECT_APP, 0x00, 0x00, 0x03, aid[0], aid[1], aid[2], 0x00
                };
                byte[] selResp = isoDep.transceive(selectAppCmd);
                if (!isSuccess(selResp)) continue;

                // Dapatkan file IDs dalam app ini
                byte[] getFilesCmd = new byte[]{
                        CLA_DESFIRE, CMD_GET_FILE_IDS, 0x00, 0x00, 0x00
                };
                byte[] filesResp = isoDep.transceive(getFilesCmd);

                List<Byte> fileIds = new ArrayList<>();
                if (isSuccess(filesResp) && filesResp.length > 2) {
                    for (int f = 0; f < filesResp.length - 2; f++) {
                        fileIds.add(filesResp[f]);
                    }
                } else {
                    // Coba file id 0, 1, 2 default
                    fileIds.add((byte) 0x00);
                    fileIds.add((byte) 0x01);
                    fileIds.add((byte) 0x02);
                }

                // Coba Get Value pada setiap file
                for (byte fileId : fileIds) {
                    byte[] getValueCmd = new byte[]{
                            CLA_DESFIRE, CMD_GET_VALUE, 0x00, 0x00, 0x01, fileId, 0x00
                    };
                    byte[] valResp = isoDep.transceive(getValueCmd);

                    if (isSuccess(valResp) && valResp.length >= 6) {
                        // 4 bytes integer little endian
                        long val = ByteUtils.bytesToLongLittleEndian(valResp, 0, 4);
                        if (val >= 0 && val <= 20_000_000) { // Rentang wajar saldo e-money di Indonesia
                            result.balanceFound = true;
                            result.balance = val;
                            Log.d(TAG, "Balance found on AID " + ByteUtils.toHexString(aid) + " file " + fileId + ": " + val);
                            return result;
                        }
                    }

                    // Coba baca data mentah (Read Data) untuk nomor kartu / info
                    byte[] readDataCmd = new byte[]{
                            CLA_DESFIRE, CMD_READ_DATA, 0x00, 0x00, 0x07,
                            fileId, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00
                    };
                    byte[] dataResp = isoDep.transceive(readDataCmd);
                    if (isSuccess(dataResp) && dataResp.length >= 10) {
                        String hexData = ByteUtils.toHexString(dataResp);
                        Log.d(TAG, "Read data on file " + fileId + ": " + hexData);
                    }
                }
            }

        } catch (IOException e) {
            Log.e(TAG, "IOException during DESFire communication", e);
        }

        return result;
    }

    private static boolean isSuccess(byte[] resp) {
        if (resp == null || resp.length < 2) return false;
        int len = resp.length;
        byte sw1 = resp[len - 2];
        byte sw2 = resp[len - 1];
        // Standar ISO 90 00 atau DESFire Status 91 00 (atau 91 AF untuk additional frame)
        return (sw1 == (byte) 0x90 && sw2 == (byte) 0x00) ||
                (sw1 == (byte) 0x91 && sw2 == (byte) 0x00) ||
                (sw1 == (byte) 0x91 && sw2 == (byte) 0xAF);
    }
}
