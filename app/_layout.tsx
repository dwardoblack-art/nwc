import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import "../global.css";
import { CustomerDataProvider } from "@/lib/data/customer-data-provider";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { StatusBar } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { Image, Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { BookingDraftProvider } from "@/stores/booking-draft";
import { CustomerAuthProvider } from "@/stores/customer-auth";
import { AppStartupProvider } from "@/stores/app-startup";
import { CustomerPermissionProvider } from "@/lib/use-cases/use-customer-permissions";
import { CustomerBillingAccountProvider } from "@/stores/customer-billing-account";
import { NotificationPreferenceProvider } from "@/stores/notification-preferences";
import { shouldLoadBundledPoppins } from "@/lib/startup-font-policy";
import { analytics } from "@/lib/services/observability/analytics";
import { assertProductionEnvReady } from "@/lib/config/env";
import { AppToastProvider } from "@/ui/app-toast";

assertProductionEnvReady();

const poppinsFonts = {
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
};

export default function RootLayout() {
  if (shouldLoadBundledPoppins(Platform.OS)) return <NativeFontRoot />;
  return <WebFontRoot />;
}

function WebFontRoot() {
  // Register the same bundled faces in the browser without gating app startup.
  useFonts(poppinsFonts);
  return <AppRoot />;
}

function NativeFontRoot() {
  // Native ships Poppins with the binary. It is intentionally never awaited, so startup remains responsive.
  useFonts(poppinsFonts);
  return <AppRoot />;
}

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    analytics.track("app_opened");
    if (Platform.OS !== "web") {
      void ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      ).catch((error) => {
        if (__DEV__)
          console.warn("[NWC UI] Could not lock screen orientation", error);
      });
    }
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppToastProvider>
          <ThemeProvider>
            <AppStartupProvider>
              <CustomerAuthProvider>
                <CustomerDataProvider>
                  <CustomerPermissionProvider>
                    <CustomerBillingAccountProvider>
                      <NotificationPreferenceProvider>
                        <BookingDraftProvider>
                          <StatusBar style={showSplash ? "light" : "dark"} />
                          <Stack
                            screenOptions={{
                              headerShown: false,
                              animation: "fade",
                            }}
                          />
                        </BookingDraftProvider>
                      </NotificationPreferenceProvider>
                    </CustomerBillingAccountProvider>
                  </CustomerPermissionProvider>
                </CustomerDataProvider>
              </CustomerAuthProvider>
            </AppStartupProvider>
          </ThemeProvider>
        </AppToastProvider>
      </SafeAreaProvider>
      {showSplash ? <LaunchSplash /> : null}
    </GestureHandlerRootView>
  );
}

function LaunchSplash() {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  return (
    <View accessibilityLabel="Newworld Cargo" style={styles.splash}>
      <Image
        source={require("../assets/images/new-world-cargo-logo-light.png")}
        resizeMode="contain"
        style={styles.splashLogo}
      />
    </View>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    splash: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1000,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.primary,
    },
    splashContent: { alignItems: "center", justifyContent: "center" },
    splashLogo: {
      width: "64%",
      maxWidth: 300,
      height: 120,
      tintColor: nwcColors.brandNavy,
    },
  });
