import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import tw from 'twrnc';

/**
 * Komponen 3D Fanned Cards Deck Responsif
 * Menampilkan kartu dengan identitas visual otentik sesuai bank yang di-tap:
 * - Bank Mandiri: Deep Navy + Pita Gelombang Emas (Golden Wave) + Badge mandiri e-money
 * - Bank BCA: BCA Royal Blue + Electric Cyan & Magenta Swoosh + Badge Flazz BCA
 * - Bank BNI: Deep Teal + Dynamic Orange Ribbon + Badge BNI TapCash
 * - Bank BRI: Ocean Blue + Vivid Orange Ribbon + Badge BRIZZI BRI
 * - Bank DKI: Monas Crimson Red + Golden Accent + Badge JakCard
 * 
 * Dilengkapi penskalaan responsif (auto-scale) agar tidak pernah terpotong di layar HP apa pun.
 */
export default function FannedCardsDeck({
  cardholderName = 'Sarah Smith',
  cardNumber = '4747 4747 4747 4747',
  cardColor = '#0E1E38',
  bankName = 'Mandiri e-Money',
  accentColor1 = '#EB001B',
  accentColor2 = '#00A3FF',
}) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Auto-scale jika layar HP Android berukuran compact agar tidak terpotong
  const scale = screenHeight < 680 ? 0.82 : screenHeight < 740 ? 0.9 : 1.0;

  const normalizedBank = (bankName || '').toLowerCase();
  const isMandiri = normalizedBank.includes('mandiri');
  const isFlazz = normalizedBank.includes('flazz') || normalizedBank.includes('bca');
  const isTapCash = normalizedBank.includes('tapcash') || normalizedBank.includes('bni');
  const isBrizzi = normalizedBank.includes('brizzi') || normalizedBank.includes('bri');
  const isJakCard = normalizedBank.includes('jakcard') || normalizedBank.includes('dki');

  // Konfigurasi tema kartu bank
  const getTheme = () => {
    if (isMandiri) {
      return {
        bg: '#041B37',
        border: 'rgba(245, 158, 11, 0.4)',
        ribbonColor: '#F59E0B',
        ribbonColor2: '#D97706',
        bankTitle: 'mandiri',
        productName: 'e-money',
        badgeBg: '#F59E0B',
        badgeTextColor: '#041B37',
        backCard1: '#1E293B',
        backCard2: '#0F172A',
      };
    }
    if (isFlazz) {
      return {
        bg: '#003A70',
        border: 'rgba(0, 210, 255, 0.4)',
        ribbonColor: '#00D2FF',
        ribbonColor2: '#005BAC',
        bankTitle: 'BCA',
        productName: 'Flazz',
        badgeBg: '#00D2FF',
        badgeTextColor: '#00284D',
        backCard1: '#1E3A8A',
        backCard2: '#172554',
      };
    }
    if (isTapCash) {
      return {
        bg: '#053C3F',
        border: 'rgba(249, 115, 22, 0.4)',
        ribbonColor: '#F97316',
        ribbonColor2: '#0D9488',
        bankTitle: 'BNI',
        productName: 'TapCash',
        badgeBg: '#F97316',
        badgeTextColor: '#FFFFFF',
        backCard1: '#042F2E',
        backCard2: '#134E4A',
      };
    }
    if (isBrizzi) {
      return {
        bg: '#003366',
        border: 'rgba(255, 102, 0, 0.4)',
        ribbonColor: '#FF6600',
        ribbonColor2: '#00529C',
        bankTitle: 'BRI',
        productName: 'BRIZZI',
        badgeBg: '#FF6600',
        badgeTextColor: '#FFFFFF',
        backCard1: '#1E3A5F',
        backCard2: '#0F2537',
      };
    }
    if (isJakCard) {
      return {
        bg: '#7F1D1D',
        border: 'rgba(251, 191, 36, 0.4)',
        ribbonColor: '#F59E0B',
        ribbonColor2: '#B91C1C',
        bankTitle: 'Bank DKI',
        productName: 'JakCard',
        badgeBg: '#F59E0B',
        badgeTextColor: '#7F1D1D',
        backCard1: '#450A0A',
        backCard2: '#7F1D1D',
      };
    }
    // Default smartcard
    return {
      bg: cardColor || '#0E1E38',
      border: 'rgba(255, 255, 255, 0.2)',
      ribbonColor: accentColor1 || '#EB001B',
      ribbonColor2: accentColor2 || '#00A3FF',
      bankTitle: bankName.split(' ')[0] || 'SMART',
      productName: 'CARD',
      badgeBg: '#4F46E5',
      badgeTextColor: '#FFFFFF',
      backCard1: '#CBD5E1',
      backCard2: '#94A3B8',
    };
  };

  const theme = getTheme();
  const scaledHeight = Math.round(245 * scale);

  return (
    <View style={[tw`items-center justify-center`, { height: scaledHeight, marginVertical: screenHeight < 720 ? 2 : 6 }]}>
      {/* Container Tumpukan 3 Kartu (3D Deck) */}
      <View style={[tw`relative items-center justify-center`, { height: 250, width: 230, transform: [{ scale }] }]}>
        
        {/* KARTU 1 (Belakang Kiri - Miring -14 Derajat) */}
        <View
          style={[
            styles.baseCard,
            {
              backgroundColor: theme.backCard1,
              transform: [{ rotate: '-14deg' }],
              zIndex: 1,
              left: 10,
              top: 14,
              opacity: 0.85,
            },
          ]}
        >
          <View style={styles.verticalTextWrapper}>
            <Text style={styles.verticalTextMuted}>
              {cardholderName}
            </Text>
          </View>
        </View>

        {/* KARTU 2 (Belakang Kanan - Miring +14 Derajat) */}
        <View
          style={[
            styles.baseCard,
            {
              backgroundColor: theme.backCard2,
              transform: [{ rotate: '14deg' }],
              zIndex: 2,
              right: 10,
              top: 14,
              opacity: 0.85,
            },
          ]}
        >
          {/* Outline Chip Tipis */}
          <View style={[styles.goldChipOutline, { top: 20, right: 16 }]} />
        </View>

        {/* KARTU 3 (Depan Tengah - Posisi Tegak Vertikal dengan Desain Bank Otentik) */}
        <View
          style={[
            styles.baseCard,
            styles.frontCardShadow,
            {
              backgroundColor: theme.bg,
              zIndex: 10,
              top: 4,
              borderWidth: 1.5,
              borderColor: theme.border,
            },
          ]}
        >
          {/* ELEMEN GRAFIS BANK 1: Gelombang Dekorasi Diagonal / Curved Ribbon */}
          <View
            style={[
              tw`absolute`,
              {
                width: 190,
                height: 190,
                borderRadius: 95,
                backgroundColor: theme.ribbonColor,
                opacity: 0.18,
                bottom: -50,
                right: -60,
              },
            ]}
          />
          <View
            style={[
              tw`absolute`,
              {
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: theme.ribbonColor2,
                opacity: 0.14,
                top: -30,
                left: -40,
              },
            ]}
          />

          {/* Sisi Atas Kiri: Teks Vertikal Nama Pemegang Kartu */}
          <View style={styles.verticalTextWrapperFront}>
            <Text numberOfLines={1} style={styles.verticalTextFront}>
              {cardholderName}
            </Text>
          </View>

          {/* Sisi Atas Kanan: Chip EMV Emas & Simbol Contactless Waves */}
          <View style={[tw`absolute`, { top: 18, right: 16, alignItems: 'center' }]}>
            {/* Chip EMV Emas Realistis */}
            <View style={styles.emvChipGold}>
              <View style={styles.emvChipInnerLineHorizontal} />
              <View style={styles.emvChipInnerLineVertical} />
              <View style={styles.emvChipCenter} />
            </View>

            {/* Simbol Contactless (Gelombang NFC Tiga Lapis) */}
            <View style={[tw`mt-1.5 flex-row items-center justify-center`, { opacity: 0.9 }]}>
              <Text style={{ color: '#F8FAFC', fontSize: 13, fontWeight: '800', transform: [{ rotate: '90deg' }] }}>
                )))
              </Text>
            </View>
          </View>

          {/* Sisi Bawah: Header Logo Bank & Nama Produk Kartu */}
          <View style={[tw`absolute px-3.5 w-full`, { bottom: 16 }]}>
            
            {/* Badge Produk Bank (misal: "mandiri e-money", "BCA Flazz", "BNI TapCash") */}
            <View style={tw`flex-row items-center justify-between`}>
              <View>
                <Text style={tw`text-white font-black text-xs tracking-wider uppercase`}>
                  {theme.bankTitle}
                </Text>
                <View
                  style={[
                    tw`px-1.5 py-0.5 rounded mt-0.5 self-start`,
                    { backgroundColor: theme.badgeBg },
                  ]}
                >
                  <Text style={[tw`font-extrabold text-[9px] uppercase tracking-wide`, { color: theme.badgeTextColor }]}>
                    {theme.productName}
                  </Text>
                </View>
              </View>

              {/* Hologram / Double Circle Graphic Badge */}
              <View style={tw`flex-row`}>
                <View
                  style={[
                    tw`rounded-full`,
                    {
                      width: 20,
                      height: 20,
                      backgroundColor: theme.ribbonColor,
                      marginRight: -8,
                      opacity: 0.95,
                    },
                  ]}
                />
                <View
                  style={[
                    tw`rounded-full`,
                    {
                      width: 20,
                      height: 20,
                      backgroundColor: theme.ribbonColor2,
                      opacity: 0.85,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Nomor Kartu Masked di Bagian Bawah Kartu */}
            <Text
              numberOfLines={1}
              style={[
                tw`text-white/80 font-mono font-bold text-[9px] mt-2 tracking-wider`,
                { textShadowColor: 'rgba(0, 0, 0, 0.6)', textShadowRadius: 2 },
              ]}
            >
              {cardNumber}
            </Text>
          </View>

        </View>

      </View>

      {/* Ikon Sensor Viewfinder NFC di Bawah Kartu */}
      <View style={tw`mt-2 items-center justify-center`}>
        <View
          style={[
            tw`border border-indigo-300/70 rounded-xl items-center justify-center bg-indigo-50/50`,
            { width: 32, height: 32, borderStyle: 'dashed' },
          ]}
        >
          <View style={tw`w-2 h-2 rounded-full bg-indigo-600`} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseCard: {
    width: 145,
    height: 220,
    borderRadius: 20,
    position: 'absolute',
    overflow: 'hidden',
  },
  frontCardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  verticalTextWrapper: {
    position: 'absolute',
    top: 24,
    left: -20,
    transform: [{ rotate: '-90deg' }],
    width: 100,
  },
  verticalTextMuted: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  verticalTextWrapperFront: {
    position: 'absolute',
    top: 28,
    left: -16,
    transform: [{ rotate: '-90deg' }],
    width: 90,
  },
  verticalTextFront: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  emvChipGold: {
    width: 28,
    height: 21,
    backgroundColor: '#F6C944',
    borderRadius: 4.5,
    borderWidth: 1,
    borderColor: '#D4A017',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 8,
    height: 6,
    borderRadius: 1.5,
    backgroundColor: '#EAB308',
    borderWidth: 0.5,
    borderColor: '#92400E',
  },
  goldChipOutline: {
    width: 26,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
  },
});
