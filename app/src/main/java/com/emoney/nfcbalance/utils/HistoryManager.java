package com.emoney.nfcbalance.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.emoney.nfcbalance.model.CardInfo;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * Manajer penyimpanan riwayat pemindaian kartu menggunakan SharedPreferences.
 */
public class HistoryManager {

    private static final String PREF_NAME = "nfc_emoney_prefs";
    private static final String KEY_HISTORY = "scan_history";
    private static final int MAX_HISTORY = 20;

    private final SharedPreferences prefs;
    private final Gson gson;

    public HistoryManager(Context context) {
        this.prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        this.gson = new Gson();
    }

    /**
     * Menyimpan kartu yang baru dipindai ke daftar riwayat (paling atas)
     */
    public void saveCard(CardInfo card) {
        if (card == null) return;

        List<CardInfo> list = getHistory();
        
        // Hapus duplikat UID jika sudah ada agar posisinya diperbarui ke paling atas
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getCardUid().equalsIgnoreCase(card.getCardUid())) {
                list.remove(i);
                break;
            }
        }

        list.add(0, card);

        // Batasi riwayat maksimal 20 item
        if (list.size() > MAX_HISTORY) {
            list = list.subList(0, MAX_HISTORY);
        }

        String json = gson.toJson(list);
        prefs.edit().putString(KEY_HISTORY, json).apply();
    }

    /**
     * Mengambil daftar riwayat pemindaian
     */
    public List<CardInfo> getHistory() {
        String json = prefs.getString(KEY_HISTORY, null);
        if (json == null || json.isEmpty()) {
            return new ArrayList<>();
        }
        Type type = new TypeToken<List<CardInfo>>() {}.getType();
        try {
            List<CardInfo> list = gson.fromJson(json, type);
            return list != null ? list : new ArrayList<>();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    /**
     * Menghapus semua riwayat pemindaian
     */
    public void clearHistory() {
        prefs.edit().remove(KEY_HISTORY).apply();
    }
}
