package com.emoney.nfcbalance.nfc;

import android.nfc.Tag;
import android.nfc.tech.MifareClassic;
import android.util.Log;

import java.io.IOException;

/**
 * Pembaca kartu dengan teknologi MIFARE Classic (1K / 4K).
 */
public class MifareClassicReader {

    private static final String TAG = "MifareClassicReader";

    public static class MifareResult {
        public boolean isMifareClassic = false;
        public boolean balanceFound = false;
        public long balance = 0;
        public int sectorCount = 0;
    }

    public static MifareResult readMifare(Tag tag) {
        MifareResult result = new MifareResult();
        MifareClassic mfc = MifareClassic.get(tag);
        if (mfc == null) return result;

        result.isMifareClassic = true;

        try {
            mfc.connect();
            result.sectorCount = mfc.getSectorCount();

            // Kunci otentikasi umum
            byte[][] defaultKeys = new byte[][]{
                    MifareClassic.KEY_DEFAULT,
                    MifareClassic.KEY_MIFARE_APPLICATION_DIRECTORY,
                    MifareClassic.KEY_NFC_FORUM,
                    ByteUtils.hexStringToByteArray("A0A1A2A3A4A5"),
                    ByteUtils.hexStringToByteArray("D3F7D3F7D3F7"),
                    ByteUtils.hexStringToByteArray("000000000000")
            };

            // Uji otentikasi pada sektor awal (1 sampai 4)
            for (int s = 1; s < Math.min(result.sectorCount, 4); s++) {
                boolean auth = false;
                for (byte[] key : defaultKeys) {
                    if (mfc.authenticateSectorWithKeyA(s, key) || mfc.authenticateSectorWithKeyB(s, key)) {
                        auth = true;
                        break;
                    }
                }

                if (auth) {
                    int blockIndex = mfc.sectorToBlock(s);
                    int blockCount = mfc.getBlockCountInSector(s);

                    for (int b = 0; b < blockCount - 1; b++) { // Lewati trailer block
                        byte[] data = mfc.readBlock(blockIndex + b);
                        if (data != null && data.length == 16) {
                            // Cek format Mifare Value Block: 4 bytes value, 4 bytes inverted value, 4 bytes value, 4 bytes address
                            long val1 = ByteUtils.bytesToLongLittleEndian(data, 0, 4);
                            long val2 = ByteUtils.bytesToLongLittleEndian(data, 8, 4);
                            if (val1 == val2 && val1 > 0 && val1 <= 20_000_000) {
                                result.balanceFound = true;
                                result.balance = val1;
                                Log.d(TAG, "Mifare Value Block found: " + val1);
                                return result;
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            Log.d(TAG, "Mifare Classic read error: " + e.getMessage());
        } finally {
            try {
                mfc.close();
            } catch (Exception ignored) {}
        }

        return result;
    }
}
