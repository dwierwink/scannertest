import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

/**
 * Komponen Supported Networks
 * Menampilkan label "Supported Networks" dan logo badge jaringan bank e-money Indonesia
 * (Mastercard, Visa, BCA, Mandiri, BNI, BRI)
 */
export default function SupportedNetworks() {
  return (
    <View style={tw`items-center my-4`}>
      <Text style={tw`text-slate-400 text-[11px] font-semibold tracking-wider mb-2`}>
        Supported Networks
      </Text>

      <View style={tw`flex-row items-center justify-center flex-wrap gap-2`}>
        {/* Mastercard Badge */}
        <View style={tw`flex-row items-center bg-slate-50 px-2 py-1 rounded-md border border-slate-200/80`}>
          <View style={[tw`w-3.5 h-3.5 rounded-full bg-red-500 mr-[-5px]`]} />
          <View style={[tw`w-3.5 h-3.5 rounded-full bg-amber-400 mr-1.5`]} />
          <Text style={tw`text-[10px] font-bold text-slate-700`}>Mastercard</Text>
        </View>

        {/* Visa Badge */}
        <View style={tw`bg-slate-50 px-2 py-1 rounded-md border border-slate-200/80`}>
          <Text style={tw`text-[10px] font-black text-blue-800 tracking-wider`}>VISA</Text>
        </View>

        {/* BCA Flazz Badge */}
        <View style={tw`bg-blue-50 px-2 py-1 rounded-md border border-blue-200`}>
          <Text style={tw`text-[10px] font-bold text-blue-700`}>Flazz BCA</Text>
        </View>

        {/* Mandiri e-Money Badge */}
        <View style={tw`bg-amber-50 px-2 py-1 rounded-md border border-amber-200`}>
          <Text style={tw`text-[10px] font-bold text-amber-800`}>e-Money</Text>
        </View>

        {/* BNI TapCash Badge */}
        <View style={tw`bg-orange-50 px-2 py-1 rounded-md border border-orange-200`}>
          <Text style={tw`text-[10px] font-bold text-orange-700`}>TapCash</Text>
        </View>

        {/* BRI Brizzi Badge */}
        <View style={tw`bg-sky-50 px-2 py-1 rounded-md border border-sky-200`}>
          <Text style={tw`text-[10px] font-bold text-sky-800`}>BRIZZI</Text>
        </View>
      </View>
    </View>
  );
}
