import { TrackingSkeleton } from "@/components/ui/skeleton";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ShipmentTrackingScreen } from "@/components/tracking/shipment-tracking-screen";
import { AppIcon } from "@/components/ui/app-icon";
import { PrimaryButton, Screen } from "@/components/ui/nwc-ui";
import { toUiShipment } from "@/lib/mappers/shipment-ui-mapper";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerShipment } from "@/lib/use-cases/use-customer-shipment";

export default function LiveTrackingScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId: string }>();
  const shipmentState = useCustomerShipment(shipmentId, {
    pollIntervalMs: 15000,
  });
  const shipment = shipmentState.shipment
    ? toUiShipment(shipmentState.shipment)
    : null;
  if (!shipment)
    return (
      <TrackingStateScreen
        status={shipmentState.status}
        message={shipmentState.errorMessage}
        onRetry={shipmentState.refresh}
      />
    );
  return (
    <ShipmentTrackingScreen
      shipment={shipment}
      isStale={shipmentState.isStale}
      onRefresh={shipmentState.refresh}
      customerActions
    />
  );
}

function TrackingStateScreen({
  status,
  message,
  onRetry,
}: {
  status: "idle" | "loading" | "success" | "not-found" | "error";
  message?: string;
  onRetry: () => void;
}) {
  if (status === "loading" || status === "idle")
    return (
      <Screen>
        <ScrollView>
          <View style={{ padding: 16 }}>
            <RoundControl
              label="Go back"
              icon="arrow-left"
              onPress={() => router.back()}
            />
          </View>
          <TrackingSkeleton />
        </ScrollView>
      </Screen>
    );
  const isError = status === "error";
  const title = isError ? "Tracking could not load" : "Shipment not found";
  const detail = isError
    ? message || "Try again when your connection is stable."
    : "Check the shipment reference and try again.";
  return (
    <Screen>
      <View style={styles.statePage}>
        <View style={styles.stateIcon}>
          <AppIcon
            name={isError ? "alert-circle-outline" : "package-variant"}
            size={30}
            color={nwcColors.primaryInk}
          />
        </View>
        <Text style={styles.stateTitle}>{title}</Text>
        <Text style={styles.stateDetail}>{detail}</Text>
        {isError ? <PrimaryButton label="Try again" onPress={onRetry} /> : null}
      </View>
    </Screen>
  );
}

function RoundControl({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: Parameters<typeof AppIcon>[0]["name"];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.74}
      onPress={onPress}
      style={styles.roundControl}
    >
      <AppIcon name={icon} size={24} color={nwcColors.primaryInk} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  mapArea: { height: 328, position: "relative" },
  mapHeader: {
    position: "absolute",
    left: 20,
    right: 20,
    top: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerActions: { flexDirection: "row", gap: 10 },
  roundControl: {
    width: 52,
    height: 52,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "#F0F3F4",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 42,
    gap: 12,
  },
  trackingNote: {
    color: nwcColors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
    paddingHorizontal: 14,
    paddingTop: 2,
  },
  freshness: {
    minHeight: 38,
    borderRadius: 13,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#EAF7F0",
  },
  freshnessStale: { backgroundColor: "#FFF4DA" },
  freshnessText: {
    flex: 1,
    color: nwcColors.success,
    fontSize: 10,
    lineHeight: 15,
    fontFamily: "Poppins_700Bold",
  },
  freshnessTextStale: { color: nwcColors.warning },
  statePage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 9,
    backgroundColor: nwcColors.background,
  },
  stateIcon: {
    width: 68,
    height: 68,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nwcColors.primary,
    marginBottom: 6,
  },
  stateTitle: {
    color: nwcColors.foreground,
    fontSize: 23,
    lineHeight: 29,
    fontFamily: "Poppins_800ExtraBold",
    textAlign: "center",
  },
  stateDetail: {
    color: nwcColors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
  },
});
