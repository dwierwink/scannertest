package com.emoney.nfcbalance.toll;

import java.text.NumberFormat;
import java.util.ArrayList;
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
        addGate("GT_WARUGUNUNG", "Warugunung (SuMo)", "Kota Surabaya", "Surabaya - Mojokerto", 14);

        // 3. Kab. Sidoarjo
        addGate("GT_WARU_RAMP", "Waru Ramp", "Kab. Sidoarjo", "Surabaya - Gempol", 17);
        addGate("GT_BERBEK", "Berbek", "Kab. Sidoarjo", "Tol Waru - Juanda", 6);
        addGate("GT_TAMBAKSUMUR", "Tambaksumur", "Kab. Sidoarjo", "Tol Waru - Juanda", 9);
        addGate("GT_JUANDA", "Juanda (Bandara)", "Kab. Sidoarjo", "Tol Waru - Juanda", 12);
        addGate("GT_SIDOARJO", "Sidoarjo Kota", "Kab. Sidoarjo", "Surabaya - Gempol", 28);
        addGate("GT_TANGGULANGIN", "Tanggulangin", "Kab. Sidoarjo", "Porong - Gempol", 34);
        addGate("GT_PORONG", "Porong", "Kab. Sidoarjo", "Porong - Gempol", 38);
        addGate("GT_KRIAN", "Krian", "Kab. Sidoarjo", "Surabaya - Mojokerto & KLBM", 26);
        addGate("GT_BELAHANREJO", "Belahanrejo", "Kab. Sidoarjo", "Tol KLBM", 8);
        addGate("GT_LEBANI_SUKO", "Lebani Suko", "Kab. Sidoarjo", "Tol KLBM & SuMo", 12);

        // 4. Kab. & Kota Mojokerto
        addGate("GT_PENOMPO", "Penompo (Mojokerto)", "Mojokerto", "Surabaya - Mojokerto & Jomo", 42);
        addGate("GT_MOJOKERTO_BARAT", "Mojokerto Barat (Gedeg)", "Mojokerto", "Tol Jomo", 50);

        // 5. Kab. Jombang
        addGate("GT_JOMBANG", "Jombang (Tembelang)", "Kab. Jombang", "Tol Jomo", 68);
        addGate("GT_BANDAR", "Bandar (Kertosono Timur)", "Kab. Jombang", "Tol Jomo & Ngawi - Kertosono", 82);

        // 6. Kab. Nganjuk & Kertosono
        addGate("GT_KERTOSONO", "Kertosono (Simpang)", "Nganjuk & Kertosono", "Tol Ngawi - Kertosono", 84);
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
        addGate("GT_GENDING", "Gending (Probolinggo Baru)", "Probolinggo", "Pasuruan - Probolinggo", 136);

        // 10. Kab. & Kota Malang
        addGate("GT_PURWODADI", "Purwodadi", "Malang", "Pandaan - Malang", 72);
        addGate("GT_LAWANG", "Lawang", "Malang", "Pandaan - Malang", 82);
        addGate("GT_SINGOSARI", "Singosari (Batu)", "Malang", "Pandaan - Malang", 92);
        addGate("GT_PAKIS", "Pakis (Bandara Abd Saleh)", "Malang", "Pandaan - Malang", 96);
        addGate("GT_MALANG_KOTA", "Malang (Madyopuro)", "Malang", "Pandaan - Malang", 101);

        // Rates
        addRate("GT_DUPAK", "GT_MANYAR", 27500, "Tol Surabaya - Gresik");
        addRate("GT_DUPAK", "GT_KEBOMAS", 21500, "Tol Surabaya - Gresik");
        addRate("GT_DUPAK", "GT_ROMOKALISARI", 12000, "Tol Surabaya - Gresik");
        addRate("GT_DUPAK", "GT_TANDES", 4500, "Tol Surabaya - Gresik");
        addRate("GT_WARUGUNUNG", "GT_PENOMPO", 43500, "Tol Surabaya - Mojokerto (SuMo)");
        addRate("GT_WARUGUNUNG", "GT_KRIAN", 22500, "Tol Surabaya - Mojokerto (SuMo)");
        addRate("GT_KRIAN", "GT_PENOMPO", 20500, "Tol Surabaya - Mojokerto (SuMo)");
        addRate("GT_PENOMPO", "GT_BANDAR", 46000, "Tol Kertosono - Mojokerto (Jomo)");
        addRate("GT_PENOMPO", "GT_JOMBANG", 29000, "Tol Kertosono - Mojokerto (Jomo)");
        addRate("GT_BANDAR", "GT_MADIUN", 76000, "Tol Ngawi - Kertosono");
        addRate("GT_BANDAR", "GT_NGANJUK", 27000, "Tol Ngawi - Kertosono");
        addRate("GT_WARU_SBY", "GT_KEJAPANAN", 18000, "Tol Surabaya - Gempol & Porong - Gempol");
        addRate("GT_GEMPOL", "GT_GRATI", 48500, "Tol Gempol - Pasuruan");
        addRate("GT_GRATI", "GT_GENDING", 52000, "Tol Pasuruan - Probolinggo (Paspro)");
        addRate("GT_GEMPOL", "GT_PANDAAN", 14500, "Tol Gempol - Pandaan");
        addRate("GT_PANDAAN", "GT_MALANG_KOTA", 38500, "Tol Pandaan - Malang");
        addRate("GT_KRIAN", "GT_BUNDER", 47500, "Tol KLBM");
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
        if (golonganIdx == 1) multiplier = 1.5;      // Gol II
        else if (golonganIdx == 2) multiplier = 1.5; // Gol III
        else if (golonganIdx == 3) multiplier = 2.0; // Gol IV
        else if (golonganIdx == 4) multiplier = 2.0; // Gol V

        List<Segment> segList = new ArrayList<>();
        String key = asalId + "_" + tujuanId;

        if (DIRECT_RATES.containsKey(key)) {
            long feeGol = Math.round((DIRECT_RATES.get(key) * multiplier) / 500) * 500;
            segList.add(new Segment(DIRECT_RUAS.get(key), gateA.name, gateB.name, feeGol));
            int dist = Math.abs(gateA.km - gateB.km);
            return new TollResult(true, feeGol, segList, dist, null);
        }

        // Multi-ruas Trans-Jawa Jawa Timur
        long totalGol1 = 0;
        boolean isWestA = gateA.km >= 68;
        boolean isWestB = gateB.km >= 68;
        boolean isSouthA = gateA.wilayah.contains("Pasuruan") || gateA.wilayah.contains("Probolinggo") || gateA.wilayah.contains("Malang");
        boolean isSouthB = gateB.wilayah.contains("Pasuruan") || gateB.wilayah.contains("Probolinggo") || gateB.wilayah.contains("Malang");

        if (isWestA != isWestB) {
            // Lintas Barat (Madiun/Nganjuk/Jombang) ke Surabaya / Timur
            Gate west = isWestA ? gateA : gateB;
            Gate east = isWestA ? gateB : gateA;

            if (!west.id.equals("GT_BANDAR")) {
                long f1 = Math.abs(west.km - 82) * 950;
                totalGol1 += f1;
                segList.add(new Segment("Tol Ngawi - Kertosono", isWestA ? west.name : "Bandar", isWestA ? "Bandar" : west.name, Math.round((f1 * multiplier) / 500) * 500));
            }
            long f2 = 46000;
            totalGol1 += f2;
            segList.add(new Segment("Tol Kertosono - Mojokerto (Jomo)", isWestA ? "Bandar" : "Penompo", isWestA ? "Penompo" : "Bandar", Math.round((f2 * multiplier) / 500) * 500));

            if (east.wilayah.contains("Surabaya") || east.id.equals("GT_WARUGUNUNG")) {
                long f3 = 43500;
                totalGol1 += f3;
                segList.add(new Segment("Tol Surabaya - Mojokerto (SuMo)", isWestA ? "Penompo" : east.name, isWestA ? east.name : "Penompo", Math.round((f3 * multiplier) / 500) * 500));
            } else if (isSouthA || isSouthB) {
                long f3 = 20500 + 16000;
                totalGol1 += f3;
                segList.add(new Segment("Tol SuMo & Porong - Gempol Bypass", "Penompo", "Gempol", Math.round((f3 * multiplier) / 500) * 500));
                if (east.wilayah.contains("Malang")) {
                    long f4 = 14500 + 38500;
                    totalGol1 += f4;
                    segList.add(new Segment("Tol Gempol - Pandaan - Malang", "Gempol", east.name, Math.round((f4 * multiplier) / 500) * 500));
                } else {
                    long f4 = 48500;
                    totalGol1 += f4;
                    segList.add(new Segment("Tol Gempol - Pasuruan & Paspro", "Gempol", east.name, Math.round((f4 * multiplier) / 500) * 500));
                }
            }
        } else if (isSouthA != isSouthB) {
            // Surabaya/Gresik ke Malang/Pasuruan/Probolinggo
            Gate north = !isSouthA ? gateA : gateB;
            Gate south = isSouthA ? gateA : gateB;

            long f1 = 18000;
            totalGol1 += f1;
            segList.add(new Segment("Tol Surabaya - Gempol & Porong - Gempol", isSouthA ? "Gempol" : north.name, isSouthA ? north.name : "Gempol", Math.round((f1 * multiplier) / 500) * 500));

            if (south.wilayah.contains("Malang")) {
                long f2 = 14500 + 38500;
                totalGol1 += f2;
                segList.add(new Segment("Tol Gempol - Pandaan - Malang", "Gempol", south.name, Math.round((f2 * multiplier) / 500) * 500));
            } else if (south.wilayah.contains("Probolinggo")) {
                long f2 = 48500 + 40000;
                totalGol1 += f2;
                segList.add(new Segment("Tol Gempol - Pasuruan & Paspro", "Gempol", south.name, Math.round((f2 * multiplier) / 500) * 500));
            } else {
                long f2 = 28000;
                totalGol1 += f2;
                segList.add(new Segment("Tol Gempol - Pasuruan", "Gempol", south.name, Math.round((f2 * multiplier) / 500) * 500));
            }
        } else {
            int kmDiff = Math.abs(gateA.km - gateB.km);
            long est = Math.max(5500, Math.round((kmDiff * 950) / 500) * 500);
            totalGol1 = est;
            segList.add(new Segment("Ruas Tol " + gateA.wilayah + " - " + gateB.wilayah, gateA.name, gateB.name, Math.round((est * multiplier) / 500) * 500));
        }

        long finalTotal = 0;
        for (Segment s : segList) {
            finalTotal += s.fee;
        }

        int dist = Math.abs(gateA.km - gateB.km);
        return new TollResult(true, finalTotal, segList, dist, null);
    }

    public static String formatRupiah(long amount) {
        NumberFormat nf = NumberFormat.getNumberInstance(new Locale("id", "ID"));
        return "Rp. " + nf.format(amount);
    }
}
