import { ListSkeleton } from "@/components/ui/skeleton";
import { mobileInputStyles } from "@/components/ui/mobile-input";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { useCustomerAuth } from "@/stores/customer-auth";

import { AppIcon } from "@/components/ui/app-icon";
import { PrimaryButton, SecondaryButton } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import { usePublicTracking } from "@/lib/use-cases/use-public-tracking";

type TrackingLookupContentProps = {
  onDismiss?: () => void;
  mode: "overlay" | "screen";
};

function TrackingLookupContent({
  onDismiss,
  mode,
}: TrackingLookupContentProps) {
  const params = useLocalSearchParams<{ code?: string }>();
  const initialCode = typeof params.code === "string" ? params.code : "";
  const [code, setCode] = useState(initialCode);
  const { customer } = useCustomerAuth();
  const [state, setState] = useState<
    "idle" | "loading" | "not-found" | "unavailable"
  >("idle");
  const tracking = usePublicTracking();
  const demoCode = "EXP-LUN06501";
  const track = tracking.track;
  useEffect(() => {
    if (!initialCode) return;
    let active = true;
    setCode(initialCode);
    setState("loading");
    void track(initialCode).then((result) => {
      if (active && result?.kind === "found") {
        onDismiss?.();
        router.replace({
          pathname: "/tracking/result",
          params: { code: initialCode },
        } as unknown as Href);
      }
      if (active)
        setState(
          result?.kind === "found"
            ? "idle"
            : result?.kind === "not-found"
              ? "not-found"
              : "unavailable",
        );
    });
    return () => {
      active = false;
    };
  }, [initialCode, track, onDismiss]);
  const openResult = (code: string) => {
    onDismiss?.();
    router.push({
      pathname: "/tracking/result",
      params: { code },
    } as unknown as Href);
  };
  const search = async () => {
    if (!code.trim() || state === "loading") return;
    setState("loading");
    const result = await tracking.track(code);
    if (result?.kind === "found") {
      setState("idle");
      openResult(code);
      return;
    }
    setState(
      !result || result.kind === "unavailable" ? "unavailable" : "not-found",
    );
  };
  const useDemo = () => {
    setCode(demoCode);
    setState("idle");
  };
  const resultMessage =
    tracking.result && tracking.result.kind !== "found"
      ? tracking.result.message
      : undefined;
  const alert =
    state === "unavailable"
      ? (resultMessage ??
        "Tracking is temporarily unavailable. Please try again.")
      : state === "not-found"
        ? (resultMessage ??
          (code.trim()
            ? "Shipment not found. Check the code and try again."
            : "Enter a tracking number to continue."))
        : undefined;
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.panel,
        mode === "screen" && styles.panelScreen,
      ]}
    >
      <View style={styles.headingRow}>
        <TouchableOpacity
          accessibilityRole="link"
          onPress={() => {
            onDismiss?.();
            router.push(
              customer ? ("/(tabs)" as Href) : ("/auth/phone" as Href),
            );
          }}
        >
          <Text style={styles.demoText}>{customer ? "Home" : "Sign in"}</Text>
        </TouchableOpacity>
        <View style={styles.brandIcon}>
          <AppIcon
            name="package-variant-closed"
            size={22}
            color={nwcColors.primaryInk}
          />
        </View>
        {onDismiss ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close tracking search"
            onPress={onDismiss}
            style={styles.close}
          >
            <AppIcon name="close" size={20} color={nwcColors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Track a shipment</Text>
        <Text style={styles.detail}>
          Enter your cargo tracking number to see its latest move.
        </Text>
      </View>
      <View style={styles.form}>
        <View
          style={[
            styles.inputFrame,
            (state === "not-found" || state === "unavailable") &&
              styles.inputError,
          ]}
        >
          <AppIcon name="barcode-scan" size={20} color={nwcColors.info} />
          <TextInput
            autoFocus
            editable={state !== "loading"}
            accessibilityLabel="Tracking number"
            accessibilityHint={
              alert ?? "Enter a tracking number, then activate Track shipment."
            }
            value={code}
            onChangeText={(value) => {
              setCode(value);
              setState("idle");
            }}
            autoCapitalize="characters"
            placeholder="Tracking number"
            placeholderTextColor="#91A0AE"
            returnKeyType="go"
            onSubmitEditing={search}
            style={[styles.input, mobileInputStyles.text]}
          />
        </View>
        {alert ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {alert}
          </Text>
        ) : null}
        <PrimaryButton
          label={
            state === "loading"
              ? "Looking up shipment"
              : state === "unavailable"
                ? "Try again"
                : "Track shipment"
          }
          icon="arrow-right"
          disabled={state === "loading"}
          onPress={search}
        />
      </View>
      <View style={styles.secondaryActions}>
        <SecondaryButton
          label="Enter code manually"
          icon="barcode-scan"
          onPress={() => {
            onDismiss?.();
            router.push("/tracking/scan" as Href);
          }}
        />
        {__DEV__ ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Use test tracking code"
            onPress={useDemo}
            style={styles.demo}
          >
            <Text style={styles.demoText}>Use test code: {demoCode}</Text>
            <AppIcon name="chevron-right" size={17} color={nwcColors.info} />
          </TouchableOpacity>
        ) : null}
      </View>
      {state === "loading" ? <ListSkeleton kind="shipment" count={1} /> : null}
      {tracking.errorMessage ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {tracking.errorMessage}
        </Text>
      ) : null}
      <Text style={styles.support}>Track any shipment without signing in.</Text>
    </ScrollView>
  );
}

