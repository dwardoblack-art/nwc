import { useNwcColors, type NwcPalette } from "@/ui/use-nwc-colors";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MapSkeleton } from "@/components/ui/skeleton";

export function MapLoadingOverlay({
  ready,
  onRetry,
}: {
  ready: boolean;
  onRetry: () => void;
}) {
  const nwcColors = useNwcColors();
  const styles = createThemedStyles_styles(nwcColors);

  const opacity = useRef(new Animated.Value(1)).current;
  const [visible, setVisible] = useState(true);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (ready) {
      setSlow(false);
      const animation = Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      });
      animation.start(({ finished }) => {
        if (finished) setVisible(false);
      });
      return () => animation.stop();
    }
    const timer = setTimeout(() => setSlow(true), 15000);
    return () => clearTimeout(timer);
  }, [ready, opacity]);
  if (slow)
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Retry map loading"
        onPress={onRetry}
        style={styles.retry}
      >
        <Text style={{ color: nwcColors.brandNavy }}>
          Map could not load. Tap to retry.
        </Text>
      </TouchableOpacity>
    );
  if (!visible) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { opacity }]}
    >
      <MapSkeleton fill />
    </Animated.View>
  );
}
const createThemedStyles_styles = (nwcColors: NwcPalette) =>
  StyleSheet.create({
    retry: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: nwcColors.tintEEF2F2,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
  });
