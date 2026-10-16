# 💳 Aplikasi Cek Saldo e-Money & e-Toll (React Native + Tailwind CSS)

Aplikasi mobile berbasis **React Native** dengan styling murni **Tailwind CSS (`twrnc`)** dan engine komunikasi **NFC IsoDep (ISO 7816-4 / DESFire)** untuk membaca saldo kartu uang elektronik perbankan Indonesia secara **100% OFFLINE** langsung dari chip kartu fisik tanpa internet, tanpa server perbankan, dan tanpa simulasi gimmick.

Desain antarmuka dibuat presisi mengikuti 3 layar pada gambar referensi:
1. **Screen 1 (Kiri - Payment Options)**: Layar utama bersih dengan ilustrasi koin & kartu bertanda tanya, teks *"Payment methods empty"*, daftar riwayat kartu, dan tombol melayang **FAB ungu (`#5C60F5`)** dengan ikon kartu `[ 💳+ ]`.
2. **Screen 3 (Kanan - Native Scanning Frame)**: Layar pemindai kartu dengan instruksi *"Position your card inside the frame"*, bingkai kartu beranimasi *laser beam scanner* horizontal yang bergerak bolak-balik, progress bar emas, dan listener sensor NFC hardware aktif.
3. **Screen 2 (Tengah - Card Details & Saldo Real)**: Layar hasil pembacaan dengan tumpukan **3D Fanned Cards Deck** (kartu depan tegak navy dengan chip EMV emas, simbol contactless `)))`, nama pemegang, nomor kartu, sensor viewfinder frame), nominal saldo Rupiah terverifikasi dari chip offline, form field *Card Number* & *Name on Card*, logo *Supported Networks*, mutasi e-toll, serta tombol *Continue* ungu melengkung dengan ikon panah.

---

## 🏛️ Dukungan Kartu e-Money / e-Toll Bank Indonesia

Algoritma pemindaian chip offline diadopsi dari riset open-source di GitHub ([`muhakmal/osp-kue-reader`](https://github.com/muhakmal/osp-kue-reader) & [`agusibrahim/prepaidcard_reader`](https://github.com/agusibrahim/prepaidcard_reader)):

| Bank Penerbit | Jenis Kartu | Standar Chip | AID / Perintah APDU Offline | Format Saldo |
| :--- | :--- | :--- | :--- | :--- |
| **Bank Mandiri** | e-Money / Indomaret Card | MIFARE DESFire / ISO 14443-4 | AID `A0 00 00 00 18 30 00 01`<br>APDU: `00 B2 01 04 00` (Rec 1 SFI 4)<br>Fallback: `00 B5 00 00 0A` | 4-Byte Integer Big Endian (offset 12..15) |
| **Bank BCA** | Flazz (Gen 2 & Gen 1) | ISO 14443-4 Contactless | AID `A0 00 00 00 18 0F 00 00 01 80 01`<br>Select File: `00 A4 01 00 02 02 00`<br>Read Balance: `80 32 00 03 04 00 00 00 00` | 3-Byte Integer Big Endian (offset 1..3) |
| **Bank BNI** | TapCash | ISO-DEP | AID `11 22 33 44 55 66`<br>APDU: `90 32 03 00 00` | 3-Byte Integer Big Endian (offset 2..4) |
| **Bank BRI** | BRIZZI | MIFARE DESFire EV1 | Select App: `90 5A 00 00 03 01 00 00 00`<br>Read Value: `90 6C 00 00 01 00 00` | 4-Byte Integer Little Endian (offset 0..3) |
| **Bank DKI** | JakCard | ISO-DEP | AID `31 54 49 43 2E 49 43 41 53 48 30 31 01 01 00`<br>Read Balance: `90 4C 00 00 04` | 4-Byte Integer Big Endian (offset 0..3) |

> 📖 **Dokumentasi Algoritma Lengkap**: Lihat rincian hex biner, status word `90 00`, dan format log transaksi di [ALGORITMA_OFFLINE_NFC.md](file:///Users/erwindwik/.gemini/antigravity-ide/scratch/nfc-emoney-reader/ALGORITMA_OFFLINE_NFC.md).

---

## 📂 Struktur Direktori Proyek

```text
nfc-emoney-reader/
├── src/
│   ├── services/
│   │   ├── apduCommands.js            # Kumpulan AID, konstanta APDU, dan utilitas konversi biner
│   │   └── nfcCardReader.js           # Engine pembaca kartu NFC fisik via IsoDep & APDU logger
│   ├── components/
│   │   ├── FannedCardsDeck.js         # Komponen 3D Fanned Cards Deck (Screen 2)
│   │   ├── CardScannerFrame.js        # Komponen frame scanner kartu & laser animasi (Screen 3)
│   │   ├── PaymentEmptyIllustration.js# Ilustrasi pastel koin $ & kartu tanda tanya (Screen 1)
│   │   └── SupportedNetworks.js       # Badge logo perbankan Indonesia & payment network
│   └── screens/
│       ├── HomeScreen.js              # Screen 1: Payment Options, riwayat kartu, & FAB ungu [💳+]
│       ├── ScanningScreen.js          # Screen 3: Position your card inside frame & listener NFC
│       └── CardDetailsScreen.js       # Screen 2: Kartu 3D, saldo terverifikasi, form field, & APDU log
├── App.js                             # Root React Native component dengan Tailwind CSS (twrnc)
├── package.json                       # Dependencies (react-native-nfc-manager, twrnc, expo-haptics)
├── app.json                           # Konfigurasi nama aplikasi, bundle ID, & permission NFC
├── ALGORITMA_OFFLINE_NFC.md           # Riset komprehensif algoritma GitHub & spesifikasi APDU
└── README.md
```

---

## 🚀 Cara Menjalankan & Memindai Kartu Fisik Nyata

Karena pembacaan chip kartu fisik menggunakan modul native Android (`android.nfc.tech.IsoDep`), Anda dapat menjalankannya dengan langkah berikut:

### 1. Menjalankan di Smartphone Android (Build Langsung / Development Build)
Pastikan HP Android Anda memiliki sensor **NFC** dan sudah dalam keadaan aktif di menu pengaturan.

```bash
# 1. Pastikan dependensi terpasang
npm install

# 2. Jalankan build Android langsung ke HP Anda (via USB debugging / WiFi ADB)
npx expo run:android
```

Saat aplikasi terbuka:
1. Ketuk tombol **⚡ Pindai Kartu e-Money** atau tombol **FAB ungu `[ 💳+ ]`**.
2. Aplikasi akan beralih ke layar **Position your card inside the frame** dan mengaktifkan sensor NFC.
3. Tempelkan kartu fisik e-Money Anda (Mandiri, Flazz, TapCash, atau Brizzi) di bodi belakang HP (di sekitar area kamera/antena NFC).
4. Sensor HP akan bergetar (*haptic feedback*), mengeksekusi rangkaian APDU secara instan, dan menampilkan saldo Rupiah asli beserta nomor kartu di layar **Card Details**.
5. Anda dapat mengetuk tombol **📡 Log APDU** di pojok kanan atas untuk melihat seluruh log transmisi byte mentah (`TX` dan `RX`) yang dikirim dan diterima langsung dari chip kartu.

### 2. Menjalankan di Expo Go (Untuk Pratinjau Desain)
```bash
npx expo start
```
Buka aplikasi **Expo Go** pada smartphone Anda dan pindai QR code. Anda dapat menguji seluruh alur UI, animasi 3D kartu, laser scan, serta opsi uji coba profil kartu Mandiri, Flazz, dan TapCash.
