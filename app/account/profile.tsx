import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { MobileInput } from "@/components/ui/mobile-input";
import { CustomerBottomDrawer } from "@/components/ui/customer-bottom-drawer";
import { AppIcon } from "@/components/ui/app-icon";
import {
  IconButton,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from "@/components/ui/nwc-ui";
import { AuthPasswordInput } from "@/components/auth/auth-shell";
import { isValidEmailInput, isValidPhoneInput } from "@/lib/auth-flow";
import { cameraService } from "@/lib/services/device/camera-service";
import { useProfilePhoto } from "@/lib/use-cases/use-profile-photo";
import { useCustomerAuth } from "@/stores/customer-auth";
import { useAppToast } from "@/components/ui/app-toast";
import { nwcColors } from "@/lib/nwc-theme";

export default function AccountSettingsScreen() {
  const { customer, updateProfile, changePassword } = useCustomerAuth();
  const photo = useProfilePhoto();
  const toast = useAppToast();
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  useEffect(() => {
    setName(customer?.name ?? "");
    setPhone(customer?.phone ?? "");
    setEmail(customer?.email ?? "");
  }, [customer?.id, customer?.name, customer?.phone, customer?.email]);
  const save = async () => {
    if (
      saving ||
      name.trim().length < 2 ||
      !isValidPhoneInput(phone) ||
      !isValidEmailInput(email)
    )
      return;
    setSaving(true);
    try {
      await updateProfile({ name, phone, email });
      toast.success("Profile saved.");
    } catch {
      toast.error("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const choosePhoto = async () => {
    const result = await cameraService.pickImage();
    if (result.ok) await photo.upload(result.value);
    else if (result.reason !== "cancelled") toast.error(result.message);
  };
  const avatar = photo.document?.url || customer?.avatarUrl;
  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.header}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 44 }} />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            onPress={() => void choosePhoto()}
            style={styles.avatar}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.image} />
            ) : (
              <AppIcon
                name="account-outline"
                size={50}
                color={nwcColors.brandNavy}
              />
            )}
            <View style={styles.camera}>
              <AppIcon
                name="camera-outline"
                size={19}
                color={nwcColors.brandNavy}
              />
            </View>
          </TouchableOpacity>
          {photo.errorMessage ? (
            <Text style={styles.error}>{photo.errorMessage}</Text>
          ) : null}
          <View style={styles.fields}>
            <MobileInput
              label="Full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <MobileInput
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <MobileInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <PrimaryButton
            label="Save Changes"
            loading={saving}
            disabled={
              saving ||
              name.trim().length < 2 ||
              !isValidPhoneInput(phone) ||
              !isValidEmailInput(email)
            }
            onPress={save}
          />
          <SecondaryButton
            label="Change password"
            icon="lock-outline"
            onPress={() => setPasswordOpen(true)}
          />
        </ScrollView>
        <CustomerBottomDrawer
          visible={passwordOpen}
          title="Change password"
          initialSnap="expanded"
          onDismiss={() => setPasswordOpen(false)}
          footer={
            <PrimaryButton
              label="Save password"
              disabled={!currentPassword || newPassword.length < 8}
              onPress={async () => {
                if (await changePassword(currentPassword, newPassword)) {
                  setPasswordOpen(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  toast.success("Password changed.");
                }
              }}
            />
          }
        >
          <AuthPasswordInput
            label="Current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <AuthPasswordInput
            label="Create password"
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </CustomerBottomDrawer>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: nwcColors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  title: {
    fontSize: 17,
    color: nwcColors.brandNavy,
    fontFamily: "Poppins_800ExtraBold",
  },
  content: { flexGrow: 1, paddingTop: 24, paddingBottom: 32, gap: 18 },
  avatar: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: nwcColors.surfaceNavyTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  image: { width: 100, height: 100, borderRadius: 50 },
  camera: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: nwcColors.primary,
    padding: 8,
    borderRadius: 16,
  },
  fields: {
    gap: 14,
    borderRadius: 22,
    backgroundColor: nwcColors.surface,
    padding: 16,
  },
  error: { color: nwcColors.error, fontSize: 12 },
});
