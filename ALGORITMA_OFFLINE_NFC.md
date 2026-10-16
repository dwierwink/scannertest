# 📡 Algoritma & Library Pembaca Saldo Kartu e-Money Indonesia (100% OFFLINE)

Dokumentasi teknis lengkap mengenai algoritma dan pustaka open-source di **GitHub** untuk membaca saldo fisik kartu uang elektronik Indonesia (**Mandiri e-Money, BCA Flazz, BNI TapCash, BRI Brizzi, dan Bank DKI JakCard**) secara **100% OFFLINE** menggunakan teknologi NFC (*Near Field Communication*) tanpa koneksi internet, tanpa server perbankan, dan tanpa simulasi gimmick.

---

## 📚 Repositori Open-Source Terverifikasi di GitHub

Berdasarkan audit mendalam terhadap repositori open-source:

| Repositori GitHub | Lisensi | Bahasa / Platform | Ringkasan Fitur & Dukungan Kartu |
| :--- | :--- | :--- | :--- |
| **[`muhakmal/osp-kue-reader`](https://github.com/muhakmal/osp-kue-reader)** | **Apache-2.0** | Kotlin / Android IsoDep | **Paling Akurat & Komprehensif**. Mengimplementasikan pembacaan saldo & riwayat mutasi offline lengkap untuk Mandiri e-Money, BCA Flazz (Gen 1 & Gen 2), BNI TapCash, BRI Brizzi, Bank DKI JakCard, dan KMT KAI Commuter. |
| **[`agusibrahim/prepaidcard_reader`](https://github.com/agusibrahim/prepaidcard_reader)** | Open-source | Java / Flutter (Android) | Implementasi native Android `IsoDep` untuk query APDU, ekstraksi nomor kartu, UID, dan parsing saldo kartu prabayar bank Indonesia. |
| **[`haonlabs/CheckSaldo`](https://github.com/haonlabs/CheckSaldo)** | Open-source | Kotlin (Android) | Implementasi pembacaan saldo smartcard e-money menggunakan sensor NFC Android. |

---

## ⚡ Mengapa Pembacaan Saldo Bisa Berjalan 100% OFFLINE?

Kartu uang elektronik di Indonesia adalah **Stored-Value Smart Cards** berbasis standar internasional **ISO/IEC 14443-4** (*Contactless Smart Card Operating System* / *IsoDep*).
1. **Nilai Saldo Tersimpan di Chip Fisik**: Saldo uang elektronik dicatat langsung di dalam memori non-volatile (*EEPROM / Flash*) yang ada pada chip fisik kartu, bukan ditarik dari server database online perbankan.
2. **Daya Induksi RF Field**: Saat kartu ditempelkan ke antena NFC di belakang smartphone, medan elektromagnetik 13.56 MHz memberi daya listrik secara induktif ke chip kartu.
3. **Komunikasi Biner APDU**: Smartphone mengirimkan perintah biner **APDU (*Application Protocol Data Unit*)** standar ISO 7816-4 / DESFire, dan chip kartu membalas dengan status data biner seketika tanpa membutuhkan internet atau sinyal seluler.

---

## 🛠️ Rincian Protokol & Algoritma APDU per Bank Penerbit

### 1. 🏦 Bank Mandiri e-Money / Indomaret Card
- **Standar Chip**: MIFARE DESFire EV1/EV2 / SmartMX (ISO/IEC 14443-4)
- **Application Identifier (AID)**:
  - Standard AID: `A0 00 00 00 18 30 00 01`
  - Fallback AID: `00 00 00 00 00 00 00 01`
- **Urutan Perintah APDU**:
  1. **Select Applet**:
     ```text
     TX: 00 A4 04 00 08 A0 00 00 00 18 30 00 01 00
     RX: 90 00 (SW_OK)
     ```
  2. **Read Balance Record 1 SFI 4**:
     ```text
     TX: 00 B2 01 04 00
     RX: [Payload Data 16+ Bytes ...] 90 00
     ```
     *Ekstraksi Saldo*: Byte indeks **12 s.d. 15** (4-byte integer format **Big Endian**).
  3. **Fallback Direct Balance** (Jika Rec 1 gagal):
     ```text
     TX: 00 B5 00 00 0A
     RX: [4-byte Little Endian ...] 90 00
     ```
  4. **Read History Log** (Mutasi e-Toll):
     ```text
     TX: 00 D1 [index 0..31] 00 00
     RX: [24-byte Record ...] 90 00
     ```

---

### 2. 🏦 Bank Central Asia (BCA Flazz - Gen 1 & Gen 2)
- **Standar Chip**: ISO/IEC 14443-4 Contactless Smart Card
- **Application Identifier (AID)**:
  - Flazz Gen 2 AID: `A0 00 00 00 18 0F 00 00 01 80 01` (11 Bytes)
  - Flazz Gen 1 AID: `A0 00 00 00 03 86 98 07 01`
- **Urutan Perintah APDU (Flazz Gen 2)**:
  1. **Select Gen 2 Applet**:
     ```text
     TX: 00 A4 04 00 0B A0 00 00 00 18 0F 00 00 01 80 01 00
     RX: 90 00
     ```
  2. **Select Application File 0200**:
     ```text
     TX: 00 A4 01 00 02 02 00
     RX: 90 00
     ```
  3. **Read Binary Block 81**:
     ```text
     TX: 00 B0 81 00 8E
     RX: [Binary Data] 90 00
     ```
  4. **Get Balance Command**:
     ```text
     TX: 80 32 00 03 04 00 00 00 00
     RX: [Status Byte] [Byte1] [Byte2] [Byte3] 90 00
     ```
     *Ekstraksi Saldo*: Byte indeks **1, 2, dan 3** (3-byte integer format **Big Endian**).
     Contoh: `RX: 00 01 E6 54 90 00` -> `0x01E654` = **Rp 124.500**.
  5. **Read History Log**:
     ```text
     TX: 00 00 40 0B 00 00 04 02 00 00
     TX: 00 B0 84 [offset] 3C  (dan 00 B0 85 [offset] 3C)
     ```

---

### 3. 🏦 Bank Negara Indonesia (BNI TapCash)
- **Standar Chip**: ISO-DEP (ISO/IEC 14443-4)
- **AID**: `11 22 33 44 55 66` (6 Bytes)
- **Urutan Perintah APDU**:
  1. **Select TapCash AID**:
     ```text
     TX: 00 A4 04 00 06 11 22 33 44 55 66 00
     RX: 90 00
     ```
  2. **Read Balance Command**:
     ```text
     TX: 90 32 03 00 00
     RX: [Status] [Byte1] [Byte2] [Byte3] 90 00
     ```
     *Ekstraksi Saldo*: Byte indeks **2, 3, dan 4** (3-byte integer format **Big Endian**).
     Contoh: `RX: 00 00 C3 50 90 00` -> `0x00C350` = **Rp 50.000**.
  3. **Read History Log**:
     ```text
     TX: 90 32 01 00 01 [index 1..10] 00
     RX: [16 Bytes Record Data] 90 00
     ```

---

### 4. 🏦 Bank Rakyat Indonesia (BRI Brizzi)
- **Standar Chip**: MIFARE DESFire EV1 (ISO-DEP)
- **Urutan Perintah APDU**:
  1. **DESFire Select Application ID `0x000001`**:
     ```text
     TX: 90 5A 00 00 03 01 00 00 00
     RX: 91 00 (DESFire Success) atau 90 00
     ```
  2. **DESFire Read Value File 0**:
     ```text
     TX: 90 6C 00 00 01 00 00
     RX: [4 Bytes Little Endian] 91 00
     ```
     *Ekstraksi Saldo*: Byte indeks **0 s.d. 3** format **Little Endian**.
  3. **Read History Log**:
     ```text
     TX: 90 BB 00 00 07 01 00 00 00 00 00 00 00
     TX: 90 AF 00 00 00  (Lanjutan record log jika status 91 AF)
     ```

---

### 5. 🏦 Bank DKI (JakCard)
- **Standar Chip**: ISO/IEC 14443-4 (IsoDep)
- **AID**: `31 54 49 43 2E 49 43 41 53 48 30 31 01 01 00` ("1TIC.ICASH01..")
- **Urutan Perintah APDU**:
  1. **Select JakCard AID**:
     ```text
     TX: 00 A4 04 00 0E 31 54 49 43 2E 49 43 41 53 48 30 31 01 01 00
     RX: 90 00
     ```
  2. **Read Balance**:
     ```text
     TX: 90 4C 00 00 04
     RX: [4 Bytes Big Endian Saldo] 90 00
     ```

---

## 📱 Implementasi di React Native & Tailwind CSS

Struktur arsitektur kode di direktori aplikasi:
- `src/services/apduCommands.js`: Definisi konstanta AID, helper konversi biner/hex, dan formula perintah APDU per bank.
- `src/services/nfcCardReader.js`: Engine pembaca kartu NFC fisik via `react-native-nfc-manager` (`NfcTech.IsoDep`) dengan fallback otomatis ke seluruh bank di Indonesia.
- `src/components/FannedCardsDeck.js`: Komponen 3D fanned cards (Screen 2 referensi).
- `src/components/CardScannerFrame.js`: Komponen scanner frame kartu horizontal dengan laser beam animasi & progress bar (Screen 3 referensi).
- `src/components/PaymentEmptyIllustration.js`: Ilustrasi pastel koin & tanda tanya (Screen 1 referensi).
- `src/components/SupportedNetworks.js`: Badge logo Mastercard, Visa, BCA, Mandiri, BNI, BRI.
- `src/screens/HomeScreen.js`: Layar 1 - Payment Options & Tombol FAB ungu `[ 💳+ ]`.
- `src/screens/ScanningScreen.js`: Layar 3 - Posisi kartu dalam frame dengan scanner laser & trigger NFC real-time.
- `src/screens/CardDetailsScreen.js`: Layar 2 - Hasil pembacaan saldo offline, nomor kartu, mutasi, dan log detail APDU.
- `App.js`: Root React Native aplikasi dengan navigasi mulus dan styling murni Tailwind CSS via `twrnc`.
