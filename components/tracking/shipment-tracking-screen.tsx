import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { LiveTrackingMap } from "@/components/tracking/live-tracking-map";
import {
  DeliveryProgressCard,
  LiveShipmentContextCard,
  TrackingContactCard,
  TrackingActionList,
  TrackingHistoryPanel,
  TrackingReferenceActions,
} from "@/components/tracking/tracking-cards";
import { IconButton, Screen } from "@/components/ui/nwc-ui";
import { getLiveTrackingHistory } from "@/lib/live-tracking-history";
import { trackingRouteOverview } from "@/lib/maps/tracking-route";

import type { Shipment } from "@/types/cargo";

export function ShipmentTrackingScreen({
  shipment,
  isStale,
  onRefresh,
  customerActions = false,
}: {
  shipment: Shipment;
  isStale?: boolean;
  onRefresh: () => void;
  customerActions?: boolean;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const [historyOpen, setHistoryOpen] = useState(true);
  const route = trackingRouteOverview(shipment);
  const service =
    shipment.service === "import"
      ? "International shipping"
      : shipment.service === "intercity"
        ? "City-to-City shipping"
        : "Local delivery";
  const contact = shipment.trackingContact;
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        <View style={styles.map}>
          <LiveTrackingMap shipment={shipment} />
          <View style={styles.controls}>
            <IconButton
              label="Go back"
              icon="arrow-left"
              onPress={() => router.back()}
            />
            <IconButton
              label="Refresh tracking"
              icon="refresh"
              onPress={onRefresh}
            />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.service}>{service}</Text>
          {isStale ? (
            <Text accessibilityRole="alert" style={styles.note}>
              Connection interrupted. Showing the last saved tracking
              information.
            </Text>
          ) : null}
          {route.approximate ? (
            <Text style={styles.note}>
              Pins show the route’s approximate areas. Shipment events show the
              latest recorded movement.
            </Text>
          ) : null}
          <LiveShipmentContextCard shipment={shipment} />
          <TrackingReferenceActions reference={shipment.reference} />
          {customerActions && contact ? (
            <TrackingContactCard
              contact={contact}
              onCall={() => void Linking.openURL(`tel:${contact.phone}`)}
              onMessage={() => router.push("/support" as never)}
            />
          ) : null}
          <DeliveryProgressCard shipment={shipment} />
          {customerActions ? (
            <TrackingActionList
              onOrder={() => router.push(`/orders/${shipment.id}` as never)}
              onPayment={() => router.push("/bills" as never)}
              onSupport={() => router.push("/support" as never)}
              onPickup={
                shipment.status === "pending"
                  ? () => router.push(`/pickups/${shipment.id}` as never)
                  : undefined
              }
              onDelivery={
                shipment.status === "out_for_delivery"
                  ? () =>
                      router.push(`/shipments/${shipment.id}/manage` as never)
                  : undefined
              }
            />
          ) : null}
          {shipment.trackingEvents?.length ? (
            <TrackingHistoryPanel
              events={getLiveTrackingHistory(shipment)}
              open={historyOpen}
              onToggle={() => setHistoryOpen((value) => !value)}
            />
          ) : (
            <Text style={styles.note}>
              No shipment events have been recorded yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    page: { paddingBottom: 32 },
    map: { height: 328 },
    controls: {
      position: "absolute",
      top: 16,
      left: 20,
      flexDirection: "row",
      gap: 10,
    },
    content: { padding: 20, gap: 20 },
    service: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 20,
      lineHeight: 28,
      color: nwcColors.foreground,
    },
    note: {
      fontFamily: "Poppins_500Medium",
      fontSize: 12,
      lineHeight: 18,
      color: nwcColors.muted,
    },
  });
