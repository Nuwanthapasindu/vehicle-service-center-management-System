import { Tabs } from 'expo-router';
import { Truck, ClipboardList } from 'lucide-react-native';

export default function SupplyChainTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#84CC16',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="suppliers"
        options={{
          title: 'SUPPLIERS',
          tabBarIcon: ({ color }) => <Truck size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="supplies"
        options={{
          title: 'SUPPLIES',
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
