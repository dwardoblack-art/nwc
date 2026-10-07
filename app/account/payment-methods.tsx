import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { MobileMoneyFields } from "@/components/billing/mobile-money-fields";
import { CustomerBottomDrawer } from "@/components/ui/customer-bottom-drawer";
import { CustomerConfirmationDialog } from "@/components/ui/customer-confirmation-dialog";
import {
  Card,
  IconButton,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from "@/components/ui/nwc-ui";
import { useCustomerBillingAccount } from "@/stores/customer-billing-account";
import { isValidInternationalMobile } from "@/lib/auth-flow";
import type { MobileMoneyDetails } from "@/lib/domain/billing";
import { nwcColors } from "@/lib/nwc-theme";
export default function PaymentMethodsScreen() {
  const billing = useCustomerBillingAccount();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [remove, setRemove] = useState<string>();
  const [details, setDetails] = useState<MobileMoneyDetails>({
    phone: "",
    provider: "MTN",
  });
  const save = async () => {
    if (saving || !isValidInternationalMobile(details.phone)) return;
    setSaving(true);
    try {
      if (await billing.addPaymentMethod("mobile", details)) {
        setOpen(false);
        setDetails({ phone: "", provider: "MTN" });
      }
    } finally {
      setSaving(false);
    }
  };
  return (
    <Screen>
      <View style={{ flex: 1, padding: 20, gap: 20 }}>
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
            Payment methods
          </Text>
        </View>
        <ScrollView contentContainerStyle={{ gap: 14 }}>
          {billing.methodsError ? <Text>{billing.methodsError}</Text> : null}
          {billing.actionError ? (
            <Text accessibilityRole="alert" style={{ color: nwcColors.error }}>
              {billing.actionError}
            </Text>
          ) : null}
          {billing.methodsLoading ? (
            <Text style={{ textAlign: "center", color: nwcColors.muted }}>
              Loading payment methods…
            </Text>
          ) : !billing.methodsError &&
            !billing.paymentMethods.some((item) => item.method === "mobile") ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 48,
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 28,
                  backgroundColor: nwcColors.surfaceNavyTint,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppIcon
                  name="wallet-outline"
                  size={36}
                  color={nwcColors.brandNavy}
                />
              </View>
              <Text
                style={{
                  fontFamily: "Poppins_800ExtraBold",
                  fontSize: 18,
                  color: nwcColors.brandNavy,
                  textAlign: "center",
                }}
              >
                No payment options added
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: nwcColors.muted,
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                Save a mobile money account for your next payment.
              </Text>
            </View>
          ) : null}
          {billing.paymentMethods
            .filter((item) => item.method === "mobile")
            .map((item) => (
              <Card key={item.id}>
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    color: nwcColors.brandNavy,
                  }}
                >
                  {item.label}
                  {item.isDefault ? " · Default" : ""}
                </Text>
                <Text>{item.detail}</Text>
                <SecondaryButton
                  label="Use this method"
                  onPress={() => billing.selectSavedPaymentMethod(item.id)}
                />
                {!item.isDefault ? (
                  <SecondaryButton
                    label="Set as default"
                    onPress={() => billing.setDefaultPaymentMethod(item.id)}
                  />
                ) : null}
                {item.method !== "wallet" ? (
                  <SecondaryButton
                    label="Remove"
                    onPress={() => setRemove(item.id)}
                  />
                ) : null}
              </Card>
            ))}
          <PrimaryButton
            label="Add mobile money"
            icon="plus"
            onPress={() => {
              billing.clearActionError();
              setOpen(true);
            }}
          />
        </ScrollView>
        <CustomerBottomDrawer
          visible={open}
          title="Add mobile money"
          detail="Enter the account to use for payments."
          initialSnap="expanded"
          onDismiss={() => {
            if (!saving) setOpen(false);
          }}
          footer={
            <PrimaryButton
              label="Save payment method"
              loading={saving}
              disabled={saving || !isValidInternationalMobile(details.phone)}
              onPress={save}
            />
          }
        >
          <MobileMoneyFields value={details} onChange={setDetails} />
          {billing.actionError ? (
            <Text accessibilityRole="alert" style={{ color: nwcColors.error }}>
              {billing.actionError}
            </Text>
          ) : null}
        </CustomerBottomDrawer>
        <CustomerConfirmationDialog
          visible={Boolean(remove)}
          title="Remove payment method?"
          detail="Remove this saved mobile money account."
          approveLabel="Remove"
          tone="danger"
          onDismiss={() => setRemove(undefined)}
          onApprove={() => {
            if (remove) billing.removePaymentMethod(remove);
            setRemove(undefined);
          }}
        />
      </View>
    </Screen>
  );
}
