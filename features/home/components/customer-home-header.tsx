import { minimumTouchTarget } from "@/ui/touch-target";
import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { useCustomerNotifications } from "@/lib/use-cases/use-customer-notifications";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon } from "@/ui/app-icon";

export function CustomerHomeHeader({
  customerName,
  onTracking,
  onNotifications,
  onAccount,
}: {
  customerName?: string;
  onTracking: () => void;
  onNotifications: () => void;
  onAccount: () => void;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const { notifications } = useCustomerNotifications();
  const firstName = customerName?.trim().split(/\s+/)[0] || "there";
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.brand}>
          <Image
            accessibilityLabel="Newworld Cargo"
            source={require("@/assets/images/new-world-cargo-logo-light.png")}
            resizeMode="contain"
            style={styles.wordmark}
          />
        </View>
        <View style={styles.actions}>
          <HeaderNotification
            badge={notifications.some((item) => item.unread)}
            onPress={onNotifications}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open Account"
            accessibilityHint="Open your account and delivery preferences"
            onPress={onAccount}
            activeOpacity={0.74}
            style={[styles.avatar, minimumTouchTarget]}
          >
            <Text style={styles.avatarText}>
              {firstName.slice(0, 1).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.greeting}>
        <Text style={styles.eyebrow}>YOUR CARGO DESK</Text>
        <Text accessibilityRole="header" style={styles.title}>
          Hello, {firstName}.
        </Text>
        <Text style={styles.subtitle}>Let’s get it moving.</Text>
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Track a shipment"
        onPress={onTracking}
        style={[styles.trackAction, minimumTouchTarget]}
      >
        <AppIcon name="barcode-scan" size={22} color={nwcColors.primaryInk} />
        <Text style={styles.trackLabel}>Track a shipment</Text>
        <AppIcon
          name="arrow-top-right"
          size={22}
          color={nwcColors.primaryInk}
        />
      </TouchableOpacity>
    </View>
  );
}

function HeaderNotification({
  badge,
  onPress,
}: {
  badge: boolean;
  onPress: () => void;
}) {
  const colors = useNwcColors();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Open notifications"
      onPress={onPress}
      style={[
        { alignItems: "center", justifyContent: "center" },
        minimumTouchTarget,
      ]}
    >
      <AppIcon name="bell-outline" size={23} color={colors.white} />
      {badge ? (
        <View
          style={{
            position: "absolute",
            right: 9,
            top: 8,
            height: 7,
            width: 7,
            borderRadius: 4,
            backgroundColor: colors.primary,
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    greeting: { gap: 2 },
    eyebrow: {
      color: nwcColors.primary,
      fontSize: 10,
      lineHeight: 16,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: 1.8,
    },
    title: {
      fontSize: 38,
      lineHeight: 48,
      letterSpacing: -1.3,
      fontFamily: "Poppins_600SemiBold",
      color: nwcColors.white,
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Poppins_500Medium",
      color: nwcColors.tintC9D7E1,
    },
    trackAction: {
      backgroundColor: nwcColors.primary,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 10,
    },
    trackLabel: {
      flex: 1,
      fontSize: 15,
      lineHeight: 22,
      fontFamily: "Poppins_600SemiBold",
      color: nwcColors.primaryInk,
    },
    header: {
      marginHorizontal: -20,
      borderBottomRightRadius: 44,
      paddingTop: 22,
      paddingBottom: 24,
      minHeight: 260,
      borderRadius: 0,
      paddingHorizontal: 24,
      backgroundColor: nwcColors.brandNavy,
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "space-between",
      gap: 24,
    },
    brand: {
      flex: 1,
      minWidth: 0,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },
    wordmark: { width: 152, height: 51, tintColor: nwcColors.white },
    actions: { flexDirection: "row", alignItems: "center", gap: 6 },
    avatar: {
      width: 38,
      height: 38,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.primary,
      borderWidth: 0,
      borderColor: nwcColors.primary,
    },
    avatarText: {
      color: nwcColors.primaryInk,
      fontSize: 13,
      lineHeight: 18,
      fontFamily: "Poppins_600SemiBold",
    },
  });
