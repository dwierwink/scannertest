import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import PaymentEmptyIllustration from '../components/PaymentEmptyIllustration';
import { formatRupiah } from '../services/apduCommands';

/**
 * Screen 1: Payment Options
 * Sesuai persis dengan gambar referensi sebelah kiri.
 * Responsif tanpa terpotong di layar HP Android dengan navigation bar sistem apa pun.
 */
export default function HomeScreen({
  onStartScan,
  onSelectSavedCard,
  onOpenTollCalculator,
  scannedCards = [],
}) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const isCompact = screenHeight < 720;

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8F9FE]`}>
      <View
        style={[
          tw`flex-1 px-6 justify-between`,
          {
            paddingTop: Math.max(insets.top, 8),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {/* Top Navigation Bar: Back Arrow & Action Buttons */}
        <View style={tw`flex-row justify-between items-center mb-3`}>
          <TouchableOpacity
            style={tw`w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm border border-slate-100`}
            activeOpacity={0.7}
          >
            <Text style={tw`text-slate-700 text-lg font-bold`}>‹</Text>
          </TouchableOpacity>

          <View style={tw`flex-row items-center gap-2`}>
            {/* Tombol Kalkulator Tol di Header */}
            <TouchableOpacity
              onPress={onOpenTollCalculator}
              activeOpacity={0.7}
              style={tw`py-1.5 px-3 rounded-full bg-blue-50 border border-blue-200 flex-row items-center`}
            >
              <Text style={tw`text-xs mr-1`}>🛣️</Text>
              <Text style={tw`text-blue-700 font-bold text-xs`}>Tarif Tol</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onStartScan}
              activeOpacity={0.7}
              style={tw`py-1.5 px-3 rounded-full bg-indigo-50 border border-indigo-100`}
            >
              <Text style={tw`text-indigo-600 font-bold text-xs`}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Header Title: Payment Options */}
        <View style={tw`mb-2`}>
          <Text style={[tw`text-slate-900 font-black tracking-tight`, { fontSize: isCompact ? 20 : 24 }]}>
            Payment Options
          </Text>
          <Text style={tw`text-slate-400 text-xs mt-0.5`}>
            Pindai saldo kartu uang elektronik Mandiri, Flazz, BNI, BRI secara offline
          </Text>
        </View>

        {/* Quick Access Card: Kalkulator Tarif Tol Jawa Timur */}
        <TouchableOpacity
          onPress={onOpenTollCalculator}
          style={tw`bg-white p-3 rounded-2xl mb-2.5 flex-row items-center justify-between shadow-sm border border-blue-100`}
          activeOpacity={0.85}
        >
          <View style={tw`flex-row items-center flex-1 mr-2`}>
            <View style={tw`w-9 h-9 rounded-xl bg-blue-50 items-center justify-center mr-2.5`}>
              <Text style={tw`text-base`}>🚗</Text>
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-slate-800 font-bold text-xs`}>
                Kalkulator Tarif Tol Jawa Timur
              </Text>
              <Text style={tw`text-slate-400 text-[10px]`}>
                Gresik, Surabaya, Sidoarjo, Malang s/d Madiun
              </Text>
            </View>
          </View>
          <View style={tw`bg-blue-600 px-2.5 py-1 rounded-full`}>
            <Text style={tw`text-white font-bold text-[10px]`}>Hitung ➔</Text>
          </View>
        </TouchableOpacity>

        {/* Konten Utama */}
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`items-center justify-center flex-grow py-2`}
          showsVerticalScrollIndicator={false}
        >
          {scannedCards.length === 0 ? (
            /* State Kosong Sesuai Gambar Referensi */
            <View style={tw`items-center justify-center w-full`}>
              <PaymentEmptyIllustration />

              <Text style={tw`text-slate-700 font-bold text-base mt-2`}>
                Payment methods empty
              </Text>

              <Text style={tw`text-slate-400 text-center text-xs px-6 mt-1.5 leading-relaxed`}>
                Belum ada kartu e-Money yang terdaftar. Tempelkan kartu di belakang HP untuk membaca saldo secara instan.
              </Text>
            </View>
          ) : (
            /* Daftar Kartu yang Pernah Dipindai */
            <View style={tw`w-full`}>
              <Text style={tw`text-slate-500 font-bold text-xs mb-3 uppercase tracking-wider`}>
                Riwayat Kartu Terakhir
              </Text>

              {scannedCards.map((card, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => onSelectSavedCard(card)}
                  style={tw`bg-white p-3.5 rounded-2xl mb-2.5 shadow-sm border border-slate-100 flex-row items-center justify-between`}
                  activeOpacity={0.8}
                >
                  <View style={tw`flex-row items-center flex-1 mr-2`}>
                    <View
                      style={[
                        tw`w-10 h-10 rounded-xl items-center justify-center mr-3`,
                        { backgroundColor: card.themeColor || '#0E1E38' },
                      ]}
                    >
                      <Text style={tw`text-white font-bold text-xs`}>💳</Text>
                    </View>
                    <View style={tw`flex-1`}>
                      <Text numberOfLines={1} style={tw`text-slate-800 font-bold text-sm`}>
                        {card.bankName}
                      </Text>
                      <Text numberOfLines={1} style={tw`text-slate-400 text-[11px] font-mono`}>
                        {card.cardNumber}
                      </Text>
                    </View>
                  </View>

                  <View style={tw`items-end`}>
                    <Text style={tw`text-indigo-600 font-black text-sm`}>
                      {formatRupiah(card.balance)}
                    </Text>
                    <Text style={tw`text-slate-400 text-[10px]`}>
                      Offline Chip
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom Bar: Action Button & Floating Action Button (FAB) */}
        <View style={tw`pt-2 flex-row items-center justify-between`}>
          <TouchableOpacity
            onPress={onStartScan}
            style={tw`flex-1 mr-3 bg-indigo-50 border border-indigo-200 py-3.5 rounded-2xl items-center shadow-sm active:bg-indigo-100`}
            activeOpacity={0.8}
          >
            <Text style={tw`text-indigo-600 font-bold text-sm`}>
              ⚡ Pindai Kartu e-Money
            </Text>
          </TouchableOpacity>

          {/* Floating Action Button (FAB) Ungu Sesuai Referensi [💳+] */}
          <TouchableOpacity
            onPress={onStartScan}
            style={[
              tw`rounded-2xl items-center justify-center shadow-md`,
              {
                width: 52,
                height: 52,
                backgroundColor: '#5C60F5',
                shadowColor: '#5C60F5',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 6,
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={tw`flex-row items-center justify-center`}>
              <View style={[tw`border border-white/90 rounded-sm mr-0.5`, { width: 17, height: 12, padding: 1 }]}>
                <View style={tw`w-full h-0.5 bg-white/70 rounded-sm mb-0.5` } />
              </View>
              <Text style={tw`text-white font-bold text-xs`}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer Attribution Pribadi */}
        <View style={tw`items-center mt-2.5 mb-1`}>
          <Text
            style={{
              fontFamily: 'Arial',
              fontStyle: 'italic',
              fontSize: 8,
              color: '#94A3B8',
              textAlign: 'center',
            }}
          >
            Dibuat dan digunakan secara pribadi oleh Erwin Dwi K
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
