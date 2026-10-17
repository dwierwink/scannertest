import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import CardScannerFrame from '../components/CardScannerFrame';
import { scanRealNfcCard, stopNfcScan, checkNfcAvailability } from '../services/nfcCardReader';

/**
 * Screen 3: Scanning Screen Responsif Anti-Terpotong
 * Mengaktifkan sensor NFC smartphone secara langsung,
 * memindai chip IsoDep smartcard e-money/e-toll,
 * mengeksekusi APDU offline, dan menampilkan visual kartu sesuai bank yang di-tap.
 */
export default function ScanningScreen({
  onBack,
  onScanSuccess,
  onEnterManually,
}) {
  const [statusText, setStatusText] = useState('Mendengarkan sensor NFC...');
  const [progress, setProgress] = useState(0.15);
  const [isScanning, setIsScanning] = useState(true);
  const [nfcError, setNfcError] = useState(null);
  const [activeBankPreview, setActiveBankPreview] = useState('');

  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const isCompact = screenHeight < 720;

  useEffect(() => {
    let isMounted = true;

    async function initAndScan() {
      // 1. Cek Ketersediaan NFC
      const check = await checkNfcAvailability();
      if (!check.supported && isMounted) {
        setNfcError('Perangkat tidak mendeteksi sensor hardware NFC.');
        setStatusText('Sensor NFC tidak tersedia pada perangkat ini');
      } else if (!check.enabled && isMounted) {
        setNfcError('NFC dinonaktifkan. Silakan aktifkan NFC di Pengaturan HP Anda.');
        setStatusText('Aktifkan NFC di Pengaturan HP');
      }

      // 2. Mulai Pemindaian Kartu Fisik
      if (check.supported && check.enabled) {
        setStatusText('Tempelkan kartu e-money di belakang HP Anda...');
        setProgress(0.3);

        const result = await scanRealNfcCard({
          onStatusChange: (status) => {
            if (isMounted) setStatusText(status);
          },
          onProgress: (p) => {
            if (isMounted) setProgress(p);
          },
        });

        if (isMounted) {
          if (result.success) {
            setActiveBankPreview(result.bankName || '');
            setProgress(1.0);
            setStatusText(`Kartu ${result.bankName || 'e-money'} berhasil dibaca!`);
            setTimeout(() => {
              onScanSuccess(result);
            }, 600);
          } else {
            setStatusText(result.error || 'Gagal membaca kartu e-money');
          }
        }
      }
    }

    initAndScan();

    return () => {
      isMounted = false;
      stopNfcScan();
    };
  }, []);

  // Simulator pengujian cepat untuk semua kartu bank e-money
  const triggerSimulationCard = (bankKey) => {
    const mockProfiles = {
      mandiri: {
        success: true,
        isRealCard: false,
        bankName: 'Mandiri e-Money',
        cardType: 'Mandiri e-Money (ISO-DEP)',
        balance: 85000,
        balanceKnown: true,
        cardNumber: '6032 0182 9381 8192',
        rawUid: '04A1B2C3D4E5F6',
        nameOnCard: 'Sarah Smith',
        themeColor: '#041B37',
        accentColor: '#F59E0B',
        history: [
          { type: 'Payment (e-Toll)', amount: 17000, date: '16/10/2026 11:20' },
          { type: 'Top Up', amount: 100000, date: '15/10/2026 08:45' }
        ],
        apduLogs: [
          { desc: 'NFC Connect', tx: 'NFC_POLL', rx: 'UID: 04A1B2C3D4E5F6', success: true },
          { desc: 'Select Mandiri AID', tx: '00A4040008A00000001830000100', rx: '9000', success: true },
          { desc: 'Read Rec 1 SFI 4', tx: '00B2010400', rx: '00000000000000000000000000014C509000', success: true }
        ]
      },
      flazz: {
        success: true,
        isRealCard: false,
        bankName: 'BCA Flazz',
        cardType: 'BCA Flazz Contactless (Gen 2)',
        balance: 124500,
        balanceKnown: true,
        cardNumber: '5241 8802 4491 1042',
        rawUid: '04F2E1D0C9B8A7',
        nameOnCard: 'Sarah Smith',
        themeColor: '#003A70',
        accentColor: '#00D2FF',
        history: [
          { type: 'Payment (e-Toll)', amount: 12500, date: '16/10/2026 09:15' }
        ],
        apduLogs: [
          { desc: 'Select Flazz AID', tx: '00A404000BA0000000180F000001800100', rx: '9000', success: true },
          { desc: 'Get Balance (80 32)', tx: '803200030400000000', rx: '0001E6549000', success: true }
        ]
      },
      tapcash: {
        success: true,
        isRealCard: false,
        bankName: 'BNI TapCash',
        cardType: 'BNI TapCash (ISO-DEP)',
        balance: 50000,
        balanceKnown: true,
        cardNumber: '7001 5521 8932 4409',
        rawUid: '0489ABCDEF1234',
        nameOnCard: 'Sarah Smith',
        themeColor: '#053C3F',
        accentColor: '#F97316',
        history: [],
        apduLogs: [
          { desc: 'Select TapCash AID', tx: '00A404000611223344556600', rx: '9000', success: true },
          { desc: 'Read Balance (90 32)', tx: '9032030000', rx: '000000C3509000', success: true }
        ]
      },
      brizzi: {
        success: true,
        isRealCard: false,
        bankName: 'BRI Brizzi',
        cardType: 'BRI BRIZZI (ISO-DEP)',
        balance: 62000,
        balanceKnown: true,
        cardNumber: '5379 1290 8472 6120',
        rawUid: '04C89123847219',
        nameOnCard: 'Sarah Smith',
        themeColor: '#003366',
        accentColor: '#FF6600',
        history: [
          { type: 'Payment (e-Toll)', amount: 15000, date: '16/10/2026 14:10' }
        ],
        apduLogs: [
          { desc: 'Select BRIZZI AID', tx: '00A4040008A00000001830000100', rx: '9000', success: true },
          { desc: 'Read Balance (90 6C)', tx: '906C000000', rx: '0000F2309000', success: true }
        ]
      },
      jakcard: {
        success: true,
        isRealCard: false,
        bankName: 'Bank DKI JakCard',
        cardType: 'Bank DKI JakCard (ISO-DEP)',
        balance: 45000,
        balanceKnown: true,
        cardNumber: '1010 4920 3810 5920',
        rawUid: '04A99120349182',
        nameOnCard: 'Sarah Smith',
        themeColor: '#7F1D1D',
        accentColor: '#F59E0B',
        history: [],
        apduLogs: [
          { desc: 'Select JakCard AID', tx: '00A4040007A000000018300001', rx: '9000', success: true }
        ]
      }
    };

    const chosen = mockProfiles[bankKey] || mockProfiles.mandiri;
    setActiveBankPreview(chosen.bankName);
    setProgress(1.0);
    setStatusText(`Membaca chip ${chosen.bankName}...`);
    setTimeout(() => {
      onScanSuccess(chosen);
    }, 450);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8F9FE]`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={[
          tw`px-6 justify-between flex-grow`,
          {
            paddingTop: Math.max(insets.top, 8),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Navigation Bar: Back & Enter Manually */}
        <View style={tw`flex-row justify-between items-center mb-3`}>
          <TouchableOpacity
            onPress={onBack}
            style={tw`w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm border border-slate-100`}
            activeOpacity={0.7}
          >
            <Text style={tw`text-slate-700 text-lg font-bold`}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onEnterManually}
            activeOpacity={0.7}
            style={tw`py-1.5 px-3 rounded-full bg-indigo-50 border border-indigo-100`}
          >
            <Text style={tw`text-indigo-600 font-bold text-xs`}>
              Enter Manually
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title: Position your card inside the frame */}
        <View style={tw`items-center my-1`}>
          <Text style={[tw`text-slate-900 font-extrabold tracking-tight text-center`, { fontSize: isCompact ? 18 : 21 }]}>
            Position your card inside the frame
          </Text>
          <Text style={tw`text-slate-500 text-xs text-center mt-1 px-4`}>
            Tempelkan kartu e-money / e-toll tepat di belakang smartphone Anda
          </Text>
        </View>

        {/* Komponen Card Scanner Frame dengan Laser Animasi dan Gambar Kartu Otentik */}
        <View style={tw`justify-center items-center my-2`}>
          <CardScannerFrame
            statusText={statusText}
            progress={progress}
            isScanning={isScanning}
            bankName={activeBankPreview}
          />

          {/* Alert Peringatan jika NFC Belum Aktif / Error */}
          {nfcError && (
            <View style={tw`bg-amber-50 border border-amber-200 p-2.5 rounded-xl mx-2 mt-2 w-full max-w-sm`}>
              <Text style={tw`text-amber-800 font-bold text-xs`}>
                ⚠️ Info Sensor NFC:
              </Text>
              <Text style={tw`text-amber-700 text-[11px] mt-0.5`}>
                {nfcError}
              </Text>
            </View>
          )}

          {/* Opsi Uji Coba Cepat Semua Kartu Bank (Simulator Test) */}
          <View style={[tw`items-center w-full max-w-sm`, { marginTop: isCompact ? 8 : 12 }]}>
            <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2`}>
              Simulasi Cepat Kartu Bank:
            </Text>
            <View style={tw`flex-row flex-wrap justify-center gap-1.5`}>
              {[
                { id: 'mandiri', label: 'Mandiri' },
                { id: 'flazz', label: 'Flazz' },
                { id: 'tapcash', label: 'TapCash' },
                { id: 'brizzi', label: 'Brizzi' },
                { id: 'jakcard', label: 'JakCard' },
              ].map((b) => (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => triggerSimulationCard(b.id)}
                  style={tw`bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm active:bg-slate-50`}
                >
                  <Text style={tw`text-[11px] font-bold text-slate-700`}>{b.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Bottom Bar: Continue Button */}
        <View style={{ paddingTop: isCompact ? 6 : 10, paddingBottom: 4 }}>
          <TouchableOpacity
            onPress={() => {
              if (progress >= 0.8) {
                // Selesai
              } else {
                triggerSimulationCard('mandiri');
              }
            }}
            style={[
              tw`w-full py-3.5 rounded-2xl flex-row items-center justify-center shadow-md`,
              {
                backgroundColor: '#5C60F5',
                shadowColor: '#5C60F5',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white font-bold text-base mr-2`}>
              Continue
            </Text>
            <View style={tw`w-6 h-6 rounded-full bg-white/20 items-center justify-center`}>
              <Text style={tw`text-white font-bold text-xs`}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer Attribution Pribadi */}
        <View style={tw`items-center mt-2.5 mb-1`}>
          <Text
            style={{
              fontFamily: 'Arial',
              fontStyle: 'italic',
              fontSize: 10.5,
              color: '#94A3B8',
              textAlign: 'center',
            }}
          >
            Dibuat dan digunakan secara pribadi oleh Erwin Dwi K
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
