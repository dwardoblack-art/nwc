import { minimumTouchTarget } from "@/ui/touch-target";
import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  floatingNavigationDockHeight,
  floatingNavigationMinimumOffset,
  floatingNavigationSafeGap,
} from "@/lib/customer-screen-layout";
import { AppIcon, type AppIconName } from "@/ui/app-icon";

const navigationItems: Record<string, { label: string; icon: AppIconName }> = {
  index: { label: "Home", icon: "home-variant-outline" },
  shipments: { label: "Shipments", icon: "package-variant-closed" },
  bills: { label: "Bills", icon: "receipt-text-outline" },
  account: { label: "Account", icon: "account-circle-outline" },
};

export function FloatingCapsuleTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <View
        style={[
          styles.dock,
          {
            marginBottom: Math.max(
              insets.bottom + floatingNavigationSafeGap,
              floatingNavigationMinimumOffset,
            ),
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const item = navigationItems[route.name];
          if (!item) return null;
          const options = descriptors[route.key]?.options;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented)
              navigation.navigate(route.name as never);
          };
          const onLongPress = () =>
            navigation.emit({ type: "tabLongPress", target: route.key });
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={
                options?.tabBarAccessibilityLabel ?? item.label
              }
              accessibilityHint={
                focused
                  ? `${item.label} tab selected`
                  : `Open ${item.label} tab`
              }
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.74}
              style={[
                minimumTouchTarget,
                [
                  styles.item,
                  focused ? styles.itemActive : styles.itemInactive,
                ],
              ]}
            >
              <AppIcon name={item.icon} size={22} color={focused ? nwcColors.primaryInk : nwcColors.muted} />
              <Text style={[styles.activeLabel, !focused && { color: nwcColors.muted }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    wrapper: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
    },
    dock: {
      width: "auto",
      alignSelf: "stretch",
      minHeight: floatingNavigationDockHeight,
      marginHorizontal: 20,
      padding: 5,
      gap: 3,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      backgroundColor: nwcColors.surfaceElevated,
      borderWidth: 1,
      borderColor: nwcColors.border,
      shadowColor: nwcColors.tint001624,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    item: {
      minHeight: 58,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 3,
    },
    itemActive: {
      flex: 1,
      minWidth: 0,
      backgroundColor: nwcColors.primary,
      paddingHorizontal: 6,
    },
    itemInactive: {
      flex: 1,
      borderRadius: 10,
      width: "auto",
      borderWidth: 0,
      borderColor: nwcColors.border,
      backgroundColor: nwcColors.surfaceElevated,
    },
    activeLabel: {
      letterSpacing: 0.1,
      flexShrink: 1,
      textAlign: "center",
      color: nwcColors.primaryInk,
      fontSize: 10,
      lineHeight: 15,
      fontFamily: "Poppins_600SemiBold",
    },
  });
