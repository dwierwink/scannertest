package com.emoney.nfcbalance.toll;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class TollDataHelper {

    public static class Gate {
        public final String id;
        public final String name;
        public final String wilayah;
        public final String ruas;
        public final int km;

        public Gate(String id, String name, String wilayah, String ruas, int km) {
            this.id = id;
            this.name = name;
            this.wilayah = wilayah;
            this.ruas = ruas;
            this.km = km;
        }

        @Override
        public String toString() {
            return name + " (" + wilayah + ")";
        }
    }

    public static class Segment {
        public final String ruasName;
        public final String fromName;
        public final String toName;
        public final long fee;

        public Segment(String ruasName, String fromName, String toName, long fee) {
            this.ruasName = ruasName;
            this.fromName = fromName;
            this.toName = toName;
            this.fee = fee;
        }
    }

    public static class TollResult {
        public final boolean success;
        public final long totalFee;
        public final List<Segment> segments;
        public final int distanceKm;
        public final String error;

        public TollResult(boolean success, long totalFee, List<Segment> segments, int distanceKm, String error) {
            this.success = success;
            this.totalFee = totalFee;
            this.segments = segments != null ? segments : new ArrayList<>();
            this.distanceKm = distanceKm;
            this.error = error;
        }
    }

    private static class RawSegment {
        final String fromId;
        final String toId;
        final long baseFee;
        final String ruasName;

        RawSegment(String fromId, String toId, long baseFee, String ruasName) {
            this.fromId = fromId;
            this.toId = toId;
            this.baseFee = baseFee;
            this.ruasName = ruasName;
        }
    }

    private static final List<Gate> ALL_GATES = new ArrayList<>();
    private static final Map<String, Long> DIRECT_RATES = new HashMap<>();
    private static final Map<String, String> DIRECT_RUAS = new HashMap<>();

    static {
        // 1. Kab. Gresik
        addGate("GT_MANYAR", "Manyar", "Kab. Gresik", "Surabaya - Gresik & KLBM", 24);
        addGate("GT_KEBOMAS", "Kebomas", "Kab. Gresik", "Surabaya - Gresik", 16);
        addGate("GT_BUNDER", "Bunder Gresik", "Kab. Gresik", "Tol KLBM", 28);
        addGate("GT_CERME", "Cerme", "Kab. Gresik", "Tol KLBM", 20);

        // 2. Kota Surabaya
        addGate("GT_DUPAK", "Dupak", "Kota Surabaya", "Surabaya - Gresik & Sby - Gempol", 4);
        addGate("GT_TANDES", "Tandes", "Kota Surabaya", "Surabaya - Gresik", 8);
        addGate("GT_ROMOKALISARI", "Romokalisari", "Kota Surabaya", "Surabaya - Gresik", 13);
        addGate("GT_BANYU_URIP", "Banyu Urip", "Kota Surabaya", "Surabaya - Gempol", 7);
        addGate("GT_GUNUNGSARI", "Gunungsari", "Kota Surabaya", "Surabaya - Gempol", 11);
        addGate("GT_PAGESANGAN", "Pagesangan / Jambangan", "Kota Surabaya", "Surabaya - Gempol", 13);
        addGate("GT_WARU_SBY", "Waru (Surabaya)", "Kota Surabaya", "Surabaya - Gempol", 17);
        addGate("GT_WARUGUNUNG", "Warugunung (SuMo Utama)", "Kota Surabaya", "Surabaya - Mojokerto", 14);

        // 3. Kab. Sidoarjo
        addGate("GT_WARU_RAMP", "Waru Ramp", "Kab. Sidoarjo", "Surabaya - Gempol", 17);
        addGate("GT_BERBEK", "Berbek", "Kab. Sidoarjo", "Tol Waru - Juanda", 6);
        addGate("GT_TAMBAKSUMUR", "Tambaksumur", "Kab. Sidoarjo", "Tol Waru - Juanda", 9);
        addGate("GT_JUANDA", "Juanda (Bandara T1 & T2)", "Kab. Sidoarjo", "Tol Waru - Juanda", 12);
        addGate("GT_SIDOARJO", "Sidoarjo Kota", "Kab. Sidoarjo", "Surabaya - Gempol", 28);
        addGate("GT_TANGGULANGIN", "Tanggulangin", "Kab. Sidoarjo", "Porong - Gempol", 34);
        addGate("GT_PORONG", "Porong", "Kab. Sidoarjo", "Porong - Gempol", 38);
        addGate("GT_KRIAN", "Krian", "Kab. Sidoarjo", "Surabaya - Mojokerto & KLBM", 26);
        addGate("GT_BELAHANREJO", "Belahanrejo", "Kab. Sidoarjo", "Tol KLBM", 8);
        addGate("GT_LEBANI_SUKO", "Lebani Suko", "Kab. Sidoarjo", "Tol KLBM & SuMo", 12);

        // 4. Kab. & Kota Mojokerto
        addGate("GT_PENOMPO", "Penompo (Mojokerto Timur)", "Mojokerto", "Surabaya - Mojokerto & Jomo", 42);
        addGate("GT_MOJOKERTO_BARAT", "Mojokerto Barat (Gedeg)", "Mojokerto", "Tol Jomo", 50);

        // 5. Kab. Jombang
        addGate("GT_JOMBANG", "Jombang (Tembelang)", "Kab. Jombang", "Tol Jomo", 68);
        addGate("GT_BANDAR", "Bandar (Kertosono Timur)", "Kab. Jombang", "Tol Jomo & Ngawi - Kertosono", 82);

        // 6. Kab. Nganjuk & Kertosono
        addGate("GT_KERTOSONO", "Kertosono (Simpang Susun)", "Nganjuk & Kertosono", "Tol Ngawi - Kertosono", 84);
        addGate("GT_NGANJUK", "Nganjuk (Sukomoro)", "Nganjuk & Kertosono", "Tol Ngawi - Kertosono", 115);

        // 7. Kab. & Kota Madiun
        addGate("GT_CARUBAN", "Caruban", "Madiun", "Tol Ngawi - Kertosono", 145);
        addGate("GT_MADIUN", "Madiun (Dumpil)", "Madiun", "Tol Ngawi - Kertosono", 160);

        // 8. Kab. & Kota Pasuruan
        addGate("GT_KEJAPANAN", "Kejapanan Utama", "Pasuruan", "Porong - Gempol", 43);
        addGate("GT_GEMPOL", "Gempol Junction", "Pasuruan", "Gempol - Pasuruan & Pandaan", 46);
        addGate("GT_BANGIL", "Bangil", "Pasuruan", "Gempol - Pasuruan", 55);
        addGate("GT_REMBANG", "Rembang (PIER)", "Pasuruan", "Gempol - Pasuruan", 64);
        addGate("GT_PASURUAN", "Pasuruan Kota", "Pasuruan", "Gempol - Pasuruan", 74);
        addGate("GT_GRATI", "Grati", "Pasuruan", "Gempol - Pasuruan & Paspro", 87);
        addGate("GT_PANDAAN", "Pandaan", "Pasuruan", "Gempol - Pandaan & Pandaan - Malang", 58);

        // 9. Kab. & Kota Probolinggo
        addGate("GT_TONGAS", "Tongas", "Probolinggo", "Pasuruan - Probolinggo", 104);
        addGate("GT_PROBOLINGGO_BARAT", "Probolinggo Barat", "Probolinggo", "Pasuruan - Probolinggo", 115);
        addGate("GT_PROBOLINGGO_TIMUR", "Probolinggo Timur (Leces)", "Probolinggo", "Pasuruan - Probolinggo", 127);
        addGate("GT_GENDING", "Gending (Probolinggo Timur Baru)", "Probolinggo", "Pasuruan - Probolinggo", 136);

        // 10. Kab. & Kota Malang
        addGate("GT_PURWODADI", "Purwodadi", "Malang", "Pandaan - Malang", 72);
        addGate("GT_LAWANG", "Lawang", "Malang", "Pandaan - Malang", 82);
        addGate("GT_SINGOSARI", "Singosari (Batu)", "Malang", "Pandaan - Malang", 92);
        addGate("GT_PAKIS", "Pakis (Bandara Abd Saleh)", "Malang", "Pandaan - Malang", 96);
        addGate("GT_MALANG_KOTA", "Malang (Madyopuro)", "Malang", "Pandaan - Malang", 101);

        // 1. Surabaya - Gresik (Kepmen PUPR 149/KPTS/M/2024)
        addRate("GT_DUPAK", "GT_TANDES", 4500, "Tol Surabaya - Gresik");
        addRate("GT_DUPAK", "GT_ROMOKALISARI", 12000, "Tol Surabaya - Gresik");
        addRate("GT_DUPAK", "GT_KEBOMAS", 21500, "Tol Surabaya - Gresik");
        addRate("GT_DUPAK", "GT_MANYAR", 27500, "Tol Surabaya - Gresik");
        addRate("GT_TANDES", "GT_ROMOKALISARI", 7000, "Tol Surabaya - Gresik");
        addRate("GT_TANDES", "GT_KEBOMAS", 17000, "Tol Surabaya - Gresik");
        addRate("GT_TANDES", "GT_MANYAR", 22500, "Tol Surabaya - Gresik");
        addRate("GT_ROMOKALISARI", "GT_KEBOMAS", 10000, "Tol Surabaya - Gresik");
        addRate("GT_ROMOKALISARI", "GT_MANYAR", 15500, "Tol Surabaya - Gresik");
        addRate("GT_KEBOMAS", "GT_MANYAR", 5500, "Tol Surabaya - Gresik");

        // 2. Surabaya Urban (Seksi Dupak - Waru Sistem Terbuka)
        addRate("GT_DUPAK", "GT_BANYU_URIP", 4000, "Tol Surabaya - Gempol (Seksi Dupak - Waru)");
        addRate("GT_DUPAK", "GT_GUNUNGSARI", 6000, "Tol Surabaya - Gempol (Seksi Dupak - Waru)");
        addRate("GT_DUPAK", "GT_PAGESANGAN", 6000, "Tol Surabaya - Gempol (Seksi Dupak - Waru)");
        addRate("GT_DUPAK", "GT_WARU_SBY", 6000, "Tol Surabaya - Gempol (Seksi Dupak - Waru)");
        addRate("GT_BANYU_URIP", "GT_GUNUNGSARI", 4000, "Tol Surabaya - Gempol (Seksi Dupak - Waru)");
        addRate("GT_BANYU_URIP", "GT_WARU_SBY", 6000, "Tol Surabaya - Gempol (Seksi Dupak - Waru)");
        addRate("GT_GUNUNGSARI", "GT_PAGESANGAN", 4000, "Tol Surabaya - Gempol (Seksi Dupak - Waru)");
        addRate("GT_GUNUNGSARI", "GT_WARU_SBY", 5000, "Tol Surabaya - Gempol (Seksi Dupak - Waru)");
        addRate("GT_PAGESANGAN", "GT_WARU_SBY", 4000, "Tol Surabaya - Gempol (Seksi Dupak - Waru)");

        // 3. Waru - Juanda (Kepmen PU 642/KPTS/M/2025: Gol I Rp 9.500)
        addRate("GT_WARU_SBY", "GT_BERBEK", 4500, "Tol Simpang Susun Waru - Bandara Juanda");
        addRate("GT_WARU_SBY", "GT_TAMBAKSUMUR", 6500, "Tol Simpang Susun Waru - Bandara Juanda");
        addRate("GT_WARU_SBY", "GT_JUANDA", 9500, "Tol Simpang Susun Waru - Bandara Juanda");
        addRate("GT_BERBEK", "GT_TAMBAKSUMUR", 3000, "Tol Simpang Susun Waru - Bandara Juanda");
        addRate("GT_BERBEK", "GT_JUANDA", 6000, "Tol Simpang Susun Waru - Bandara Juanda");
        addRate("GT_TAMBAKSUMUR", "GT_JUANDA", 4500, "Tol Simpang Susun Waru - Bandara Juanda");

        // 4. Waru - Sidoarjo - Porong - Kejapanan - Gempol
        addRate("GT_WARU_SBY", "GT_SIDOARJO", 6500, "Tol Surabaya - Gempol (Waru - Sidoarjo)");
        addRate("GT_WARU_RAMP", "GT_SIDOARJO", 6500, "Tol Surabaya - Gempol (Waru - Sidoarjo)");
        addRate("GT_WARU_SBY", "GT_TANGGULANGIN", 8000, "Tol Surabaya - Gempol");
        addRate("GT_WARU_SBY", "GT_PORONG", 10000, "Tol Surabaya - Gempol");
        addRate("GT_WARU_SBY", "GT_KEJAPANAN", 16000, "Tol Surabaya - Gempol & Porong - Gempol");
        addRate("GT_WARU_SBY", "GT_GEMPOL", 19000, "Tol Surabaya - Gempol & Porong - Gempol");
        addRate("GT_SIDOARJO", "GT_PORONG", 6500, "Tol Porong - Gempol");
        addRate("GT_SIDOARJO", "GT_KEJAPANAN", 11500, "Tol Porong - Gempol");
        addRate("GT_SIDOARJO", "GT_GEMPOL", 14500, "Tol Porong - Gempol");
        addRate("GT_PORONG", "GT_KEJAPANAN", 6000, "Tol Porong - Gempol");
        addRate("GT_PORONG", "GT_GEMPOL", 9000, "Tol Porong - Gempol");
        addRate("GT_KEJAPANAN", "GT_GEMPOL", 3500, "Tol Porong - Gempol");

        // 5. KLBM (Kepmen PU 330/KPTS/M/2025)
        addRate("GT_KRIAN", "GT_LEBANI_SUKO", 14500, "Tol KLBM");
        addRate("GT_KRIAN", "GT_BELAHANREJO", 14500, "Tol KLBM");
        addRate("GT_KRIAN", "GT_CERME", 34500, "Tol KLBM");
        addRate("GT_KRIAN", "GT_BUNDER", 47500, "Tol KLBM");
        addRate("GT_BELAHANREJO", "GT_CERME", 20000, "Tol KLBM");
        addRate("GT_BELAHANREJO", "GT_BUNDER", 33000, "Tol KLBM");
        addRate("GT_LEBANI_SUKO", "GT_CERME", 20000, "Tol KLBM");
        addRate("GT_LEBANI_SUKO", "GT_BUNDER", 29000, "Tol KLBM");
        addRate("GT_CERME", "GT_BUNDER", 15000, "Tol KLBM");

        // 6. SuMo (Kepmen PUPR 1306/KPTS/M/2024)
        addRate("GT_WARUGUNUNG", "GT_LEBANI_SUKO", 15000, "Tol Surabaya - Mojokerto (SuMo)");
        addRate("GT_WARUGUNUNG", "GT_KRIAN", 22500, "Tol Surabaya - Mojokerto (SuMo)");
        addRate("GT_WARUGUNUNG", "GT_PENOMPO", 43500, "Tol Surabaya - Mojokerto (SuMo)");
        addRate("GT_LEBANI_SUKO", "GT_KRIAN", 7500, "Tol Surabaya - Mojokerto (SuMo)");
        addRate("GT_LEBANI_SUKO", "GT_PENOMPO", 28500, "Tol Surabaya - Mojokerto (SuMo)");
        addRate("GT_KRIAN", "GT_PENOMPO", 20500, "Tol Surabaya - Mojokerto (SuMo)");

        // 7. Jomo (Kepmen PUPR 252/KPTS/M/2024)
        addRate("GT_PENOMPO", "GT_MOJOKERTO_BARAT", 7000, "Tol Kertosono - Mojokerto (Jomo)");
        addRate("GT_PENOMPO", "GT_JOMBANG", 34000, "Tol Kertosono - Mojokerto (Jomo)");
        addRate("GT_PENOMPO", "GT_BANDAR", 54000, "Tol Kertosono - Mojokerto (Jomo)");
        addRate("GT_MOJOKERTO_BARAT", "GT_JOMBANG", 27000, "Tol Kertosono - Mojokerto (Jomo)");
        addRate("GT_MOJOKERTO_BARAT", "GT_BANDAR", 47000, "Tol Kertosono - Mojokerto (Jomo)");
        addRate("GT_JOMBANG", "GT_BANDAR", 20000, "Tol Kertosono - Mojokerto (Jomo)");

        // 8. Ngawi - Kertosono
        addRate("GT_BANDAR", "GT_NGANJUK", 27000, "Tol Ngawi - Kertosono");
        addRate("GT_BANDAR", "GT_CARUBAN", 66500, "Tol Ngawi - Kertosono");
        addRate("GT_BANDAR", "GT_MADIUN", 76000, "Tol Ngawi - Kertosono");
        addRate("GT_KERTOSONO", "GT_NGANJUK", 27000, "Tol Ngawi - Kertosono");
        addRate("GT_KERTOSONO", "GT_CARUBAN", 66500, "Tol Ngawi - Kertosono");
        addRate("GT_KERTOSONO", "GT_MADIUN", 76000, "Tol Ngawi - Kertosono");
        addRate("GT_NGANJUK", "GT_CARUBAN", 39000, "Tol Ngawi - Kertosono");
        addRate("GT_NGANJUK", "GT_MADIUN", 48500, "Tol Ngawi - Kertosono");
        addRate("GT_CARUBAN", "GT_MADIUN", 10000, "Tol Ngawi - Kertosono");

        // 9. Gempas
        addRate("GT_GEMPOL", "GT_BANGIL", 9500, "Tol Gempol - Pasuruan");
        addRate("GT_GEMPOL", "GT_REMBANG", 19000, "Tol Gempol - Pasuruan");
        addRate("GT_GEMPOL", "GT_PASURUAN", 28000, "Tol Gempol - Pasuruan");
        addRate("GT_GEMPOL", "GT_GRATI", 48500, "Tol Gempol - Pasuruan");
        addRate("GT_BANGIL", "GT_REMBANG", 9500, "Tol Gempol - Pasuruan");
        addRate("GT_BANGIL", "GT_PASURUAN", 18500, "Tol Gempol - Pasuruan");
        addRate("GT_BANGIL", "GT_GRATI", 37500, "Tol Gempol - Pasuruan");
        addRate("GT_REMBANG", "GT_PASURUAN", 9000, "Tol Gempol - Pasuruan");
        addRate("GT_REMBANG", "GT_GRATI", 27500, "Tol Gempol - Pasuruan");
        addRate("GT_PASURUAN", "GT_GRATI", 16000, "Tol Gempol - Pasuruan");

        // 10. Paspro
        addRate("GT_GRATI", "GT_TONGAS", 17000, "Tol Pasuruan - Probolinggo (Paspro)");
        addRate("GT_GRATI", "GT_PROBOLINGGO_BARAT", 26000, "Tol Pasuruan - Probolinggo (Paspro)");
        addRate("GT_GRATI", "GT_PROBOLINGGO_TIMUR", 40000, "Tol Pasuruan - Probolinggo (Paspro)");
        addRate("GT_GRATI", "GT_GENDING", 52000, "Tol Pasuruan - Probolinggo (Paspro)");
        addRate("GT_TONGAS", "GT_PROBOLINGGO_BARAT", 9000, "Tol Pasuruan - Probolinggo (Paspro)");
        addRate("GT_TONGAS", "GT_PROBOLINGGO_TIMUR", 23000, "Tol Pasuruan - Probolinggo (Paspro)");
        addRate("GT_TONGAS", "GT_GENDING", 35000, "Tol Pasuruan - Probolinggo (Paspro)");
        addRate("GT_PROBOLINGGO_BARAT", "GT_PROBOLINGGO_TIMUR", 14000, "Tol Pasuruan - Probolinggo (Paspro)");
        addRate("GT_PROBOLINGGO_BARAT", "GT_GENDING", 26500, "Tol Pasuruan - Probolinggo (Paspro)");
        addRate("GT_PROBOLINGGO_TIMUR", "GT_GENDING", 12000, "Tol Pasuruan - Probolinggo (Paspro)");

        // 11. Pandaan - Malang (Kepmen PU 602/KPTS/M/2025)
        addRate("GT_GEMPOL", "GT_PANDAAN", 14500, "Tol Gempol - Pandaan");
        addRate("GT_KEJAPANAN", "GT_PANDAAN", 16500, "Tol Gempol - Pandaan");
        addRate("GT_PANDAAN", "GT_PURWODADI", 15000, "Tol Pandaan - Malang");
        addRate("GT_PANDAAN", "GT_LAWANG", 23000, "Tol Pandaan - Malang");
        addRate("GT_PANDAAN", "GT_SINGOSARI", 30000, "Tol Pandaan - Malang");
        addRate("GT_PANDAAN", "GT_PAKIS", 34500, "Tol Pandaan - Malang");
        addRate("GT_PANDAAN", "GT_MALANG_KOTA", 38000, "Tol Pandaan - Malang");
        addRate("GT_PURWODADI", "GT_LAWANG", 8000, "Tol Pandaan - Malang");
        addRate("GT_PURWODADI", "GT_SINGOSARI", 15000, "Tol Pandaan - Malang");
        addRate("GT_PURWODADI", "GT_PAKIS", 19500, "Tol Pandaan - Malang");
        addRate("GT_PURWODADI", "GT_MALANG_KOTA", 23000, "Tol Pandaan - Malang");
        addRate("GT_LAWANG", "GT_SINGOSARI", 7000, "Tol Pandaan - Malang");
        addRate("GT_LAWANG", "GT_PAKIS", 11500, "Tol Pandaan - Malang");
        addRate("GT_LAWANG", "GT_MALANG_KOTA", 15000, "Tol Pandaan - Malang");
        addRate("GT_SINGOSARI", "GT_PAKIS", 4500, "Tol Pandaan - Malang");
        addRate("GT_SINGOSARI", "GT_MALANG_KOTA", 8000, "Tol Pandaan - Malang");
        addRate("GT_PAKIS", "GT_MALANG_KOTA", 3500, "Tol Pandaan - Malang");
    }

    private static void addGate(String id, String name, String wilayah, String ruas, int km) {
        ALL_GATES.add(new Gate(id, name, wilayah, ruas, km));
    }

    private static void addRate(String a, String b, long fee, String ruas) {
        DIRECT_RATES.put(a + "_" + b, fee);
        DIRECT_RATES.put(b + "_" + a, fee);
        DIRECT_RUAS.put(a + "_" + b, ruas);
        DIRECT_RUAS.put(b + "_" + a, ruas);
    }

    public static List<Gate> getAllGates() {
        return ALL_GATES;
    }

    public static Gate getGateById(String id) {
        for (Gate g : ALL_GATES) {
            if (g.id.equals(id)) return g;
        }
        return null;
    }

    private static boolean hasDirect(String a, String b) {
        return DIRECT_RATES.containsKey(a + "_" + b);
    }

    private static long getDirectFee(String a, String b) {
        Long fee = DIRECT_RATES.get(a + "_" + b);
        return fee != null ? fee : 0;
    }

    private static String getDirectRuas(String a, String b) {
        String ruas = DIRECT_RUAS.get(a + "_" + b);
        return ruas != null ? ruas : "Jalan Tol";
    }

    public static TollResult calculateRoute(String asalId, String tujuanId, int golonganIdx) {
        if (asalId == null || tujuanId == null) {
            return new TollResult(false, 0, null, 0, "Pilih gerbang asal dan tujuan");
        }
        if (asalId.equals(tujuanId)) {
            return new TollResult(false, 0, null, 0, "Gerbang asal dan tujuan tidak boleh sama");
        }

        Gate gateA = getGateById(asalId);
        Gate gateB = getGateById(tujuanId);
        if (gateA == null || gateB == null) {
            return new TollResult(false, 0, null, 0, "Gerbang tidak valid");
        }

        double multiplier = 1.0;
        if (golonganIdx == 1 || golonganIdx == 2) multiplier = 1.5; // Gol II & III
        else if (golonganIdx == 3 || golonganIdx == 4) multiplier = 2.0; // Gol IV & V

        // 1. Ruas Langsung
        String directKey = asalId + "_" + tujuanId;
        if (DIRECT_RATES.containsKey(directKey)) {
            long baseFee = DIRECT_RATES.get(directKey);
            long feeGol;
            if (directKey.contains("GT_WARU_SBY") && directKey.contains("GT_JUANDA")) {
                if (multiplier == 1.5) feeGol = 14000;
                else if (multiplier == 2.0) feeGol = 19000;
                else feeGol = 9500;
            } else {
                feeGol = Math.round((baseFee * multiplier) / 500) * 500;
            }
            List<Segment> segs = new ArrayList<>();
            segs.add(new Segment(DIRECT_RUAS.get(directKey), gateA.name, gateB.name, feeGol));
            int dist = Math.abs(gateA.km - gateB.km);
            return new TollResult(true, feeGol, segs, dist, null);
        }

        // Koridor Kategori
        List<String> G_GRESIK_SBY = Arrays.asList("GT_MANYAR", "GT_KEBOMAS", "GT_ROMOKALISARI", "GT_TANDES", "GT_DUPAK");
        List<String> G_SBY_INNER = Arrays.asList("GT_DUPAK", "GT_BANYU_URIP", "GT_GUNUNGSARI", "GT_PAGESANGAN", "GT_WARU_SBY");
        List<String> G_JUANDA = Arrays.asList("GT_BERBEK", "GT_TAMBAKSUMUR", "GT_JUANDA");
        List<String> G_SBY_GEMPOL_SOUTH = Arrays.asList("GT_WARU_RAMP", "GT_SIDOARJO", "GT_TANGGULANGIN", "GT_PORONG", "GT_KEJAPANAN", "GT_GEMPOL");
        List<String> G_KLBM = Arrays.asList("GT_BUNDER", "GT_CERME", "GT_BELAHANREJO");
        List<String> G_MAPAN = Arrays.asList("GT_GEMPOL", "GT_KEJAPANAN", "GT_PANDAAN", "GT_PURWODADI", "GT_LAWANG", "GT_SINGOSARI", "GT_PAKIS", "GT_MALANG_KOTA");
        List<String> G_GEMPAS = Arrays.asList("GT_GEMPOL", "GT_BANGIL", "GT_REMBANG", "GT_PASURUAN", "GT_GRATI");
        List<String> G_PASPRO = Arrays.asList("GT_GRATI", "GT_TONGAS", "GT_PROBOLINGGO_BARAT", "GT_PROBOLINGGO_TIMUR", "GT_GENDING");

        boolean isGresikA = G_GRESIK_SBY.contains(asalId) && !asalId.equals("GT_DUPAK");
        boolean isGresikB = G_GRESIK_SBY.contains(tujuanId) && !tujuanId.equals("GT_DUPAK");
        boolean isSbyInnerA = G_SBY_INNER.contains(asalId);
        boolean isSbyInnerB = G_SBY_INNER.contains(tujuanId);
        boolean isJuandaA = G_JUANDA.contains(asalId);
        boolean isJuandaB = G_JUANDA.contains(tujuanId);
        boolean isSouthA = G_SBY_GEMPOL_SOUTH.contains(asalId) && !asalId.equals("GT_WARU_SBY");
        boolean isSouthB = G_SBY_GEMPOL_SOUTH.contains(tujuanId) && !tujuanId.equals("GT_WARU_SBY");
        boolean isMapanA = G_MAPAN.contains(asalId) && !asalId.equals("GT_GEMPOL") && !asalId.equals("GT_KEJAPANAN");
        boolean isMapanB = G_MAPAN.contains(tujuanId) && !tujuanId.equals("GT_GEMPOL") && !tujuanId.equals("GT_KEJAPANAN");
        boolean isGempasA = G_GEMPAS.contains(asalId) && !asalId.equals("GT_GEMPOL");
        boolean isGempasB = G_GEMPAS.contains(tujuanId) && !tujuanId.equals("GT_GEMPOL");
        boolean isPasproA = G_PASPRO.contains(asalId) && !asalId.equals("GT_GRATI");
        boolean isPasproB = G_PASPRO.contains(tujuanId) && !tujuanId.equals("GT_GRATI");
        boolean isWestA = gateA.wilayah.contains("Madiun") || gateA.wilayah.contains("Nganjuk") || gateA.wilayah.contains("Jombang");
        boolean isWestB = gateB.wilayah.contains("Madiun") || gateB.wilayah.contains("Nganjuk") || gateB.wilayah.contains("Jombang");
        boolean isKlbmA = G_KLBM.contains(asalId);
        boolean isKlbmB = G_KLBM.contains(tujuanId);

        List<RawSegment> raw = new ArrayList<>();

        // A. Gresik ke koridor lain
        if (isGresikA || isGresikB) {
            boolean isReversed = !isGresikA;
            String gresikId = isGresikA ? asalId : tujuanId;
            String destId = isGresikA ? tujuanId : asalId;

            if (hasDirect(gresikId, "GT_DUPAK")) {
                raw.add(isReversed ? new RawSegment("GT_DUPAK", gresikId, getDirectFee(gresikId, "GT_DUPAK"), getDirectRuas(gresikId, "GT_DUPAK"))
                                   : new RawSegment(gresikId, "GT_DUPAK", getDirectFee(gresikId, "GT_DUPAK"), getDirectRuas(gresikId, "GT_DUPAK")));
            }

            if (G_SBY_INNER.contains(destId)) {
                if (hasDirect("GT_DUPAK", destId)) {
                    raw.add(isReversed ? new RawSegment(destId, "GT_DUPAK", getDirectFee("GT_DUPAK", destId), getDirectRuas("GT_DUPAK", destId))
                                       : new RawSegment("GT_DUPAK", destId, getDirectFee("GT_DUPAK", destId), getDirectRuas("GT_DUPAK", destId)));
                }
            } else if (G_JUANDA.contains(destId)) {
                raw.add(isReversed ? new RawSegment("GT_WARU_SBY", "GT_DUPAK", getDirectFee("GT_DUPAK", "GT_WARU_SBY"), getDirectRuas("GT_DUPAK", "GT_WARU_SBY"))
                                   : new RawSegment("GT_DUPAK", "GT_WARU_SBY", getDirectFee("GT_DUPAK", "GT_WARU_SBY"), getDirectRuas("GT_DUPAK", "GT_WARU_SBY")));
                raw.add(isReversed ? new RawSegment(destId, "GT_WARU_SBY", getDirectFee("GT_WARU_SBY", destId), getDirectRuas("GT_WARU_SBY", destId))
                                   : new RawSegment("GT_WARU_SBY", destId, getDirectFee("GT_WARU_SBY", destId), getDirectRuas("GT_WARU_SBY", destId)));
            } else if (G_SBY_GEMPOL_SOUTH.contains(destId)) {
                raw.add(isReversed ? new RawSegment("GT_WARU_SBY", "GT_DUPAK", getDirectFee("GT_DUPAK", "GT_WARU_SBY"), getDirectRuas("GT_DUPAK", "GT_WARU_SBY"))
                                   : new RawSegment("GT_DUPAK", "GT_WARU_SBY", getDirectFee("GT_DUPAK", "GT_WARU_SBY"), getDirectRuas("GT_DUPAK", "GT_WARU_SBY")));
                raw.add(isReversed ? new RawSegment(destId, "GT_WARU_SBY", getDirectFee("GT_WARU_SBY", destId), getDirectRuas("GT_WARU_SBY", destId))
                                   : new RawSegment("GT_WARU_SBY", destId, getDirectFee("GT_WARU_SBY", destId), getDirectRuas("GT_WARU_SBY", destId)));
            } else if (G_MAPAN.contains(destId)) {
                raw.add(isReversed ? new RawSegment("GT_WARU_SBY", "GT_DUPAK", getDirectFee("GT_DUPAK", "GT_WARU_SBY"), getDirectRuas("GT_DUPAK", "GT_WARU_SBY"))
                                   : new RawSegment("GT_DUPAK", "GT_WARU_SBY", getDirectFee("GT_DUPAK", "GT_WARU_SBY"), getDirectRuas("GT_DUPAK", "GT_WARU_SBY")));
                raw.add(isReversed ? new RawSegment("GT_GEMPOL", "GT_WARU_SBY", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL"))
                                   : new RawSegment("GT_WARU_SBY", "GT_GEMPOL", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL")));
                raw.add(isReversed ? new RawSegment("GT_PANDAAN", "GT_GEMPOL", getDirectFee("GT_GEMPOL", "GT_PANDAAN"), getDirectRuas("GT_GEMPOL", "GT_PANDAAN"))
                                   : new RawSegment("GT_GEMPOL", "GT_PANDAAN", getDirectFee("GT_GEMPOL", "GT_PANDAAN"), getDirectRuas("GT_GEMPOL", "GT_PANDAAN")));
                if (!destId.equals("GT_PANDAAN")) {
                    raw.add(isReversed ? new RawSegment(destId, "GT_PANDAAN", getDirectFee("GT_PANDAAN", destId), getDirectRuas("GT_PANDAAN", destId))
                                       : new RawSegment("GT_PANDAAN", destId, getDirectFee("GT_PANDAAN", destId), getDirectRuas("GT_PANDAAN", destId)));
                }
            } else if (G_GEMPAS.contains(destId)) {
                raw.add(isReversed ? new RawSegment("GT_WARU_SBY", "GT_DUPAK", getDirectFee("GT_DUPAK", "GT_WARU_SBY"), getDirectRuas("GT_DUPAK", "GT_WARU_SBY"))
                                   : new RawSegment("GT_DUPAK", "GT_WARU_SBY", getDirectFee("GT_DUPAK", "GT_WARU_SBY"), getDirectRuas("GT_DUPAK", "GT_WARU_SBY")));
                raw.add(isReversed ? new RawSegment("GT_GEMPOL", "GT_WARU_SBY", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL"))
                                   : new RawSegment("GT_WARU_SBY", "GT_GEMPOL", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL")));
                raw.add(isReversed ? new RawSegment(destId, "GT_GEMPOL", getDirectFee("GT_GEMPOL", destId), getDirectRuas("GT_GEMPOL", destId))
                                   : new RawSegment("GT_GEMPOL", destId, getDirectFee("GT_GEMPOL", destId), getDirectRuas("GT_GEMPOL", destId)));
            } else if (G_PASPRO.contains(destId)) {
                raw.add(isReversed ? new RawSegment("GT_WARU_SBY", "GT_DUPAK", getDirectFee("GT_DUPAK", "GT_WARU_SBY"), getDirectRuas("GT_DUPAK", "GT_WARU_SBY"))
                                   : new RawSegment("GT_DUPAK", "GT_WARU_SBY", getDirectFee("GT_DUPAK", "GT_WARU_SBY"), getDirectRuas("GT_DUPAK", "GT_WARU_SBY")));
                raw.add(isReversed ? new RawSegment("GT_GEMPOL", "GT_WARU_SBY", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL"))
                                   : new RawSegment("GT_WARU_SBY", "GT_GEMPOL", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL")));
                raw.add(isReversed ? new RawSegment("GT_GRATI", "GT_GEMPOL", getDirectFee("GT_GEMPOL", "GT_GRATI"), getDirectRuas("GT_GEMPOL", "GT_GRATI"))
                                   : new RawSegment("GT_GEMPOL", "GT_GRATI", getDirectFee("GT_GEMPOL", "GT_GRATI"), getDirectRuas("GT_GEMPOL", "GT_GRATI")));
                raw.add(isReversed ? new RawSegment(destId, "GT_GRATI", getDirectFee("GT_GRATI", destId), getDirectRuas("GT_GRATI", destId))
                                   : new RawSegment("GT_GRATI", destId, getDirectFee("GT_GRATI", destId), getDirectRuas("GT_GRATI", destId)));
            }
            if (isReversed) Collections.reverse(raw);
        }

        // B. KLBM
        else if (isKlbmA || isKlbmB) {
            boolean isReversed = !isKlbmA;
            String klbmId = isKlbmA ? asalId : tujuanId;
            String otherId = isKlbmA ? tujuanId : asalId;

            if (hasDirect(klbmId, "GT_KRIAN")) {
                raw.add(isReversed ? new RawSegment("GT_KRIAN", klbmId, getDirectFee(klbmId, "GT_KRIAN"), getDirectRuas(klbmId, "GT_KRIAN"))
                                   : new RawSegment(klbmId, "GT_KRIAN", getDirectFee(klbmId, "GT_KRIAN"), getDirectRuas(klbmId, "GT_KRIAN")));
            }

            if (otherId.equals("GT_WARUGUNUNG") || otherId.equals("GT_PENOMPO")) {
                raw.add(isReversed ? new RawSegment(otherId, "GT_KRIAN", getDirectFee("GT_KRIAN", otherId), getDirectRuas("GT_KRIAN", otherId))
                                   : new RawSegment("GT_KRIAN", otherId, getDirectFee("GT_KRIAN", otherId), getDirectRuas("GT_KRIAN", otherId)));
            } else if (isWestA || isWestB) {
                raw.add(isReversed ? new RawSegment("GT_PENOMPO", "GT_KRIAN", getDirectFee("GT_KRIAN", "GT_PENOMPO"), getDirectRuas("GT_KRIAN", "GT_PENOMPO"))
                                   : new RawSegment("GT_KRIAN", "GT_PENOMPO", getDirectFee("GT_KRIAN", "GT_PENOMPO"), getDirectRuas("GT_KRIAN", "GT_PENOMPO")));
                raw.add(isReversed ? new RawSegment("GT_BANDAR", "GT_PENOMPO", 54000, "Tol Kertosono - Mojokerto (Jomo)")
                                   : new RawSegment("GT_PENOMPO", "GT_BANDAR", 54000, "Tol Kertosono - Mojokerto (Jomo)"));
                if (!otherId.equals("GT_BANDAR")) {
                    long fW = hasDirect("GT_BANDAR", otherId) ? getDirectFee("GT_BANDAR", otherId) : 76000;
                    raw.add(isReversed ? new RawSegment(otherId, "GT_BANDAR", fW, "Tol Ngawi - Kertosono")
                                       : new RawSegment("GT_BANDAR", otherId, fW, "Tol Ngawi - Kertosono"));
                }
            } else if (G_MAPAN.contains(otherId)) {
                raw.add(isReversed ? new RawSegment("GT_GEMPOL", "GT_KRIAN", 16000, "Tol Krian - Porong - Gempol")
                                   : new RawSegment("GT_KRIAN", "GT_GEMPOL", 16000, "Tol Krian - Porong - Gempol"));
                raw.add(isReversed ? new RawSegment("GT_PANDAAN", "GT_GEMPOL", getDirectFee("GT_GEMPOL", "GT_PANDAAN"), getDirectRuas("GT_GEMPOL", "GT_PANDAAN"))
                                   : new RawSegment("GT_GEMPOL", "GT_PANDAAN", getDirectFee("GT_GEMPOL", "GT_PANDAAN"), getDirectRuas("GT_GEMPOL", "GT_PANDAAN")));
                if (!otherId.equals("GT_PANDAAN")) {
                    raw.add(isReversed ? new RawSegment(otherId, "GT_PANDAAN", getDirectFee("GT_PANDAAN", otherId), getDirectRuas("GT_PANDAAN", otherId))
                                       : new RawSegment("GT_PANDAAN", otherId, getDirectFee("GT_PANDAAN", otherId), getDirectRuas("GT_PANDAAN", otherId)));
                }
            }
            if (isReversed) Collections.reverse(raw);
        }

        // C. Surabaya Urban / Juanda ke Sidoarjo Selatan / Malang / Pasuruan / Probolinggo
        else if (((isSbyInnerA || isJuandaA) && (isJuandaB || isSouthB || isMapanB || isGempasB || isPasproB)) ||
                 ((isSbyInnerB || isJuandaB) && (isJuandaA || isSouthA || isMapanA || isGempasA || isPasproA))) {
            boolean isReversed = !(isSbyInnerA || isJuandaA);
            String startId = !isReversed ? asalId : tujuanId;
            String destId = !isReversed ? tujuanId : asalId;

            if (!startId.equals("GT_WARU_SBY") && hasDirect(startId, "GT_WARU_SBY")) {
                raw.add(isReversed ? new RawSegment("GT_WARU_SBY", startId, getDirectFee(startId, "GT_WARU_SBY"), getDirectRuas(startId, "GT_WARU_SBY"))
                                   : new RawSegment(startId, "GT_WARU_SBY", getDirectFee(startId, "GT_WARU_SBY"), getDirectRuas(startId, "GT_WARU_SBY")));
            }

            if (G_JUANDA.contains(destId) && !destId.equals("GT_WARU_SBY")) {
                raw.add(isReversed ? new RawSegment(destId, "GT_WARU_SBY", getDirectFee("GT_WARU_SBY", destId), getDirectRuas("GT_WARU_SBY", destId))
                                   : new RawSegment("GT_WARU_SBY", destId, getDirectFee("GT_WARU_SBY", destId), getDirectRuas("GT_WARU_SBY", destId)));
            } else if (G_SBY_GEMPOL_SOUTH.contains(destId)) {
                raw.add(isReversed ? new RawSegment(destId, "GT_WARU_SBY", getDirectFee("GT_WARU_SBY", destId), getDirectRuas("GT_WARU_SBY", destId))
                                   : new RawSegment("GT_WARU_SBY", destId, getDirectFee("GT_WARU_SBY", destId), getDirectRuas("GT_WARU_SBY", destId)));
            } else if (G_MAPAN.contains(destId)) {
                raw.add(isReversed ? new RawSegment("GT_GEMPOL", "GT_WARU_SBY", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL"))
                                   : new RawSegment("GT_WARU_SBY", "GT_GEMPOL", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL")));
                raw.add(isReversed ? new RawSegment("GT_PANDAAN", "GT_GEMPOL", getDirectFee("GT_GEMPOL", "GT_PANDAAN"), getDirectRuas("GT_GEMPOL", "GT_PANDAAN"))
                                   : new RawSegment("GT_GEMPOL", "GT_PANDAAN", getDirectFee("GT_GEMPOL", "GT_PANDAAN"), getDirectRuas("GT_GEMPOL", "GT_PANDAAN")));
                if (!destId.equals("GT_PANDAAN")) {
                    raw.add(isReversed ? new RawSegment(destId, "GT_PANDAAN", getDirectFee("GT_PANDAAN", destId), getDirectRuas("GT_PANDAAN", destId))
                                       : new RawSegment("GT_PANDAAN", destId, getDirectFee("GT_PANDAAN", destId), getDirectRuas("GT_PANDAAN", destId)));
                }
            } else if (G_GEMPAS.contains(destId)) {
                raw.add(isReversed ? new RawSegment("GT_GEMPOL", "GT_WARU_SBY", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL"))
                                   : new RawSegment("GT_WARU_SBY", "GT_GEMPOL", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL")));
                raw.add(isReversed ? new RawSegment(destId, "GT_GEMPOL", getDirectFee("GT_GEMPOL", destId), getDirectRuas("GT_GEMPOL", destId))
                                   : new RawSegment("GT_GEMPOL", destId, getDirectFee("GT_GEMPOL", destId), getDirectRuas("GT_GEMPOL", destId)));
            } else if (G_PASPRO.contains(destId)) {
                raw.add(isReversed ? new RawSegment("GT_GEMPOL", "GT_WARU_SBY", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL"))
                                   : new RawSegment("GT_WARU_SBY", "GT_GEMPOL", getDirectFee("GT_WARU_SBY", "GT_GEMPOL"), getDirectRuas("GT_WARU_SBY", "GT_GEMPOL")));
                raw.add(isReversed ? new RawSegment("GT_GRATI", "GT_GEMPOL", getDirectFee("GT_GEMPOL", "GT_GRATI"), getDirectRuas("GT_GEMPOL", "GT_GRATI"))
                                   : new RawSegment("GT_GEMPOL", "GT_GRATI", getDirectFee("GT_GEMPOL", "GT_GRATI"), getDirectRuas("GT_GEMPOL", "GT_GRATI")));
                raw.add(isReversed ? new RawSegment(destId, "GT_GRATI", getDirectFee("GT_GRATI", destId), getDirectRuas("GT_GRATI", destId))
                                   : new RawSegment("GT_GRATI", destId, getDirectFee("GT_GRATI", destId), getDirectRuas("GT_GRATI", destId)));
            }
            if (isReversed) Collections.reverse(raw);
        }

        // D. Lintas Barat (Madiun, Nganjuk, Jombang) ke Surabaya / Timur / Malang
        else if (isWestA != isWestB) {
            boolean isReversed = !isWestA;
            Gate west = isWestA ? gateA : gateB;
            Gate other = isWestA ? gateB : gateA;

            if (!west.id.equals("GT_BANDAR")) {
                long fW = hasDirect(west.id, "GT_BANDAR") ? getDirectFee(west.id, "GT_BANDAR") : 76000;
                raw.add(isReversed ? new RawSegment("GT_BANDAR", west.id, fW, "Tol Ngawi - Kertosono")
                                   : new RawSegment(west.id, "GT_BANDAR", fW, "Tol Ngawi - Kertosono"));
            }

            raw.add(isReversed ? new RawSegment("GT_PENOMPO", "GT_BANDAR", 54000, "Tol Kertosono - Mojokerto (Jomo)")
                               : new RawSegment("GT_BANDAR", "GT_PENOMPO", 54000, "Tol Kertosono - Mojokerto (Jomo)"));

            if (other.wilayah.contains("Surabaya")) {
                raw.add(isReversed ? new RawSegment(other.id, "GT_PENOMPO", 43500, "Tol Surabaya - Mojokerto (SuMo)")
                                   : new RawSegment("GT_PENOMPO", other.id, 43500, "Tol Surabaya - Mojokerto (SuMo)"));
            } else if (other.wilayah.contains("Malang")) {
                raw.add(isReversed ? new RawSegment("GT_KRIAN", "GT_PENOMPO", 20500, "Tol Surabaya - Mojokerto (SuMo)")
                                   : new RawSegment("GT_PENOMPO", "GT_KRIAN", 20500, "Tol Surabaya - Mojokerto (SuMo)"));
                raw.add(isReversed ? new RawSegment("GT_GEMPOL", "GT_KRIAN", 16000, "Tol Krian - Porong - Gempol")
                                   : new RawSegment("GT_KRIAN", "GT_GEMPOL", 16000, "Tol Krian - Porong - Gempol"));
                raw.add(isReversed ? new RawSegment("GT_PANDAAN", "GT_GEMPOL", getDirectFee("GT_GEMPOL", "GT_PANDAAN"), getDirectRuas("GT_GEMPOL", "GT_PANDAAN"))
                                   : new RawSegment("GT_GEMPOL", "GT_PANDAAN", getDirectFee("GT_GEMPOL", "GT_PANDAAN"), getDirectRuas("GT_GEMPOL", "GT_PANDAAN")));
                raw.add(isReversed ? new RawSegment(other.id, "GT_PANDAAN", getDirectFee("GT_PANDAAN", other.id), getDirectRuas("GT_PANDAAN", other.id))
                                   : new RawSegment("GT_PANDAAN", other.id, getDirectFee("GT_PANDAAN", other.id), getDirectRuas("GT_PANDAAN", other.id)));
            } else if (other.wilayah.contains("Pasuruan") || other.wilayah.contains("Probolinggo")) {
                raw.add(isReversed ? new RawSegment("GT_KRIAN", "GT_PENOMPO", 20500, "Tol Surabaya - Mojokerto (SuMo)")
                                   : new RawSegment("GT_PENOMPO", "GT_KRIAN", 20500, "Tol Surabaya - Mojokerto (SuMo)"));
                raw.add(isReversed ? new RawSegment("GT_GEMPOL", "GT_KRIAN", 16000, "Tol Krian - Porong - Gempol")
                                   : new RawSegment("GT_KRIAN", "GT_GEMPOL", 16000, "Tol Krian - Porong - Gempol"));
                if (other.wilayah.contains("Pasuruan")) {
                    raw.add(isReversed ? new RawSegment(other.id, "GT_GEMPOL", 28000, "Tol Gempol - Pasuruan")
                                       : new RawSegment("GT_GEMPOL", other.id, 28000, "Tol Gempol - Pasuruan"));
                } else {
                    raw.add(isReversed ? new RawSegment("GT_GRATI", "GT_GEMPOL", getDirectFee("GT_GEMPOL", "GT_GRATI"), getDirectRuas("GT_GEMPOL", "GT_GRATI"))
                                       : new RawSegment("GT_GEMPOL", "GT_GRATI", getDirectFee("GT_GEMPOL", "GT_GRATI"), getDirectRuas("GT_GEMPOL", "GT_GRATI")));
                    raw.add(isReversed ? new RawSegment(other.id, "GT_GRATI", getDirectFee("GT_GRATI", other.id), getDirectRuas("GT_GRATI", other.id))
                                       : new RawSegment("GT_GRATI", other.id, getDirectFee("GT_GRATI", other.id), getDirectRuas("GT_GRATI", other.id)));
                }
            }
            if (isReversed) Collections.reverse(raw);
        }

        // E. Sidoarjo Selatan ke Malang / Pasuruan / Probolinggo
        else if (((isSouthA || asalId.equals("GT_GEMPOL")) && (isMapanB || isGempasB || isPasproB)) ||
                 ((isSouthB || tujuanId.equals("GT_GEMPOL")) && (isMapanA || isGempasA || isPasproA))) {
            boolean isReversed = !(isSouthA || asalId.equals("GT_GEMPOL"));
            String southId = !isReversed ? asalId : tujuanId;
            String destId = !isReversed ? tujuanId : asalId;

            if (!southId.equals("GT_GEMPOL")) {
                long fS = hasDirect(southId, "GT_GEMPOL") ? getDirectFee(southId, "GT_GEMPOL") : 14500;
                raw.add(isReversed ? new RawSegment("GT_GEMPOL", southId, fS, "Tol Surabaya - Gempol & Porong - Gempol")
                                   : new RawSegment(southId, "GT_GEMPOL", fS, "Tol Surabaya - Gempol & Porong - Gempol"));
            }

            if (G_MAPAN.contains(destId)) {
                raw.add(isReversed ? new RawSegment("GT_PANDAAN", "GT_GEMPOL", getDirectFee("GT_GEMPOL", "GT_PANDAAN"), getDirectRuas("GT_GEMPOL", "GT_PANDAAN"))
                                   : new RawSegment("GT_GEMPOL", "GT_PANDAAN", getDirectFee("GT_GEMPOL", "GT_PANDAAN"), getDirectRuas("GT_GEMPOL", "GT_PANDAAN")));
                if (!destId.equals("GT_PANDAAN")) {
                    raw.add(isReversed ? new RawSegment(destId, "GT_PANDAAN", getDirectFee("GT_PANDAAN", destId), getDirectRuas("GT_PANDAAN", destId))
                                       : new RawSegment("GT_PANDAAN", destId, getDirectFee("GT_PANDAAN", destId), getDirectRuas("GT_PANDAAN", destId)));
                }
            } else if (G_GEMPAS.contains(destId)) {
                raw.add(isReversed ? new RawSegment(destId, "GT_GEMPOL", getDirectFee("GT_GEMPOL", destId), getDirectRuas("GT_GEMPOL", destId))
                                   : new RawSegment("GT_GEMPOL", destId, getDirectFee("GT_GEMPOL", destId), getDirectRuas("GT_GEMPOL", destId)));
            } else if (G_PASPRO.contains(destId)) {
                raw.add(isReversed ? new RawSegment("GT_GRATI", "GT_GEMPOL", getDirectFee("GT_GEMPOL", "GT_GRATI"), getDirectRuas("GT_GEMPOL", "GT_GRATI"))
                                   : new RawSegment("GT_GEMPOL", "GT_GRATI", getDirectFee("GT_GEMPOL", "GT_GRATI"), getDirectRuas("GT_GEMPOL", "GT_GRATI")));
                raw.add(isReversed ? new RawSegment(destId, "GT_GRATI", getDirectFee("GT_GRATI", destId), getDirectRuas("GT_GRATI", destId))
                                   : new RawSegment("GT_GRATI", destId, getDirectFee("GT_GRATI", destId), getDirectRuas("GT_GRATI", destId)));
            }
            if (isReversed) Collections.reverse(raw);
        }

        // Fallback
        if (raw.isEmpty()) {
            int kmDiff = Math.abs(gateA.km - gateB.km);
            long est = Math.max(5500, Math.round((kmDiff * 950) / 500) * 500);
            long feeGol = Math.round((est * multiplier) / 500) * 500;
            List<Segment> segs = new ArrayList<>();
            segs.add(new Segment("Ruas Tol " + gateA.wilayah + " - " + gateB.wilayah, gateA.name, gateB.name, feeGol));
            return new TollResult(true, feeGol, segs, kmDiff, null);
        }

        List<Segment> segList = new ArrayList<>();
        long finalTotal = 0;
        for (RawSegment r : raw) {
            long fee;
            if (r.ruasName.contains("Waru - Bandara Juanda") &&
               ((r.fromId.equals("GT_WARU_SBY") && r.toId.equals("GT_JUANDA")) || (r.fromId.equals("GT_JUANDA") && r.toId.equals("GT_WARU_SBY")))) {
                if (multiplier == 1.5) fee = 14000;
                else if (multiplier == 2.0) fee = 19000;
                else fee = 9500;
            } else {
                fee = Math.round((r.baseFee * multiplier) / 500) * 500;
            }
            Gate fG = getGateById(r.fromId);
            Gate tG = getGateById(r.toId);
            String fName = fG != null ? fG.name : r.fromId;
            String tName = tG != null ? tG.name : r.toId;
            segList.add(new Segment(r.ruasName, fName, tName, fee));
            finalTotal += fee;
        }

        int dist = Math.abs(gateA.km - gateB.km);
        return new TollResult(true, finalTotal, segList, dist, null);
    }

    public static String formatRupiah(long amount) {
        NumberFormat nf = NumberFormat.getNumberInstance(new Locale("id", "ID"));
        return "Rp. " + nf.format(amount);
    }
}
