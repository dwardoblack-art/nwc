import { minimumTouchTarget } from "@/ui/touch-target";
import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, type Href } from "expo-router";
import { ServiceCard } from "@/features/booking/components/cargo-cards";
import { useFloatingNavigationClearance } from "@/ui/navigation/use-floating-navigation-clearance";
import { Screen } from "@/ui/nwc-ui";
import { DeskHeading } from "@/ui/desk-heading";

export default function SendScreen() {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const floatingNavigationClearance = useFloatingNavigationClearance();
  const openLocalRoute = () => router.push("/local-delivery/route" as Href);
  return (
    <Screen>
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: floatingNavigationClearance },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View style={styles.headingRow}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Open saved booking drafts"
                onPress={() => router.push("/bookings/drafts" as Href)}
                style={[styles.draftsAction, minimumTouchTarget]}
              >
                <Text style={styles.draftsText}>Saved drafts</Text>
              </TouchableOpacity>
            </View>
            <DeskHeading
              eyebrow="BOOK A DELIVERY / 01"
              title={"Make your\nnext move."}
              detail="Choose a service. We’ll take care of the journey."
            />
          </View>
          <View style={styles.services}>
            <ServiceCard
              service="local"
              image={require("@/assets/images/services/new-world-scooter.png")}
              onPress={openLocalRoute}
            />
            <ServiceCard
              service="intercity"
              image={require("@/assets/images/services/new-world-truck.png")}
              onPress={() => router.push("/intercity/route" as Href)}
            />
            <ServiceCard
              service="import"
              image={require("@/assets/images/services/cargo-parcel-transparent.png")}
              onPress={() => router.push("/import/route" as Href)}
            />
          </View>
          <View style={styles.footerNote}>
            <Text style={styles.footerTitle}>Need something different?</Text>
            <Text style={styles.footerDetail}>
              Choose Custom Request from Home and we will shape a cargo move
              around your needs.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    page: { flex: 1, backgroundColor: nwcColors.background },
    content: { paddingHorizontal: 24, paddingTop: 22, gap: 28 },
    headingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    draftsAction: {
      alignSelf: "flex-end",
      minHeight: 44,
      justifyContent: "center",
      paddingHorizontal: 4,
    },
    draftsText: {
      color: nwcColors.info,
      fontSize: 11,
      lineHeight: 15,
      fontFamily: "Poppins_600SemiBold",
    },
    eyebrow: {
      color: nwcColors.info,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "800",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    detail: {
      color: nwcColors.muted,
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "500",
      marginTop: -4,
    },
    services: { gap: 0 },
    footerNote: {
      borderLeftWidth: 3,
      borderLeftColor: nwcColors.primary,
      paddingLeft: 16,
      paddingVertical: 8,
      gap: 8,
      paddingHorizontal: 4,
    },
    footerTitle: {
      color: nwcColors.foreground,
      fontSize: 16,
      lineHeight: 23,
      fontFamily: "Poppins_600SemiBold",
    },
    footerDetail: {
      color: nwcColors.muted,
      fontSize: 12,
      lineHeight: 18,
      fontFamily: "Poppins_500Medium",
    },
  });
