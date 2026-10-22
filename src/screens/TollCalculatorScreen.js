import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import * as Haptics from 'expo-haptics';
import {
  WILAYAH_TOL,
  ALL_GATES,
  GOLONGAN_OPTIONS,
  calculateTollRoute,
} from '../data/tollData';

export default function TollCalculatorScreen({
  onBack,
  cardBalance = null,
}) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  // State Pilihan
  const [selectedGolongan, setSelectedGolongan] = useState(GOLONGAN_OPTIONS[0]); // Default Golongan I
  const [selectedAsal, setSelectedAsal] = useState(null);
  const [selectedTujuan, setSelectedTujuan] = useState(null);

  // Daftar Tarif Ditambahkan (Multi-Trip List)
  const [addedTrips, setAddedTrips] = useState([]);

  // Modals Picker State
  const [modalType, setModalType] = useState(null); // 'golongan' | 'asal' | 'tujuan'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterWilayah, setSelectedFilterWilayah] = useState('SEMUA');

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  // Format Rupiah
  const formatRp = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return 'Rp. 0';
    return 'Rp. ' + Math.floor(num).toLocaleString('id-ID');
  };

  // Perhitungan Otomatis untuk Pilihan Aktif saat ini
  const currentCalculation = useMemo(() => {
    if (!selectedAsal || !selectedTujuan) return null;
    return calculateTollRoute(selectedAsal.id, selectedTujuan.id, selectedGolongan.code);
  }, [selectedAsal, selectedTujuan, selectedGolongan]);

  // Total Keseluruhan Tarif:
  // Jika ada addedTrips, jumlahkan semua addedTrips.
  // Jika belum ada addedTrips tapi ada currentCalculation, tampilkan tarif rute saat ini.
  const totalTarif = useMemo(() => {
    if (addedTrips.length > 0) {
      return addedTrips.reduce((acc, trip) => acc + trip.totalFee, 0);
    }
    if (currentCalculation && currentCalculation.success) {
      return currentCalculation.totalFee;
    }
    return 0;
  }, [addedTrips, currentCalculation]);

  // Action: Tambah Tarif
  const handleTambahTarif = () => {
    triggerHaptic('success');
    if (!selectedAsal || !selectedTujuan) {
      alert('Harap pilih Gerbang Asal dan Gerbang Tujuan terlebih dahulu.');
      return;
    }
    if (selectedAsal.id === selectedTujuan.id) {
      alert('Gerbang Asal dan Gerbang Tujuan tidak boleh sama.');
      return;
    }
    if (currentCalculation && currentCalculation.success) {
      const newTrip = {
        id: Date.now().toString(),
        asal: selectedAsal,
        tujuan: selectedTujuan,
        golongan: selectedGolongan,
        totalFee: currentCalculation.totalFee,
        segments: currentCalculation.segments,
        distanceKm: currentCalculation.distanceKm,
      };
      setAddedTrips((prev) => [...prev, newTrip]);
    }
  };

  // Action: Bersihkan Tarif
  const handleBersihkanTarif = () => {
    triggerHaptic('light');
    setSelectedAsal(null);
    setSelectedTujuan(null);
    setAddedTrips([]);
  };

  // Hapus 1 trip tertentu dari daftar
  const handleRemoveTrip = (tripId) => {
    triggerHaptic('light');
    setAddedTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  // Filter Gerbang di Modal
  const filteredGates = useMemo(() => {
    return ALL_GATES.filter((gate) => {
      const matchSearch =
        gate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gate.wilayahName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gate.ruas.toLowerCase().includes(searchQuery.toLowerCase());
      const matchWilayah =
        selectedFilterWilayah === 'SEMUA' || gate.wilayahId === selectedFilterWilayah;
      return matchSearch && matchWilayah;
    });
  }, [searchQuery, selectedFilterWilayah]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View
        style={[
          tw`flex-1`,
          {
            paddingTop: Math.max(insets.top, 8),
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        {/* Top Header Navigation */}
        <View style={tw`flex-row items-center px-5 py-2 justify-between border-b border-slate-100`}>
          <TouchableOpacity
            onPress={onBack}
            style={tw`w-9 h-9 rounded-full bg-slate-100 items-center justify-center`}
            activeOpacity={0.7}
          >
            <Text style={tw`text-slate-700 font-bold text-lg`}>‹</Text>
          </TouchableOpacity>

          <View style={tw`items-center`}>
            <Text style={tw`text-slate-800 font-extrabold text-base tracking-tight`}>
              Kalkulator Tarif Tol
            </Text>
            <Text style={tw`text-slate-400 text-[10px]`}>
              Trans-Jawa & Jalur Tol Jawa Timur
            </Text>
          </View>

          <View style={tw`w-9`} />
        </View>

        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`px-4 pt-4 pb-8`}
          showsVerticalScrollIndicator={false}
        >
          {/* ======================================================== */}
          {/* 1. KONTROL INPUT SESUAI GAMBAR REFERENSI USER              */}
          {/* ======================================================== */}
          <View style={tw`w-full mb-4`}>
            <View
              style={[
                tw`flex-row justify-between items-start`,
                screenWidth < 380 ? tw`flex-col gap-3` : tw`flex-row gap-2`,
              ]}
            >
              {/* Kolom 1: Pilih Golongan */}
              <View style={tw`flex-1 min-w-[105px]`}>
                <Text style={tw`text-slate-800 font-bold text-xs mb-1`}>
                  Pilih Golongan
                </Text>

                {/* Box Floating Outlined Style (Persis Gambar) */}
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic('light');
                    setModalType('golongan');
                  }}
                  activeOpacity={0.8}
                  style={[
                    tw`h-12 border-2 border-[#1E88E5] rounded-md px-2.5 flex-row items-center justify-between bg-white relative`,
                  ]}
                >
                  {/* Floating Label notched on top border */}
                  <View style={tw`absolute -top-2 left-2 px-1 bg-white`}>
                    <Text style={tw`text-[#1E88E5] text-[10px] font-semibold`}>
                      Pilih Golongan
                    </Text>
                  </View>

                  <Text
                    numberOfLines={1}
                    style={tw`text-slate-800 font-bold text-xs flex-1 mr-1`}
                  >
                    {selectedGolongan.code}
                  </Text>
                  <Text style={tw`text-slate-500 text-[10px]`}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* Kolom 2: Gerbang Asal */}
              <View style={tw`flex-1 min-w-[110px]`}>
                <Text style={tw`text-slate-800 font-bold text-xs mb-1`}>
                  Gerbang Asal
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic('light');
                    setSearchQuery('');
                    setSelectedFilterWilayah('SEMUA');
                    setModalType('asal');
                  }}
                  activeOpacity={0.8}
                  style={tw`h-12 border border-slate-300 rounded-md px-2.5 flex-row items-center justify-between bg-white`}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      tw`text-xs flex-1 mr-1`,
                      selectedAsal
                        ? tw`text-slate-800 font-bold`
                        : tw`text-slate-400 font-normal`,
                    ]}
                  >
                    {selectedAsal ? selectedAsal.name : 'Gerbang Asal'}
                  </Text>
                  <Text style={tw`text-slate-400 text-[10px]`}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* Kolom 3: Gerbang Tujuan */}
              <View style={tw`flex-1 min-w-[110px]`}>
                <Text style={tw`text-slate-800 font-bold text-xs mb-1`}>
                  Gerbang Tujuan
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic('light');
                    setSearchQuery('');
                    setSelectedFilterWilayah('SEMUA');
                    setModalType('tujuan');
                  }}
                  activeOpacity={0.8}
                  style={tw`h-12 border border-slate-300 rounded-md px-2.5 flex-row items-center justify-between bg-white`}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      tw`text-xs flex-1 mr-1`,
                      selectedTujuan
                        ? tw`text-slate-800 font-bold`
                        : tw`text-slate-400 font-normal`,
                    ]}
                  >
                    {selectedTujuan ? selectedTujuan.name : 'Gerbang Tujuan'}
                  </Text>
                  <Text style={tw`text-slate-400 text-[10px]`}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ======================================================== */}
            {/* 2. DUA TOMBOL AKSI BIRU (PERSIS GAMBAR REFERENSI)          */}
            {/* ======================================================== */}
            <View style={tw`flex-row justify-center items-center gap-3 mt-4`}>
              {/* Tombol Tambah Tarif */}
              <TouchableOpacity
                onPress={handleTambahTarif}
                activeOpacity={0.85}
                style={[
                  tw`px-6 py-2.5 rounded-full items-center justify-center shadow-sm`,
                  { backgroundColor: '#1976D2' },
                ]}
              >
                <Text style={tw`text-white font-bold text-xs tracking-wide`}>
                  Tambah Tarif
                </Text>
              </TouchableOpacity>

              {/* Tombol Bersihkan Tarif */}
              <TouchableOpacity
                onPress={handleBersihkanTarif}
                activeOpacity={0.85}
                style={[
                  tw`px-6 py-2.5 rounded-full items-center justify-center shadow-sm`,
                  { backgroundColor: '#1976D2' },
                ]}
              >
                <Text style={tw`text-white font-bold text-xs tracking-wide`}>
                  Bersihkan Tarif
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ======================================================== */}
          {/* 3. GARIS PEMISAH TIPIS (PERSIS GAMBAR REFERENSI)          */}
          {/* ======================================================== */}
          <View style={tw`w-full h-[1px] bg-slate-200 my-4`} />

          {/* ======================================================== */}
          {/* 4. TOTAL TARIF CARD (PERSIS GAMBAR REFERENSI)             */}
          {/* ======================================================== */}
          <View style={tw`w-full items-center justify-center my-2`}>
            <View
              style={[
                tw`w-full max-w-sm bg-[#FAFAFA] rounded-2xl py-6 px-8 items-center justify-center border border-slate-100 shadow-sm`,
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                },
              ]}
            >
              <Text style={tw`text-slate-600 text-sm font-semibold mb-1`}>
                Total Tarif
              </Text>
              <Text
                style={[
                  tw`text-slate-700 tracking-tight`,
                  totalTarif > 0
                    ? tw`text-2xl font-black text-indigo-600`
                    : tw`text-base font-normal`,
                ]}
              >
                {formatRp(totalTarif)}
              </Text>

              {/* Status komparasi dengan saldo kartu NFC (jika ada kartu terdeteksi) */}
              {cardBalance !== null && totalTarif > 0 && (
                <View
                  style={[
                    tw`mt-3 py-1.5 px-3 rounded-xl flex-row items-center`,
                    cardBalance >= totalTarif
                      ? tw`bg-emerald-50 border border-emerald-200`
                      : tw`bg-rose-50 border border-rose-200`,
                  ]}
                >
                  <Text
                    style={[
                      tw`text-[11px] font-bold`,
                      cardBalance >= totalTarif
                        ? tw`text-emerald-700`
                        : tw`text-rose-700`,
                    ]}
                  >
                    {cardBalance >= totalTarif
                      ? `✓ Saldo Cukup (Sisa ${formatRp(cardBalance - totalTarif)})`
                      : `⚠ Saldo Kurang ${formatRp(totalTarif - cardBalance)} (Harap Top-Up)`}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* ======================================================== */}
          {/* 5. RINCIAN TARIF PER RUAS TOL (PERHITUNGAN OTOMATIS)      */}
          {/* ======================================================== */}
          {currentCalculation && currentCalculation.success && (
            <View style={tw`mt-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm`}>
              <View style={tw`flex-row items-center justify-between mb-3 border-b border-slate-100 pb-2`}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-base mr-1.5`}>🛣️</Text>
                  <Text style={tw`text-slate-800 font-extrabold text-xs uppercase tracking-wider`}>
                    Rincian Tarif Per Ruas Tol
                  </Text>
                </View>
                <View style={tw`bg-indigo-50 px-2 py-0.5 rounded-md`}>
                  <Text style={tw`text-indigo-600 font-bold text-[10px]`}>
                    ± {currentCalculation.distanceKm} Km
                  </Text>
                </View>
              </View>

              {/* Rute Awal -> Akhir Header */}
              <View style={tw`bg-slate-50 p-2.5 rounded-xl mb-3 flex-row items-center justify-between`}>
                <View style={tw`flex-1 mr-2`}>
                  <Text style={tw`text-[10px] text-slate-400 font-bold uppercase`}>Masuk</Text>
                  <Text style={tw`text-xs font-bold text-slate-800`} numberOfLines={1}>
                    {selectedAsal?.name}
                  </Text>
                  <Text style={tw`text-[10px] text-slate-400`}>
                    {selectedAsal?.wilayahName}
                  </Text>
                </View>

                <Text style={tw`text-indigo-500 font-black text-sm px-1`}>➔</Text>

                <View style={tw`flex-1 items-end ml-2`}>
                  <Text style={tw`text-[10px] text-slate-400 font-bold uppercase`}>Keluar</Text>
                  <Text style={tw`text-xs font-bold text-slate-800 text-right`} numberOfLines={1}>
                    {selectedTujuan?.name}
                  </Text>
                  <Text style={tw`text-[10px] text-slate-400 text-right`}>
                    {selectedTujuan?.wilayahName}
                  </Text>
                </View>
              </View>

              {/* List Breakdown Ruas */}
              {currentCalculation.segments.map((seg, idx) => (
                <View
                  key={idx}
                  style={tw`flex-row justify-between items-start py-2 border-b border-slate-50`}
                >
                  <View style={tw`flex-1 mr-3`}>
                    <Text style={tw`text-slate-800 font-bold text-xs`}>
                      {seg.ruasName}
                    </Text>
                    <Text style={tw`text-slate-400 text-[11px]`}>
                      {seg.fromName} ➔ {seg.toName}
                    </Text>
                  </View>
                  <Text style={tw`text-slate-800 font-black text-xs font-mono`}>
                    {formatRp(seg.fee)}
                  </Text>
                </View>
              ))}

              {/* Subtotal Rute Ini */}
              <View style={tw`flex-row justify-between items-center pt-3 mt-1`}>
                <Text style={tw`text-slate-500 font-bold text-xs`}>
                  Subtotal ({selectedGolongan.code})
                </Text>
                <Text style={tw`text-indigo-600 font-black text-sm`}>
                  {formatRp(currentCalculation.totalFee)}
                </Text>
              </View>
            </View>
          )}

          {/* ======================================================== */}
          {/* 6. DAFTAR TARIF YANG TELAH DITAMBAHKAN (MULTI-TRIP)       */}
          {/* ======================================================== */}
          {addedTrips.length > 0 && (
            <View style={tw`mt-5`}>
              <View style={tw`flex-row justify-between items-center mb-2 px-1`}>
                <Text style={tw`text-slate-800 font-extrabold text-xs uppercase tracking-wider`}>
                  Daftar Rute Perjalanan ({addedTrips.length})
                </Text>
                <TouchableOpacity onPress={() => setAddedTrips([])}>
                  <Text style={tw`text-rose-600 font-bold text-xs`}>Hapus Semua</Text>
                </TouchableOpacity>
              </View>

              {addedTrips.map((trip, idx) => (
                <View
                  key={trip.id}
                  style={tw`bg-white p-3.5 rounded-2xl mb-2.5 border border-slate-100 shadow-sm flex-row items-center justify-between`}
                >
                  <View style={tw`flex-1 mr-2`}>
                    <View style={tw`flex-row items-center mb-1`}>
                      <View style={tw`bg-blue-50 px-2 py-0.5 rounded mr-2`}>
                        <Text style={tw`text-blue-700 font-bold text-[10px]`}>
                          Rute #{idx + 1}
                        </Text>
                      </View>
                      <Text style={tw`text-slate-400 text-[10px] font-semibold`}>
                        {trip.golongan.code} • ± {trip.distanceKm} Km
                      </Text>
                    </View>

                    <Text style={tw`text-slate-800 font-bold text-xs`} numberOfLines={1}>
                      {trip.asal.name} ➔ {trip.tujuan.name}
                    </Text>
                    <Text style={tw`text-slate-400 text-[10px]`}>
                      {trip.asal.wilayahName} ke {trip.tujuan.wilayahName}
                    </Text>
                  </View>

                  <View style={tw`items-end flex-row items-center gap-2`}>
                    <Text style={tw`text-indigo-600 font-black text-sm font-mono`}>
                      {formatRp(trip.totalFee)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveTrip(trip.id)}
                      style={tw`w-6 h-6 rounded-full bg-slate-100 items-center justify-center`}
                    >
                      <Text style={tw`text-slate-400 font-bold text-xs`}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Attribution Footer */}
          <View style={tw`items-center mt-8 mb-2`}>
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
        </ScrollView>

        {/* ======================================================== */}
        {/* MODAL 1: PICKER GOLONGAN KENDARAAN                        */}
        {/* ======================================================== */}
        <Modal
          visible={modalType === 'golongan'}
          transparent
          animationType="fade"
          onRequestClose={() => setModalType(null)}
        >
          <View style={tw`flex-1 bg-black/50 justify-end`}>
            <View style={tw`bg-white rounded-t-3xl p-5 shadow-2xl`}>
              <View style={tw`flex-row justify-between items-center mb-3 pb-2 border-b border-slate-100`}>
                <Text style={tw`text-slate-900 font-black text-base`}>
                  Pilih Golongan Kendaraan
                </Text>
                <TouchableOpacity onPress={() => setModalType(null)}>
                  <Text style={tw`text-slate-400 font-bold text-base px-2`}>✕</Text>
                </TouchableOpacity>
              </View>

              {GOLONGAN_OPTIONS.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  onPress={() => {
                    triggerHaptic('light');
                    setSelectedGolongan(g);
                    setModalType(null);
                  }}
                  style={[
                    tw`p-3.5 rounded-xl mb-2 flex-row items-center justify-between border`,
                    selectedGolongan.id === g.id
                      ? tw`bg-blue-50/60 border-blue-500`
                      : tw`bg-slate-50 border-slate-100`,
                  ]}
                >
                  <View style={tw`flex-row items-center flex-1 mr-2`}>
                    <Text style={tw`text-2xl mr-3`}>{g.icon}</Text>
                    <View style={tw`flex-1`}>
                      <Text
                        style={[
                          tw`text-sm font-bold`,
                          selectedGolongan.id === g.id
                            ? tw`text-blue-700`
                            : tw`text-slate-800`,
                        ]}
                      >
                        {g.code}
                      </Text>
                      <Text style={tw`text-slate-500 text-[11px]`}>{g.desc}</Text>
                    </View>
                  </View>

                  {selectedGolongan.id === g.id && (
                    <Text style={tw`text-blue-600 font-bold text-base`}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* ======================================================== */}
        {/* MODAL 2: PICKER GERBANG ASAL & TUJUAN (SEARCHABLE)       */}
        {/* ======================================================== */}
        <Modal
          visible={modalType === 'asal' || modalType === 'tujuan'}
          transparent
          animationType="slide"
          onRequestClose={() => setModalType(null)}
        >
          <View style={tw`flex-1 bg-black/50 justify-end`}>
            <View style={[tw`bg-white rounded-t-3xl p-5 shadow-2xl`, { height: '80%' }]}>
              {/* Header Modal */}
              <View style={tw`flex-row justify-between items-center mb-3`}>
                <View>
                  <Text style={tw`text-slate-900 font-black text-base`}>
                    {modalType === 'asal' ? 'Pilih Gerbang Asal' : 'Pilih Gerbang Tujuan'}
                  </Text>
                  <Text style={tw`text-slate-400 text-xs`}>
                    Pilih gerbang tol di wilayah Jawa Timur
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setModalType(null)}>
                  <Text style={tw`text-slate-400 font-bold text-lg px-2`}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Search Bar Input (Pencarian Nama Gerbang Asal & Tujuan) */}
              <View style={tw`flex-row items-center bg-slate-100 rounded-xl px-3 py-2.5 mb-3 border border-slate-200`}>
                <Text style={tw`text-slate-400 mr-2 text-sm`}>🔍</Text>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={
                    modalType === 'asal'
                      ? 'Ketik nama gerbang asal (misal: Dupak, Waru, Malang)...'
                      : 'Ketik nama gerbang tujuan (misal: Madiun, Pasuruan, Bunder)...'
                  }
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-slate-800 text-xs font-semibold py-1`}
                  autoFocus={true}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    style={tw`w-5 h-5 rounded-full bg-slate-200 items-center justify-center`}
                  >
                    <Text style={tw`text-slate-500 font-bold text-[10px]`}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Filter Tabs Wilayah */}
              <View style={tw`mb-3`}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-1.5`}>
                  <TouchableOpacity
                    onPress={() => setSelectedFilterWilayah('SEMUA')}
                    style={[
                      tw`px-3 py-1.5 rounded-full border`,
                      selectedFilterWilayah === 'SEMUA'
                        ? tw`bg-blue-600 border-blue-600`
                        : tw`bg-slate-50 border-slate-200`,
                    ]}
                  >
                    <Text
                      style={[
                        tw`text-[11px] font-bold`,
                        selectedFilterWilayah === 'SEMUA'
                          ? tw`text-white`
                          : tw`text-slate-600`,
                      ]}
                    >
                      Semua (46)
                    </Text>
                  </TouchableOpacity>

                  {WILAYAH_TOL.map((w) => (
                    <TouchableOpacity
                      key={w.id}
                      onPress={() => setSelectedFilterWilayah(w.id)}
                      style={[
                        tw`px-3 py-1.5 rounded-full border`,
                        selectedFilterWilayah === w.id
                          ? tw`bg-blue-600 border-blue-600`
                          : tw`bg-slate-50 border-slate-200`,
                      ]}
                    >
                      <Text
                        style={[
                          tw`text-[11px] font-bold`,
                          selectedFilterWilayah === w.id
                            ? tw`text-white`
                            : tw`text-slate-600`,
                        ]}
                      >
                        {w.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* List Gerbang Tol */}
              <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
                {filteredGates.length === 0 ? (
                  <View style={tw`items-center justify-center py-8`}>
                    <Text style={tw`text-slate-400 text-xs`}>
                      Gerbang tol tidak ditemukan
                    </Text>
                  </View>
                ) : (
                  filteredGates.map((gate) => {
                    const isSelected =
                      (modalType === 'asal' && selectedAsal?.id === gate.id) ||
                      (modalType === 'tujuan' && selectedTujuan?.id === gate.id);

                    return (
                      <TouchableOpacity
                        key={gate.id}
                        onPress={() => {
                          triggerHaptic('light');
                          if (modalType === 'asal') {
                            setSelectedAsal(gate);
                          } else {
                            setSelectedTujuan(gate);
                          }
                          setModalType(null);
                        }}
                        style={[
                          tw`p-3 rounded-xl mb-2 flex-row items-center justify-between border`,
                          isSelected
                            ? tw`bg-blue-50/60 border-blue-500`
                            : tw`bg-slate-50/60 border-slate-100`,
                        ]}
                        activeOpacity={0.8}
                      >
                        <View style={tw`flex-1 mr-2`}>
                          <Text
                            style={[
                              tw`text-xs font-bold`,
                              isSelected ? tw`text-blue-700` : tw`text-slate-800`,
                            ]}
                          >
                            {gate.name}
                          </Text>
                          <Text style={tw`text-slate-400 text-[10px]`}>
                            {gate.wilayahName} • {gate.ruas}
                          </Text>
                        </View>

                        <View style={tw`items-end`}>
                          <Text style={tw`text-slate-400 text-[10px]`}>
                            KM {gate.km}
                          </Text>
                          {isSelected && (
                            <Text style={tw`text-blue-600 font-bold text-xs`}>
                              ✓ Terpilih
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
