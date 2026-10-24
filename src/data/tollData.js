/**
 * Database Gerbang Tol & Tarif Resmi Wilayah Jawa Timur (BPJT / Jasa Marga / Astra Tol)
 * Berdasarkan Penyesuaian Tarif Resmi Kepmen PUPR / Kepmen PU Terbaru:
 * - Tol Surabaya - Gresik: Kepmen PUPR No. 149/KPTS/M/2024
 * - Tol Simpang Susun Waru - Bandara Juanda: Kepmen PU No. 642/KPTS/M/2025 (berlaku mulai Juli 2025)
 * - Tol Surabaya - Gempol: Kepmen PUPR No. 1345/KPTS/M/2024
 * - Tol Surabaya - Mojokerto (SuMo): Kepmen PUPR No. 1306/KPTS/M/2024
 * - Tol Krian - Legundi - Bunder - Manyar (KLBM): Kepmen PU No. 330/KPTS/M/2025
 * - Tol Kertosono - Mojokerto (Jomo / Astra Tol): Kepmen PUPR No. 252/KPTS/M/2024
 * - Tol Pandaan - Malang: Kepmen PU No. 602/KPTS/M/2025 (berlaku mulai Juni 2025)
 * - Tol Gempol - Pasuruan & Pasuruan - Probolinggo (Paspro)
 * - Tol Ngawi - Kertosono
 */

export const GOLONGAN_OPTIONS = [
  {
    id: 'GOL_1',
    code: 'Golongan I',
    name: 'Golongan I',
    desc: 'Sedan, Jip, Pick Up, Truk Kecil, & Bus',
    icon: '🚗',
  },
  {
    id: 'GOL_2',
    code: 'Golongan II',
    name: 'Golongan II',
    desc: 'Truk Besar dengan 2 Gandar (Sumbu Roda)',
    icon: '🚚',
  },
  {
    id: 'GOL_3',
    code: 'Golongan III',
    name: 'Golongan III',
    desc: 'Truk Besar dengan 3 Gandar (Sumbu Roda)',
    icon: '🚛',
  },
  {
    id: 'GOL_4',
    code: 'Golongan IV',
    name: 'Golongan IV',
    desc: 'Truk Besar dengan 4 Gandar (Sumbu Roda)',
    icon: '🚛',
  },
  {
    id: 'GOL_5',
    code: 'Golongan V',
    name: 'Golongan V',
    desc: 'Truk Besar dengan 5 Gandar atau lebih',
    icon: '🚛',
  },
];

