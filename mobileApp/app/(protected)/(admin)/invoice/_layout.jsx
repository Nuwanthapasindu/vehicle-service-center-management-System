import React from 'react'
import { Stack, useRouter } from 'expo-router'
import colors from '../../../../constants/colors'
import { DrawerToggleButton } from '@react-navigation/drawer'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function InvoiceLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.LIGHT,
        },
        headerTitleStyle: {
          fontWeight: "800",
          color: colors.DARK,
        },
        headerShadowVisible: false,
        headerTintColor: colors.DARK,
        headerTitleAlign: 'center',
      }}
    >
        <Stack.Screen name="index" options={{
          title: "All Invoice",
          headerLeft: () => <DrawerToggleButton tintColor={colors.DARK} />,
        }} />
        <Stack.Screen name="AddInvoice" options={{
          title: "Direct Invoice",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 0 }}>
              <Ionicons name="chevron-back" size={28} color={colors.DARK} />
            </TouchableOpacity>
          ),
        }}
        />
        <Stack.Screen name="[id]" options={{
          title: "Invoice & Billing",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/(protected)/(admin)/invoice")} style={{ marginLeft: 0 }}>
              <Ionicons name="chevron-back" size={28} color={colors.DARK} />
            </TouchableOpacity>
          ),
        }}
        />
    </Stack>
  )
}