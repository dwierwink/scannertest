import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import tw from 'twrnc';

/**
 * Komponen Card Scanner Frame Responsif & Otentik Bank
 * Menampilkan frame kartu horizontal dengan identitas visual bank yang terdeteksi/dipindai:
 * - Mandiri e-Money, BCA Flazz, BNI TapCash, BRI Brizzi, Bank DKI JakCard
 * - Laser scanner beam bergerak bolak-balik
 * - Progress bar tipis animasi
 * - Auto-scale responsif agar tidak pernah terpotong di layar HP Android mana pun
 */
export default function CardScannerFrame({
  statusText = 'Scanning ...',
  progress = 0, // 0..1
  cardholderName = 'Sarah Smith',
  expiryDate = '01/22',
  cardNumber = '4747  4747  4747  4747',
  isScanning = true,
  bankName = '',
}) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

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

  // Responsif dimensi: hitung ukuran kartu berdasarkan lebar & tinggi layar HP
  const isCompact = screenHeight < 720;
  const maxCardWidth = isCompact ? 280 : 310;
  const cardWidth = Math.min(screenWidth - 56, maxCardWidth);
  const cardHeight = Math.round(cardWidth * 0.61);

  const translateX = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-cardWidth * 0.42, cardWidth * 0.42],
  });

  // Tema visual kartu sesuai bank
  const normalizedBank = (bankName || '').toLowerCase();
  const isMandiri = normalizedBank.includes('mandiri');
  const isFlazz = normalizedBank.includes('flazz') || normalizedBank.includes('bca');
  const isTapCash = normalizedBank.includes('tapcash') || normalizedBank.includes('bni');
  const isBrizzi = normalizedBank.includes('brizzi') || normalizedBank.includes('bri');
  const isJakCard = normalizedBank.includes('jakcard') || normalizedBank.includes('dki');

  const getBankStyle = () => {
    if (isMandiri) {
      return {
        bg: '#041B37',
        border: 'rgba(245, 158, 11, 0.5)',
        ribbon1: '#F59E0B',
        ribbon2: '#D97706',
        bankTitle: 'mandiri',
        productName: 'e-money',
        badgeBg: '#F59E0B',
        badgeTextColor: '#041B37',
      };
    }
    if (isFlazz) {
      return {
        bg: '#003A70',
        border: 'rgba(0, 210, 255, 0.5)',
        ribbon1: '#00D2FF',
        ribbon2: '#E02475',
        bankTitle: 'BCA',
        productName: 'Flazz',
        badgeBg: '#00D2FF',
        badgeTextColor: '#00284D',
      };
    }
    if (isTapCash) {
      return {
        bg: '#053C3F',
        border: 'rgba(249, 115, 22, 0.5)',
        ribbon1: '#F97316',
        ribbon2: '#0D9488',
        bankTitle: 'BNI',
        productName: 'TapCash',
        badgeBg: '#F97316',
        badgeTextColor: '#FFFFFF',
      };
    }
    if (isBrizzi) {
      return {
        bg: '#003366',
        border: 'rgba(255, 102, 0, 0.5)',
        ribbon1: '#FF6600',
        ribbon2: '#0284C7',
        bankTitle: 'BRI',
        productName: 'BRIZZI',
        badgeBg: '#FF6600',
        badgeTextColor: '#FFFFFF',
      };
    }
    if (isJakCard) {
      return {
        bg: '#7F1D1D',
        border: 'rgba(251, 191, 36, 0.5)',
        ribbon1: '#F59E0B',
        ribbon2: '#991B1B',
        bankTitle: 'Bank DKI',
        productName: 'JakCard',
        badgeBg: '#F59E0B',
        badgeTextColor: '#7F1D1D',
      };
    }
    return {
      bg: '#0F172A',
      border: 'rgba(99, 102, 241, 0.35)',
      ribbon1: '#EB001B',
      ribbon2: '#00A3FF',
      bankTitle: 'SMART',
      productName: 'CARD',
      badgeBg: '#6366F1',
      badgeTextColor: '#FFFFFF',
    };
  };

  const bankTheme = getBankStyle();

  return (
    <View style={[tw`items-center justify-center`, { marginVertical: isCompact ? 10 : 16 }]}>
      {/* Outer Card Frame dengan Desain Bank Otentik */}
      <View
        style={[
          styles.scannerCardContainer,
          {
            width: cardWidth,
            height: cardHeight,
            backgroundColor: bankTheme.bg,
            borderColor: bankTheme.border,
          },
        ]}
      >
        {/* Dekorasi Gelombang Ribbon Bank */}
        <View
          style={[
            tw`absolute`,
            {
              width: cardWidth * 0.9,
              height: cardWidth * 0.9,
              borderRadius: cardWidth * 0.45,
              backgroundColor: bankTheme.ribbon1,
              opacity: 0.16,
              bottom: -cardHeight * 0.4,
              right: -cardWidth * 0.25,
            },
          ]}
        />
        <View
          style={[
            tw`absolute`,
            {
              width: cardWidth * 0.65,
              height: cardWidth * 0.65,
              borderRadius: cardWidth * 0.325,
              backgroundColor: bankTheme.ribbon2,
              opacity: 0.14,
              top: -cardHeight * 0.35,
              left: -cardWidth * 0.2,
            },
          ]}
        />

        {/* Laser Scanner Beam Vertikal Bergerak */}
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

        {/* Konten Kartu */}
        <View style={tw`flex-1 p-4 justify-between relative z-10`}>
          {/* Header Kartu: Chip EMV Emas & Logo Bank */}
          <View style={tw`flex-row justify-between items-center`}>
            {/* Chip EMV Emas & Gelombang Contactless */}
            <View style={tw`flex-row items-center gap-2`}>
              <View style={styles.emvChipGold}>
                <View style={styles.emvChipInnerLineHorizontal} />
                <View style={styles.emvChipInnerLineVertical} />
                <View style={styles.emvChipCenter} />
              </View>
              <Text style={{ color: '#F8FAFC', fontSize: 11, fontWeight: '800', transform: [{ rotate: '90deg' }] }}>
                )))
              </Text>
            </View>

            {/* Logo Bank & Badge Produk */}
            <View style={tw`items-end`}>
              <Text style={tw`text-white font-black text-xs tracking-wider uppercase`}>
                {bankTheme.bankTitle}
              </Text>
              <View
                style={[
                  tw`px-1.5 py-0.5 rounded mt-0.5`,
                  { backgroundColor: bankTheme.badgeBg },
                ]}
              >
                <Text style={[tw`font-extrabold text-[8px] uppercase tracking-wide`, { color: bankTheme.badgeTextColor }]}>
                  {bankTheme.productName}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer Kartu: Nama, Tanggal, dan Nomor Kartu */}
          <View>
            <View style={tw`flex-row justify-between items-center mb-1`}>
              <Text numberOfLines={1} style={tw`text-white/80 text-[10px] font-semibold flex-1 mr-2`}>
                {cardholderName.toUpperCase()}
              </Text>
              <Text style={tw`text-white/60 text-[10px] font-mono`}>
                {expiryDate}
              </Text>
            </View>
            <Text
              numberOfLines={1}
              style={[
                tw`text-white font-mono font-bold tracking-widest`,
                { fontSize: isCompact ? 12 : 13, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 3 },
              ]}
            >
              {cardNumber}
            </Text>
          </View>
        </View>
      </View>

      {/* Status Teks Animasi "Scanning ..." */}
      <View style={[tw`items-center`, { marginTop: isCompact ? 12 : 18 }]}>
        <Text style={tw`text-slate-700 font-semibold text-xs tracking-wide text-center px-4`}>
          {statusText}
        </Text>

        {/* Progress Bar Tipis Oranye/Emas */}
        <View
          style={[
            tw`h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2.5`,
            { width: 170 },
          ]}
        >
          <View
            style={[
              tw`h-full bg-amber-500 rounded-full`,
              {
                width: `${Math.min(100, Math.max(8, progress * 100))}%`,
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
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  laserBeam: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.28)',
    borderLeftWidth: 2,
    borderLeftColor: '#818CF8',
    borderRightWidth: 2,
    borderRightColor: '#818CF8',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    zIndex: 5,
  },
  emvChipGold: {
    width: 26,
    height: 19,
    backgroundColor: '#F6C944',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4A017',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emvChipInnerLineHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#B45309',
  },
  emvChipInnerLineVertical: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: '#B45309',
  },
  emvChipCenter: {
    width: 7,
    height: 5,
    borderRadius: 1,
    backgroundColor: '#EAB308',
    borderWidth: 0.5,
    borderColor: '#92400E',
  },
});
