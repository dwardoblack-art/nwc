import { minimumTouchTarget } from "@/ui/touch-target";
import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, type Href } from "expo-router";

import { AppIcon } from "@/ui/app-icon";
import { IconButton, Screen } from "@/ui/nwc-ui";
import { legalDocuments } from "@/lib/legal-documents";

export default function LegalIndexScreen() {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.header}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Legal & about</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.lead}>
            <Text style={styles.title}>
              Information you can read in the app
            </Text>
            <Text style={styles.detail}>
              Policies are presented for the customer preview and require formal
              legal approval before a production release.
            </Text>
          </View>
          <View style={styles.list}>
            {Object.values(legalDocuments).map((document) => (
              <TouchableOpacity
                key={document.id}
                accessibilityRole="button"
                accessibilityLabel={document.title}
                accessibilityHint={document.summary}
                onPress={() =>
                  router.push(`/account/legal/${document.id}` as Href)
                }
                activeOpacity={0.74}
                style={[styles.row, minimumTouchTarget]}
              >
                <View style={styles.icon}>
                  <AppIcon
                    name="file-document-outline"
                    size={21}
                    color={nwcColors.foreground}
                  />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.rowTitle}>{document.title}</Text>
                  <Text style={styles.rowDetail}>{document.summary}</Text>
                </View>
                <AppIcon
                  name="chevron-right"
                  size={20}
                  color={nwcColors.muted}
                />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="About Newworld Cargo"
              accessibilityHint="Learn about services and customer support"
              onPress={() => router.push("/account/about" as Href)}
              activeOpacity={0.74}
              style={[styles.row, minimumTouchTarget]}
            >
              <View style={styles.icon}>
                <AppIcon
                  name="package-variant-closed"
                  size={21}
                  color={nwcColors.foreground}
                />
              </View>
              <View style={styles.copy}>
                <Text style={styles.rowTitle}>About Newworld Cargo</Text>
                <Text style={styles.rowDetail}>
                  Our customer services and support options.
                </Text>
              </View>
              <AppIcon name="chevron-right" size={20} color={nwcColors.muted} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    page: { flex: 1, backgroundColor: nwcColors.background },
    header: {
      minHeight: 60,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      color: nwcColors.foreground,
      fontSize: 14,
      lineHeight: 19,
      fontFamily: "Poppins_600SemiBold",
    },
    headerSpacer: { height: 44, width: 44 },
    content: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 42,
      gap: 24,
    },
    lead: { gap: 5 },
    eyebrow: {
      color: nwcColors.info,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    title: {
      color: nwcColors.foreground,
      fontSize: 27,
      lineHeight: 34,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: -0.45,
    },
    detail: {
      color: nwcColors.muted,
      fontSize: 13,
      lineHeight: 19,
      fontFamily: "Poppins_500Medium",
    },
    list: {
      borderRadius: 24,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: nwcColors.border,
      backgroundColor: nwcColors.surface,
    },
    row: {
      minHeight: 82,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
      borderBottomWidth: 1,
      borderBottomColor: nwcColors.border,
    },
    icon: {
      width: 41,
      height: 41,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.surfaceRaised,
    },
    copy: { flex: 1, gap: 2 },
    rowTitle: {
      color: nwcColors.foreground,
      fontSize: 14,
      lineHeight: 19,
      fontFamily: "Poppins_600SemiBold",
    },
    rowDetail: {
      color: nwcColors.muted,
      fontSize: 11,
      lineHeight: 16,
      fontFamily: "Poppins_500Medium",
    },
  });
