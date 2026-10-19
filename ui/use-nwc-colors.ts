import { useColorScheme } from "react-native";
import { useOptionalThemeContext } from "@/lib/theme-provider";
import { themeColors } from "@/theme.config";

export type NwcPalette = { [K in keyof typeof themeColors]: string };
export const defaultNwcPalette = Object.fromEntries(
  Object.entries(themeColors).map(([name, value]) => [name, value.light]),
) as NwcPalette;

/** Canonical light/dark tokens; white and primaryInk stay fixed for brand artwork. */
export function useNwcColors(): NwcPalette {
  const theme = useOptionalThemeContext();
  const systemScheme = useColorScheme();
  const scheme = theme?.colorScheme ?? systemScheme ?? "light";
  return Object.fromEntries(
    Object.entries(themeColors).map(([name, value]) => [name, value[scheme]]),
  ) as NwcPalette;
}
