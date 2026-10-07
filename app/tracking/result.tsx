import { useEffect } from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ShipmentTrackingScreen } from "@/components/tracking/shipment-tracking-screen";
import { TrackingSkeleton } from "@/components/ui/skeleton";
import { IconButton, PrimaryButton, Screen } from "@/components/ui/nwc-ui";
import { usePublicTracking } from "@/lib/use-cases/use-public-tracking";
import { toUiShipment } from "@/lib/mappers/shipment-ui-mapper";
export default function PublicTrackingResultScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { result, status, isStale, track } = usePublicTracking();
  useEffect(() => {
    if (code) void track(code);
  }, [code, track]);
  if (result?.kind === "found")
    return (
      <ShipmentTrackingScreen
        shipment={toUiShipment(result.shipment)}
        isStale={isStale}
        onRefresh={() => void track(code, true)}
      />
    );
  return (
    <Screen>
      <View style={{ padding: 20, gap: 20 }}>
        <IconButton
          label="Go back"
          icon="arrow-left"
          onPress={() => router.back()}
        />
        {status === "idle" || status === "loading" ? (
          <TrackingSkeleton />
        ) : (
          <>
            <Text>
              {result
                ? result.message
                : "Tracking could not load. Please try again."}
            </Text>
            <PrimaryButton label="Try again" onPress={() => void track(code)} />
          </>
        )}
      </View>
    </Screen>
  );
}
