import { CustomerMap } from "@/components/map/customer-map";
import { trackingRouteOverview } from "@/lib/maps/tracking-route";
import type { Shipment } from "@/types/cargo";

export function LiveTrackingMap({ shipment }: { shipment: Shipment }) {
  const route = trackingRouteOverview(shipment);
  return (
    <CustomerMap
      pickup={route.pickup}
      destination={route.destination}
      mode={shipment.service === "import" ? "international" : "route-preview"}
      deliveryService={shipment.service}
      shipment={shipment}
      routeProgress={shipment.trackingProgress?.fraction ?? 0}
    />
  );
}
