import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tw from 'twrnc';

/**
 * Komponen 3D Fanned Cards Deck (Sesuai Referensi Layar Tengah)
 * Menampilkan 3 kartu bertumpuk dengan kartu depan vertikal biru tua,
 * chip emas, simbol contactless, nama kartu, dan sensor NFC frame di bawahnya.
 */
export default function FannedCardsDeck({
  cardholderName = 'Sarah Smith',
  cardNumber = '4747 4747 4747 4747',
  cardColor = '#0E1E38',
  bankName = 'Mandiri e-Money',
  accentColor1 = '#EB001B',
  accentColor2 = '#00A3FF',
}) {
  return (
    <View style={tw`items-center justify-center my-4`}>
      {/* Container Tumpukan 3 Kartu (3D Deck) */}
      <View style={[tw`relative items-center justify-center`, { height: 260, width: 240 }]}>
        
        {/* KARTU 1 (Belakang Kiri - Miring -14 Derajat) */}
        <View
          style={[
            styles.baseCard,
            {
              backgroundColor: '#CBD5E1',
              transform: [{ rotate: '-14deg' }],
              zIndex: 1,
              left: 12,
              top: 14,
            },
          ]}
        >
          {/* Teks vertikal di sisi kiri kartu belakang */}
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
              backgroundColor: '#DDE3EA',
              transform: [{ rotate: '14deg' }],
              zIndex: 2,
              right: 12,
              top: 14,
            },
          ]}
        >
          {/* Outline Chip Tipis di kartu kanan */}
          <View style={[styles.goldChipOutline, { top: 22, right: 18 }]} />
        </View>

        {/* KARTU 3 (Depan Tengah - Posisi Tegak Vertikal) */}
        <View
          style={[
            styles.baseCard,
            styles.frontCardShadow,
            {
              backgroundColor: cardColor || '#0E1E38',
              zIndex: 10,
              top: 4,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.15)',
            },
          ]}
        >
          {/* Sisi Atas Kiri: Teks Vertikal "Sarah Smith" */}
          <View style={styles.verticalTextWrapperFront}>
            <Text style={styles.verticalTextFront}>
              {cardholderName}
            </Text>
          </View>

          {/* Sisi Atas Kanan: Chip EMV Emas & Simbol Contactless */}
          <View style={[tw`absolute`, { top: 22, right: 18, alignItems: 'center' }]}>
            {/* Chip EMV Emas Realistis */}
            <View style={styles.emvChipGold}>
              <View style={styles.emvChipInnerLineHorizontal} />
              <View style={styles.emvChipInnerLineVertical} />
            </View>

            {/* Simbol Contactless (Gelombang NFC Tiga Lapis) */}
            <View style={[tw`mt-2 flex-row items-center justify-center`, { opacity: 0.85 }]}>
              <Text style={{ color: '#E2E8F0', fontSize: 13, transform: [{ rotate: '90deg' }] }}>
                )))
              </Text>
            </View>
          </View>

          {/* Sisi Bawah Kanan: Dua Lingkaran Logo Beririsan (Mastercard / Bank Badge Style) */}
          <View style={[tw`absolute flex-row`, { bottom: 20, right: 20 }]}>
            <View
              style={[
                tw`rounded-full`,
                {
                  width: 24,
                  height: 24,
                  backgroundColor: accentColor1 || '#EB001B',
                  marginRight: -10,
                  opacity: 0.95,
                },
              ]}
            />
            <View
              style={[
                tw`rounded-full`,
                {
                  width: 24,
                  height: 24,
                  backgroundColor: accentColor2 || '#00A3FF',
                  opacity: 0.9,
                },
              ]}
            />
          </View>

          {/* Badge Mini Nama Bank di Kiri Bawah */}
          <View style={[tw`absolute`, { bottom: 20, left: 18 }]}>
            <Text style={[tw`text-white/60 font-semibold text-[10px] tracking-wider`]}>
              {bankName.toUpperCase()}
            </Text>
          </View>
        </View>

      </View>

      {/* Ikon Sensor Viewfinder NFC di Bawah Kartu */}
      <View style={tw`mt-3 items-center justify-center`}>
        <View
          style={[
            tw`border border-indigo-300/80 rounded-lg items-center justify-center`,
            { width: 34, height: 34, borderStyle: 'dashed' },
          ]}
        >
          <View style={tw`w-2 h-2 rounded-full bg-indigo-500`} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseCard: {
    width: 140,
    height: 215,
    borderRadius: 22,
    position: 'absolute',
    overflow: 'hidden',
  },
  frontCardShadow: {
    shadowColor: '#0A1428',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  verticalTextWrapper: {
    position: 'absolute',
    top: 24,
    left: -20,
    transform: [{ rotate: '-90deg' }],
    width: 100,
  },
  verticalTextMuted: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  verticalTextWrapperFront: {
    position: 'absolute',
    top: 30,
    left: -14,
    transform: [{ rotate: '-90deg' }],
    width: 90,
  },
  verticalTextFront: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.8,
  },
  emvChipGold: {
    width: 28,
    height: 22,
    backgroundColor: '#F6C944',
    borderRadius: 5,
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
    backgroundColor: '#CA8A04',
  },
  emvChipInnerLineVertical: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: '#CA8A04',
  },
  goldChipOutline: {
    width: 28,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    position: 'absolute',
  },
});