export function TrackingLookupOverlay({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={styles.modal}>
        <Pressable style={styles.dim} onPress={onDismiss} />
        <View style={styles.overlayPanel}>
          <TrackingLookupContent mode="overlay" onDismiss={onDismiss} />
        </View>
      </View>
    </Modal>
  );
}

export function PublicTrackingLookupScreen() {
  return (
    <View style={styles.screen}>
      <TrackingLookupContent mode="screen" />
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(1,38,66,0.26)",
  },
  dim: { ...StyleSheet.absoluteFillObject },
  overlayPanel: { maxWidth: 480, alignSelf: "center", width: "100%" },
  screen: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: nwcColors.background,
  },
  panel: {
    borderRadius: 28,
    padding: 20,
    gap: 18,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.84)",
    shadowColor: "#012642",
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  panelScreen: {
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: nwcColors.surface,
    borderColor: "#E2EAEC",
    shadowOpacity: 0.06,
  },
  headingRow: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nwcColors.primary,
  },
  close: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F6",
  },
  copy: { gap: 4 },
  overline: {
    color: nwcColors.info,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    fontFamily: "Poppins_800ExtraBold",
  },
  title: {
    color: nwcColors.foreground,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.45,
    fontFamily: "Poppins_800ExtraBold",
  },
  detail: {
    color: nwcColors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_500Medium",
  },
  form: { gap: 8 },
  label: {
    color: nwcColors.foreground,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Poppins_800ExtraBold",
  },
  inputFrame: {
    minHeight: 55,
    paddingHorizontal: 13,
    gap: 9,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#DCE7EA",
    backgroundColor: "#FBFDFD",
  },
  inputError: { borderColor: nwcColors.error },
  input: {
    flex: 1,
    minHeight: 53,
    color: nwcColors.foreground,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  error: {
    color: nwcColors.error,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  secondaryActions: { gap: 8 },
  demo: {
    minHeight: 38,
    paddingHorizontal: 10,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#F4F8F9",
  },
  demoText: {
    color: nwcColors.info,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Poppins_800ExtraBold",
  },
  loading: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: nwcColors.surfaceNavyTint,
    borderRadius: 14,
  },
  loadingText: {
    color: nwcColors.info,
    fontSize: 11,
    lineHeight: 15,
    fontFamily: "Poppins_700Bold",
  },
  support: {
    color: nwcColors.muted,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 15,
    fontFamily: "Poppins_500Medium",
  },
});
