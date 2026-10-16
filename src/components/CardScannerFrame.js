import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet, Dimensions } from 'react-native';
import tw from 'twrnc';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Komponen Card Scanner Frame (Sesuai Referensi Layar Kanan / Screen 3)
 * Menampilkan frame kartu gelap, preview kartu horizontal dengan nama, nomor, tanggal,
 * laser scanner beam animasi, teks "Scanning ...", dan progress bar emas/oranye.
 */
export default function CardScannerFrame({
  statusText = 'Scanning ...',
  progress = 0, // 0..1
  cardholderName = 'Sarah Smith',
  expiryDate = '01/22',
  cardNumber = '4747  4747  4747  4747',
  isScanning = true,
}) {
  // Animasi Laser Scanner bergerak bolak-balik dari kiri ke kanan
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isScanning]);

  const cardWidth = Math.min(SCREEN_WIDTH - 64, 320);
  const cardHeight = cardWidth * 0.62;

  const translateX = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-cardWidth * 0.4, cardWidth * 0.4],
  });

  return (
    <View style={tw`items-center justify-center my-6`}>
      {/* Container Outer Frame Kartu dengan Border Halus */}
      <View
        style={[
          styles.scannerCardContainer,
          {
            width: cardWidth,
            height: cardHeight,
          },
        ]}
      >
        {/* Glow Latar Belakang Kartu Gradien Gelap */}
        <View style={StyleSheet.absoluteFillObject}>
          <View style={[styles.cardBackgroundGradient]} />
        </View>

        {/* Laser Scanner Beam Vertikal Menyala yang Bergerak */}
        {isScanning && (
          <Animated.View
            style={[
              styles.laserBeam,
              {
                height: cardHeight,
                transform: [{ translateX }],
              },
            ]}
          />
        )}

        {/* Konten Kartu di Dalam Frame */}
        <View style={tw`flex-1 p-5 justify-between relative z-10`}>
          {/* Header Kartu: Dua Lingkaran Beririsan Merah & Biru */}
          <View style={tw`flex-row justify-end items-center`}>
            <View
              style={[
                tw`rounded-full`,
                {
                  width: 28,
                  height: 28,
                  backgroundColor: '#EB001B',
                  marginRight: -12,
                  opacity: 0.95,
                },
              ]}
            />
            <View
              style={[
                tw`rounded-full`,
                {
                  width: 28,
                  height: 28,
                  backgroundColor: '#00A3FF',
                  opacity: 0.9,
                },
              ]}
            />
          </View>

          {/* Footer Kartu: Nama, Tanggal Kadaluarsa, dan Nomor Kartu */}
          <View>
            <View style={tw`flex-row justify-between items-center mb-1`}>
              <Text style={tw`text-white/60 text-[10px] font-medium`}>
                {cardholderName}
              </Text>
              <Text style={tw`text-white/60 text-[10px] font-medium`}>
                {expiryDate}
              </Text>
            </View>
            <Text style={tw`text-white font-bold tracking-widest text-sm`}>
              {cardNumber}
            </Text>
          </View>
        </View>
      </View>

      {/* Status Teks Animasi "Scanning ..." */}
      <View style={tw`mt-8 items-center`}>
        <Text style={tw`text-slate-600 font-medium text-sm tracking-wide`}>
          {statusText}
        </Text>

        {/* Progress Bar Tipis Oranye/Emas Sesuai Referensi */}
        <View
          style={[
            tw`h-1 bg-slate-200 rounded-full overflow-hidden mt-3`,
            { width: 180 },
          ]}
        >
          <View
            style={[
              tw`h-full bg-amber-500 rounded-full`,
              {
                width: `${Math.min(100, Math.max(5, progress * 100))}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scannerCardContainer: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: '#0A1224',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  cardBackgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0C162D',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 24,
  },
  laserBeam: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderLeftWidth: 2,
    borderLeftColor: '#818CF8',
    borderRightWidth: 2,
    borderRightColor: '#818CF8',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    zIndex: 5,
  },
});