// Daftar Wilayah & Gerbang Tol Jawa Timur
export const WILAYAH_TOL = [
  {
    id: 'GRESIK',
    name: 'Kab. Gresik',
    badgeColor: '#0284C7',
    gates: [
      { id: 'GT_MANYAR', name: 'Manyar', ruas: 'Surabaya - Gresik & KLBM', km: 24, corridor: 'pantura' },
      { id: 'GT_KEBOMAS', name: 'Kebomas', ruas: 'Surabaya - Gresik', km: 16, corridor: 'pantura' },
      { id: 'GT_BUNDER', name: 'Bunder Gresik', ruas: 'Tol KLBM', km: 28, corridor: 'klbm' },
      { id: 'GT_CERME', name: 'Cerme', ruas: 'Tol KLBM', km: 20, corridor: 'klbm' },
    ],
  },
  {
    id: 'SURABAYA',
    name: 'Kota Surabaya',
    badgeColor: '#2563EB',
    gates: [
      { id: 'GT_DUPAK', name: 'Dupak', ruas: 'Surabaya - Gresik & Sby - Gempol', km: 4, corridor: 'sby_urban' },
      { id: 'GT_TANDES', name: 'Tandes', ruas: 'Surabaya - Gresik', km: 8, corridor: 'pantura' },
      { id: 'GT_ROMOKALISARI', name: 'Romokalisari', ruas: 'Surabaya - Gresik', km: 13, corridor: 'pantura' },
      { id: 'GT_BANYU_URIP', name: 'Banyu Urip', ruas: 'Surabaya - Gempol', km: 7, corridor: 'sby_urban' },
      { id: 'GT_GUNUNGSARI', name: 'Gunungsari', ruas: 'Surabaya - Gempol', km: 11, corridor: 'sby_urban' },
      { id: 'GT_PAGESANGAN', name: 'Pagesangan / Jambangan', ruas: 'Surabaya - Gempol', km: 13, corridor: 'sby_urban' },
      { id: 'GT_WARU_SBY', name: 'Waru (Surabaya)', ruas: 'Surabaya - Gempol & Waru-Juanda', km: 17, corridor: 'trans_jawa' },
      { id: 'GT_WARUGUNUNG', name: 'Warugunung (SuMo Utama)', ruas: 'Surabaya - Mojokerto', km: 14, corridor: 'trans_jawa' },
    ],
  },
  {
    id: 'SIDOARJO',
    name: 'Kab. Sidoarjo',
    badgeColor: '#4F46E5',
    gates: [
      { id: 'GT_WARU_RAMP', name: 'Waru Ramp (Sidoarjo)', ruas: 'Surabaya - Gempol', km: 17, corridor: 'trans_jawa' },
      { id: 'GT_BERBEK', name: 'Berbek', ruas: 'Tol Waru - Juanda', km: 6, corridor: 'sby_urban' },
      { id: 'GT_TAMBAKSUMUR', name: 'Tambaksumur', ruas: 'Tol Waru - Juanda', km: 9, corridor: 'sby_urban' },
      { id: 'GT_JUANDA', name: 'Juanda (Bandara T1 & T2)', ruas: 'Tol Waru - Juanda', km: 12, corridor: 'sby_urban' },
      { id: 'GT_SIDOARJO', name: 'Sidoarjo Kota', ruas: 'Surabaya - Gempol', km: 28, corridor: 'trans_jawa' },
      { id: 'GT_TANGGULANGIN', name: 'Tanggulangin', ruas: 'Porong - Gempol', km: 34, corridor: 'trans_jawa' },
      { id: 'GT_PORONG', name: 'Porong', ruas: 'Porong - Gempol', km: 38, corridor: 'trans_jawa' },
      { id: 'GT_KRIAN', name: 'Krian (Sidoarjo Barat)', ruas: 'Surabaya - Mojokerto & KLBM', km: 26, corridor: 'trans_jawa' },
      { id: 'GT_BELAHANREJO', name: 'Belahanrejo', ruas: 'Tol KLBM', km: 8, corridor: 'klbm' },
      { id: 'GT_LEBANI_SUKO', name: 'Lebani Suko / Driyorejo', ruas: 'Tol KLBM & SuMo', km: 12, corridor: 'klbm' },
    ],
  },
  {
    id: 'MOJOKERTO',
    name: 'Kab. & Kota Mojokerto',
    badgeColor: '#7C3AED',
    gates: [
      { id: 'GT_PENOMPO', name: 'Penompo (Mojokerto Timur)', ruas: 'Surabaya - Mojokerto & Kertosono - Mojokerto', km: 42, corridor: 'trans_jawa' },
      { id: 'GT_MOJOKERTO_BARAT', name: 'Mojokerto Barat (Gedeg)', ruas: 'Kertosono - Mojokerto', km: 50, corridor: 'trans_jawa' },
    ],
  },
  {
    id: 'JOMBANG',
    name: 'Kab. Jombang',
    badgeColor: '#9333EA',
    gates: [
      { id: 'GT_JOMBANG', name: 'Jombang (Tembelang)', ruas: 'Kertosono - Mojokerto', km: 68, corridor: 'trans_jawa' },
      { id: 'GT_BANDAR', name: 'Bandar (Kertosono Timur)', ruas: 'Kertosono - Mojokerto & Ngawi - Kertosono', km: 82, corridor: 'trans_jawa' },
    ],
  },
  {
    id: 'NGANJUK',
    name: 'Kab. Nganjuk & Kertosono',
    badgeColor: '#C026D3',
    gates: [
      { id: 'GT_KERTOSONO', name: 'Kertosono (Simpang Susun)', ruas: 'Ngawi - Kertosono', km: 84, corridor: 'trans_jawa' },
      { id: 'GT_NGANJUK', name: 'Nganjuk (Sukomoro)', ruas: 'Ngawi - Kertosono', km: 115, corridor: 'trans_jawa' },
    ],
  },
  {
    id: 'MADIUN',
    name: 'Kab. & Kota Madiun',
    badgeColor: '#DB2777',
    gates: [
      { id: 'GT_CARUBAN', name: 'Caruban', ruas: 'Ngawi - Kertosono', km: 145, corridor: 'trans_jawa' },
      { id: 'GT_MADIUN', name: 'Madiun (Dumpil)', ruas: 'Ngawi - Kertosono', km: 160, corridor: 'trans_jawa' },
    ],
  },
  {
    id: 'PASURUAN',
    name: 'Kab. & Kota Pasuruan',
    badgeColor: '#EA580C',
    gates: [
      { id: 'GT_KEJAPANAN', name: 'Kejapanan Utama', ruas: 'Porong - Gempol', km: 43, corridor: 'trans_jawa' },
      { id: 'GT_GEMPOL', name: 'Gempol Junction', ruas: 'Gempol - Pasuruan & Gempol - Pandaan', km: 46, corridor: 'trans_jawa' },
      { id: 'GT_BANGIL', name: 'Bangil', ruas: 'Gempol - Pasuruan', km: 55, corridor: 'trans_jawa' },
      { id: 'GT_REMBANG', name: 'Rembang (PIER)', ruas: 'Gempol - Pasuruan', km: 64, corridor: 'trans_jawa' },
      { id: 'GT_PASURUAN', name: 'Pasuruan Kota', ruas: 'Gempol - Pasuruan', km: 74, corridor: 'trans_jawa' },
      { id: 'GT_GRATI', name: 'Grati', ruas: 'Gempol - Pasuruan & Paspro', km: 87, corridor: 'trans_jawa' },
      { id: 'GT_PANDAAN', name: 'Pandaan', ruas: 'Gempol - Pandaan & Pandaan - Malang', km: 58, corridor: 'malang' },
    ],
  },
  {
    id: 'PROBOLINGGO',
    name: 'Kab. & Kota Probolinggo',
    badgeColor: '#E11D48',
    gates: [
      { id: 'GT_TONGAS', name: 'Tongas', ruas: 'Pasuruan - Probolinggo', km: 104, corridor: 'trans_jawa' },
      { id: 'GT_PROBOLINGGO_BARAT', name: 'Probolinggo Barat (Muneng)', ruas: 'Pasuruan - Probolinggo', km: 115, corridor: 'trans_jawa' },
      { id: 'GT_PROBOLINGGO_TIMUR', name: 'Probolinggo Timur (Leces)', ruas: 'Pasuruan - Probolinggo', km: 127, corridor: 'trans_jawa' },
      { id: 'GT_GENDING', name: 'Gending (Probolinggo Timur Baru)', ruas: 'Pasuruan - Probolinggo', km: 136, corridor: 'trans_jawa' },
    ],
  },
  {
    id: 'MALANG',
    name: 'Kab. & Kota Malang',
    badgeColor: '#059669',
    gates: [
      { id: 'GT_PURWODADI', name: 'Purwodadi', ruas: 'Pandaan - Malang', km: 72, corridor: 'malang' },
      { id: 'GT_LAWANG', name: 'Lawang', ruas: 'Pandaan - Malang', km: 82, corridor: 'malang' },
      { id: 'GT_SINGOSARI', name: 'Singosari (Batu / Malang Utara)', ruas: 'Pandaan - Malang', km: 92, corridor: 'malang' },
      { id: 'GT_PAKIS', name: 'Pakis (Bandara Abd Saleh)', ruas: 'Pandaan - Malang', km: 96, corridor: 'malang' },
      { id: 'GT_MALANG_KOTA', name: 'Malang (Madyopuro)', ruas: 'Pandaan - Malang', km: 101, corridor: 'malang' },
    ],
  },
];

// Flatten semua gate untuk akses cepat
export const ALL_GATES = WILAYAH_TOL.reduce((acc, w) => {
  w.gates.forEach((g) => {
    acc.push({ ...g, wilayahName: w.name, wilayahId: w.id });
  });
  return acc;
}, []);

/**
 * Matriks Tarif Ruas Tunggal Resmi Terbaru (Golongan I)
 */
