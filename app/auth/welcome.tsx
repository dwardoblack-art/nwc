import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton, SecondaryButton } from "@/components/ui/nwc-ui";

export default function WelcomeScreen() {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image
          accessibilityLabel="Newworld Cargo"
          source={require("../../assets/images/new-world-cargo-logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>

      <View style={styles.message}>
        <Text style={styles.title}>Move your Katundu with confidence.</Text>
        <Text style={styles.detail}>
          International shipping, local deliveries and cargo tracking, all in
          one place.
        </Text>
      </View>

      <SecondaryButton
        label="Track a shipment"
        icon="barcode-scan"
        onPress={() => router.push("/tracking" as Href)}
      />
      <PrimaryButton
        label="Continue"
        accessibilityHint="Continue to app permissions"
        onPress={() => router.push("/auth/permissions" as Href)}
        style={styles.continueButton}
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: nwcColors.background,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 18,
    },
    header: {
      alignItems: "flex-start",
    },
    logo: {
      width: 190,
      height: 76,
    },
    message: {
      flex: 1,
      minHeight: 340,
      alignItems: "flex-start",
      justifyContent: "center",
      gap: 12,
      paddingVertical: 32,
    },
    title: {
      color: nwcColors.foreground,
      textAlign: "left",
      fontSize: 34,
      lineHeight: 42,
      letterSpacing: -0.8,
      fontFamily: "Poppins_600SemiBold",
    },
    detail: {
      maxWidth: 310,
      color: nwcColors.muted,
      textAlign: "left",
      fontSize: 15,
      lineHeight: 23,
      fontFamily: "Poppins_500Medium",
    },
    continueButton: { minHeight: 44, width: "100%" },
  });
