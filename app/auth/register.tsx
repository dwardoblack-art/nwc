import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import {
  AuthPasswordInput,
  AuthScreen,
  AuthTextInput,
} from "@/components/auth/auth-shell";
import { useAppToast } from "@/components/ui/app-toast";
import { isValidEmailInput, isValidInternationalMobile } from "@/lib/auth-flow";

import {
  clearRegistrationDraft,
  readRegistrationDraft,
  writeRegistrationDraft,
} from "@/lib/storage/registration-draft-storage";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function RegisterScreen() {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const [givenName, setGivenName] = useState("");
  const [lastName, setLastName] = useState("");
  const name = `${givenName.trim()} ${lastName.trim()}`.trim();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lusaka");
  const [password, setPassword] = useState("");
  const [draftRestored, setDraftRestored] = useState(false);
  const {
    authError,
    beginRegistration,
    clearRegistrationError,
    registrationErrors,
  } = useCustomerAuth();
  const toast = useAppToast();
  const valid =
    givenName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    isValidEmailInput(email) &&
    isValidInternationalMobile(phone) &&
    city.trim().length >= 2 &&
    password.length >= 8;

  useEffect(() => {
    if (authError) toast.error(authError);
  }, [authError, toast]);

  useEffect(() => {
    let active = true;
    void readRegistrationDraft()
      .then((draft) => {
        if (!active || !draft) return;
        const [first, ...rest] = draft.name.trim().split(/\s+/);
        setGivenName(draft.firstName ?? first ?? "");
        setLastName(draft.lastName ?? rest.join(" "));
        setEmail(draft.email);
        setPhone(draft.phone);
        setCity(draft.city || "Lusaka");
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setDraftRestored(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!draftRestored) return;
    const timer = setTimeout(() => {
      void writeRegistrationDraft({
        name,
        firstName: givenName,
        lastName,
        email,
        phone,
        city,
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [city, draftRestored, email, name, givenName, lastName, phone]);

  const register = async () => {
    if (!valid) return;
    const started = await beginRegistration({
      name,
      firstName: givenName,
      lastName,
      email,
      phone,
      city,
      password,
    });
    if (started) {
      setDraftRestored(false);
      await clearRegistrationDraft();
      router.push("/auth/verify" as Href);
    }
  };

  return (
    <AuthScreen
      showBack
      title="Create your account"
      detail="Enter your details to book deliveries, track cargo, and receive secure shipment updates."
      primaryLabel="Create account"
      onPrimary={register}
      primaryDisabled={!draftRestored || !valid}
      secondaryLabel="I already have an account"
      onSecondary={() => router.replace("/auth/phone" as Href)}
    >
      <AuthTextInput
        label="First name"
        placeholder="Chanda"
        value={givenName}
        error={registrationErrors.name}
        autoComplete="given-name"
        autoCapitalize="words"
        autoFocus
        onChangeText={(value) => {
          setGivenName(value);
          clearRegistrationError("name");
        }}
      />
      <AuthTextInput
        label="Last name"
        placeholder="Mwila"
        value={lastName}
        autoComplete="family-name"
        autoCapitalize="words"
        onChangeText={setLastName}
      />
      <AuthTextInput
        label="Mobile number"
        placeholder="+260971234567"
        value={phone}
        error={
          registrationErrors.phone ||
          (phone && !isValidInternationalMobile(phone)
            ? "Enter + followed by exactly 12 digits, including country code."
            : undefined)
        }
        autoComplete="tel"
        keyboardType="phone-pad"
        onChangeText={(value) => {
          setPhone(value);
          clearRegistrationError("phone");
        }}
        maxLength={13}
      />
      <AuthTextInput
        label="Email address"
        placeholder="name@email.com"
        value={email}
        error={registrationErrors.email}
        autoComplete="email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(value) => {
          setEmail(value);
          clearRegistrationError("email");
        }}
      />
      <AuthTextInput
        label="City"
        placeholder="e.g. Lusaka"
        value={city}
        error={registrationErrors.city}
        autoCapitalize="words"
        onChangeText={(value) => {
          setCity(value);
          clearRegistrationError("city");
        }}
      />
      <AuthPasswordInput
        label="Create password"
        placeholder="At least 8 characters"
        value={password}
        error={registrationErrors.password}
        autoComplete="new-password"
        textContentType="newPassword"
        onChangeText={(value) => {
          setPassword(value);
          clearRegistrationError("password");
        }}
      />
      <View style={styles.terms}>
        <Text style={styles.termsText}>
          By creating an account, you agree to the Terms of Service and Privacy
          Policy.
        </Text>
      </View>
    </AuthScreen>
  );
}

const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    terms: { paddingHorizontal: 4 },
    termsText: {
      color: nwcColors.muted,
      textAlign: "center",
      fontSize: 11,
      lineHeight: 17,
      fontFamily: "Poppins_500Medium",
    },
  });
