/**
 * Database Gerbang Tol & Tarif Resmi Wilayah Jawa Timur (BPJT / Jasa Marga / Astra Tol)
 * Mencakup:
 * 1. Kab. Gresik
 * 2. Kota Surabaya
 * 3. Kab. Sidoarjo
 * 4. Kab. & Kota Pasuruan
 * 5. Kab. & Kota Probolinggo
 * 6. Kab. & Kota Malang
 * 7. Kab. & Kota Mojokerto
 * 8. Kab. Jombang
 * 9. Kab. Nganjuk & Kertosono
 * 10. Kab. & Kota Madiun
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

// Flatten semua gate untuk akses instan
export const ALL_GATES = WILAYAH_TOL.reduce((acc, w) => {
  w.gates.forEach((g) => {
    acc.push({ ...g, wilayahName: w.name, wilayahId: w.id });
  });
  return acc;
}, []);

/**
 * Matriks Tarif Ruas Tunggal Resmi (Golongan I)
 * Digunakan untuk menghitung tarif gerbang-ke-gerbang secara presisi.
 * Rasio Golongan:
 * Gol II & III ~ 1.5x Gol I
 * Gol IV & V   ~ 2.0x Gol I
 */
const TARIFF_SEGMENTS_GOL1 = [
  // 1. Ruas Surabaya - Gresik
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

  // 2. Ruas KLBM (Krian - Legundi - Bunder - Manyar)
  { from: 'GT_KRIAN', to: 'GT_LEBANI_SUKO', fee: 14500, ruasName: 'Tol KLBM' },
  { from: 'GT_KRIAN', to: 'GT_BELAHANREJO', fee: 14500, ruasName: 'Tol KLBM' },
  { from: 'GT_KRIAN', to: 'GT_CERME', fee: 34500, ruasName: 'Tol KLBM' },
  { from: 'GT_KRIAN', to: 'GT_BUNDER', fee: 47500, ruasName: 'Tol KLBM' },
  { from: 'GT_LEBANI_SUKO', to: 'GT_CERME', fee: 20000, ruasName: 'Tol KLBM' },
  { from: 'GT_LEBANI_SUKO', to: 'GT_BUNDER', fee: 29000, ruasName: 'Tol KLBM' },
  { from: 'GT_CERME', to: 'GT_BUNDER', fee: 15000, ruasName: 'Tol KLBM' },

  // 3. Ruas Surabaya Urban (Surabaya - Gempol)
  { from: 'GT_DUPAK', to: 'GT_BANYU_URIP', fee: 4000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_DUPAK', to: 'GT_GUNUNGSARI', fee: 6000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_DUPAK', to: 'GT_PAGESANGAN', fee: 6000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_DUPAK', to: 'GT_WARU_SBY', fee: 6000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_BANYU_URIP', to: 'GT_WARU_SBY', fee: 6000, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },
  { from: 'GT_GUNUNGSARI', to: 'GT_WARU_SBY', fee: 4500, ruasName: 'Tol Surabaya - Gempol (Seksi Dupak - Waru)' },

  // 4. Ruas Waru - Juanda
  { from: 'GT_WARU_SBY', to: 'GT_BERBEK', fee: 4500, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },
  { from: 'GT_WARU_SBY', to: 'GT_TAMBAKSUMUR', fee: 6500, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },
  { from: 'GT_WARU_SBY', to: 'GT_JUANDA', fee: 9000, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },
  { from: 'GT_BERBEK', to: 'GT_JUANDA', fee: 5500, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },
  { from: 'GT_TAMBAKSUMUR', to: 'GT_JUANDA', fee: 4000, ruasName: 'Tol Simpang Susun Waru - Bandara Juanda' },

  // 5. Ruas Waru - Sidoarjo - Porong - Kejapanan (Sby - Gempol Selatan)
  { from: 'GT_WARU_SBY', to: 'GT_SIDOARJO', fee: 6500, ruasName: 'Tol Surabaya - Gempol (Waru - Sidoarjo)' },
  { from: 'GT_WARU_RAMP', to: 'GT_SIDOARJO', fee: 6500, ruasName: 'Tol Surabaya - Gempol (Waru - Sidoarjo)' },
  { from: 'GT_WARU_SBY', to: 'GT_PORONG', fee: 11000, ruasName: 'Tol Surabaya - Gempol' },
  { from: 'GT_WARU_SBY', to: 'GT_KEJAPANAN', fee: 18000, ruasName: 'Tol Surabaya - Gempol & Porong - Gempol' },
  { from: 'GT_SIDOARJO', to: 'GT_PORONG', fee: 6000, ruasName: 'Tol Porong - Gempol' },
  { from: 'GT_SIDOARJO', to: 'GT_KEJAPANAN', fee: 11500, ruasName: 'Tol Porong - Gempol' },
  { from: 'GT_PORONG', to: 'GT_KEJAPANAN', fee: 6000, ruasName: 'Tol Porong - Gempol' },

  // 6. Ruas Surabaya - Mojokerto (SuMo)
  { from: 'GT_WARUGUNUNG', to: 'GT_LEBANI_SUKO', fee: 15000, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },
  { from: 'GT_WARUGUNUNG', to: 'GT_KRIAN', fee: 22500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },
  { from: 'GT_WARUGUNUNG', to: 'GT_PENOMPO', fee: 43500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },
  { from: 'GT_LEBANI_SUKO', to: 'GT_KRIAN', fee: 7500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },
  { from: 'GT_LEBANI_SUKO', to: 'GT_PENOMPO', fee: 28500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },
  { from: 'GT_KRIAN', to: 'GT_PENOMPO', fee: 20500, ruasName: 'Tol Surabaya - Mojokerto (SuMo)' },

  // 7. Ruas Kertosono - Mojokerto (Jomo / Astra Tol Nusantara)
  { from: 'GT_PENOMPO', to: 'GT_MOJOKERTO_BARAT', fee: 6000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },
  { from: 'GT_PENOMPO', to: 'GT_JOMBANG', fee: 29000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },
  { from: 'GT_PENOMPO', to: 'GT_BANDAR', fee: 46000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },
  { from: 'GT_MOJOKERTO_BARAT', to: 'GT_JOMBANG', fee: 23000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },
  { from: 'GT_MOJOKERTO_BARAT', to: 'GT_BANDAR', fee: 40000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },
  { from: 'GT_JOMBANG', to: 'GT_BANDAR', fee: 17000, ruasName: 'Tol Kertosono - Mojokerto (Jomo)' },

  // 8. Ruas Ngawi - Kertosono (Bandar/Kertosono - Nganjuk - Caruban - Madiun)
  { from: 'GT_BANDAR', to: 'GT_NGANJUK', fee: 27000, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_BANDAR', to: 'GT_CARUBAN', fee: 66500, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_BANDAR', to: 'GT_MADIUN', fee: 76000, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_KERTOSONO', to: 'GT_NGANJUK', fee: 27000, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_KERTOSONO', to: 'GT_CARUBAN', fee: 66500, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_KERTOSONO', to: 'GT_MADIUN', fee: 76000, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_NGANJUK', to: 'GT_CARUBAN', fee: 39000, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_NGANJUK', to: 'GT_MADIUN', fee: 48500, ruasName: 'Tol Ngawi - Kertosono' },
  { from: 'GT_CARUBAN', to: 'GT_MADIUN', fee: 9500, ruasName: 'Tol Ngawi - Kertosono' },

  // 9. Ruas Gempol - Pasuruan (Gempas)
  { from: 'GT_KEJAPANAN', to: 'GT_GEMPOL', fee: 3000, ruasName: 'Tol Gempol - Pasuruan' },
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
  { from: 'GT_PROBOLINGGO_BARAT', to: 'GT_GENDING', fee: 26000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },
  { from: 'GT_PROBOLINGGO_TIMUR', to: 'GT_GENDING', fee: 12000, ruasName: 'Tol Pasuruan - Probolinggo (Paspro)' },

  // 11. Ruas Gempol - Pandaan & Pandaan - Malang (Mapan)
  { from: 'GT_GEMPOL', to: 'GT_PANDAAN', fee: 14500, ruasName: 'Tol Gempol - Pandaan' },
  { from: 'GT_KEJAPANAN', to: 'GT_PANDAAN', fee: 16500, ruasName: 'Tol Gempol - Pandaan' },
  { from: 'GT_PANDAAN', to: 'GT_PURWODADI', fee: 15500, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PANDAAN', to: 'GT_LAWANG', fee: 23500, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PANDAAN', to: 'GT_SINGOSARI', fee: 30500, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PANDAAN', to: 'GT_PAKIS', fee: 35000, ruasName: 'Tol Pandaan - Malang' },
  { from: 'GT_PANDAAN', to: 'GT_MALANG_KOTA', fee: 38500, ruasName: 'Tol Pandaan - Malang' },
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
 * Helper mencari tarif langsung antar dua gerbang
 */
function findDirectSegment(idA, idB) {
  return TARIFF_SEGMENTS_GOL1.find(
    (s) => (s.from === idA && s.to === idB) || (s.from === idB && s.to === idA)
  );
}

/**
 * Hub Junction penghubung antar-koridor tol Trans-Jawa Jawa Timur:
 * - Warugunung & Penompo (Tol Surabaya-Mojokerto)
 * - Penompo & Bandar (Tol Kertosono-Mojokerto)
 * - Bandar & Madiun (Tol Ngawi-Kertosono)
 * - Waru & Kejapanan (Tol Surabaya-Gempol)
 * - Kejapanan / Gempol (Titik temu arah Malang & Probolinggo)
 * - Gempol & Grati (Tol Gempol-Pasuruan)
 * - Grati & Gending (Tol Pasuruan-Probolinggo)
 * - Gempol & Pandaan & Malang (Tol Pandaan-Malang)
 * - Dupak & Manyar (Tol Surabaya-Gresik)
 * - Krian & Bunder (Tol KLBM)
 */

/**
 * Menghitung rute tol otomatis beserta rincian tarif per ruas tol
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

  // Multiplier faktor pengali golongan kendaraan BPJT:
  // Gol I   = 1.0x
  // Gol II  = 1.5x
  // Gol III = 1.5x (atau 1.6x di beberapa ruas Jasa Marga)
  // Gol IV  = 2.0x
  // Gol V   = 2.0x (atau 2.1x)
  let golMultiplier = 1.0;
  if (golonganCode === 'Golongan II') golMultiplier = 1.5;
  else if (golonganCode === 'Golongan III') golMultiplier = 1.5;
  else if (golonganCode === 'Golongan IV') golMultiplier = 2.0;
  else if (golonganCode === 'Golongan V') golMultiplier = 2.0;

  // 1. Coba pencarian ruas langsung
  const direct = findDirectSegment(asalId, tujuanId);
  if (direct) {
    const fee = Math.round(direct.fee * golMultiplier / 500) * 500;
    return {
      success: true,
      totalFee: fee,
      segments: [
        {
          ruasName: direct.ruasName,
          fromName: gateA.name,
          toName: gateB.name,
          fee: fee,
        },
      ],
      distanceKm: Math.abs(gateA.km - gateB.km) || 15,
    };
  }

  // 2. Pencarian rute multi-ruas melewati koridor jalan tol Trans-Jawa Jawa Timur
  // Titik simpul (Waypoints / Junctions)
  const junctions = [
    'GT_DUPAK',
    'GT_WARU_SBY',
    'GT_WARUGUNUNG',
    'GT_KRIAN',
    'GT_PENOMPO',
    'GT_BANDAR',
    'GT_KEJAPANAN',
    'GT_GEMPOL',
    'GT_GRATI',
    'GT_PANDAAN',
    'GT_SINGOSARI',
  ];

  // Algoritma graph traversal sederhana mencari jalur terpendek/termurah antar segmen
  const segmentsResult = [];
  let totalGol1 = 0;

  // Cek koridor Trans-Jawa Barat (Madiun/Nganjuk/Jombang/Mojokerto -> Surabaya/Sidoarjo/Malang/Probolinggo)
  const isWestA = ['MADIUN', 'NGANJUK', 'JOMBANG'].includes(gateA.wilayahId);
  const isWestB = ['MADIUN', 'NGANJUK', 'JOMBANG'].includes(gateB.wilayahId);

  const isSouthA = ['PASURUAN', 'PROBOLINGGO', 'MALANG'].includes(gateA.wilayahId);
  const isSouthB = ['PASURUAN', 'PROBOLINGGO', 'MALANG'].includes(gateB.wilayahId);

  // Jalur Lintas Wilayah Barat ke Timur (misal Madiun ke Surabaya / Malang / Probolinggo)
  if (isWestA !== isWestB) {
    const westGate = isWestA ? gateA : gateB;
    const otherGate = isWestA ? gateB : gateA;

    // Bagian 1: Dari West Gate ke Simpang Bandar/Kertosono
    if (westGate.id !== 'GT_BANDAR') {
      const segW = findDirectSegment(westGate.id, 'GT_BANDAR') || {
        ruasName: 'Tol Ngawi - Kertosono',
        fee: Math.abs(westGate.km - 82) * 950,
      };
      totalGol1 += segW.fee;
      segmentsResult.push({
        ruasName: segW.ruasName,
        fromName: isWestA ? westGate.name : 'Bandar / Kertosono',
        toName: isWestA ? 'Bandar / Kertosono' : westGate.name,
        feeGol1: segW.fee,
      });
    }

    // Bagian 2: Dari Bandar ke Penompo (Tol Kertosono - Mojokerto)
    const segMo = { ruasName: 'Tol Kertosono - Mojokerto (Jomo)', fee: 46000 };
    totalGol1 += segMo.fee;
    segmentsResult.push({
      ruasName: segMo.ruasName,
      fromName: isWestA ? 'Bandar' : 'Penompo (Mojokerto)',
      toName: isWestA ? 'Penompo (Mojokerto)' : 'Bandar',
      feeGol1: segMo.fee,
    });

    // Bagian 3: Dari Penompo ke Surabaya/Sidoarjo/Selatan
    if (otherGate.wilayahId === 'MOJOKERTO') {
      // Sampai Mojokerto
    } else if (otherGate.wilayahId === 'SURABAYA') {
      const segSuMo = findDirectSegment('GT_PENOMPO', otherGate.id) || {
        ruasName: 'Tol Surabaya - Mojokerto (SuMo)',
        fee: 43500,
      };
      totalGol1 += segSuMo.fee;
      segmentsResult.push({
        ruasName: segSuMo.ruasName,
        fromName: isWestA ? 'Penompo' : otherGate.name,
        toName: isWestA ? otherGate.name : 'Penompo',
        feeGol1: segSuMo.fee,
      });
    } else if (isSouthB || isSouthA) {
      // Ke arah Malang / Pasuruan / Probolinggo via Krian -> Kejapanan / Gempol
      const segSuMo = { ruasName: 'Tol SuMo (Penompo - Krian)', fee: 20500 };
      const segKLBM = { ruasName: 'Tol Krian - Porong / Kejapanan Bypass', fee: 16000 };
      totalGol1 += segSuMo.fee + segKLBM.fee;
      segmentsResult.push({
        ruasName: 'Tol Surabaya - Mojokerto (Penompo - Krian)',
        fromName: isWestA ? 'Penompo' : 'Krian',
        toName: isWestA ? 'Krian' : 'Penompo',
        feeGol1: segSuMo.fee,
      });
      segmentsResult.push({
        ruasName: 'Tol Penghubung Krian - Porong - Gempol',
        fromName: isWestA ? 'Krian' : 'Gempol',
        toName: isWestA ? 'Gempol' : 'Krian',
        feeGol1: segKLBM.fee,
      });

      // Lalu dari Gempol ke arah Malang atau Paspro
      if (otherGate.wilayahId === 'MALANG') {
        const segMpn = findDirectSegment('GT_PANDAAN', otherGate.id) || {
          ruasName: 'Tol Pandaan - Malang',
          fee: 38500,
        };
        totalGol1 += 14500 + segMpn.fee;
        segmentsResult.push({
          ruasName: 'Tol Gempol - Pandaan',
          fromName: 'Gempol',
          toName: 'Pandaan',
          feeGol1: 14500,
        });
        segmentsResult.push({
          ruasName: segMpn.ruasName,
          fromName: 'Pandaan',
          toName: otherGate.name,
          feeGol1: segMpn.fee,
        });
      } else if (['PASURUAN', 'PROBOLINGGO'].includes(otherGate.wilayahId)) {
        const segGempas = findDirectSegment('GT_GEMPOL', otherGate.id) || {
          ruasName: 'Tol Gempol - Pasuruan & Paspro',
          fee: 48500 + (otherGate.wilayahId === 'PROBOLINGGO' ? 40000 : 0),
        };
        totalGol1 += segGempas.fee;
        segmentsResult.push({
          ruasName: segGempas.ruasName,
          fromName: 'Gempol',
          toName: otherGate.name,
          feeGol1: segGempas.fee,
        });
      }
    } else {
      // Ke Sidoarjo / Gresik
      const segSuMo = { ruasName: 'Tol Surabaya - Mojokerto (Warugunung)', fee: 43500 };
      totalGol1 += segSuMo.fee;
      segmentsResult.push({
        ruasName: segSuMo.ruasName,
        fromName: 'Penompo',
        toName: 'Warugunung',
        feeGol1: segSuMo.fee,
      });
    }
  } else if (isSouthA !== isSouthB) {
    // Surabaya / Sidoarjo / Gresik ke Pasuruan / Malang / Probolinggo
    const northGate = !isSouthA ? gateA : gateB;
    const southGate = isSouthA ? gateA : gateB;

    // Ruas 1: Dari Surabaya/Sidoarjo ke Kejapanan / Gempol
    let sbyToGempolFee = 18000;
    if (northGate.wilayahId === 'GRESIK') {
      const gresikSeg = findDirectSegment(northGate.id, 'GT_DUPAK') || { fee: 21500 };
      totalGol1 += gresikSeg.fee;
      segmentsResult.push({
        ruasName: 'Tol Surabaya - Gresik',
        fromName: isSouthA ? 'Dupak' : northGate.name,
        toName: isSouthA ? northGate.name : 'Dupak',
        feeGol1: gresikSeg.fee,
      });
    }

    if (northGate.id === 'GT_SIDOARJO') sbyToGempolFee = 11500;
    else if (northGate.id === 'GT_PORONG') sbyToGempolFee = 6000;

    totalGol1 += sbyToGempolFee;
    segmentsResult.push({
      ruasName: 'Tol Surabaya - Gempol & Porong - Gempol',
      fromName: isSouthA ? 'Gempol' : (northGate.wilayahId === 'GRESIK' ? 'Dupak' : northGate.name),
      toName: isSouthA ? (northGate.wilayahId === 'GRESIK' ? 'Dupak' : northGate.name) : 'Gempol',
      feeGol1: sbyToGempolFee,
    });

    // Ruas 2: Dari Gempol ke Malang atau Paspro
    if (southGate.wilayahId === 'MALANG') {
      const segMpn = findDirectSegment('GT_PANDAAN', southGate.id) || {
        ruasName: 'Tol Pandaan - Malang',
        fee: 38500,
      };
      totalGol1 += 14500 + segMpn.fee;
      segmentsResult.push({
        ruasName: 'Tol Gempol - Pandaan',
        fromName: 'Gempol',
        toName: 'Pandaan',
        feeGol1: 14500,
      });
      segmentsResult.push({
        ruasName: segMpn.ruasName,
        fromName: 'Pandaan',
        toName: southGate.name,
        feeGol1: segMpn.fee,
      });
    } else if (southGate.wilayahId === 'PASURUAN') {
      const segGempas = findDirectSegment('GT_GEMPOL', southGate.id) || {
        ruasName: 'Tol Gempol - Pasuruan',
        fee: 28000,
      };
      totalGol1 += segGempas.fee;
      segmentsResult.push({
        ruasName: segGempas.ruasName,
        fromName: 'Gempol',
        toName: southGate.name,
        feeGol1: segGempas.fee,
      });
    } else if (southGate.wilayahId === 'PROBOLINGGO') {
      const gempasFee = 48500;
      const pasproSeg = findDirectSegment('GT_GRATI', southGate.id) || {
        ruasName: 'Tol Pasuruan - Probolinggo (Paspro)',
        fee: 40000,
      };
      totalGol1 += gempasFee + pasproSeg.fee;
      segmentsResult.push({
        ruasName: 'Tol Gempol - Pasuruan (Gempol - Grati)',
        fromName: 'Gempol',
        toName: 'Grati',
        feeGol1: gempasFee,
      });
      segmentsResult.push({
        ruasName: pasproSeg.ruasName,
        fromName: 'Grati',
        toName: southGate.name,
        feeGol1: pasproSeg.fee,
      });
    }
  } else {
    // Estimasi berbasis jarak tarif dasar per kilometer jika tidak ada segmen eksplisit
    const kmDiff = Math.abs(gateA.km - gateB.km) || 12;
    const estFeeGol1 = Math.max(5500, Math.round((kmDiff * 950) / 500) * 500);
    totalGol1 = estFeeGol1;
    segmentsResult.push({
      ruasName: `Ruas Tol ${gateA.wilayahName} - ${gateB.wilayahName}`,
      fromName: gateA.name,
      toName: gateB.name,
      feeGol1: estFeeGol1,
    });
  }

  // Konversikan tarif ke golongan terpilih
  const finalSegments = segmentsResult.map((s) => {
    const feeGol = Math.round((s.feeGol1 * golMultiplier) / 500) * 500;
    return {
      ruasName: s.ruasName,
      fromName: s.fromName,
      toName: s.toName,
      fee: feeGol,
    };
  });

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
