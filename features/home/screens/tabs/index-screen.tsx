import { minimumTouchTarget } from "@/ui/touch-target";
import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { ListSkeleton } from "@/ui/skeleton";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, type Href } from "expo-router";
import { CustomerHomeHeader } from "@/features/home/components/customer-home-header";
import { DeliverySnapshot } from "@/features/home/components/delivery-snapshot";
import { HomeServiceTile } from "@/features/home/components/home-service-tile";
import { MyOrderRow } from "@/features/home/components/my-order-row";
import { useCustomerContentInsets } from "@/ui/layout/customer-screen-layout";
import { AppIcon } from "@/ui/app-icon";
import { Card, Screen } from "@/ui/nwc-ui";
import { toUiShipments } from "@/lib/mappers/shipment-ui-mapper";
import {
  firstActiveShipment,
  shipmentDestination,
} from "@/lib/shipment-navigation";

import { useCustomerShipments } from "@/lib/use-cases/use-customer-shipments";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function HomeScreen() {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const { customer } = useCustomerAuth();
  const shipmentState = useCustomerShipments();
  const contentInsets = useCustomerContentInsets({
    hasFloatingNavigation: true,
  });
  const shipments = toUiShipments(shipmentState.shipments);
  const activeShipment = firstActiveShipment(shipments);
  const orders = shipments.slice(0, 2);
  return (
    <Screen>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={[styles.content, contentInsets]}
          showsVerticalScrollIndicator={false}
        >
          <CustomerHomeHeader
            customerName={customer?.name}
            onTracking={() => router.push("/tracking" as Href)}
            onNotifications={() => router.push("/notifications" as Href)}
            onAccount={() => router.push("/account" as Href)}
          />
          {activeShipment ? (
            <View style={styles.activeSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Track your shipment</Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="View active shipment"
                  onPress={() =>
                    router.push(shipmentDestination(activeShipment) as Href)
                  }
                  style={[styles.sectionAction, minimumTouchTarget]}
                >
                  <Text style={styles.sectionActionText}>Open</Text>
                  <AppIcon
                    name="chevron-right"
                    size={18}
                    color={nwcColors.info}
                  />
                </TouchableOpacity>
              </View>
              <DeliverySnapshot
                shipment={activeShipment}
                onPress={() =>
                  router.push(shipmentDestination(activeShipment) as Href)
                }
              />
            </View>
          ) : null}
          <View style={styles.servicesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Where are you sending?</Text>
            </View>
            <View style={styles.serviceGrid}>
              <HomeServiceTile
                title="International Imports"
                subtitle="From any country"
                icon="ferry"
                image={require("@/assets/images/services/cargo-parcel-transparent.png")}
                variant="compact"
                onPress={() => router.push("/import/route" as Href)}
              />
              <HomeServiceTile
                title="City-to-City"
                subtitle="Between cities"
                icon="truck-outline"
                image={require("@/assets/images/services/new-world-truck.png")}
                variant="compact"
                onPress={() => router.push("/intercity/route" as Href)}
              />
              <HomeServiceTile
                title="Local Delivery"
                subtitle="Within your city"
                capacity="< 100 kg"
                icon="moped-outline"
                image={require("@/assets/images/services/new-world-scooter.png")}
                variant="wide"
                onPress={() => router.push("/local-delivery/route" as Href)}
              />
              <HomeServiceTile
                title="Custom Request"
                icon="arrow-top-right"
                variant="custom"
                onPress={() => router.push("/custom/route" as Href)}
              />
            </View>
          </View>
          <View style={styles.ordersSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Your shipments</Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="View all shipments"
                onPress={() => router.push("/shipments" as Href)}
                style={[styles.sectionAction, minimumTouchTarget]}
              >
                <Text style={styles.sectionActionText}>View all</Text>
                <AppIcon
                  name="chevron-right"
                  size={18}
                  color={nwcColors.info}
                />
              </TouchableOpacity>
            </View>
            {orders.length ? (
              <View style={styles.ordersList}>
                {orders.map((shipment) => (
                  <MyOrderRow
                    key={shipment.id}
                    shipment={shipment}
                    onPress={() =>
                      router.push(shipmentDestination(shipment) as Href)
                    }
                  />
                ))}
              </View>
            ) : (
              <HomeStateCard
                status={shipmentState.status}
                message={shipmentState.errorMessage}
                onRetry={shipmentState.refresh}
                compact
              />
            )}
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

function HomeStateCard({
  status,
  message,
  compact = false,
  onRetry,
}: {
  status: "idle" | "loading" | "success" | "empty" | "error";
  message?: string;
  compact?: boolean;
  onRetry: () => void;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const isError = status === "error";
  if (status === "idle" || status === "loading")
    return <ListSkeleton count={2} />;
  const title = isError ? "Shipments could not load" : "No shipments yet";
  const detail = isError
    ? message || "Try again when your connection is stable."
    : "When you book or receive cargo, it will appear here.";
  return (
    <Card style={[styles.stateCard, compact && styles.stateCardCompact]}>
      <View style={styles.stateIcon}>
        <AppIcon
          name={
            isError
              ? "alert-circle-outline"
              : status === "empty"
                ? "package-variant"
                : "progress-clock"
          }
          size={22}
          color={nwcColors.primaryInk}
        />
      </View>
      <View style={styles.stateCopy}>
        <Text style={styles.stateTitle}>{title}</Text>
        <Text style={styles.stateDetail}>{detail}</Text>
      </View>
      {isError ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Try loading shipments again"
          onPress={onRetry}
          style={[styles.retryButton, minimumTouchTarget]}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </Card>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    page: { flex: 1, backgroundColor: nwcColors.background },
    content: { gap: 24 },
    activeSection: { gap: 10 },
    servicesSection: { gap: 10 },
    sectionHeader: {
      minHeight: 33,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    sectionEyebrow: {
      color: nwcColors.info,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: 0.7,
      textTransform: "uppercase",
    },
    sectionTitle: {
      color: nwcColors.foreground,
      fontSize: 20,
      lineHeight: 26,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: -0.25,
    },
    sectionAction: {
      minHeight: 44,
      paddingHorizontal: 5,
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    sectionActionText: {
      color: nwcColors.info,
      fontSize: 11,
      lineHeight: 15,
      fontFamily: "Poppins_600SemiBold",
    },
    serviceGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      justifyContent: "space-between",
    },
    ordersSection: { gap: 8 },
    ordersList: { borderTopWidth: 1, borderTopColor: nwcColors.border },
    stateCard: {
      minHeight: 116,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 24,
      backgroundColor: nwcColors.surfaceRaised,
    },
    stateCardCompact: { minHeight: 86 },
    stateIcon: {
      width: 44,
      height: 44,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.primary,
    },
    stateCopy: { flex: 1, gap: 2 },
    stateTitle: {
      color: nwcColors.foreground,
      fontSize: 14,
      lineHeight: 19,
      fontFamily: "Poppins_600SemiBold",
    },
    stateDetail: {
      color: nwcColors.muted,
      fontSize: 11,
      lineHeight: 16,
      fontFamily: "Poppins_500Medium",
    },
    retryButton: {
      minHeight: 44,
      borderRadius: 12,
      paddingHorizontal: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.brandNavy,
    },
    retryText: {
      color: nwcColors.white,
      fontSize: 11,
      lineHeight: 15,
      fontFamily: "Poppins_600SemiBold",
    },
  });
