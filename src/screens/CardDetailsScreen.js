import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import FannedCardsDeck from '../components/FannedCardsDeck';
import SupportedNetworks from '../components/SupportedNetworks';
import { formatRupiah } from '../services/apduCommands';

/**
 * Screen 2: Card Details & Balance Result
 * Sesuai persis dengan gambar referensi di bagian tengah.
 * Menampilkan tumpukan 3 kartu fanned out 3D dengan visual kartu sesuai bank yang di-tap,
 * sensor NFC frame di bawahnya, Form field Card Number, Name on Card, Supported Networks,
 * serta tombol Continue ungu dengan icon panah.
 * Responsif tanpa terpotong di layar HP Android mana pun.
 */
export default function CardDetailsScreen({
  cardData,
  onBack,
  onScanAnother,
}) {
  const [nameOnCard, setNameOnCard] = useState(cardData?.nameOnCard || 'Sarah Smith');
  const [cardNumber, setCardNumber] = useState(cardData?.cardNumber || '4747 4747 4747 4747');
  const [showLogModal, setShowLogModal] = useState(false);

  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const isCompact = screenHeight < 720;

  const balance = cardData?.balance || 0;
  const bankName = cardData?.bankName || 'Mandiri e-Money';
  const cardColor = cardData?.themeColor || '#0E1E38';
  const isReal = cardData?.isRealCard !== false;

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
        {/* Top Navigation Bar: Back & Diagnostics Log */}
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <TouchableOpacity
            onPress={onBack}
            style={tw`w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm border border-slate-100`}
            activeOpacity={0.7}
          >
            <Text style={tw`text-slate-700 text-lg font-bold`}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowLogModal(true)}
            style={tw`px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 flex-row items-center`}
            activeOpacity={0.7}
          >
            <Text style={tw`text-indigo-600 font-bold text-xs mr-1`}>📡 Log APDU</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={tw`flex-1`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-4`}
          bounces={false}
        >
          {/* Komponen 3D Fanned Cards Deck Sesuai Identitas Bank yang Di-tap */}
          <FannedCardsDeck
            cardholderName={nameOnCard}
            cardNumber={cardNumber}
            cardColor={cardColor}
            bankName={bankName}
            accentColor1={cardData?.accentColor || '#EB001B'}
            accentColor2="#00A3FF"
          />

          {/* Saldo Kartu e-Money (Verified Offline Chip Stored Value) */}
          <View style={tw`bg-white rounded-2xl p-4 my-2 border border-slate-100 shadow-sm items-center`}>
            <View style={tw`flex-row items-center mb-1`}>
              <View style={[tw`w-2 h-2 rounded-full mr-2`, { backgroundColor: isReal ? '#10B981' : '#6366F1' }]} />
              <Text style={tw`text-slate-400 text-xs font-bold tracking-wide uppercase`}>
                Saldo Chip e-Money (100% Offline)
              </Text>
            </View>

            <Text style={[tw`text-slate-900 font-black tracking-tight my-1`, { fontSize: isCompact ? 26 : 30 }]}>
              {formatRupiah(balance)}
            </Text>

            <View style={tw`flex-row items-center bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60 mt-0.5`}>
              <Text style={tw`text-[11px] font-bold text-slate-700 mr-1`}>
                {bankName}
              </Text>
              <Text style={tw`text-[10px] text-slate-400`}>
                • {cardData?.cardType || 'ISO-DEP 14443-4'}
              </Text>
            </View>
          </View>

          {/* Form Field 1: Card Number */}
          <View style={tw`mt-2 mb-2.5`}>
            <Text style={tw`text-slate-500 text-xs font-bold mb-1.5 ml-1`}>
              Card Number
            </Text>
            <View style={tw`bg-white rounded-xl border border-slate-200/90 px-4 py-3 flex-row items-center justify-between shadow-sm`}>
              <TextInput
                value={cardNumber}
                onChangeText={setCardNumber}
                style={tw`text-slate-800 font-bold text-sm tracking-widest flex-1 font-mono`}
                placeholder="4747 4747 4747 4747"
                keyboardType="numeric"
              />
              <Text style={tw`text-indigo-500 font-bold text-xs`}>
                UID
              </Text>
            </View>
          </View>

          {/* Form Field 2: Name on Card */}
          <View style={tw`mb-3`}>
            <Text style={tw`text-slate-500 text-xs font-bold mb-1.5 ml-1`}>
              Name on Card
            </Text>
            <View style={tw`bg-white rounded-xl border border-slate-200/90 px-4 py-3 shadow-sm`}>
              <TextInput
                value={nameOnCard}
                onChangeText={setNameOnCard}
                style={tw`text-slate-800 font-semibold text-sm`}
                placeholder="Sarah Smith"
              />
            </View>
          </View>

          {/* Supported Networks Sesuai Referensi */}
          <SupportedNetworks />

          {/* Mutasi Transaksi Terakhir dari Chip jika Ada */}
          {cardData?.history && cardData.history.length > 0 && (
            <View style={tw`bg-white rounded-2xl p-4 mt-2 border border-slate-100 shadow-sm`}>
              <Text style={tw`text-slate-700 font-bold text-xs uppercase tracking-wider mb-2`}>
                Riwayat Transaksi e-Toll dari Chip
              </Text>
              {cardData.history.map((tx, idx) => (
                <View key={idx} style={tw`flex-row justify-between items-center py-2 border-b border-slate-100`}>
                  <View>
                    <Text style={tw`text-slate-800 font-bold text-xs`}>{tx.type}</Text>
                    {tx.date && <Text style={tw`text-slate-400 text-[10px]`}>{tx.date}</Text>}
                  </View>
                  <Text style={tw`text-indigo-600 font-bold text-xs`}>
                    {formatRupiah(tx.amount)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom Bar: Continue Button */}
        <View style={{ paddingTop: 6, paddingBottom: 2 }}>
          <TouchableOpacity
            onPress={onScanAnother}
            style={[
              tw`w-full py-3.5 rounded-2xl flex-row items-center justify-between px-6 shadow-md`,
              {
                backgroundColor: '#5C60F5',
                shadowColor: '#5C60F5',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 5,
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={tw`w-6`} />
            <Text style={tw`text-white font-bold text-base`}>
              Continue
            </Text>
            <View style={tw`w-7 h-7 rounded-full bg-white/25 items-center justify-center`}>
              <Text style={tw`text-white font-bold text-sm`}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Modal Detail Log APDU Transceive */}
        <Modal
          visible={showLogModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLogModal(false)}
        >
          <View style={tw`flex-1 bg-black/60 justify-end`}>
            <View style={tw`bg-slate-900 rounded-t-3xl p-6 max-h-[80%]`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-white font-bold text-base`}>
                  📡 APDU Hex Trace Log (100% Offline)
                </Text>
                <TouchableOpacity onPress={() => setShowLogModal(false)}>
                  <Text style={tw`text-slate-400 font-bold text-lg`}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={tw`mb-4`}>
                {(cardData?.apduLogs || []).map((log, idx) => (
                  <View key={idx} style={tw`bg-slate-800/80 p-3 rounded-xl mb-2.5 border border-slate-700`}>
                    <Text style={tw`text-indigo-400 font-bold text-xs mb-1`}>
                      {log.desc} {log.durationMs ? `(${log.durationMs}ms)` : ''}
                    </Text>
                    <Text style={tw`text-slate-300 font-mono text-[11px]`}>
                      TX: <Text style={tw`text-emerald-400`}>{log.tx}</Text>
                    </Text>
                    <Text style={tw`text-slate-300 font-mono text-[11px]`}>
                      RX: <Text style={tw`text-amber-400`}>{log.rx}</Text>
                    </Text>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={() => setShowLogModal(false)}
                style={tw`w-full bg-indigo-600 py-3 rounded-xl items-center`}
              >
                <Text style={tw`text-white font-bold text-sm`}>Tutup Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}
