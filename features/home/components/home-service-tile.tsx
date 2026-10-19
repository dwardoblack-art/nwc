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
  icon,
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
      style={[[styles.tile, styles[variant]], minimumTouchTarget]}
    >
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
      {accent ? (
        <AppIcon
          name="arrow-top-right"
          size={variant === "custom" ? 42 : 31}
          color={dark ? nwcColors.white : nwcColors.brandNavy}
          style={
            variant === "custom" ? styles.customIcon : styles.compactCustomIcon
          }
        />
      ) : image ? (
        <Image
          accessibilityIgnoresInvertColors
          source={image}
          contentFit="contain"
          cachePolicy="memory-disk"
          style={[
            styles.vehicleImage,
            variant === "wide" && styles.wideVehicleImage,
            variant === "compact" && styles.compactVehicleImage,
          ]}
        />
      ) : (
        <AppIcon
          name={icon}
          size={variant === "wide" ? 60 : variant === "compact" ? 40 : 53}
          color={nwcColors.primaryInk}
          style={styles.vehicleIcon}
        />
      )}
    </TouchableOpacity>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    tile: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 24,
      padding: 15,
      backgroundColor: nwcColors.surface,
      borderWidth: 1,
      borderColor: nwcColors.border,
      justifyContent: "space-between",
    },
    half: { width: "48.4%", minHeight: 145 },
    wide: { width: "64.8%", minHeight: 142 },
    custom: {
      width: "32%",
      minHeight: 142,
      backgroundColor: nwcColors.brandNavy,
      borderColor: nwcColors.brandNavy,
    },
    compact: { width: "48.4%", minHeight: 116, borderRadius: 20, padding: 13 },
    compactDark: {
      width: "48.4%",
      minHeight: 116,
      borderRadius: 20,
      padding: 13,
      backgroundColor: nwcColors.surfaceNavyTint,
      borderColor: nwcColors.border,
    },
    copy: { maxWidth: "82%", gap: 1 },
    title: {
      color: nwcColors.foreground,
      fontSize: 16,
      lineHeight: 21,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: -0.25,
    },
    compactTitle: { fontSize: 14, lineHeight: 18 },
    subtitle: {
      color: nwcColors.muted,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_500Medium",
    },
    capacity: {
      color: nwcColors.foreground,
      fontSize: 11,
      lineHeight: 15,
      fontFamily: "Poppins_600SemiBold",
    },
    darkText: { color: nwcColors.white },
    darkSubtext: { color: nwcColors.tintC9D7E1 },
    vehicleIcon: { position: "absolute", right: -8, bottom: 5, opacity: 0.94 },
    vehicleImage: {
      position: "absolute",
      right: -10,
      bottom: -3,
      height: 84,
      width: 112,
    },
    wideVehicleImage: { right: -30, bottom: -10, height: 128, width: 166 },
    compactVehicleImage: { right: -6, bottom: -6, width: 78, height: 58 },
    customIcon: { position: "absolute", right: 11, bottom: 12 },
    compactCustomIcon: { position: "absolute", right: 12, bottom: 12 },
  });
