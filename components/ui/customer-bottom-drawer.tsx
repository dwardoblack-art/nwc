import {
  useNwcColors, type NwcPalette,
} from "@/ui/use-nwc-colors";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import {
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import {
  type CustomerDrawerSnap,
  drawerHeightForSnap,
  nextCustomerDrawerSnap,
} from "@/lib/customer-drawer";

export type CustomerBottomDrawerProps = PropsWithChildren<{
  visible: boolean;
  overline?: string;
  title: string;
  detail?: string;
  initialSnap?: Exclude<CustomerDrawerSnap, "dismissed">;
  footer?: ReactNode;
  onDismiss: () => void;
  closeLabel?: string;
  testID?: string;
}>;

export function CustomerBottomDrawer({
  visible,
  overline,
  title,
  detail,
  initialSnap = "half",
  footer,
  onDismiss,
  closeLabel,
  testID,
  children,
}: CustomerBottomDrawerProps) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const insets = useSafeAreaInsets();
  const { height: viewportHeight } = useWindowDimensions();
  const [snap, setSnap] =
    useState<Exclude<CustomerDrawerSnap, "dismissed">>(initialSnap);
  const [dragY, setDragY] = useState(0);
  useEffect(() => {
    if (visible) {
      setSnap(initialSnap);
      setDragY(0);
    }
  }, [visible, initialSnap]);
  const settle = useCallback(
    (distance: number) => {
      const next = nextCustomerDrawerSnap(snap, distance);
      setDragY(0);
      if (next === "dismissed") onDismiss();
      else setSnap(next);
    },
    [snap, onDismiss],
  );
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 3,
        onPanResponderMove: (_, gesture) =>
          setDragY(Math.max(-96, Math.min(gesture.dy, 320))),
        onPanResponderRelease: (_, gesture) => settle(gesture.dy),
        onPanResponderTerminate: () => setDragY(0),
      }),
    [settle],
  );
  const drawerHeight = drawerHeightForSnap(viewportHeight, insets.top, snap);
  const closeText = closeLabel ?? `Close ${title}`;
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={closeText}
          onPress={onDismiss}
          style={styles.dismiss}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboard}
        >
          <View
            accessibilityViewIsModal
            testID={testID}
            style={[
              styles.drawer,
              {
                height: drawerHeight,
                transform: [{ translateY: Math.max(0, dragY) }],
              },
            ]}
          >
            <View
              accessibilityRole="adjustable"
              accessibilityLabel={`${title} drawer. Drag up to expand or down to dismiss.`}
              {...panResponder.panHandlers}
              style={styles.handleArea}
            >
              <View style={styles.grabber} />
            </View>
            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <Text style={styles.title}>{title}</Text>
                {detail ? <Text style={styles.detail}>{detail}</Text> : null}
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={closeText}
                onPress={onDismiss}
                activeOpacity={0.74}
                style={styles.close}
              >
                <AppIcon name="close" size={20} color={nwcColors.foreground} />
              </TouchableOpacity>
            </View>
            <ScrollView
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.body}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
            {footer ? (
              <View
                style={[
                  styles.footer,
                  { paddingBottom: Math.max(insets.bottom, 16) },
                ]}
              >
                {footer}
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(1,38,66,0.38)",
    },
    dismiss: { ...StyleSheet.absoluteFillObject },
    keyboard: { flex: 1, justifyContent: "flex-end" },
    drawer: {
      overflow: "hidden",
      borderTopLeftRadius: 31,
      borderTopRightRadius: 31,
      backgroundColor: nwcColors.background,
      shadowColor: nwcColors.tint001C30,
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.06,
      shadowRadius: 22,
      elevation: 2,
    },
    handleArea: {
      minHeight: 28,
      alignItems: "center",
      justifyContent: "center",
    },
    grabber: {
      width: 45,
      height: 5,
      borderRadius: 3,
      backgroundColor: nwcColors.tintBBC8CE,
    },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 14,
      flexDirection: "row",
      gap: 12,
      alignItems: "flex-start",
      borderBottomWidth: 1,
      borderBottomColor: nwcColors.border,
    },
    headerCopy: { flex: 1, gap: 2 },
    overline: {
      color: nwcColors.info,
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 0.75,
      textTransform: "uppercase",
      fontFamily: "Poppins_600SemiBold",
    },
    title: {
      color: nwcColors.foreground,
      fontSize: 24,
      lineHeight: 30,
      fontFamily: "Poppins_600SemiBold",
    },
    detail: {
      color: nwcColors.muted,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_500Medium",
    },
    close: {
      width: 40,
      height: 40,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.surfaceRaised,
    },
    body: { gap: 12, padding: 20, paddingBottom: 28 },
    footer: {
      borderTopWidth: 1,
      borderTopColor: nwcColors.border,
      paddingHorizontal: 20,
      paddingTop: 12,
      backgroundColor: nwcColors.surfaceElevated,
    },
  });
