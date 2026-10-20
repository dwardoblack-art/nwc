import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNwcColors } from "./use-nwc-colors";

/** The editorial heading used across the cargo desk. */
export function DeskHeading({
  eyebrow,
  title,
  detail,
  children,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  children?: ReactNode;
}) {
  const colors = useNwcColors();
  return (
    <View style={styles.heading}>
      <View style={styles.top}>
        <View style={[styles.rule, { backgroundColor: colors.primary }]} />
        <Text style={[styles.eyebrow, { color: colors.muted }]}>{eyebrow}</Text>
      </View>
      <View style={styles.row}>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.foreground }]}
        >
          {title}
        </Text>
        {children}
      </View>
      {detail ? (
        <Text style={[styles.detail, { color: colors.muted }]}>{detail}</Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  heading: { gap: 12, paddingTop: 8, paddingBottom: 8 },
  top: { flexDirection: "row", alignItems: "center", gap: 8 },
  rule: { width: 24, height: 4 },
  eyebrow: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: {
    flex: 1,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -1.8,
  },
  detail: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 360,
  },
});
