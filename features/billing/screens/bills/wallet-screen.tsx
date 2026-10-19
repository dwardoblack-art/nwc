import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { InvoiceSkeleton } from "@/ui/skeleton";
import { useState } from "react";
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
} from "@/ui/nwc-ui";
import { formatMoney } from "@/lib/domain/money";

import { useCustomerBillingAccount } from "@/stores/customer-billing-account";

const topUpOptions = [100, 250, 500];

export default function WalletScreen() {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const {
    walletLoading,
    walletError,
    refreshWallet,
    walletBalance,
    walletCurrency,
    walletActivity,
  } = useCustomerBillingAccount();
  const formatWalletAmount = (amount: number) =>
    formatMoney(amount, walletCurrency);
  const [amount, setAmount] = useState(250);
  const topUp = () =>
    router.push({
      pathname: "/bills/deposit",
      params: { amount: String(amount) },
    } as unknown as Href);
  if (walletLoading || walletError)
    return (
      <Screen>
        <View style={{ padding: 20, gap: 20 }}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          {walletLoading ? (
            <InvoiceSkeleton />
          ) : (
            <>
              <Text>{walletError}</Text>
              <PrimaryButton label="Retry wallet" onPress={refreshWallet} />
            </>
          )}
        </View>
      </Screen>
    );
  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.header}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Cargo Wallet</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <View style={styles.walletIcon}>
                <AppIcon
                  name="wallet-outline"
                  size={23}
                  color={nwcColors.primaryInk}
                />
              </View>
              <Text style={styles.mockTag}>Wallet</Text>
            </View>
            <Text style={styles.heroLabel}>Available to pay cargo bills</Text>
            <Text style={styles.balance}>
              {formatWalletAmount(walletBalance)}
            </Text>
            <Text style={styles.heroDetail}>
              Add balance and use your wallet for eligible cargo bills.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add balance</Text>
            <Text style={styles.sectionDetail}>
              Choose a quick top-up amount.
            </Text>
            <View style={styles.amounts}>
              {topUpOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: amount === option }}
                  accessibilityLabel={`Top up ${formatWalletAmount(option)}`}
                  activeOpacity={0.74}
                  onPress={() => {
                    setAmount(option);
                  }}
                  style={[
                    styles.amountOption,
                    amount === option && styles.amountOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.amountText,
                      amount === option && styles.amountTextActive,
                    ]}
                  >
                    {formatWalletAmount(option)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <PrimaryButton
              label={`Continue with ${formatWalletAmount(amount)}`}
              icon="arrow-right"
              onPress={topUp}
            />
            <Text style={styles.confirmation}>
              Pay with mobile money to add balance to your wallet.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wallet activity</Text>
            <Card style={styles.activityCard}>
              {walletActivity.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.activity,
                    index !== walletActivity.length - 1 &&
                      styles.activityDivider,
                  ]}
                >
                  <View
                    style={[
                      styles.activityIcon,
                      item.type === "payment" && styles.activityIconPayment,
                    ]}
                  >
                    <AppIcon
                      name={
                        item.type === "payment"
                          ? "receipt-text-outline"
                          : "plus"
                      }
                      size={17}
                      color={
                        item.type === "payment"
                          ? nwcColors.primaryInk
                          : nwcColors.success
                      }
                    />
                  </View>
                  <View style={styles.activityCopy}>
                    <Text style={styles.activityLabel}>{item.label}</Text>
                    <Text style={styles.activityDetail}>
                      {item.detail} · {item.time}
                    </Text>
                    {item.type === "topup" && item.detail === "pending" ? (
                      <TouchableOpacity
                        accessibilityRole="button"
                        onPress={() =>
                          router.push({
                            pathname: "/bills/deposit",
                            params: {
                              amount: String(item.amount),
                              depositId: item.id,
                            },
                          } as unknown as Href)
                        }
                      >
                        <Text
                          style={{
                            color: nwcColors.info,
                            fontFamily: "Poppins_700Bold",
                            paddingVertical: 8,
                          }}
                        >
                          Check deposit confirmation
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.activityAmount,
                      item.type === "payment" && styles.activityAmountPayment,
                    ]}
                  >
                    {item.type === "payment" ? "−" : "+"}
                    {formatWalletAmount(Math.abs(item.amount)).replace(
                      "K ",
                      "K",
                    )}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
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
    content: { paddingTop: 22, paddingBottom: 48, gap: 24 },
    hero: {
      minHeight: 200,
      borderRadius: 27,
      padding: 19,
      backgroundColor: nwcColors.brandNavy,
      gap: 8,
    },
    heroTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    walletIcon: {
      width: 44,
      height: 44,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.primary,
    },
    mockTag: {
      color: nwcColors.tintBCD0D9,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_700Bold",
      textTransform: "uppercase",
      letterSpacing: 0.45,
    },
    heroLabel: {
      marginTop: 3,
      color: nwcColors.tintB3C4CE,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_600SemiBold",
    },
    balance: {
      color: nwcColors.white,
      fontSize: 33,
      lineHeight: 41,
      fontFamily: "Poppins_600SemiBold",
      letterSpacing: -0.7,
    },
    heroDetail: {
      marginTop: "auto",
      paddingTop: 11,
      borderTopWidth: 1,
      borderTopColor: nwcColors.border,
      color: nwcColors.tintD6E3E8,
      fontSize: 11,
      lineHeight: 16,
      fontFamily: "Poppins_500Medium",
    },
    section: { gap: 9 },
    sectionTitle: {
      color: nwcColors.foreground,
      fontSize: 18,
      lineHeight: 24,
      fontFamily: "Poppins_600SemiBold",
    },
    sectionDetail: {
      color: nwcColors.muted,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_500Medium",
    },
    amounts: { flexDirection: "row", gap: 8 },
    amountOption: {
      flex: 1,
      minHeight: 47,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.surface,
      borderWidth: 1,
      borderColor: nwcColors.border,
    },
    amountOptionActive: {
      backgroundColor: nwcColors.surfaceRaised,
      borderColor: nwcColors.primary,
    },
    amountText: {
      color: nwcColors.foreground,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_600SemiBold",
    },
    amountTextActive: { color: nwcColors.primaryInk },
    confirmation: {
      color: nwcColors.muted,
      fontSize: 11,
      lineHeight: 16,
      fontFamily: "Poppins_600SemiBold",
      textAlign: "center",
    },
    confirmationSuccess: { color: nwcColors.success },
    activityCard: { paddingVertical: 0 },
    activity: {
      minHeight: 65,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 10,
    },
    activityDivider: {
      borderBottomWidth: 1,
      borderBottomColor: nwcColors.border,
    },
    activityIcon: {
      width: 36,
      height: 36,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: nwcColors.surfaceRaised,
    },
    activityIconPayment: { backgroundColor: nwcColors.surfaceRaised },
    activityCopy: { flex: 1, gap: 1 },
    activityLabel: {
      color: nwcColors.foreground,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_600SemiBold",
    },
    activityDetail: {
      color: nwcColors.muted,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Poppins_500Medium",
    },
    activityAmount: {
      color: nwcColors.success,
      fontSize: 12,
      lineHeight: 17,
      fontFamily: "Poppins_600SemiBold",
    },
    activityAmountPayment: { color: nwcColors.primaryInk },
  });
