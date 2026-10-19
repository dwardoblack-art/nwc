import { minimumTouchTarget } from "@/ui/touch-target";
import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { MobileMoneyFields } from "@/features/billing/components/mobile-money-fields";
import { isValidInternationalMobile } from "@/lib/auth-flow";
import { InvoiceSkeleton } from "@/ui/skeleton";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/ui/app-icon";
import {
  Card,
  IconButton,
  PrimaryButton,
  Screen,
  SecondaryButton,
  StatusBadge,
} from "@/ui/nwc-ui";
import {
  canPayWithMockWallet,
  formatMockKwacha,
  paymentMethodLabel,
} from "@/lib/mock-billing";

import { useCustomerBillingAccount } from "@/stores/customer-billing-account";

export default function PaymentScreen() {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const {
    billingLoading,
    billingError,
    refreshBilling,
    selectedInvoice,
    setPaymentState,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    walletBalance,
    mobileMoney,
    setMobileMoney,
    confirmSelectedInvoicePayment,
  } = useCustomerBillingAccount();
  const invoice = selectedInvoice;
  const method = selectedPaymentMethod;
  const beginPayment = () => {
    if (
      method === "card" ||
      (method === "mobile" && !isValidInternationalMobile(mobileMoney.phone))
    )
      return;
    setPaymentState("pending");
    confirmSelectedInvoicePayment();
    router.push("/bills/payment-status" as Href);
  };
  if (!invoice)
    return (
      <Screen>
        <View style={{ padding: 20, gap: 16 }}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          {billingLoading ? (
            <InvoiceSkeleton />
          ) : (
            <>
              <Text>{billingError || "Select an invoice to continue."}</Text>
              <PrimaryButton
                label="View bills"
                onPress={() => {
                  refreshBilling();
                  router.replace("/bills" as Href);
                }}
              />
            </>
          )}
        </View>
      </Screen>
    );
  const walletAvailable = canPayWithMockWallet(walletBalance, invoice);
  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.header}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Pay {invoice.amount}</Text>
            <Text style={styles.detail}>{invoice.description}</Text>
          </View>
          <Card style={styles.invoice}>
            <View style={styles.invoiceTop}>
              <Text style={styles.invoiceReference}>{invoice.reference}</Text>
              <StatusBadge label="Due" tone="warning" />
            </View>
            <Text
              style={styles.shipment}
            >{`For shipment ${invoice.shipmentReference}`}</Text>
          </Card>
          <View style={styles.methods}>
            <View style={styles.methodsHeader}>
              <Text style={styles.methodsTitle}>Pay with</Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Manage saved payment methods"
                onPress={() => router.push("/account/payment-methods" as Href)}
                style={[styles.manageMethods, minimumTouchTarget]}
              >
                <Text style={styles.manageMethodsText}>Manage</Text>
              </TouchableOpacity>
            </View>
            <PaymentMethod
              icon="cellphone"
              title="Mobile money"
              selected={method === "mobile"}
              onPress={() => setSelectedPaymentMethod("mobile")}
            />
            <PaymentMethod
              icon="wallet-outline"
              title="Cargo wallet"
              subtitle={`Available ${formatMockKwacha(walletBalance)}${walletAvailable ? "" : " · Add balance first"}`}
              selected={method === "wallet"}
              onPress={() => setSelectedPaymentMethod("wallet")}
            />
          </View>
          {method === "mobile" ? (
            <MobileMoneyFields value={mobileMoney} onChange={setMobileMoney} />
          ) : null}
          {method === "wallet" && !walletAvailable ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Add wallet balance"
              onPress={() => router.push("/bills/wallet" as Href)}
              style={[styles.walletWarning, minimumTouchTarget]}
            >
              <AppIcon
                name="alert-circle-outline"
                size={18}
                color={nwcColors.warning}
              />
              <Text style={styles.walletWarningText}>
                This wallet needs{" "}
                {formatMockKwacha(invoice.amountValue - walletBalance)} more.
                Add balance first.
              </Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.actions}>
            <PrimaryButton
              label={`Pay with ${paymentMethodLabel(method)}`}
              icon="arrow-right"
              disabled={
                (method === "mobile" &&
                  !isValidInternationalMobile(mobileMoney.phone)) ||
                (method === "wallet" && !walletAvailable)
              }
              onPress={beginPayment}
            />
            <SecondaryButton label="Cancel" onPress={() => router.back()} />
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