export const TARIFF_SEGMENTS_GOL1 = [
  // 1. Ruas Surabaya - Gresik (Kepmen PUPR 149/KPTS/M/2024)
  { from: 'GT_DUPAK', to: 'GT_TANDES', fee: 4500, ruasName: 'Tol Surabaya - Gresik' },
  { from: 'GT_DUPAK', to: 'GT_ROMOKALISARI', fee: 12000, ruasName: 'Tol Surabaya - Gresik' },
  { from: 'GT_DUPAK', to: 'GT_KEBOMAS', fee: 21500, ruasName: 'Tol Surabaya - Gresik' },
  { from: 'GT_DUPAK', to: 'GT_MANYAR', fee: 27500, ruasName: 'Tol Surabaya - Gresik' },
  { from: 'GT_TANDES', to: 'GT_ROMOKALISARI', fee: 7000, ruasName: 'Tol Surabaya - Gresik' },
  { from: 'GT_TANDES', to: 'GT_KEBOMAS', fee: 17000, ruasName: 'Tol Surabaya - Gresik' },
  { from: 'GT_TANDES', to: 'GT_MANYAR', fee: 22500, ruasName: 'Tol Surabaya - Gresik' },
  { from: 'GT_ROMOKALISARI', to: 'GT_KEBOMAS', fee: 10000, ruasName: 'Tol Surabaya - Gresik' },
  { from: 'GT_ROMOKALISARI', to: 'GT_MANYAR', fee: 15500, ruasName: 'Tol Surabaya - Gresik' },
  { from: 'GT_KEBOMAS', to: 'GT_MANYAR', fee: 5500, ruasName: 'Tol Surabaya - Gresik' },

  // 2. Ruas Surabaya Urban (Surabaya - Gempol Seksi Dupak - Waru Sistem Terbuka)
  { from: 'GT_DUPAK', to: 'GT_BANYU_URIP', fee: 4000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_DUPAK', to: 'GT_GUNUNGSARI', fee: 6000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_DUPAK', to: 'GT_PAGESANGAN', fee: 6000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_DUPAK', to: 'GT_WARU_SBY', fee: 6000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_BANYU_URIP', to: 'GT_GUNUNGSARI', fee: 4000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_BANYU_URIP', to: 'GT_WARU_SBY', fee: 6000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_GUNUNGSARI', to: 'GT_PAGESANGAN', fee: 4000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_GUNUNGSARI', to: 'GT_WARU_SBY', fee: 5000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_PAGESANGAN', to: 'GT_WARU_SBY', fee: 4000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },

  // 3. Ruas Waru - Juanda (Kepmen PU 642/KPTS/M/2025 terbaru: Gol I Waru - Juanda Rp 9.500)
  { from: 'GT_WARU_SBY', to: 'GT_BERBEK', fee: 4500, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },
  { from: 'GT_WARU_SBY', to: 'GT_TAMBAKSUMUR', fee: 6500, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },
  { from: 'GT_WARU_SBY', to: 'GT_JUANDA', fee: 9500, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },
  { from: 'GT_BERBEK', to: 'GT_TAMBAKSUMUR', fee: 3000, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },
  { from: 'GT_BERBEK', to: 'GT_JUANDA', fee: 6000, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },
  { from: 'GT_TAMBAKSUMUR', to: 'GT_JUANDA', fee: 4500, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },

  // 4. Ruas Waru - Sidoarjo - Porong - Kejapanan - Gempol (Sby - Gempol Selatan)
  { from: 'GT_WARU_SBY', to: 'GT_SIDOARJO', fee: 6500, ruasName: 'Tol Surabaya - Gempol (Waru - Sidoarjo)' },
  { from: 'GT_WARU_RAMP', to: 'GT_SIDOARJO', fee: 6500, ruasName: 'Tol Surabaya - Gempol (Waru - Sidoarjo)' },
  { from: 'GT_WARU_SBY', to: 'GT_TANGGULANGIN', fee: 8000, ruasName: 'Tol Surabaya - Gempol' },
  { from: 'GT_WARU_SBY', to: 'GT_PORONG', fee: 10000, ruasName: 'Tol Surabaya - Gempol' },
  { from: 'GT_WARU_SBY', to: 'GT_KEJAPANAN', fee: 16000, ruasName: 'Tol Surabaya - Gempol & Porong - Gempol' },
  { from: 'GT_WARU_SBY', to: 'GT_GEMPOL', fee: 19000, ruasName: 'Tol Surabaya - Gempol & Porong - Gempol' },
  { from: 'GT_SIDOARJO', to: 'GT_PORONG', fee: 6500, ruasName: 'Tol Porong - Gempol' },
  { from: 'GT_SIDOARJO', to: 'GT_KEJAPANAN', fee: 11500, ruasName: 'Tol Porong - Gempol' },
  { from: 'GT_SIDOARJO', to: 'GT_GEMPOL', fee: 14500, ruasName: 'Tol Porong - Gempol' },
  { from: 'GT_PORONG', to: 'GT_KEJAPANAN', fee: 6000, ruasName: 'Tol Porong - Gempol' },
  { from: 'GT_PORONG', to: 'GT_GEMPOL', fee: 9000, ruasName: 'Tol Porong - Gempol' },
  { from: 'GT_KEJAPANAN', to: 'GT_GEMPOL', fee: 3500, ruasName: 'Tol Porong - Gempol' },

  // 5. Ruas KLBM (Krian - Legundi - Bunder - Manyar) (Kepmen PU 330/KPTS/M/2025)
  { from: 'GT_KRIAN', to: 'GT_LEBANI_SUKO', fee: 14500, ruasName: 'Tol KLBM' },
  { from: 'GT_KRIAN', to: 'GT_BELAHANREJO', fee: 14500, ruasName: 'Tol KLBM' },
  { from: 'GT_KRIAN', to: 'GT_CERME', fee: 34500, ruasName: 'Tol KLBM' },
  { from: 'GT_KRIAN', to: 'GT_BUNDER', fee: 47500, ruasName: 'Tol KLBM' },
  { from: 'GT_BELAHANREJO', to: 'GT_CERME', fee: 20000, ruasName: 'Tol KLBM' },
  { from: 'GT_BELAHANREJO', to: 'GT_BUNDER', fee: 33000, ruasName: 'Tol KLBM' },
  { from: 'GT_LEBANI_SUKO', to: 'GT_CERME', fee: 20000, ruasName: 'Tol KLBM' },
  { from: 'GT_LEBANI_SUKO', to: 'GT_BUNDER', fee: 29000, ruasName: 'Tol KLBM' },
  { from: 'GT_CERME', to: 'GT_BUNDER', fee: 15000, ruasName: 'Tol KLBM' },

  // 6. Ruas Surabaya - Mojokerto (SuMo) (Kepmen PUPR 1306/KPTS/M/2024)
  { from: 'GT_WARUGUNUNG', to: 'GT_LEBANI_SUKO', fee: 15000, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },
  { from: 'GT_WARUGUNUNG', to: 'GT_KRIAN', fee: 22500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },
  { from: 'GT_WARUGUNUNG', to: 'GT_PENOMPO', fee: 43500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },
  { from: 'GT_LEBANI_SUKO', to: 'GT_KRIAN', fee: 7500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },
  { from: 'GT_LEBANI_SUKO', to: 'GT_PENOMPO', fee: 28500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },
  { from: 'GT_KRIAN', to: 'GT_PENOMPO', fee: 20500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },

  // 7. Ruas Kertosono - Mojokerto (Jomo / Astra Tol) (Kepmen PUPR 252/KPTS/M/2024)
  { from: 'GT_PENOMPO', to: 'GT_MOJOKERTO_BARAT', fee: 7000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },
  { from: 'GT_PENOMPO', to: 'GT_JOMBANG', fee: 34000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },
  { from: 'GT_PENOMPO', to: 'GT_BANDAR', fee: 54000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },
  { from: 'GT_MOJOKERTO_BARAT', to: 'GT_JOMBANG', fee: 27000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },
  { from: 'GT_MOJOKERTO_BARAT', to: 'GT_BANDAR', fee: 47000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },
  { from: 'GT_JOMBANG', to: 'GT_BANDAR', fee: 20000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },

  // 8. Ruas Ngawi - Kertosono
  { from: 'GT_BANDAR', to: 'GT_NGANJUK', fee: 27000, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_BANDAR', to: 'GT_CARUBAN', fee: 66500, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_BANDAR', to: 'GT_MADIUN', fee: 76000, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_KERTOSONO', to: 'GT_NGANJUK', fee: 27000, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_KERTOSONO', to: 'GT_CARUBAN', fee: 66500, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_KERTOSONO', to: 'GT_MADIUN', fee: 76000, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_NGANJUK', to: 'GT_CARUBAN', fee: 39000, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_NGANJUK', to: 'GT_MADIUN', fee: 48500, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_CARUBAN', to: 'GT_MADIUN', fee: 10000, ruasName: 'Tol Ngawi - Kertosono' },

  // 9. Ruas Gempol - Pasuruan (Gempas)
  { from: 'GT_GEMPOL', to: 'GT_BANGIL', fee: 9500, ruasName: 'Tol Gempol - Pasuruan' },
  { from: 'GT_GEMPOL', to: 'GT_REMBANG', fee: 19000, ruasName: 'Tol Gempol - Pasuruan' },
  { from: 'GT_GEMPOL', to: 'GT_PASURUAN', fee: 28000, ruasName: 'Tol Gempol - Pasuruan' },
  { from: 'GT_GEMPOL', to: 'GT_GRATI', fee: 48500, ruasName: 'Tol Gempol - Pasuruan' },
  { from: 'GT_BANGIL', to: 'GT_REMBANG', fee: 9500, ruasName: 'Tol Gempol - Pasuruan' },
  { from: 'GT_BANGIL', to: 'GT_PASURUAN', fee: 18500, ruasName: 'Tol Gempol - Pasuruan' },
  { from: 'GT_BANGIL', to: 'GT_GRATI', fee: 37500, ruasName: 'Tol Gempol - Pasuruan' },
  { from: 'GT_REMBANG', to: 'GT_PASURUAN', fee: 9000, ruasName: 'Tol Gempol - Pasuruan' },
  { from: 'GT_REMBANG', to: 'GT_GRATI', fee: 27500, ruasName: 'Tol Gempol - Pasuruan' },
  { from: 'GT_PASURUAN', to: 'GT_GRATI', fee: 16000, ruasName: 'Tol Gempol - Pasuruan' },

  // 10. Ruas Pasuruan - Probolinggo (Paspro)
  { from: 'GT_GRATI', to: 'GT_TONGAS', fee: 17000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },
  { from: 'GT_GRATI', to: 'GT_PROBOLINGGO_BARAT', fee: 26000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },
  { from: 'GT_GRATI', to: 'GT_PROBOLINGGO_TIMUR', fee: 40000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },
  { from: 'GT_GRATI', to: 'GT_GENDING', fee: 52000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },
  { from: 'GT_TONGAS', to: 'GT_PROBOLINGGO_BARAT', fee: 9000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },
  { from: 'GT_TONGAS', to: 'GT_PROBOLINGGO_TIMUR', fee: 23000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },
  { from: 'GT_TONGAS', to: 'GT_GENDING', fee: 35000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },
  { from: 'GT_PROBOLINGGO_BARAT', to: 'GT_PROBOLINGGO_TIMUR', fee: 14000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },
  { from: 'GT_PROBOLINGGO_BARAT', to: 'GT_GENDING', fee: 26500, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },
  { from: 'GT_PROBOLINGGO_TIMUR', to: 'GT_GENDING', fee: 12000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },

  // 11. Ruas Gempol - Pandaan & Pandaan - Malang (Mapan) (Kepmen PU 602/KPTS/M/2025)
  { from: 'GT_GEMPOL', to: 'GT_PANDAAN', fee: 14500, ruasName: 'Tol Gempol - Pandaan' },
  { from: 'GT_KEJAPANAN', to: 'GT_PANDAAN', fee: 16500, ruasName: 'Tol Gempol - Pandaan' },
  { from: 'GT_PANDAAN', to: 'GT_PURWODADI', fee: 15000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PANDAAN', to: 'GT_LAWANG', fee: 23000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PANDAAN', to: 'GT_SINGOSARI', fee: 30000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PANDAAN', to: 'GT_PAKIS', fee: 34500, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PANDAAN', to: 'GT_MALANG_KOTA', fee: 38000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PURWODADI', to: 'GT_LAWANG', fee: 8000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PURWODADI', to: 'GT_SINGOSARI', fee: 15000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PURWODADI', to: 'GT_PAKIS', fee: 19500, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PURWODADI', to: 'GT_MALANG_KOTA', fee: 23000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_LAWANG', to: 'GT_SINGOSARI', fee: 7000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_LAWANG', to: 'GT_PAKIS', fee: 11500, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_LAWANG', to: 'GT_MALANG_KOTA', fee: 15000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_SINGOSARI', to: 'GT_PAKIS', fee: 4500, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_SINGOSARI', to: 'GT_MALANG_KOTA', fee: 8000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PAKIS', to: 'GT_MALANG_KOTA', fee: 3500, ruasName: 'Tol Pandaan - Malang' },
];

