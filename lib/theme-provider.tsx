import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Appearance,
  Platform,
  View,
  useColorScheme as useSystemColorScheme,
} from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";

import { SchemeColors, type ColorScheme } from "@/constants/theme";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  // Match the static web render, then apply the browser preference after hydration.
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    Platform.OS === "web" ? "light" : systemScheme,
  );
  const [themeReady, setThemeReady] = useState(Platform.OS !== "web");
  useEffect(() => {
    setColorSchemeState(systemScheme);
    setThemeReady(true);
  }, [systemScheme]);

  const applyScheme = useCallback((scheme: ColorScheme) => {
    nativewindColorScheme.set(scheme);
    Appearance.setColorScheme?.(scheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = scheme;
      root.classList.toggle("dark", scheme === "dark");
      const palette = SchemeColors[scheme];
      Object.entries(palette).forEach(([token, value]) => {
        root.style.setProperty(`--color-${token}`, value);
      });
    }
  }, []);

  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      setColorSchemeState(scheme);
      applyScheme(scheme);
    },
    [applyScheme],
  );

  useEffect(() => {
    if (themeReady) applyScheme(colorScheme);
  }, [applyScheme, colorScheme, themeReady]);

  const themeVariables = useMemo(
    () =>
      vars(Object.fromEntries(Object.entries(SchemeColors[colorScheme]).map(
        ([name, value]) => [`color-${name}`, value],
      ))),
    [colorScheme],
  );

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
    }),
    [colorScheme, setColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVariables]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}

/** UI rendered outside the app provider (startup overlays) follows the system. */
export function useOptionalThemeContext(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
