import React, { useState } from 'react';
import { StatusBar, Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';

import HomeScreen from './src/screens/HomeScreen';
import ScanningScreen from './src/screens/ScanningScreen';
import CardDetailsScreen from './src/screens/CardDetailsScreen';

export default function App() {
  // Layar aktif: 'home' (Screen 1) | 'scanning' (Screen 3) | 'card_details' (Screen 2)
  const [currentScreen, setCurrentScreen] = useState('home');
  const [scannedCards, setScannedCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  // Modal Enter Manually
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [manualCardNumber, setManualCardNumber] = useState('');
  const [manualCardName, setManualCardName] = useState('');
  const [manualBank, setManualBank] = useState('Mandiri e-Money');

  // Trigger feedback getar (Haptics)
  const triggerHaptic = (type = 'success') => {
    try {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'light') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (e) {}
  };

  // Handler saat kartu fisik NFC berhasil dibaca
  const handleScanSuccess = (cardResult) => {
    triggerHaptic('success');
    setActiveCard(cardResult);
    // Simpan ke daftar riwayat kartu
    setScannedCards((prev) => {
      const filtered = prev.filter((c) => c.cardNumber !== cardResult.cardNumber);
      return [cardResult, ...filtered];
    });
    setCurrentScreen('card_details');
  };

  // Handler saat kartu dipilih dari daftar riwayat
  const handleSelectSavedCard = (card) => {
    triggerHaptic('light');
    setActiveCard(card);
    setCurrentScreen('card_details');
  };

  // Simpan input manual
  const handleSaveManual = () => {
    if (!manualCardNumber.trim()) {
      Alert.alert('Perhatian', 'Harap masukkan nomor kartu e-money.');
      return;
    }
    const cleanNum = manualCardNumber.replace(/\s+/g, '');
    const formatted = cleanNum.replace(/(.{4})/g, '$1 ').trim();

    const manualData = {
      success: true,
      isRealCard: false,
      bankName: manualBank,
      cardType: `${manualBank} (Input Manual)`,
      balance: 50000,
      balanceKnown: true,
      cardNumber: formatted,
      rawUid: 'MANUAL_ENTRY',
      nameOnCard: manualCardName || '',
      themeColor: manualBank.includes('BCA') ? '#003A70' : manualBank.includes('BNI') ? '#B43E00' : '#0A1E3F',
      accentColor: '#6366F1',
      history: [],
      apduLogs: [
        { desc: 'Input Manual Pengguna', tx: 'MANUAL_ENTRY', rx: formatted, success: true }
      ]
    };

    setManualModalVisible(false);
    handleScanSuccess(manualData);
  };

  return (
    <SafeAreaProvider>
      <View style={tw`flex-1 bg-[#F8F9FE]`}>
        <ExpoStatusBar style="dark" />
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />

      {/* Screen 1: Payment Options (Home Screen) */}
      {currentScreen === 'home' && (
        <HomeScreen
          onStartScan={() => {
            triggerHaptic('light');
            setCurrentScreen('scanning');
          }}
          onSelectSavedCard={handleSelectSavedCard}
          scannedCards={scannedCards}
        />
      )}

      {/* Screen 3: Scanning Screen (Position your card inside the frame) */}
      {currentScreen === 'scanning' && (
        <ScanningScreen
          onBack={() => {
            triggerHaptic('light');
            setCurrentScreen('home');
          }}
          onScanSuccess={handleScanSuccess}
          onEnterManually={() => setManualModalVisible(true)}
        />
      )}

      {/* Screen 2: Card Details (3D Fanned Deck & Verified Balance) */}
      {currentScreen === 'card_details' && (
        <CardDetailsScreen
          cardData={activeCard}
          onBack={() => {
            triggerHaptic('light');
            setCurrentScreen('home');
          }}
          onScanAnother={() => {
            triggerHaptic('light');
            setCurrentScreen('scanning');
          }}
        />
      )}

      {/* Modal Input Manual (Enter Manually) */}
      <Modal
        visible={manualModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setManualModalVisible(false)}
      >
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl p-6 shadow-xl`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-slate-900 font-extrabold text-lg`}>
                Enter Card Manually
              </Text>
              <TouchableOpacity onPress={() => setManualModalVisible(false)}>
                <Text style={tw`text-slate-400 font-bold text-lg`}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Input Bank Penerbit */}
            <Text style={tw`text-slate-500 text-xs font-semibold mb-1.5`}>Pilih Bank</Text>
            <View style={tw`flex-row gap-2 mb-4`}>
              {['Mandiri e-Money', 'BCA Flazz', 'BNI TapCash'].map((b) => (
                <TouchableOpacity
                  key={b}
                  onPress={() => setManualBank(b)}
                  style={[
                    tw`flex-1 py-2 rounded-xl border items-center`,
                    manualBank === b
                      ? tw`bg-indigo-50 border-indigo-500`
                      : tw`bg-slate-50 border-slate-200`,
                  ]}
                >
                  <Text
                    style={[
                      tw`text-xs font-bold`,
                      manualBank === b ? tw`text-indigo-600` : tw`text-slate-600`,
                    ]}
                  >
                    {b.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Input Card Number */}
            <Text style={tw`text-slate-500 text-xs font-semibold mb-1.5`}>Card Number</Text>
            <TextInput
              value={manualCardNumber}
              onChangeText={setManualCardNumber}
              placeholder="6032 0182 9381 8192"
              keyboardType="numeric"
              style={tw`bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-slate-800 font-bold text-sm mb-4 tracking-wider`}
            />

            {/* Input Name on Card */}
            <Text style={tw`text-slate-500 text-xs font-semibold mb-1.5`}>Name on Card</Text>
            <TextInput
              value={manualCardName}
              onChangeText={setManualCardName}
              placeholder="Nama Pemilik (Opsional)"
              style={tw`bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-slate-800 font-semibold text-sm mb-6`}
            />

            {/* Action Button */}
            <TouchableOpacity
              onPress={handleSaveManual}
              style={[
                tw`w-full py-4 rounded-2xl items-center shadow-md`,
                { backgroundColor: '#5C60F5' },
              ]}
              activeOpacity={0.8}
            >
              <Text style={tw`text-white font-bold text-base`}>
                Simpan & Cek Saldo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      </View>
    </SafeAreaProvider>
  );
}