function PaymentMethod({
  icon,
  title,
  subtitle,
  selected = false,
  onPress,
}: {
  icon: "cellphone" | "bank-outline" | "wallet-outline";
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  return (
    <TouchableOpacity
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={title}
      accessibilityHint={`Use ${title} for this payment`}
      activeOpacity={0.77}
      onPress={onPress}
      style={[
        [styles.method, selected && styles.methodSelected],
        minimumTouchTarget,
      ]}
    >
      <View style={[styles.methodIcon, selected && styles.methodIconSelected]}>
        <AppIcon
          name={icon}
          size={21}
          color={selected ? nwcColors.primaryInk : nwcColors.brandNavy}
        />
      </View>
      <View style={styles.methodCopy}>
        <Text style={styles.methodTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.methodSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </TouchableOpacity>
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
    headerSpacer: { height: 44, width: 44 },
    content: { flexGrow: 1, paddingTop: 24, gap: 20 },
    titleBlock: { gap: 3 },
    title: {
      color: nwcColors.foreground,
      fontSize: 30,
      lineHeight: 38,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: -0.5,
    },
    detail: {
      color: nwcColors.muted,
      fontSize: 13,
      lineHeight: 18,
      fontFamily: "Poppins_500Medium",
    },
    invoice: {
      minHeight: 80,
      gap: 9,
      borderRadius: 22,
      backgroundColor: nwcColors.surfaceRaised,
    },
    invoiceTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    invoiceReference: {
      color: nwcColors.foreground,
      fontSize: 12,
      lineHeight: 16,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: 0.6,
    },
    shipment: {
      color: nwcColors.muted,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_600SemiBold",
    },
    methods: { gap: 9 },
    methodsHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    manageMethods: {
      minHeight: 32,
      paddingHorizontal: 5,
      justifyContent: "center",
    },
    manageMethodsText: {
      color: nwcColors.info,
      fontSize: 11,
      lineHeight: 15,
      fontFamily: "Poppins_600SemiBold",
    },
    methodsTitle: {
      color: nwcColors.foreground,
      fontSize: 17,
      lineHeight: 23,
      fontFamily: "Poppins_600SemiBold",
      marginBottom: 1,
    },
    method: {
      minHeight: 64,
      borderWidth: 1,
      borderColor: nwcColors.border,
      borderRadius: 19,
      padding: 11,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
      backgroundColor: nwcColors.surface,
    },
    methodSelected: {
      borderColor: nwcColors.brandNavy,
      backgroundColor: nwcColors.surfaceRaised,
    },
    methodIcon: {
      height: 42,
      width: 42,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: nwcColors.surfaceRaised,
    },
    methodIconSelected: { backgroundColor: nwcColors.primary },
    methodCopy: { flex: 1, gap: 1 },
    methodTitle: {
      color: nwcColors.foreground,
      fontSize: 14,
      lineHeight: 19,
      fontFamily: "Poppins_600SemiBold",
    },
    methodSubtitle: {
      color: nwcColors.muted,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_500Medium",
    },
    radio: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: nwcColors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    radioSelected: { borderColor: nwcColors.brandNavy },
    radioDot: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: nwcColors.brandNavy,
    },
    walletWarning: {
      borderRadius: 15,
      padding: 11,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      backgroundColor: nwcColors.surfaceRaised,
    },
    walletWarningText: {
      flex: 1,
      color: nwcColors.tint745100,
      fontSize: 11,
      lineHeight: 16,
      fontFamily: "Poppins_700Bold",
    },
    actions: { gap: 10, marginTop: "auto", paddingBottom: 16 },
  });
