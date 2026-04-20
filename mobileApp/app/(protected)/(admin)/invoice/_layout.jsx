import React from 'react'
import { Stack } from 'expo-router'
import colors from '../../../../constants/colors'
import { DrawerToggleButton } from '@react-navigation/drawer'

export default function InvoiceLayout() {
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
        headerTintColor: colors.PRIMARY,
      }}
    >
        <Stack.Screen name="index" options={{
          title: "All Invoice",
          headerLeft: () => <DrawerToggleButton tintColor={colors.DARK} />,
        }} />
        <Stack.Screen name="AddInvoice" options={{
          title: "Direct Invoice",
          headerBackTitle: "Invoices",
        }}
        />
        <Stack.Screen name="[id]" options={{
          title: "Invoice & Billing",
          headerBackTitle: "Invoices",
        }}
        />
        <Stack.Screen name="revenue" options={{
          headerShown: false,
        }}
        />
    </Stack>
  )
}