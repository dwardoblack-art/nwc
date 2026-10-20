import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { AccountRow } from "@/features/account/components/account-row";
import { useCustomerContentInsets } from "@/ui/layout/customer-screen-layout";
import { Screen } from "@/ui/nwc-ui";
import type { AppIconName } from "@/ui/app-icon";
import { useCustomerAuth } from "@/stores/customer-auth";

const entries: {
  title: string;
  detail: string;
  icon: AppIconName;
  path: string;
}[] = [
  {
    title: "Edit profile",
    detail: "Your photo and contact details",
    icon: "account-circle-outline",
    path: "/account/profile",
  },
  {
    title: "Saved places",
    detail: "Pickup and delivery addresses",
    icon: "map-marker-outline",
    path: "/account/saved-places",
  },
  {
    title: "Recipients",
    detail: "People you send cargo to",
    icon: "account-outline",
    path: "/account/recipients",
  },
  {
    title: "Payment methods",
    detail: "Your saved mobile money accounts",
    icon: "wallet-outline",
    path: "/account/payment-methods",
  },
  {
    title: "Receipts",
    detail: "View your payment receipts",
    icon: "receipt-text-outline",
    path: "/bills/receipts",
  },
  {
    title: "Notifications",
    detail: "Choose the updates you receive",
    icon: "bell-outline",
    path: "/notifications/preferences",
  },
  {
    title: "Permissions",
    detail: "Camera, location and contacts",
    icon: "shield-check-outline",
    path: "/permissions",
  },
  {
    title: "Legal & policies",
    detail: "Terms and privacy",
    icon: "file-document-outline",
    path: "/account/legal",
  },
  {
    title: "Delete account",
    detail: "Request deletion of your account and personal data",
    icon: "account-outline",
    path: "/account/delete",
  },
  {
    title: "About Newworld Cargo",
    detail: "Learn about your cargo partner",
    icon: "information-outline",
    path: "/account/about",
  },
  {
    title: "Support",
    detail: "Get help with your shipment",
    icon: "headset",
    path: "/support",
  },
];

export function AccountSettingsScreen({
  hasFloatingNavigation = false,
}: {
  hasFloatingNavigation?: boolean;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const { customer, signOut } = useCustomerAuth();
  const insets = useCustomerContentInsets({ hasFloatingNavigation });
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, insets]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            {customer?.name || "Your account"}
          </Text>
        </View>
        <View style={styles.group}>
          {entries.map((entry) => (
            <View key={entry.path} style={styles.row}>
              <AccountRow
                {...entry}
                onPress={() => router.push(entry.path as Href)}
              />
            </View>
          ))}
        </View>
        <AccountRow
          title="Sign out"
          detail="Sign out of your account on this device"
          icon="logout"
          onPress={async () => {
            await signOut();
            router.replace("/auth/phone" as Href);
          }}
        />
      </ScrollView>
    </Screen>
  );
}
export default AccountSettingsScreen;
const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    content: { gap: 28 },
    heading: {
      backgroundColor: nwcColors.brandNavy,
      marginHorizontal: -20,
      padding: 24,
      borderBottomRightRadius: 40,
      minHeight: 180,
      justifyContent: "flex-end",
      gap: 10,
    },
    title: {
      letterSpacing: -1.5,
      fontSize: 42,
      lineHeight: 50,
      fontFamily: "Poppins_600SemiBold",
      color: nwcColors.white,
    },
    subtitle: {
      lineHeight: 24,
      fontSize: 16,
      fontFamily: "Poppins_500Medium",
      color: nwcColors.tintC9D7E1,
    },
    group: {
      backgroundColor: nwcColors.background,
      borderRadius: 0,
      paddingHorizontal: 0,
    },
    row: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: nwcColors.border,
    },
  });
