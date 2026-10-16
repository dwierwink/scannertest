package com.emoney.nfcbalance.model;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Model data yang menyimpan detail kartu e-money yang dipindai.
 */
public class CardInfo implements Serializable {
    private String cardName;          // e.g. "Mandiri e-Money", "BCA Flazz", "BNI TapCash", "BRI Brizzi"
    private String cardNumber;        // Nomor kartu terformat (e.g. "6032 •••• •••• 9812")
    private String cardUid;           // UID kartu dalam hex (e.g. "04:A2:38:B1")
    private long balance;             // Nilai saldo dalam Rupiah
    private String formattedBalance;  // e.g. "Rp 75.000"
    private boolean isEncrypted;      // True jika saldo terproteksi enkripsi bank (SAM/HSM)
    private String technology;        // e.g. "IsoDep (ISO 14443-4)"
    private long timestamp;           // Waktu pemindaian (epoch millis)

    public CardInfo() {
        this.timestamp = System.currentTimeMillis();
    }

    public CardInfo(String cardName, String cardNumber, String cardUid, long balance, 
                    String formattedBalance, boolean isEncrypted, String technology) {
        this.cardName = cardName;
        this.cardNumber = cardNumber;
        this.cardUid = cardUid;
        this.balance = balance;
        this.formattedBalance = formattedBalance;
        this.isEncrypted = isEncrypted;
        this.technology = technology;
        this.timestamp = System.currentTimeMillis();
    }

    public String getCardName() {
        return cardName != null ? cardName : "Kartu NFC";
    }

    public void setCardName(String cardName) {
        this.cardName = cardName;
    }

    public String getCardNumber() {
        return cardNumber != null ? cardNumber : cardUid;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardUid() {
        return cardUid != null ? cardUid : "-";
    }

    public void setCardUid(String cardUid) {
        this.cardUid = cardUid;
    }

    public long getBalance() {
        return balance;
    }

    public void setBalance(long balance) {
        this.balance = balance;
    }

    public String getFormattedBalance() {
        return formattedBalance != null ? formattedBalance : "Rp 0";
    }

    public void setFormattedBalance(String formattedBalance) {
        this.formattedBalance = formattedBalance;
    }

    public boolean isEncrypted() {
        return isEncrypted;
    }

    public void setEncrypted(boolean encrypted) {
        isEncrypted = encrypted;
    }

    public String getTechnology() {
        return technology != null ? technology : "ISO 14443";
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getFormattedTimestamp() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy, HH:mm", new Locale("id", "ID"));
        return sdf.format(new Date(timestamp));
    }
}
