import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import colors from '../../../../constants/colors';

export default function BookingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
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
      <Stack.Screen 
        name="(tabs)" 
        options={{
          title: 'Bookings',
          headerLeft: () => <DrawerToggleButton tintColor={colors.DARK} />
        }} 
      />
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{
          title: 'Booking Details',
          headerBackTitleVisible: true,
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="manage/[id]" 
        options={{
          title: 'Manage Booking',
          headerBackTitleVisible: true,
          headerBackTitle: "Back",
        }} 
      />
    </Stack>
  );
}
