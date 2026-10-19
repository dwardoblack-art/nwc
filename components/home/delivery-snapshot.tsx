import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { trackingRouteOverview } from "@/lib/maps/tracking-route";
import { NativeMapSurface } from "@/components/map/native-map-surface";
import { AppIcon } from "@/components/ui/app-icon";

import type { Address, Shipment } from "@/types/cargo";
function point(address: Address) {
  return Number.isFinite(address.latitude) && Number.isFinite(address.longitude)
    ? {
        latitude: address.latitude!,
        longitude: address.longitude!,
        label: address.detail || address.city,
      }
    : null;
}
export function DeliverySnapshot({
  shipment,
  onPress,
}: {
  shipment: Shipment;
  onPress: () => void;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const route = trackingRouteOverview(shipment);
  const origin = point(route.pickup),
    destination = point(route.destination);
  return (
    <View style={styles.card}>
      <NativeMapSurface
        height={220}
        origin={origin}
        destination={destination}
        progress={0}
        completed={false}
        routeMode={shipment.service === "import" ? "direct" : "road"}
        requestCurrentLocation={false}
        showControls={false}
      />
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={"Open shipment " + shipment.reference}
        onPress={onPress}
        style={styles.overlay}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.reference}>{shipment.reference}</Text>
          <Text style={styles.detail}>
            {origin || destination
              ? route.approximate
                ? "Route overview · View tracking"
                : "View shipment tracking"
              : "Shipment locations not yet available"}
          </Text>
        </View>
        <AppIcon
          name="arrow-top-right"
          size={22}
          color={nwcColors.foreground}
        />
      </TouchableOpacity>
    </View>
  );
}
const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    card: {
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: nwcColors.surfaceRaised,
    },
    overlay: {
      position: "absolute",
      bottom: 30,
      left: 12,
      right: 12,
      minHeight: 54,
      borderRadius: 16,
      padding: 12,
      backgroundColor: "white",
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    reference: {
      fontFamily: "Poppins_700Bold",
      fontSize: 14,
      color: nwcColors.foreground,
    },
    detail: { fontSize: 11, color: nwcColors.muted },
  });
