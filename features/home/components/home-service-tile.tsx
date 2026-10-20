import { minimumTouchTarget } from "@/ui/touch-target";
import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image";
import { AppIcon, type AppIconName } from "@/ui/app-icon";

export function HomeServiceTile({
  title,
  subtitle,
  capacity,
  image,
  variant = "half",
  onPress,
}: {
  title: string;
  subtitle?: string;
  capacity?: string;
  icon: AppIconName;
  image?: ImageSourcePropType;
  variant?: "half" | "wide" | "custom" | "compact" | "compactDark";
  onPress: () => void;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const accent = variant === "custom" || variant === "compactDark";
  const dark = variant === "custom";
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Choose ${title}`}
      accessibilityHint={subtitle}
      onPress={onPress}
      activeOpacity={0.76}
      style={[minimumTouchTarget, styles.tile, styles[variant]]}
    >
      <View style={styles.serviceNumber}>
        <Text style={[styles.number, dark && styles.darkText]}>
          {title === "International Imports"
            ? "01"
            : title === "City-to-City"
              ? "02"
              : title === "Local Delivery"
                ? "03"
                : "04"}
        </Text>
      </View>
      <View style={styles.copy}>
        <Text
          numberOfLines={2}
          style={[
            styles.title,
            variant.includes("compact") && styles.compactTitle,
            dark && styles.darkText,
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[styles.subtitle, dark && styles.darkSubtext]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {capacity ? (
        <Text style={[styles.capacity, dark && styles.darkSubtext]}>
          {capacity}
        </Text>
      ) : null}
      {image ? (
        <Image
          accessibilityIgnoresInvertColors
          source={image}
          contentFit="contain"
          cachePolicy="memory-disk"
          style={styles.thumbnail}
        />
      ) : null}
      {accent ? (
        <AppIcon
          name="arrow-top-right"
          size={22}
          color={nwcColors.foreground}
          style={
            variant === "custom" ? styles.customIcon : styles.compactCustomIcon
          }
        />
      ) : (
        <AppIcon
          name="arrow-top-right"
          size={22}
          color={nwcColors.foreground}
          style={styles.vehicleIcon}
        />
      )}
    </TouchableOpacity>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    serviceNumber: {
      width: 30,
      alignSelf: "stretch",
      justifyContent: "center",
    },
    number: {
      fontSize: 13,
      lineHeight: 20,
      fontFamily: "Poppins_500Medium",
      color: nwcColors.muted,
    },
    thumbnail: { width: 54, height: 50 },
    tile: {
      paddingVertical: 18,
      borderBottomWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      position: "relative",
      overflow: "visible",
      borderRadius: 0,
      padding: 0,
      backgroundColor: nwcColors.background,
      borderWidth: 0,
      borderColor: nwcColors.border,
      justifyContent: "flex-start",
    },
    half: { width: "100%", minHeight: 100 },
    wide: { width: "100%", minHeight: 100 },
    custom: {
      width: "100%",
      minHeight: 100,
      backgroundColor: nwcColors.background,
      borderColor: nwcColors.border,
    },
    compact: {
      paddingVertical: 18,
      width: "100%",
      minHeight: 100,
      borderRadius: 0,
      padding: 0,
    },
    compactDark: {
      paddingVertical: 18,
      width: "100%",
      minHeight: 100,
      borderRadius: 0,
      padding: 0,
      backgroundColor: nwcColors.background,
      borderColor: nwcColors.border,
    },
    copy: { flex: 1, maxWidth: "100%", gap: 4 },
    title: {
      color: nwcColors.foreground,
      fontSize: 18,
      lineHeight: 25,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: -0.4,
    },
    compactTitle: { fontSize: 18, lineHeight: 25 },
    subtitle: {
      color: nwcColors.muted,
      fontSize: 12,
      lineHeight: 18,
      fontFamily: "Poppins_500Medium",
    },
    capacity: {
      position: "absolute",
      left: 44,
      bottom: 4,
      color: nwcColors.foreground,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_600SemiBold",
    },
    darkText: { color: nwcColors.foreground },
    darkSubtext: { color: nwcColors.muted },
    vehicleIcon: { position: "relative", right: 0, bottom: 0, opacity: 0.94 },
    vehicleImage: {
      position: "absolute",
      right: -10,
      bottom: -3,
      height: 84,
      width: 112,
    },
    wideVehicleImage: { right: -30, bottom: -10, height: 128, width: 166 },
    compactVehicleImage: { right: -6, bottom: -6, width: 78, height: 58 },
    customIcon: { position: "relative", right: 0, bottom: 0 },
    compactCustomIcon: { position: "relative", right: 0, bottom: 0 },
  });
