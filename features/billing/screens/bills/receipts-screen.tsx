import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { ListSkeleton } from "@/ui/skeleton";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { AppIcon } from "@/ui/app-icon";
import {
  Card,
  IconButton,
  PrimaryButton,
  Screen,
  StatusBadge,
} from "@/ui/nwc-ui";
import { exportReceipt } from "@/lib/customer-document-export";

import { useCustomerBillingAccount } from "@/stores/customer-billing-account";
import { useAppToast } from "@/ui/app-toast";

export default function ReceiptHistoryScreen() {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const toast = useAppToast();
  const {
    billingLoading,
    billingError,
    refreshBilling,
    invoices,
    selectInvoice,
  } = useCustomerBillingAccount();
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const openReceipt = (invoiceId: string) => {
    selectInvoice(invoiceId);
    router.push("/bills/receipt");
  };
  const documentAction = (invoice: (typeof invoices)[number]) => {
    void exportReceipt(invoice).then((result) =>
      result.status === "downloaded"
        ? toast.success(`${result.filename} was downloaded.`)
        : toast.warning(
            "Receipt download is ready, but this device needs native file saving enabled.",
          ),
    );
  };
  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.header}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Receipts</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Payment receipts</Text>
            <Text style={styles.detail}>
              Every paid invoice is kept here for your cargo records.
            </Text>
          </View>
          {billingLoading && !invoices.length ? (
            <ListSkeleton kind="invoice" />
          ) : billingError && !invoices.length ? (
            <PrimaryButton label="Retry receipts" onPress={refreshBilling} />
          ) : paidInvoices.length ? (
            <View style={styles.list}>
              {paidInvoices.map((invoice) => (
                <Card key={invoice.id} style={styles.receiptCard}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Open receipt ${invoice.reference}`}
                    accessibilityHint={`${invoice.amount}, paid ${invoice.paidAt}`}
                    onPress={() => openReceipt(invoice.id)}
                    activeOpacity={0.74}
                    style={styles.receiptTop}
                  >
                    <View style={styles.receiptIcon}>
                      <AppIcon
                        name="receipt-text-outline"
                        size={21}
                        color={nwcColors.primaryInk}
                      />
                    </View>
                    <View style={styles.receiptCopy}>
                      <View style={styles.receiptTitleLine}>
                        <Text style={styles.receiptTitle}>
                          {invoice.shipmentLabel}
                        </Text>
                        <StatusBadge label="Paid" tone="success" />
                      </View>
                      <Text style={styles.receiptDetail}>
                        {invoice.reference} · {invoice.paidAt ?? "Confirmed"}
                      </Text>
                      <Text numberOfLines={1} style={styles.receiptRoute}>
                        {invoice.route}
                      </Text>
                    </View>
                    <Text style={styles.amount}>{invoice.amount}</Text>
                  </TouchableOpacity>
                  <View style={styles.cardFooter}>
                    <Text style={styles.method}>
                      {invoice.paymentMethod ?? "Payment"}
                    </Text>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Download receipt ${invoice.reference}`}
                      onPress={() => documentAction(invoice)}
                      style={styles.documentAction}
                    >
                      <AppIcon
                        name="share-variant-outline"
                        size={17}
                        color={nwcColors.foreground}
                      />
                      <Text style={styles.documentLabel}>Download</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Card style={styles.empty}>
              <View style={styles.emptyIcon}>
                <AppIcon
                  name="receipt-text-outline"
                  size={25}
                  color={nwcColors.primaryInk}
                />
              </View>
              <Text style={styles.emptyTitle}>No receipts yet</Text>
              <Text style={styles.emptyDetail}>
                Paid cargo invoices will appear here with their records.
              </Text>
            </Card>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: nwcColors.background,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    header: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      color: nwcColors.foreground,
      fontSize: 15,
      lineHeight: 20,
      fontFamily: "Poppins_600SemiBold",
    },
    headerSpacer: { width: 44, height: 44 },
    content: { paddingTop: 24, paddingBottom: 42, gap: 20 },
    titleBlock: { gap: 4 },
    title: {
      color: nwcColors.foreground,
      fontSize: 29,
      lineHeight: 37,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: -0.5,
    },
    detail: {
      color: nwcColors.muted,
      fontSize: 13,
      lineHeight: 19,
      fontFamily: "Poppins_500Medium",
    },
    list: { gap: 10 },
    receiptCard: { gap: 11, padding: 13 },
    receiptTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    receiptIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.surfaceRaised,
    },
    receiptCopy: { minWidth: 0, flex: 1, gap: 2 },
    receiptTitleLine: { flexDirection: "row", alignItems: "center", gap: 6 },
    receiptTitle: {
      flexShrink: 1,
      color: nwcColors.foreground,
      fontSize: 13,
      lineHeight: 18,
      fontFamily: "Poppins_600SemiBold",
    },
    receiptDetail: {
      color: nwcColors.muted,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_600SemiBold",
    },
    receiptRoute: {
      color: nwcColors.muted,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_500Medium",
    },
    amount: {
      color: nwcColors.foreground,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_600SemiBold",
    },
    cardFooter: {
      minHeight: 33,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: nwcColors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    method: {
      color: nwcColors.muted,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_600SemiBold",
    },
    documentAction: {
      minHeight: 44,
      paddingHorizontal: 8,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: nwcColors.surfaceRaised,
    },
    documentLabel: {
      color: nwcColors.foreground,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_600SemiBold",
    },
    empty: { alignItems: "center", gap: 7, paddingVertical: 25 },
    emptyIcon: {
      width: 52,
      height: 52,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.primary,
    },
    emptyTitle: {
      color: nwcColors.foreground,
      fontSize: 16,
      lineHeight: 22,
      fontFamily: "Poppins_600SemiBold",
    },
    emptyDetail: {
      color: nwcColors.muted,
      fontSize: 12,
      lineHeight: 18,
      textAlign: "center",
      fontFamily: "Poppins_500Medium",
    },
  });
