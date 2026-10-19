import { minimumTouchTarget } from "@/ui/touch-target";
import { useNwcColors } from "@/ui/use-nwc-colors";
import { View, Text, TouchableOpacity } from "react-native";
import { MobileInput } from "@/ui/mobile-input";
import type { MobileMoneyDetails } from "@/lib/domain/billing";

import { isValidInternationalMobile } from "@/lib/auth-flow";
export function MobileMoneyFields({
  value,
  onChange,
}: {
  value: MobileMoneyDetails;
  onChange: (value: MobileMoneyDetails) => void;
}) {
  const nwcColors = useNwcColors();

  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{ color: nwcColors.foreground, fontFamily: "Poppins_700Bold" }}
      >
        Mobile money account
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["MTN", "Airtel", "Zamtel"] as const).map((provider) => (
          <TouchableOpacity
            accessibilityLabel={provider}
            key={provider}
            accessibilityRole="radio"
            accessibilityState={{ selected: value.provider === provider }}
            onPress={() => onChange({ ...value, provider })}
            style={[
              {
                flex: 1,
                padding: 12,
                borderRadius: 14,
                backgroundColor:
                  value.provider === provider
                    ? nwcColors.primary
                    : nwcColors.surfaceNavyTint,
              },
              minimumTouchTarget,
            ]}
          >
            <Text
              style={{
                textAlign: "center",
                color:
                  value.provider === provider
                    ? nwcColors.primaryInk
                    : nwcColors.foreground,
              }}
            >
              {provider}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <MobileInput
        label="Mobile money number"
        placeholder="+260971234567"
        keyboardType="phone-pad"
        maxLength={13}
        value={value.phone}
        onChangeText={(phone) => onChange({ ...value, phone })}
        error={
          value.phone && !isValidInternationalMobile(value.phone)
            ? "Enter + followed by exactly 12 digits."
            : undefined
        }
      />
      <Text style={{ color: nwcColors.muted, fontSize: 12 }}>
        Approve the payment on this phone when your provider sends a request.
      </Text>
    </View>
  );
}
