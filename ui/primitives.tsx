import type { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon, type AppIconName } from "@/ui/app-icon";
import { IconButton } from "@/ui/nwc-ui";
import { nwcSpacing, nwcTypography } from "@/lib/nwc-theme";
import { useNwcColors } from "./use-nwc-colors";

export {
  Screen,
  Card,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  StatusBadge as Badge,
} from "@/ui/nwc-ui";
export { MobileInput as Field } from "@/ui/mobile-input";
export { CustomerBottomDrawer as Sheet } from "@/ui/customer-bottom-drawer";

export function Header({
  title,
  detail,
  onBack,
  action,
}: {
  title: string;
  detail?: string;
  onBack?: () => void;
  action?: ReactNode;
}) {
  const colors = useNwcColors();
  return (
    <View style={styles.header}>
      {onBack ? (
        <IconButton label="Go back" icon="arrow-left" onPress={onBack} />
      ) : null}
      <View style={styles.copy}>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.foreground }]}
        >
          {title}
        </Text>
        {detail ? (
          <Text style={[styles.body, { color: colors.muted }]}>{detail}</Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

export function EmptyState({
  title,
  detail,
  icon = "package-variant-closed",
  children,
}: PropsWithChildren<{ title: string; detail: string; icon?: AppIconName }>) {
  const colors = useNwcColors();
  return (
    <View style={styles.empty}>
      <View style={[styles.symbol, { backgroundColor: colors.surfaceRaised }]}>
        <AppIcon name={icon} size={28} color={colors.foreground} />
      </View>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.foreground }]}
      >
        {title}
      </Text>
      <Text style={[styles.body, styles.center, { color: colors.muted }]}>
        {detail}
      </Text>
      {children}
    </View>
  );
}

export function ListRow({
  title,
  detail,
  leading,
  trailing,
  onPress,
}: {
  title: string;
  detail?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
}) {
  const colors = useNwcColors();
  const content = (
    <>
      {leading}
      <View style={styles.copy}>
        <Text style={[styles.rowTitle, { color: colors.foreground }]}>
          {title}
        </Text>
        {detail ? (
          <Text style={[styles.body, { color: colors.muted }]}>{detail}</Text>
        ) : null}
      </View>
      {trailing}
    </>
  );
  const style = [styles.row, { borderBottomColor: colors.border }];
  return onPress ? (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={detail}
      onPress={onPress}
      style={style}
    >
      {content}
    </TouchableOpacity>
  ) : (
    <View style={style}>{content}</View>
  );
}

export function ProgressSteps({
  labels,
  activeIndex,
}: {
  labels: string[];
  activeIndex: number;
}) {
  const colors = useNwcColors();
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Step ${activeIndex + 1} of ${labels.length}: ${labels[activeIndex]}`}
      style={styles.steps}
    >
      {labels.map((label, index) => (
        <View key={`${index}-${label}`} style={styles.step}>
          <View
            style={[
              styles.stepLine,
              {
                backgroundColor:
                  index <= activeIndex ? colors.primary : colors.border,
              },
            ]}
          />
          <Text
            style={[
              styles.caption,
              {
                color: index === activeIndex ? colors.foreground : colors.muted,
              },
            ]}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: nwcSpacing.md,
    paddingVertical: nwcSpacing.lg,
  },
  copy: { flex: 1, gap: nwcSpacing.xs },
  title: {
    ...nwcTypography.title,
    fontFamily: "Poppins_600SemiBold",
    flexShrink: 1,
  },
  body: {
    ...nwcTypography.body,
    fontFamily: "Poppins_500Medium",
    flexShrink: 1,
  },
  caption: { ...nwcTypography.caption, fontFamily: "Poppins_500Medium" },
  rowTitle: { ...nwcTypography.body, fontFamily: "Poppins_600SemiBold" },
  row: {
    minHeight: 64,
    paddingVertical: nwcSpacing.lg,
    gap: nwcSpacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  empty: {
    alignItems: "center",
    paddingVertical: nwcSpacing.hero,
    paddingHorizontal: nwcSpacing.xl,
    gap: nwcSpacing.lg,
  },
  center: { textAlign: "center" },
  symbol: { padding: nwcSpacing.lg, borderRadius: 20 },
  steps: {
    flexDirection: "row",
    gap: nwcSpacing.sm,
    paddingVertical: nwcSpacing.lg,
  },
  step: { flex: 1, gap: nwcSpacing.sm },
  stepLine: { minHeight: 4, borderRadius: 2 },
});
