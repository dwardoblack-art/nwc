import { minimumTouchTarget } from "@/ui/touch-target";
import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AppIcon } from "@/ui/app-icon";
import { useAppToast } from "@/ui/app-toast";

import {
  contactService,
  type DeviceContact,
} from "@/lib/services/device/contact-service";

export function ContactPickerAction({
  label,
  disabled,
  onContact,
}: {
  label: string;
  disabled?: boolean;
  onContact: (contact: DeviceContact) => void;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);
  const toast = useAppToast();
  const pick = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    Keyboard.dismiss();
    try {
      const result = await contactService.pickContact();
      if (result.ok) onContact(result.value);
      else if (result.reason !== "cancelled") toast.error(result.message);
    } catch {
      toast.error("Could not open contacts. Try again or type the number.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  };
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Choose contact for ${label}`}
      accessibilityHint="Fill this phone number from device contacts"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={pick}
      style={[styles.action, minimumTouchTarget]}
    >
      {loading ? (
        <ActivityIndicator color={nwcColors.foreground} />
      ) : (
        <AppIcon
          name="contacts-outline"
          size={23}
          color={nwcColors.foreground}
        />
      )}
    </TouchableOpacity>
  );
}
const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    action: {
      width: 44,
      minHeight: 44,
      borderRadius: 13,
      backgroundColor: nwcColors.surfaceAccent,
      alignItems: "center",
      justifyContent: "center",
    },
  });
