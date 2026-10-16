import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import CardScannerFrame from '../components/CardScannerFrame';
import { scanRealNfcCard, stopNfcScan, checkNfcAvailability } from '../services/nfcCardReader';

/**
 * Screen 3: Scanning Screen
 * Sesuai persis dengan gambar referensi sebelah kanan.
 * Mengaktifkan sensor NFC smartphone secara langsung,
 * memindai chip IsoDep smartcard e-money/e-toll,
 * mengeksekusi APDU offline, dan menampilkan progress.
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
            setProgress(1.0);
            setStatusText('Kartu berhasil dibaca!');
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

  // Fungsi fallback simulasi pengujian cepat jika diuji di emulator / desktop
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
        themeColor: '#0A1E3F',
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
        bankName: 'BCA Flazz (Gen 2)',
        cardType: 'BCA Flazz Contactless',
        balance: 124500,
        balanceKnown: true,
        cardNumber: '5241 8802 4491 1042',
        rawUid: '04F2E1D0C9B8A7',
        nameOnCard: 'Sarah Smith',
        themeColor: '#003A70',
        accentColor: '#00A859',
        history: [
          { type: 'Payment (e-Toll)', amount: 12500, date: '16/10/2026 09:15' }
        ],
        apduLogs: [
          { desc: 'Select Flazz Gen 2 AID', tx: '00A404000BA0000000180F000001800100', rx: '9000', success: true },
          { desc: 'Select File 0200', tx: '00A40100020200', rx: '9000', success: true },
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
        themeColor: '#B43E00',
        accentColor: '#F97316',
        history: [],
        apduLogs: [
          { desc: 'Select TapCash AID', tx: '00A404000611223344556600', rx: '9000', success: true },
          { desc: 'Read Balance (90 32)', tx: '9032030000', rx: '000000C3509000', success: true }
        ]
      }
    };

    const chosen = mockProfiles[bankKey] || mockProfiles.mandiri;
    setProgress(1.0);
    setStatusText(`Simulasi membaca chip ${chosen.bankName}...`);
    setTimeout(() => {
      onScanSuccess(chosen);
    }, 400);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8F9FE]`}>
      <View style={tw`flex-1 px-6 pt-4 justify-between`}>
        
        {/* Top Navigation Bar: Back & Enter Manually */}
        <View style={tw`flex-row justify-between items-center mb-4`}>
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
          >
            <Text style={tw`text-indigo-600 font-semibold text-sm`}>
              Enter Manually
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title: Position your card inside the frame */}
        <View style={tw`items-center my-2`}>
          <Text style={tw`text-slate-900 text-xl font-bold tracking-tight text-center`}>
            Position your card inside the frame
          </Text>
          <Text style={tw`text-slate-400 text-xs text-center mt-1`}>
            Tempelkan kartu e-money / e-toll tepat di belakang smartphone Anda
          </Text>
        </View>

        {/* Komponen Card Scanner Frame dengan Laser Animasi */}
        <View style={tw`flex-1 justify-center`}>
          <CardScannerFrame
            statusText={statusText}
            progress={progress}
            isScanning={isScanning}
          />

          {/* Alert Peringatan jika NFC Belum Aktif / Error */}
          {nfcError && (
            <View style={tw`bg-amber-50 border border-amber-200 p-3 rounded-xl mx-4 mt-2`}>
              <Text style={tw`text-amber-800 font-bold text-xs`}>
                ⚠️ Info Sensor NFC:
              </Text>
              <Text style={tw`text-amber-700 text-[11px] mt-0.5`}>
                {nfcError}
              </Text>
            </View>
          )}

          {/* Opsi Uji Coba Cepat (Simulator & Debug Testing) */}
          <View style={tw`mt-4 items-center`}>
            <Text style={tw`text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-2`}>
              Uji Coba Profil Kartu (Simulator Test)
            </Text>
            <View style={tw`flex-row gap-2`}>
              <TouchableOpacity
                onPress={() => triggerSimulationCard('mandiri')}
                style={tw`bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm`}
              >
                <Text style={tw`text-[11px] font-bold text-slate-700`}>Mandiri</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => triggerSimulationCard('flazz')}
                style={tw`bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm`}
              >
                <Text style={tw`text-[11px] font-bold text-slate-700`}>BCA Flazz</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => triggerSimulationCard('tapcash')}
                style={tw`bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm`}
              >
                <Text style={tw`text-[11px] font-bold text-slate-700`}>TapCash</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Bar: Continue Button */}
        <View style={tw`pb-6 pt-2`}>
          <TouchableOpacity
            onPress={() => {
              if (progress >= 0.8) {
                // Selesai
              } else {
                triggerSimulationCard('mandiri');
              }
            }}
            style={[
              tw`w-full py-4 rounded-2xl flex-row items-center justify-center shadow-md`,
              {
                backgroundColor: '#5C60F5',
                shadowColor: '#5C60F5',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
                elevation: 6,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white font-bold text-base mr-3`}>
              Continue
            </Text>
            <View style={tw`w-6 h-6 rounded-full bg-white/20 items-center justify-center`}>
              <Text style={tw`text-white font-bold text-xs`}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