/**
 * Helper pencarian segmen tarif langsung (2 arah)
 */
export function findDirectSegment(idA, idB) {
  return TARIFF_SEGMENTS_GOL1.find(
    (s) => (s.from === idA && s.to === idB) || (s.from === idB && s.to === idA)
  );
}

// Pengelompokan Gerbang Tol per Koridor Jaringan
const G_GRESIK_SBY = ['GT_MANYAR', 'GT_KEBOMAS', 'GT_ROMOKALISARI', 'GT_TANDES', 'GT_DUPAK'];
const G_SBY_INNER = ['GT_DUPAK', 'GT_BANYU_URIP', 'GT_GUNUNGSARI', 'GT_PAGESANGAN', 'GT_WARU_SBY'];
const G_JUANDA = ['GT_BERBEK', 'GT_TAMBAKSUMUR', 'GT_JUANDA'];
const G_SBY_GEMPOL_SOUTH = ['GT_WARU_RAMP', 'GT_SIDOARJO', 'GT_TANGGULANGIN', 'GT_PORONG', 'GT_KEJAPANAN', 'GT_GEMPOL'];
const G_KLBM = ['GT_BUNDER', 'GT_CERME', 'GT_BELAHANREJO'];
const G_SUMO = ['GT_WARUGUNUNG', 'GT_LEBANI_SUKO', 'GT_KRIAN', 'GT_PENOMPO'];
const G_JOMO = ['GT_PENOMPO', 'GT_MOJOKERTO_BARAT', 'GT_JOMBANG', 'GT_BANDAR'];
const G_NGAWI = ['GT_BANDAR', 'GT_KERTOSONO', 'GT_NGANJUK', 'GT_CARUBAN', 'GT_MADIUN'];
const G_GEMPAS = ['GT_GEMPOL', 'GT_BANGIL', 'GT_REMBANG', 'GT_PASURUAN', 'GT_GRATI'];
const G_PASPRO = ['GT_GRATI', 'GT_TONGAS', 'GT_PROBOLINGGO_BARAT', 'GT_PROBOLINGGO_TIMUR', 'GT_GENDING'];
const G_MAPAN = ['GT_GEMPOL', 'GT_KEJAPANAN', 'GT_PANDAAN', 'GT_PURWODADI', 'GT_LAWANG', 'GT_SINGOSARI', 'GT_PAKIS', 'GT_MALANG_KOTA'];

