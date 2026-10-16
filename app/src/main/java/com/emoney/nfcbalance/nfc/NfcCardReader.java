package com.emoney.nfcbalance.nfc;

import android.nfc.Tag;
import android.nfc.tech.IsoDep;
import android.nfc.tech.MifareClassic;
import android.nfc.tech.NfcA;
import android.util.Log;

import com.emoney.nfcbalance.model.CardInfo;

import java.io.IOException;
import java.util.Arrays;

/**
 * Controller utama untuk mengurai objek NFC Tag yang terdeteksi.
 */
public class NfcCardReader {

    private static final String TAG = "NfcCardReader";

    /**
     * Parsing Tag NFC menjadi objek CardInfo
     */
    public static CardInfo parseTag(Tag tag) {
        if (tag == null) return null;

        CardInfo cardInfo = new CardInfo();
        
        // 1. Ekstrak UID fisik kartu
        byte[] id = tag.getId();
        String uidHex = ByteUtils.toHexStringWithColon(id);
        String rawUid = ByteUtils.toHexString(id);
        cardInfo.setCardUid(uidHex);

        // Nomor kartu default dari UID (diforward menjadi format 16-karakter atau masked)
        cardInfo.setCardNumber(ByteUtils.formatCardNumber(rawUid));

        // 2. Periksa daftar teknologi kartu
        String[] techList = tag.getTechList();
        Log.d(TAG, "Tag detected with technologies: " + Arrays.toString(techList));

        boolean hasIsoDep = false;
        boolean hasMifareClassic = false;

        for (String tech : techList) {
            if (tech.contains("IsoDep")) hasIsoDep = true;
            if (tech.contains("MifareClassic")) hasMifareClassic = true;
        }

        // 3. Jika memiliki teknologi IsoDep (Mayoritas kartu e-money modern)
        if (hasIsoDep) {
            cardInfo.setTechnology("ISO-DEP (ISO 14443-4)");
            IsoDep isoDep = IsoDep.get(tag);
            if (isoDep != null) {
                try {
                    isoDep.connect();
                    isoDep.setTimeout(4000); // Timeout 4 detik agar stabil

                    // Cek historical bytes / ATS
                    byte[] historicalBytes = isoDep.getHistoricalBytes();
                    byte[] hiLayerResp = isoDep.getHiLayerResponse();
                    if (historicalBytes != null) {
                        Log.d(TAG, "Historical Bytes: " + ByteUtils.toHexString(historicalBytes));
                    }

                    // A. Coba deteksi via DESFire
                    DesfireReader.DesfireResult desfireResult = DesfireReader.readDesfire(isoDep);
                    if (desfireResult.isDesfire) {
                        cardInfo.setCardName("Mandiri e-Money");
                        if (desfireResult.balanceFound) {
                            cardInfo.setBalance(desfireResult.balance);
                            cardInfo.setFormattedBalance(ByteUtils.formatRupiah(desfireResult.balance));
                            cardInfo.setEncrypted(false);
                            return cardInfo;
                        }
                    }

                    // B. Coba deteksi via ISO-DEP Bank AID Reader
                    IsoDepReader.IsoResult isoResult = IsoDepReader.readIsoDep(isoDep);
                    if (isoResult != null && isoResult.detectedIssuer != null) {
                        cardInfo.setCardName(isoResult.detectedIssuer);
                        if (isoResult.balanceFound) {
                            cardInfo.setBalance(isoResult.balance);
                            cardInfo.setFormattedBalance(ByteUtils.formatRupiah(isoResult.balance));
                            cardInfo.setEncrypted(false);
                            return cardInfo;
                        } else if (isoResult.isSecurityProtected) {
                            // Saldo terkunci dengan proteksi enkripsi bank (HSM/SAM)
                            cardInfo.setEncrypted(true);
                            cardInfo.setFormattedBalance("Terkunci Enkripsi");
                            return cardInfo;
                        }
                    }

                } catch (IOException e) {
                    Log.e(TAG, "Error connecting to IsoDep", e);
                } finally {
                    try {
                        isoDep.close();
                    } catch (Exception ignored) {}
                }
            }
        }

        // 4. Jika kartu Mifare Classic
        if (hasMifareClassic) {
            cardInfo.setCardName("Kartu MIFARE Classic");
            cardInfo.setTechnology("MIFARE Classic (NXP)");
            MifareClassicReader.MifareResult mfcResult = MifareClassicReader.readMifare(tag);
            if (mfcResult.balanceFound) {
                cardInfo.setBalance(mfcResult.balance);
                cardInfo.setFormattedBalance(ByteUtils.formatRupiah(mfcResult.balance));
                cardInfo.setEncrypted(false);
                return cardInfo;
            }
        }

        // 5. Fallback ke kartu NFC-A / Generic SmartCard
        NfcA nfcA = NfcA.get(tag);
        if (nfcA != null) {
            if (cardInfo.getCardName().equals("Kartu NFC")) {
                cardInfo.setCardName("Kartu e-Money / NFC");
            }
            if (cardInfo.getTechnology().equals("ISO 14443")) {
                cardInfo.setTechnology("NFC-A (ISO 14443-3A)");
            }
        }

        // Jika saldo tidak dapat dibaca karena proteksi enkripsi dari penerbit
        cardInfo.setEncrypted(true);
        cardInfo.setFormattedBalance("Terkunci Enkripsi");
        
        return cardInfo;
    }
}
