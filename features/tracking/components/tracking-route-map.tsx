import {
  useNwcColors, } from "@/ui/use-nwc-colors";
import { Text, View } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";
import { CustomerMap } from "@/ui/maps/customer-map";
import { trackingRouteOverview } from "@/lib/maps/tracking-route";

import type { Shipment } from "@/types/cargo";
export function TrackingRouteMap({ shipment }: { shipment: Shipment }) {
  const nwcColors = useNwcColors();

  const route = trackingRouteOverview(shipment);
  const mapped =
    Number.isFinite(route.pickup.latitude) &&
    Number.isFinite(route.destination.latitude);
  return (
    <View style={{ gap: 8 }}>
      {mapped ? (
        <CustomerMap
          mode={
            shipment.service === "import" ? "international" : "route-preview"
          }
          pickup={route.pickup}
          destination={route.destination}
          deliveryService={shipment.service}
          height={280}
        />
      ) : (
        <View
          style={{
            padding: 20,
            borderRadius: 20,
            backgroundColor: nwcColors.surfaceNavyTint,
          }}
        >
          <Text>
            {shipment.pickup.city} → {shipment.destination.city}
          </Text>
          <Svg height={60} width="100%" viewBox="0 0 300 60">
            <Polyline
              points="20,30 100,30 150,15 200,30 280,30"
              fill="none"
              stroke={nwcColors.primary}
              strokeWidth={5}
            />
            <Circle cx={20} cy={30} r={7} fill={nwcColors.brandNavy} />
            <Circle cx={280} cy={30} r={7} fill={nwcColors.brandNavy} />
          </Svg>
        </View>
      )}
      <Text style={{ fontSize: 11, color: nwcColors.muted }}>
        {route.approximate
          ? "Country/city route overview. Pins show approximate areas, not the parcel’s live location."
          : !mapped
            ? "Route overview. Exact map coordinates have not been recorded."
            : "Shipment route. Tracking events show the latest recorded movement."}
      </Text>
    </View>
  );
}
