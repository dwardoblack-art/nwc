import { minimumTouchTarget } from "@/ui/touch-target";
import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon, type AppIconName } from "@/ui/app-icon";

export function AccountRow({
  icon,
  title,
  detail,
  onPress,
}: {
  icon: AppIconName;
  title: string;
  detail: string;
  onPress?: () => void;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const content = (
    <>
      <View style={styles.iconWrap}>
        <AppIcon name={icon} size={21} color={nwcColors.foreground} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      {onPress ? (
        <AppIcon name="chevron-right" size={21} color={nwcColors.muted} />
      ) : null}
    </>
  );
  if (onPress)
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={detail}
        activeOpacity={0.75}
        onPress={onPress}
        style={[styles.row, minimumTouchTarget]}
      >
        {content}
      </TouchableOpacity>
    );
  return <View style={styles.row}>{content}</View>;
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    row: {
      minHeight: 88,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingVertical: 18,
    },
    iconWrap: {
      height: 44,
      width: 44,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      backgroundColor: nwcColors.surfaceRaised,
    },
    copy: { flex: 1, gap: 2 },
    title: {
      color: nwcColors.foreground,
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Poppins_600SemiBold",
    },
    detail: {
      color: nwcColors.muted,
      fontSize: 12,
      lineHeight: 19,
      fontFamily: "Poppins_500Medium",
    },
  });
