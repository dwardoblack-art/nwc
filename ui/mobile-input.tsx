import {
  useNwcColors,
  defaultNwcPalette as nwcColors,
  type NwcPalette,
} from "@/ui/use-nwc-colors";
import { useState, type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { AppIcon, type AppIconName } from "@/ui/app-icon";
import { ContactPickerAction } from "@/ui/contact-picker-action";

export const createThemedStyles_mobileInputStyles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    frame: {
      minHeight: 60,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: nwcColors.border,
      backgroundColor: nwcColors.surfaceRaised,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    text: {
      color: nwcColors.foreground,
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Poppins_500Medium",
      paddingVertical: 10,
    },
    label: {
      color: nwcColors.muted,
      fontSize: 11,
      lineHeight: 15,
      fontFamily: "Poppins_500Medium",
    },
    error: {
      color: nwcColors.error,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 5,
    },
  });
export const mobileInputStyles =
  createThemedStyles_mobileInputStyles(nwcColors);

export function useMobileInputStyles() {
  return createThemedStyles_mobileInputStyles(useNwcColors());
}
export function MobileInput({
  label,
  error,
  icon,
  action,
  keepLabel = true,
  style,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
  icon?: AppIconName;
  action?: ReactNode;
  keepLabel?: boolean;
}) {
  const nwcColors = useNwcColors();
  const mobileInputStyles = createThemedStyles_mobileInputStyles(nwcColors);

  const [focused, setFocused] = useState(false);
  const filled = Boolean(props.value?.length || props.defaultValue?.length);
  const smallLabel = keepLabel && filled;
  return (
    <View>
      <View
        style={[
          mobileInputStyles.frame,
          focused && { borderColor: nwcColors.brandNavy },
          error ? { borderColor: nwcColors.error } : null,
        ]}
      >
        {icon ? (
          <AppIcon name={icon} size={21} color={nwcColors.muted} />
        ) : null}
        <View style={{ flex: 1, paddingVertical: smallLabel ? 5 : 0 }}>
          {smallLabel ? (
            <Text style={mobileInputStyles.label}>{label}</Text>
          ) : null}
          <TextInput
            {...props}
            accessibilityLabel={props.accessibilityLabel ?? label}
            accessibilityHint={error || props.accessibilityHint}
            placeholder={label}
            placeholderTextColor={nwcColors.muted}
            style={[
              mobileInputStyles.text,
              {
                minHeight: smallLabel ? 28 : 54,
                paddingVertical: smallLabel ? 1 : 10,
              },
              props.multiline && { minHeight: 88, textAlignVertical: "top" },
              style,
            ]}
            onFocus={(event) => {
              setFocused(true);
              props.onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              props.onBlur?.(event);
            }}
          />
        </View>
        {action ??
          (props.keyboardType === "phone-pad" ? (
            <ContactPickerAction
              label={label}
              disabled={props.editable === false}
              onContact={(contact) => props.onChangeText?.(contact.phone)}
            />
          ) : null)}
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={mobileInputStyles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
