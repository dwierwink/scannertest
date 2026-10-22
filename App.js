import React, { useState } from 'react';
import { StatusBar, Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import tw from 'twrnc';

import HomeScreen from './src/screens/HomeScreen';
import ScanningScreen from './src/screens/ScanningScreen';
import CardDetailsScreen from './src/screens/CardDetailsScreen';
import TollCalculatorScreen from './src/screens/TollCalculatorScreen';

export default function App() {
  // Layar aktif: 'home' (Screen 1) | 'scanning' (Screen 3) | 'card_details' (Screen 2)
  const [currentScreen, setCurrentScreen] = useState('home');
  const [scannedCards, setScannedCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

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
          onOpenTollCalculator={() => {
            triggerHaptic('light');
            setCurrentScreen('toll_calculator');
          }}
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
          onOpenTollCalculator={() => {
            triggerHaptic('light');
            setCurrentScreen('toll_calculator');
          }}
        />
      )}

      {/* Screen 4: Kalkulator Tarif Tol Jawa Timur */}
      {currentScreen === 'toll_calculator' && (
        <TollCalculatorScreen
          onBack={() => {
            triggerHaptic('light');
            setCurrentScreen('home');
          }}
          cardBalance={activeCard?.balance ?? null}
        />
      )}

      </View>
    </SafeAreaProvider>
  );
}
