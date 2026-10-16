import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import PaymentEmptyIllustration from '../components/PaymentEmptyIllustration';
import { formatRupiah } from '../services/apduCommands';

/**
 * Screen 1: Payment Options
 * Sesuai persis dengan gambar referensi sebelah kiri.
 * Menampilkan judul "Payment Options", ilustrasi pastel kosong, teks status,
 * serta tombol floating FAB ungu [💳+] di pojok kanan bawah.
 */
export default function HomeScreen({
  onStartScan,
  onSelectSavedCard,
  scannedCards = [],
}) {
  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8F9FE]`}>
      <View style={tw`flex-1 px-6 pt-4 justify-between`}>
        
        {/* Top Navigation Bar: Back Arrow & Skip */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <TouchableOpacity
            style={tw`w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm border border-slate-100`}
            activeOpacity={0.7}
          >
            <Text style={tw`text-slate-700 text-lg font-bold`}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onStartScan}
            activeOpacity={0.7}
          >
            <Text style={tw`text-indigo-600 font-semibold text-sm`}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Header Title: Payment Options */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-slate-900 text-2xl font-extrabold tracking-tight`}>
            Payment Options
          </Text>
          <Text style={tw`text-slate-400 text-xs mt-1`}>
            Pindai saldo kartu uang elektronik Mandiri, Flazz, BNI, BRI secara offline
          </Text>
        </View>

        {/* Konten Utama */}
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`items-center justify-center flex-grow py-4`}
          showsVerticalScrollIndicator={false}
        >
          {scannedCards.length === 0 ? (
            /* State Kosong Sesuai Gambar Referensi */
            <View style={tw`items-center justify-center w-full`}>
              <PaymentEmptyIllustration />

              <Text style={tw`text-slate-600 font-semibold text-base mt-2`}>
                Payment methods empty
              </Text>

              <Text style={tw`text-slate-400 text-center text-xs px-8 mt-2 leading-relaxed`}>
                Belum ada kartu e-Money yang terdaftar. Tempelkan kartu di belakang HP untuk membaca saldo secara instan.
              </Text>
            </View>
          ) : (
            /* Daftar Kartu yang Pernah Dipindai */
            <View style={tw`w-full`}>
              <Text style={tw`text-slate-500 font-semibold text-xs mb-3 uppercase tracking-wider`}>
                Riwayat Kartu Terakhir
              </Text>

              {scannedCards.map((card, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => onSelectSavedCard(card)}
                  style={tw`bg-white p-4 rounded-2xl mb-3 shadow-sm border border-slate-100 flex-row items-center justify-between`}
                  activeOpacity={0.8}
                >
                  <View style={tw`flex-row items-center`}>
                    <View
                      style={[
                        tw`w-10 h-10 rounded-xl items-center justify-center mr-3`,
                        { backgroundColor: card.themeColor || '#0E1E38' },
                      ]}
                    >
                      <Text style={tw`text-white font-bold text-xs`}>💳</Text>
                    </View>
                    <View>
                      <Text style={tw`text-slate-800 font-bold text-sm`}>
                        {card.bankName}
                      </Text>
                      <Text style={tw`text-slate-400 text-[11px]`}>
                        {card.cardNumber}
                      </Text>
                    </View>
                  </View>

                  <View style={tw`items-end`}>
                    <Text style={tw`text-indigo-600 font-extrabold text-sm`}>
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
        <View style={tw`pb-6 pt-2 flex-row items-center justify-between`}>
          <TouchableOpacity
            onPress={onStartScan}
            style={tw`flex-1 mr-4 bg-indigo-50 border border-indigo-200 py-3.5 rounded-2xl items-center shadow-sm`}
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
                width: 54,
                height: 54,
                backgroundColor: '#5C60F5',
                shadowColor: '#5C60F5',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 8,
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={tw`flex-row items-center justify-center`}>
              <View style={[tw`border border-white/90 rounded-sm mr-0.5`, { width: 18, height: 13, padding: 1 }]}>
                <View style={tw`w-full h-1 bg-white/70 rounded-sm mb-0.5`} />
              </View>
              <Text style={tw`text-white font-bold text-xs`}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
