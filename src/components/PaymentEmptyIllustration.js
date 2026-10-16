import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

/**
 * Komponen Ilustrasi Minimalis untuk Screen 1 (Payment Options)
 * Menampilkan lingkaran pastel, tumpukan koin dengan simbol $, kartu outline, dan tanda tanya '?'
 * Sesuai persis dengan gambar referensi sebelah kiri.
 */
export default function PaymentEmptyIllustration() {
  return (
    <View style={tw`items-center justify-center my-6`}>
      {/* Lingkaran Latar Belakang Pastel Lembut */}
      <View
        style={[
          tw`items-center justify-center relative`,
          {
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: '#EFF3FA',
          },
        ]}
      >
        {/* Kartu Outline di Belakang Koin */}
        <View
          style={[
            tw`absolute rounded-xl border border-indigo-200 bg-white/70 shadow-sm`,
            {
              width: 140,
              height: 90,
              top: 36,
              left: 40,
              padding: 10,
            },
          ]}
        >
          {/* Garis strip magnetik kartu */}
          <View style={tw`w-full h-2 bg-indigo-100 rounded-sm mb-3`} />
          {/* Chip mini */}
          <View style={tw`w-5 h-4 bg-indigo-200/60 rounded-sm`} />
        </View>

        {/* Tumpukan Koin Pastel di Kiri Bawah */}
        <View style={[tw`absolute`, { bottom: 32, left: 44 }]}>
          {/* Koin Paling Bawah */}
          <View
            style={[
              tw`rounded-full border border-indigo-200/80 bg-indigo-100/90 shadow-sm mb-[-12px]`,
              { width: 54, height: 18 },
            ]}
          />
          {/* Koin Tengah */}
          <View
            style={[
              tw`rounded-full border border-indigo-200/80 bg-indigo-100 shadow-sm mb-[-12px]`,
              { width: 54, height: 18 },
            ]}
          />
          {/* Koin Atas dengan Simbol $ */}
          <View
            style={[
              tw`rounded-full border border-indigo-300 bg-indigo-200/90 shadow-md items-center justify-center`,
              { width: 56, height: 56 },
            ]}
          >
            <Text style={tw`text-indigo-400 font-bold text-xl`}>$</Text>
          </View>
        </View>

        {/* Simbol Tanda Tanya '?' di Sebelah Koin */}
        <View style={[tw`absolute`, { top: 76, right: 68 }]}>
          <Text style={[tw`text-indigo-300 font-extrabold text-4xl`, { opacity: 0.85 }]}>
            ?
          </Text>
        </View>

        {/* Aksen Daun Organik Minimalis di Kanan Bawah */}
        <View style={[tw`absolute flex-row`, { bottom: 36, right: 38 }]}>
          <View
            style={[
              tw`bg-indigo-300/40 rounded-full`,
              {
                width: 14,
                height: 22,
                transform: [{ rotate: '30deg' }],
                marginRight: -4,
              },
            ]}
          />
          <View
            style={[
              tw`bg-indigo-300/30 rounded-full`,
              {
                width: 12,
                height: 18,
                transform: [{ rotate: '-25deg' }],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}
