import { useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MobileMoneyFields } from "@/components/billing/mobile-money-fields";
import {
  Card,
  IconButton,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from "@/components/ui/nwc-ui";
import { repositories } from "@/lib/repositories";
import { isValidInternationalMobile } from "@/lib/auth-flow";
import { formatMoney } from "@/lib/domain/money";
import { nwcColors } from "@/lib/nwc-theme";
import type { MobileMoneyDetails } from "@/lib/domain/billing";
import { useCustomerBillingAccount } from "@/stores/customer-billing-account";
import { useQueryClient } from "@tanstack/react-query";

export default function WalletDepositScreen() {
  const params = useLocalSearchParams<{ amount: string; depositId?: string }>();
  const amount = Number(params.amount);
  const validAmount = Number.isFinite(amount) && amount > 0;
  const billing = useCustomerBillingAccount();
  const formatDepositAmount = (value: number) =>
    formatMoney(value, billing.walletCurrency);
  const queryClient = useQueryClient();
  const [details, setDetails] = useState<MobileMoneyDetails>(
    billing.mobileMoney,
  );
  const [state, setState] = useState<
    "ready" | "confirmed" | "delayed" | "failed"
  >(params.depositId ? "delayed" : "ready");
  const [depositId, setDepositId] = useState<string | undefined>(
    params.depositId,
  );
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const requestId = useRef(
    `deposit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const [error, setError] = useState("");
  const submit = async () => {
    if (
      inFlight.current ||
      !validAmount ||
      (!depositId && !isValidInternationalMobile(details.phone))
    )
      return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await repositories.billingActions.topUpWallet(
        amount,
        details,
        depositId,
        requestId.current,
      );
      setDepositId(result.depositId);
      setState(result.paymentState);
      if (result.paymentState === "confirmed") {
        await queryClient.invalidateQueries({ queryKey: ["wallet"] });
        billing.refreshWallet();
      }
    } catch {
      setError(
        "We couldn’t confirm your deposit. Check again before starting another payment.",
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  return (
    <Screen>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 40 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          <Text
            style={{
              fontSize: 22,
              fontFamily: "Poppins_800ExtraBold",
              color: nwcColors.brandNavy,
            }}
          >
            Wallet deposit
          </Text>
        </View>
        <Card>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              color: nwcColors.muted,
            }}
          >
            Add to your Cargo Wallet
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_800ExtraBold",
              fontSize: 32,
              color: nwcColors.brandNavy,
            }}
          >
            {validAmount ? formatDepositAmount(amount) : "Invalid amount"}
          </Text>
        </Card>
        {state === "ready" ? (
          <>
            <Text
              style={{
                fontFamily: "Poppins_800ExtraBold",
                color: nwcColors.brandNavy,
              }}
            >
              Pay with mobile money
            </Text>
            <MobileMoneyFields
              value={details}
              onChange={(value) => {
                if (!busy) setDetails(value);
              }}
            />
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 13,
                lineHeight: 20,
                color: nwcColors.muted,
              }}
            >
              Confirm the payment on your phone. Your wallet balance updates
              after the payment is confirmed.
            </Text>
          </>
        ) : (
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontFamily: "Poppins_800ExtraBold",
                fontSize: 22,
                color: nwcColors.brandNavy,
              }}
            >
              {state === "confirmed"
                ? "Deposit confirmed"
                : state === "delayed"
                  ? "Approve your deposit"
                  : "Deposit was not completed"}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                lineHeight: 22,
                color: nwcColors.muted,
              }}
            >
              {state === "confirmed"
                ? `${formatDepositAmount(amount)} has been added to your wallet.`
                : state === "delayed"
                  ? "Approve the mobile money prompt on your phone, then check confirmation. Your balance will update once payment succeeds."
                  : "Check your mobile money account before starting a new deposit."}
            </Text>
          </View>
        )}
        {error ? (
          <Text
            accessibilityRole="alert"
            style={{ color: nwcColors.error, lineHeight: 20 }}
          >
            {error}
          </Text>
        ) : null}
        {state === "confirmed" || state === "failed" ? (
          <PrimaryButton label="Back to wallet" onPress={() => router.back()} />
        ) : (
          <PrimaryButton
            label={
              depositId
                ? "Check confirmation"
                : `Pay ${validAmount ? formatDepositAmount(amount) : ""}`
            }
            loading={busy}
            disabled={
              busy ||
              !validAmount ||
              (!depositId && !isValidInternationalMobile(details.phone))
            }
            onPress={submit}
          />
        )}
        {state !== "confirmed" && state !== "failed" ? (
          <SecondaryButton
            label="Back to wallet"
            onPress={() => router.back()}
          />
        ) : null}
      </ScrollView>
    </Screen>
  );
}