/**
 * Menghitung rute tol otomatis beserta rincian tarif per ruas tol yang akurat
 * @param {string} asalId ID Gerbang Asal
 * @param {string} tujuanId ID Gerbang Tujuan
 * @param {string} golonganCode 'Golongan I' | 'Golongan II' | 'Golongan III' | 'Golongan IV' | 'Golongan V'
 * @returns {object} { success, totalFee, segments: [{ ruasName, fromName, toName, fee }], distanceKm }
 */
export function calculateTollRoute(asalId, tujuanId, golonganCode = 'Golongan I') {
  if (!asalId || !tujuanId) {
    return { success: false, totalFee: 0, segments: [], error: 'Pilih gerbang asal dan tujuan' };
  }

  if (asalId === tujuanId) {
    return { success: false, totalFee: 0, segments: [], error: 'Gerbang asal dan tujuan tidak boleh sama' };
  }

  const gateA = ALL_GATES.find((g) => g.id === asalId);
  const gateB = ALL_GATES.find((g) => g.id === tujuanId);

  if (!gateA || !gateB) {
    return { success: false, totalFee: 0, segments: [], error: 'Gerbang tol tidak ditemukan' };
  }

  // Multiplier golongan kendaraan BPJT:
  // Gol I   = 1.0x
  // Gol II  = 1.5x
  // Gol III = 1.5x
  // Gol IV  = 2.0x
  // Gol V   = 2.0x
  let golMultiplier = 1.0;
  if (golonganCode === 'Golongan II' || golonganCode === 'Golongan III') golMultiplier = 1.5;
  else if (golonganCode === 'Golongan IV' || golonganCode === 'Golongan V') golMultiplier = 2.0;

  // Helper konversi tarif segmen ke golongan
  function toGolFee(directSeg) {
    if (!directSeg) return 0;
    // Khusus Waru - Juanda: Gol II/III Rp 14.000, Gol IV/V Rp 19.000
    if (directSeg.ruasName.includes('Waru - Bandara Juanda')) {
      if ((directSeg.from === 'GT_WARU_SBY' && directSeg.to === 'GT_JUANDA') || (directSeg.from === 'GT_JUANDA' && directSeg.to === 'GT_WARU_SBY')) {
        if (golMultiplier === 1.5) return 14000;
        if (golMultiplier === 2.0) return 19000;
        return directSeg.fee;
      }
    }
    return Math.round((directSeg.fee * golMultiplier) / 500) * 500;
  }

  // Helper pembuat objek segmen
  function makeSegment(directSeg, fromGateId, toGateId) {
    const fGate = ALL_GATES.find((g) => g.id === fromGateId);
    const tGate = ALL_GATES.find((g) => g.id === toGateId);
    return {
      ruasName: directSeg.ruasName,
      fromName: fGate ? fGate.name : fromGateId,
      toName: tGate ? tGate.name : toGateId,
      fee: toGolFee(directSeg),
    };
  }

  // 1. Cek pencarian ruas langsung
  const direct = findDirectSegment(asalId, tujuanId);
  if (direct) {
    const seg = makeSegment(direct, asalId, tujuanId);
    return {
      success: true,
      totalFee: seg.fee,
      segments: [seg],
      distanceKm: Math.abs(gateA.km - gateB.km) || 15,
      originGate: gateA,
      destinationGate: gateB,
      golongan: GOLONGAN_OPTIONS.find((g) => g.code === golonganCode) || GOLONGAN_OPTIONS[0],
    };
  }

  // 2. Evaluasi Multi-Ruas Antar-Koridor Jawa Timur
  const isGresikA = G_GRESIK_SBY.includes(asalId) && asalId !== 'GT_DUPAK';
  const isGresikB = G_GRESIK_SBY.includes(tujuanId) && tujuanId !== 'GT_DUPAK';
  const isSbyInnerA = G_SBY_INNER.includes(asalId);
  const isSbyInnerB = G_SBY_INNER.includes(tujuanId);
  const isJuandaA = G_JUANDA.includes(asalId);
  const isJuandaB = G_JUANDA.includes(tujuanId);
  const isSouthA = G_SBY_GEMPOL_SOUTH.includes(asalId) && asalId !== 'GT_WARU_SBY';
  const isSouthB = G_SBY_GEMPOL_SOUTH.includes(tujuanId) && tujuanId !== 'GT_WARU_SBY';
  const isMapanA = G_MAPAN.includes(asalId) && asalId !== 'GT_GEMPOL' && asalId !== 'GT_KEJAPANAN';
  const isMapanB = G_MAPAN.includes(tujuanId) && tujuanId !== 'GT_GEMPOL' && tujuanId !== 'GT_KEJAPANAN';
  const isGempasA = G_GEMPAS.includes(asalId) && asalId !== 'GT_GEMPOL';
  const isGempasB = G_GEMPAS.includes(tujuanId) && tujuanId !== 'GT_GEMPOL';
  const isPasproA = G_PASPRO.includes(asalId) && asalId !== 'GT_GRATI';
  const isPasproB = G_PASPRO.includes(tujuanId) && tujuanId !== 'GT_GRATI';
  const isWestA = ['MADIUN', 'NGANJUK', 'JOMBANG'].includes(gateA.wilayahId);
  const isWestB = ['MADIUN', 'NGANJUK', 'JOMBANG'].includes(gateB.wilayahId);
  const isKlbmA = G_KLBM.includes(asalId);
  const isKlbmB = G_KLBM.includes(tujuanId);

  const rawSegments = [];

  // A. Rute Melibatkan Koridor Surabaya - Gresik (Kebomas, Manyar, Romokalisari, Tandes)
  if (isGresikA || isGresikB) {
    const isReversed = !isGresikA;
    const gresikGateId = isGresikA ? asalId : tujuanId;
    const destGateId = isGresikA ? tujuanId : asalId;

    // Tahap 1: Gerbang Gresik <-> Dupak
    const s1 = findDirectSegment(gresikGateId, 'GT_DUPAK');
    if (s1) {
      rawSegments.push(isReversed ? { seg: s1, from: 'GT_DUPAK', to: gresikGateId } : { seg: s1, from: gresikGateId, to: 'GT_DUPAK' });
    }

    // Tahap 2: Dupak ke destinasi
    if (G_SBY_INNER.includes(destGateId)) {
      const s2 = findDirectSegment('GT_DUPAK', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: destGateId, to: 'GT_DUPAK' } : { seg: s2, from: 'GT_DUPAK', to: destGateId });
    } else if (G_JUANDA.includes(destGateId)) {
      const s2 = findDirectSegment('GT_DUPAK', 'GT_WARU_SBY');
      const s3 = findDirectSegment('GT_WARU_SBY', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_WARU_SBY', to: 'GT_DUPAK' } : { seg: s2, from: 'GT_DUPAK', to: 'GT_WARU_SBY' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: destGateId, to: 'GT_WARU_SBY' } : { seg: s3, from: 'GT_WARU_SBY', to: destGateId });
    } else if (G_SBY_GEMPOL_SOUTH.includes(destGateId)) {
      const s2 = findDirectSegment('GT_DUPAK', 'GT_WARU_SBY');
      const s3 = findDirectSegment('GT_WARU_SBY', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_WARU_SBY', to: 'GT_DUPAK' } : { seg: s2, from: 'GT_DUPAK', to: 'GT_WARU_SBY' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: destGateId, to: 'GT_WARU_SBY' } : { seg: s3, from: 'GT_WARU_SBY', to: destGateId });
    } else if (G_MAPAN.includes(destGateId)) {
      const s2 = findDirectSegment('GT_DUPAK', 'GT_WARU_SBY');
      const s3 = findDirectSegment('GT_WARU_SBY', 'GT_GEMPOL');
      const s4 = findDirectSegment('GT_GEMPOL', 'GT_PANDAAN');
      const s5 = destGateId === 'GT_PANDAAN' ? null : findDirectSegment('GT_PANDAAN', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_WARU_SBY', to: 'GT_DUPAK' } : { seg: s2, from: 'GT_DUPAK', to: 'GT_WARU_SBY' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: 'GT_GEMPOL', to: 'GT_WARU_SBY' } : { seg: s3, from: 'GT_WARU_SBY', to: 'GT_GEMPOL' });
      if (s4) rawSegments.push(isReversed ? { seg: s4, from: 'GT_PANDAAN', to: 'GT_GEMPOL' } : { seg: s4, from: 'GT_GEMPOL', to: 'GT_PANDAAN' });
      if (s5) rawSegments.push(isReversed ? { seg: s5, from: destGateId, to: 'GT_PANDAAN' } : { seg: s5, from: 'GT_PANDAAN', to: destGateId });
    } else if (G_GEMPAS.includes(destGateId)) {
      const s2 = findDirectSegment('GT_DUPAK', 'GT_WARU_SBY');
      const s3 = findDirectSegment('GT_WARU_SBY', 'GT_GEMPOL');
      const s4 = findDirectSegment('GT_GEMPOL', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_WARU_SBY', to: 'GT_DUPAK' } : { seg: s2, from: 'GT_DUPAK', to: 'GT_WARU_SBY' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: 'GT_GEMPOL', to: 'GT_WARU_SBY' } : { seg: s3, from: 'GT_WARU_SBY', to: 'GT_GEMPOL' });
      if (s4) rawSegments.push(isReversed ? { seg: s4, from: destGateId, to: 'GT_GEMPOL' } : { seg: s4, from: 'GT_GEMPOL', to: destGateId });
    } else if (G_PASPRO.includes(destGateId)) {
      const s2 = findDirectSegment('GT_DUPAK', 'GT_WARU_SBY');
      const s3 = findDirectSegment('GT_WARU_SBY', 'GT_GEMPOL');
      const s4 = findDirectSegment('GT_GEMPOL', 'GT_GRATI');
      const s5 = findDirectSegment('GT_GRATI', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_WARU_SBY', to: 'GT_DUPAK' } : { seg: s2, from: 'GT_DUPAK', to: 'GT_WARU_SBY' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: 'GT_GEMPOL', to: 'GT_WARU_SBY' } : { seg: s3, from: 'GT_WARU_SBY', to: 'GT_GEMPOL' });
      if (s4) rawSegments.push(isReversed ? { seg: s4, from: 'GT_GRATI', to: 'GT_GEMPOL' } : { seg: s4, from: 'GT_GEMPOL', to: 'GT_GRATI' });
      if (s5) rawSegments.push(isReversed ? { seg: s5, from: destGateId, to: 'GT_GRATI' } : { seg: s5, from: 'GT_GRATI', to: destGateId });
    }
    if (isReversed) {
      rawSegments.reverse();
    }
  }

  // B. Rute KLBM (Bunder, Cerme, Belahanrejo) ke SuMo / Mojokerto / Barat / Malang
  else if (isKlbmA || isKlbmB) {
    const isReversed = !isKlbmA;
    const klbmGateId = isKlbmA ? asalId : tujuanId;
    const otherGateId = isKlbmA ? tujuanId : asalId;

    const s1 = findDirectSegment(klbmGateId, 'GT_KRIAN');
    if (s1) {
      rawSegments.push(isReversed ? { seg: s1, from: 'GT_KRIAN', to: klbmGateId } : { seg: s1, from: klbmGateId, to: 'GT_KRIAN' });
    }

    if (otherGateId === 'GT_WARUGUNUNG') {
      const s2 = findDirectSegment('GT_KRIAN', 'GT_WARUGUNUNG');
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: otherGateId, to: 'GT_KRIAN' } : { seg: s2, from: 'GT_KRIAN', to: otherGateId });
    } else if (otherGateId === 'GT_PENOMPO') {
      const s2 = findDirectSegment('GT_KRIAN', 'GT_PENOMPO');
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: otherGateId, to: 'GT_KRIAN' } : { seg: s2, from: 'GT_KRIAN', to: otherGateId });
    } else if (isWestB || isWestA) {
      const s2 = findDirectSegment('GT_KRIAN', 'GT_PENOMPO');
      const s3 = { from: 'GT_PENOMPO', to: 'GT_BANDAR', fee: 54000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' };
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_PENOMPO', to: 'GT_KRIAN' } : { seg: s2, from: 'GT_KRIAN', to: 'GT_PENOMPO' });
      rawSegments.push(isReversed ? { seg: s3, from: 'GT_BANDAR', to: 'GT_PENOMPO' } : { seg: s3, from: 'GT_PENOMPO', to: 'GT_BANDAR' });

      if (otherGateId !== 'GT_BANDAR') {
        const s4 = findDirectSegment('GT_BANDAR', otherGateId) || {
          fee: Math.abs(gateB.km - 82) * 950,
          ruasName: 'Tol Ngawi - Kertosono',
        };
        rawSegments.push(isReversed ? { seg: s4, from: otherGateId, to: 'GT_BANDAR' } : { seg: s4, from: 'GT_BANDAR', to: otherGateId });
      }
    } else if (G_MAPAN.includes(otherGateId)) {
      const segBypass = { from: 'GT_KRIAN', to: 'GT_GEMPOL', fee: 16000, ruasName: 'Tol Krian - Porong - Gempol' };
      const s3 = findDirectSegment('GT_GEMPOL', 'GT_PANDAAN');
      const s4 = otherGateId === 'GT_PANDAAN' ? null : findDirectSegment('GT_PANDAAN', otherGateId);
      rawSegments.push(isReversed ? { seg: segBypass, from: 'GT_GEMPOL', to: 'GT_KRIAN' } : { seg: segBypass, from: 'GT_KRIAN', to: 'GT_GEMPOL' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: 'GT_PANDAAN', to: 'GT_GEMPOL' } : { seg: s3, from: 'GT_GEMPOL', to: 'GT_PANDAAN' });
      if (s4) rawSegments.push(isReversed ? { seg: s4, from: otherGateId, to: 'GT_PANDAAN' } : { seg: s4, from: 'GT_PANDAAN', to: otherGateId });
    }
    if (isReversed) {
      rawSegments.reverse();
    }
  }

  // C. Rute Surabaya Urban / Juanda ke Sidoarjo Selatan / Malang / Pasuruan / Probolinggo
  else if (
    ((isSbyInnerA || isJuandaA) && (isJuandaB || isSouthB || isMapanB || isGempasB || isPasproB)) ||
    ((isSbyInnerB || isJuandaB) && (isJuandaA || isSouthA || isMapanA || isGempasA || isPasproA))
  ) {
    const isReversed = !(isSbyInnerA || isJuandaA);
    const startGateId = !isReversed ? asalId : tujuanId;
    const destGateId = !isReversed ? tujuanId : asalId;

    // Start ke Simpang Susun Waru
    if (startGateId !== 'GT_WARU_SBY') {
      const s1 = findDirectSegment(startGateId, 'GT_WARU_SBY');
      if (s1) rawSegments.push(isReversed ? { seg: s1, from: 'GT_WARU_SBY', to: startGateId } : { seg: s1, from: startGateId, to: 'GT_WARU_SBY' });
    }

    // Waru ke Destinasi
    if (G_JUANDA.includes(destGateId) && destGateId !== 'GT_WARU_SBY') {
      const s2 = findDirectSegment('GT_WARU_SBY', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: destGateId, to: 'GT_WARU_SBY' } : { seg: s2, from: 'GT_WARU_SBY', to: destGateId });
    } else if (G_SBY_GEMPOL_SOUTH.includes(destGateId)) {
      const s2 = findDirectSegment('GT_WARU_SBY', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: destGateId, to: 'GT_WARU_SBY' } : { seg: s2, from: 'GT_WARU_SBY', to: destGateId });
    } else if (G_MAPAN.includes(destGateId)) {
      const s2 = findDirectSegment('GT_WARU_SBY', 'GT_GEMPOL');
      const s3 = findDirectSegment('GT_GEMPOL', 'GT_PANDAAN');
      const s4 = destGateId === 'GT_PANDAAN' ? null : findDirectSegment('GT_PANDAAN', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_GEMPOL', to: 'GT_WARU_SBY' } : { seg: s2, from: 'GT_WARU_SBY', to: 'GT_GEMPOL' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: 'GT_PANDAAN', to: 'GT_GEMPOL' } : { seg: s3, from: 'GT_GEMPOL', to: 'GT_PANDAAN' });
      if (s4) rawSegments.push(isReversed ? { seg: s4, from: destGateId, to: 'GT_PANDAAN' } : { seg: s4, from: 'GT_PANDAAN', to: destGateId });
    } else if (G_GEMPAS.includes(destGateId)) {
      const s2 = findDirectSegment('GT_WARU_SBY', 'GT_GEMPOL');
      const s3 = findDirectSegment('GT_GEMPOL', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_GEMPOL', to: 'GT_WARU_SBY' } : { seg: s2, from: 'GT_WARU_SBY', to: 'GT_GEMPOL' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: destGateId, to: 'GT_GEMPOL' } : { seg: s3, from: 'GT_GEMPOL', to: destGateId });
    } else if (G_PASPRO.includes(destGateId)) {
      const s2 = findDirectSegment('GT_WARU_SBY', 'GT_GEMPOL');
      const s3 = findDirectSegment('GT_GEMPOL', 'GT_GRATI');
      const s4 = findDirectSegment('GT_GRATI', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_GEMPOL', to: 'GT_WARU_SBY' } : { seg: s2, from: 'GT_WARU_SBY', to: 'GT_GEMPOL' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: 'GT_GRATI', to: 'GT_GEMPOL' } : { seg: s3, from: 'GT_GEMPOL', to: 'GT_GRATI' });
      if (s4) rawSegments.push(isReversed ? { seg: s4, from: destGateId, to: 'GT_GRATI' } : { seg: s4, from: 'GT_GRATI', to: destGateId });
    }
    if (isReversed) {
      rawSegments.reverse();
    }
  }

  // D. Rute Lintas Koridor Barat (Madiun, Nganjuk, Jombang) ke Surabaya / Timur / Malang
  else if (isWestA !== isWestB) {
    const isReversed = !isWestA;
    const westGate = isWestA ? gateA : gateB;
    const otherGate = isWestA ? gateB : gateA;

    // Segmen 1: West Gate ke Simpang Bandar
    if (westGate.id !== 'GT_BANDAR') {
      const segW = findDirectSegment(westGate.id, 'GT_BANDAR') || {
        fee: Math.abs(westGate.km - 82) * 950,
        ruasName: 'Tol Ngawi - Kertosono',
      };
      rawSegments.push(isReversed ? { seg: segW, from: 'GT_BANDAR', to: westGate.id } : { seg: segW, from: westGate.id, to: 'GT_BANDAR' });
    }

    // Segmen 2: Bandar ke Penompo (Tol Jomo)
    const segMo = { from: 'GT_BANDAR', to: 'GT_PENOMPO', fee: 54000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' };
    rawSegments.push(isReversed ? { seg: segMo, from: 'GT_PENOMPO', to: 'GT_BANDAR' } : { seg: segMo, from: 'GT_BANDAR', to: 'GT_PENOMPO' });

    // Segmen 3: Penompo ke Surabaya/Selatan/Malang
    if (otherGate.wilayahId === 'MOJOKERTO') {
      // Sampai Mojokerto
    } else if (otherGate.wilayahId === 'SURABAYA') {
      const segSuMo = findDirectSegment('GT_PENOMPO', otherGate.id) || {
        from: 'GT_PENOMPO', to: 'GT_WARUGUNUNG', fee: 43500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)',
      };
      rawSegments.push(isReversed ? { seg: segSuMo, from: otherGate.id, to: 'GT_PENOMPO' } : { seg: segSuMo, from: 'GT_PENOMPO', to: otherGate.id });
    } else if (otherGate.wilayahId === 'MALANG') {
      const segSuMo = { from: 'GT_PENOMPO', to: 'GT_KRIAN', fee: 20500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' };
      const segBypass = { from: 'GT_KRIAN', to: 'GT_GEMPOL', fee: 16000, ruasName: 'Tol Krian - Porong - Gempol' };
      const segPandaan = findDirectSegment('GT_GEMPOL', 'GT_PANDAAN');
      const segMpn = findDirectSegment('GT_PANDAAN', otherGate.id) || {
        from: 'GT_PANDAAN', to: otherGate.id, fee: 38000, ruasName: 'Tol Pandaan - Malang',
      };
      rawSegments.push(isReversed ? { seg: segSuMo, from: 'GT_KRIAN', to: 'GT_PENOMPO' } : { seg: segSuMo, from: 'GT_PENOMPO', to: 'GT_KRIAN' });
      rawSegments.push(isReversed ? { seg: segBypass, from: 'GT_GEMPOL', to: 'GT_KRIAN' } : { seg: segBypass, from: 'GT_KRIAN', to: 'GT_GEMPOL' });
      rawSegments.push(isReversed ? { seg: segPandaan, from: 'GT_PANDAAN', to: 'GT_GEMPOL' } : { seg: segPandaan, from: 'GT_GEMPOL', to: 'GT_PANDAAN' });
      rawSegments.push(isReversed ? { seg: segMpn, from: otherGate.id, to: 'GT_PANDAAN' } : { seg: segMpn, from: 'GT_PANDAAN', to: otherGate.id });
    } else if (['PASURUAN', 'PROBOLINGGO'].includes(otherGate.wilayahId)) {
      const segSuMo = { from: 'GT_PENOMPO', to: 'GT_KRIAN', fee: 20500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' };
      const segBypass = { from: 'GT_KRIAN', to: 'GT_GEMPOL', fee: 16000, ruasName: 'Tol Krian - Porong - Gempol' };
      rawSegments.push(isReversed ? { seg: segSuMo, from: 'GT_KRIAN', to: 'GT_PENOMPO' } : { seg: segSuMo, from: 'GT_PENOMPO', to: 'GT_KRIAN' });
      rawSegments.push(isReversed ? { seg: segBypass, from: 'GT_GEMPOL', to: 'GT_KRIAN' } : { seg: segBypass, from: 'GT_KRIAN', to: 'GT_GEMPOL' });

      if (otherGate.wilayahId === 'PASURUAN') {
        const segGempas = findDirectSegment('GT_GEMPOL', otherGate.id) || {
          from: 'GT_GEMPOL', to: otherGate.id, fee: 28000, ruasName: 'Tol Gempol - Pasuruan',
        };
        rawSegments.push(isReversed ? { seg: segGempas, from: otherGate.id, to: 'GT_GEMPOL' } : { seg: segGempas, from: 'GT_GEMPOL', to: otherGate.id });
      } else {
        const segGempas = findDirectSegment('GT_GEMPOL', 'GT_GRATI');
        const segPaspro = findDirectSegment('GT_GRATI', otherGate.id) || {
          from: 'GT_GRATI', to: otherGate.id, fee: 40000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)',
        };
        rawSegments.push(isReversed ? { seg: segGempas, from: 'GT_GRATI', to: 'GT_GEMPOL' } : { seg: segGempas, from: 'GT_GEMPOL', to: 'GT_GRATI' });
        rawSegments.push(isReversed ? { seg: segPaspro, from: otherGate.id, to: 'GT_GRATI' } : { seg: segPaspro, from: 'GT_GRATI', to: otherGate.id });
      }
    }
    if (isReversed) {
      rawSegments.reverse();
    }
  }

  // E. Rute Sidoarjo Selatan (Sidoarjo/Porong/Kejapanan) ke Pasuruan / Malang / Probolinggo
  else if (
    ((isSouthA || asalId === 'GT_GEMPOL') && (isMapanB || isGempasB || isPasproB)) ||
    ((isSouthB || tujuanId === 'GT_GEMPOL') && (isMapanA || isGempasA || isPasproA))
  ) {
    const isReversed = !(isSouthA || asalId === 'GT_GEMPOL');
    const southGateId = !isReversed ? asalId : tujuanId;
    const destGateId = !isReversed ? tujuanId : asalId;

    if (southGateId !== 'GT_GEMPOL') {
      const s1 = findDirectSegment(southGateId, 'GT_GEMPOL') || {
        from: southGateId, to: 'GT_GEMPOL', fee: 14500, ruasName: 'Tol Surabaya - Gempol & Porong - Gempol',
      };
      rawSegments.push(isReversed ? { seg: s1, from: 'GT_GEMPOL', to: southGateId } : { seg: s1, from: southGateId, to: 'GT_GEMPOL' });
    }

    if (G_MAPAN.includes(destGateId)) {
      const s2 = findDirectSegment('GT_GEMPOL', 'GT_PANDAAN');
      const s3 = destGateId === 'GT_PANDAAN' ? null : findDirectSegment('GT_PANDAAN', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_PANDAAN', to: 'GT_GEMPOL' } : { seg: s2, from: 'GT_GEMPOL', to: 'GT_PANDAAN' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: destGateId, to: 'GT_PANDAAN' } : { seg: s3, from: 'GT_PANDAAN', to: destGateId });
    } else if (G_GEMPAS.includes(destGateId)) {
      const s2 = findDirectSegment('GT_GEMPOL', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: destGateId, to: 'GT_GEMPOL' } : { seg: s2, from: 'GT_GEMPOL', to: destGateId });
    } else if (G_PASPRO.includes(destGateId)) {
      const s2 = findDirectSegment('GT_GEMPOL', 'GT_GRATI');
      const s3 = findDirectSegment('GT_GRATI', destGateId);
      if (s2) rawSegments.push(isReversed ? { seg: s2, from: 'GT_GRATI', to: 'GT_GEMPOL' } : { seg: s2, from: 'GT_GEMPOL', to: 'GT_GRATI' });
      if (s3) rawSegments.push(isReversed ? { seg: s3, from: destGateId, to: 'GT_GRATI' } : { seg: s3, from: 'GT_GRATI', to: destGateId });
    }
    if (isReversed) {
      rawSegments.reverse();
    }
  }

  // F. Fallback jarak jika belum terpetakan di simpul utama
  if (rawSegments.length === 0) {
    const kmDiff = Math.abs(gateA.km - gateB.km) || 15;
    const estGol1 = Math.max(5500, Math.round((kmDiff * 950) / 500) * 500);
    const feeGol = Math.round((estGol1 * golMultiplier) / 500) * 500;
    return {
      success: true,
      totalFee: feeGol,
      segments: [
        {
          ruasName: `Ruas Tol ${gateA.wilayahName} - ${gateB.wilayahName}`,
          fromName: gateA.name,
          toName: gateB.name,
          fee: feeGol,
        },
      ],
      distanceKm: kmDiff,
      originGate: gateA,
      destinationGate: gateB,
      golongan: GOLONGAN_OPTIONS.find((g) => g.code === golonganCode) || GOLONGAN_OPTIONS[0],
    };
  }

  const finalSegments = rawSegments.map((item) => makeSegment(item.seg, item.from, item.to));
  const finalTotal = finalSegments.reduce((sum, s) => sum + s.fee, 0);
  const distanceKm = Math.abs(gateA.km - gateB.km) || Math.round(finalTotal / 1000);

  return {
    success: true,
    totalFee: finalTotal,
    segments: finalSegments,
    distanceKm,
    originGate: gateA,
    destinationGate: gateB,
    golongan: GOLONGAN_OPTIONS.find((g) => g.code === golonganCode) || GOLONGAN_OPTIONS[0],
  };
}
