package com.emoney.nfcbalance.utils;

import android.content.Context;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;

/**
 * Helper untuk memberikan respon getar (haptic feedback) dan suara saat kartu terdeteksi.
 */
public class SoundVibrationHelper {

    private static final String TAG = "SoundVibrationHelper";

    /**
     * Memainkan efek getar dan suara notifikasi kartu terbaca
     */
    public static void triggerSuccess(Context context) {
        playCardTapFeedback(context);
    }

    public static void playCardTapFeedback(Context context) {
        if (context == null) return;

        // 1. Getar (Haptic Feedback)
        try {
            Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null && vibrator.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    // Dua kali getaran lembut ala tap pembayaran
                    long[] pattern = {0, 60, 80, 80};
                    int[] amplitudes = {0, 200, 0, 255};
                    VibrationEffect effect = VibrationEffect.createWaveform(pattern, amplitudes, -1);
                    vibrator.vibrate(effect);
                } else {
                    vibrator.vibrate(100);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Vibration failed", e);
        }

        // 2. Efek Nada Bip Sukses (ToneGenerator)
        try {
            ToneGenerator toneGen = new ToneGenerator(AudioManager.STREAM_NOTIFICATION, 80);
            toneGen.startTone(ToneGenerator.TONE_PROP_BEEP2, 180);
        } catch (Exception e) {
            Log.e(TAG, "Tone generation failed", e);
        }
    }
}
