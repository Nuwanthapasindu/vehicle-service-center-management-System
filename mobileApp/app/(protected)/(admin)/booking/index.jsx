import { Redirect } from "expo-router";

export default function BookingIndex() {
  return <Redirect href="/(protected)/(admin)/booking/(tabs)/upcoming" />;
}
