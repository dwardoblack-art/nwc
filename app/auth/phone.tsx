import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";

import {
  AuthPasswordInput,
  AuthScreen,
  AuthTextInput,
} from "@/components/auth/auth-shell";
import { AppIcon } from "@/components/ui/app-icon";
import { useAppToast } from "@/components/ui/app-toast";
import { isValidPhoneInput } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function SignInScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const { authError, completeCredentialSignIn } = useCustomerAuth();
  const toast = useAppToast();
  const valid = isValidPhoneInput(identifier) && password.length >= 6;

  useEffect(() => {
    if (authError) toast.error(authError);
  }, [authError, toast]);

  const signIn = async () => {
    if (!valid) return;

    const signedIn = await completeCredentialSignIn(
      identifier,
      password,
      remember,
    );
    if (signedIn) router.replace("/(tabs)" as Href);
  };

  const footer = (
    <View style={styles.footer}>
      <View style={styles.accountPrompt}>
        <Text style={styles.promptText}>Don’t have an account?</Text>
        <TouchableOpacity
          accessibilityRole="link"
          onPress={() => router.push("/auth/register" as Href)}
        >
          <Text style={styles.linkText}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        accessibilityRole="link"
        onPress={() => router.push("/auth/forgot-password" as Href)}
      >
        <Text style={styles.linkText}>Forgot password?</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AuthScreen
      title="Sign in to your account"
      detail="Welcome back. Enter your details to continue managing your cargo."
      primaryLabel="Sign in"
      onPrimary={signIn}
      primaryDisabled={!valid}
      afterActions={
        <>
          <TouchableOpacity
            accessibilityRole="link"
            style={{
              alignSelf: "center",
              minHeight: 44,
              justifyContent: "center",
            }}
            onPress={() => router.push("/tracking" as Href)}
          >
            <Text style={styles.linkText}>Track shipment directly</Text>
          </TouchableOpacity>
          {footer}
        </>
      }
    >
      <AuthTextInput
        label="Phone number"
        placeholder="+260971234567"
        value={identifier}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        keyboardType="phone-pad"
        autoFocus
        onChangeText={setIdentifier}
      />
      <AuthPasswordInput
        value={password}
        placeholder="Enter your password"
        autoComplete="current-password"
        textContentType="password"
        onChangeText={setPassword}
        onSubmitEditing={signIn}
        returnKeyType="go"
      />
      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityState={{ checked: remember }}
        accessibilityLabel="Remember me"
        onPress={() => setRemember((current) => !current)}
        style={styles.rememberRow}
      >
        <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
          {remember ? (
            <AppIcon name="check" size={14} color={nwcColors.white} />
          ) : null}
        </View>
        <Text style={styles.rememberText}>Remember me</Text>
      </TouchableOpacity>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  rememberRow: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: nwcColors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nwcColors.white,
  },
  checkboxChecked: {
    borderColor: nwcColors.brandNavy,
    backgroundColor: nwcColors.brandNavy,
  },
  rememberText: {
    color: nwcColors.foreground,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  footer: { alignItems: "center", gap: 12, marginTop: 2 },
  accountPrompt: { flexDirection: "row", alignItems: "center", gap: 5 },
  promptText: {
    color: nwcColors.foreground,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  linkText: {
    color: nwcColors.info,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_800ExtraBold",
  },
  divider: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  line: { flex: 1, height: 1, backgroundColor: nwcColors.border },
  or: {
    color: nwcColors.muted,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Poppins_700Bold",
  },
  googleButton: {
    width: "100%",
    minHeight: 52,
    borderWidth: 1,
    borderColor: nwcColors.border,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: nwcColors.white,
  },
  googleText: {
    color: nwcColors.foreground,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Poppins_700Bold",
  },
});
