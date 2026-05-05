import { Redirect } from 'expo-router';

export default function SupplyChainIndex() {
  return <Redirect href="/(protected)/(admin)/supplychain/(tabs)/suppliers" />;
}