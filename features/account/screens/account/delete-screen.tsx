import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { useState } from "react";
import { Linking, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import {
  AppNotice,
  IconButton,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from "@/ui/nwc-ui";
import { CustomerConfirmationDialog } from "@/ui/customer-confirmation-dialog";
import { useAccountSettings } from "@/lib/use-cases/use-account-settings";

const deletionEmail =
  "mailto:info@newworldcargo.com?subject=Newworld%20Cargo%20account%20deletion&body=Please%20delete%20my%20Newworld%20Cargo%20account%20and%20associated%20personal%20data.%0ARegistered%20email%20or%20phone%3A%20";

export default function DeleteAccountScreen() {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const settings = useAccountSettings();
  const [confirming, setConfirming] = useState(false);
  const [emailError, setEmailError] = useState("");
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <IconButton
          label="Go back"
          icon="arrow-left"
          onPress={() => router.back()}
        />
        <Text style={styles.title}>Delete account</Text>
        <Text style={styles.body}>
          Request deletion of your Newworld Cargo account and associated
          profile, saved contacts, saved places, and personal uploads. We verify
          account ownership before completing deletion.
        </Text>
        <Text style={styles.body}>
          Shipment, payment, invoice, fraud-prevention, or dispute records may
          need to be retained to complete a service or meet legal obligations.
          Our response will explain what is retained and for how long.
          Submitting a request does not immediately delete your account.
        </Text>
        {settings.errorMessage ? (
          <AppNotice tone="error" message={settings.errorMessage} />
        ) : null}
        {settings.deletionRequested ? (
          <AppNotice
            tone="success"
            message="Your deletion request has been recorded. Contact info@newworldcargo.com for updates."
          />
        ) : null}
        <PrimaryButton
          label={
            settings.deletionRequested
              ? "Request recorded"
              : "Request account deletion"
          }
          icon="account-outline"
          loading={settings.status === "updating"}
          disabled={settings.deletionRequested}
          onPress={() => setConfirming(true)}
        />
        <Text style={styles.body}>
          You can also request deletion without signing in by emailing
          info@newworldcargo.com. Include your registered email or phone number.
          Never send your password or payment PIN.
        </Text>
        {emailError ? <AppNotice tone="error" message={emailError} /> : null}
        <SecondaryButton
          label="Email deletion request"
          icon="email-outline"
          onPress={async () => {
            try {
              await Linking.openURL(deletionEmail);
            } catch {
              setEmailError(
                "Email info@newworldcargo.com with the subject Newworld Cargo account deletion using your preferred email service.",
              );
            }
          }}
        />
      </ScrollView>
      <CustomerConfirmationDialog
        visible={confirming}
        tone="danger"
        title="Request account deletion?"
        detail="We will verify ownership and review any records we must retain. This submits a deletion request for your account and associated personal data."
        approveLabel="Submit request"
        onDismiss={() => setConfirming(false)}
        onApprove={() => {
          setConfirming(false);
          void settings.requestAccountDeletion();
        }}
      />
    </Screen>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    content: { padding: 24, gap: 20, paddingBottom: 48 },
    title: {
      fontSize: 26,
      lineHeight: 34,
      fontFamily: "Poppins_600SemiBold",
      color: nwcColors.foreground,
    },
    body: { fontSize: 14, lineHeight: 23, color: nwcColors.muted },
  });
