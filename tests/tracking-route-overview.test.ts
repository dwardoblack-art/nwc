import { describe, expect, it } from "vitest";
import { trackingRouteOverview } from "../lib/maps/tracking-route";
import type { Shipment } from "../types/cargo";

const shipment = {
  pickup: { city: "China Branch", area: "China", detail: "China Branch" },
  destination: {
    city: "Lusaka (Head Office) Branch",
    area: "Lusaka",
    detail: "Lusaka",
  },
} as Shipment;
describe("tracking route overview", () => {
  it("recognises country and city names in legacy branch labels", () => {
    const route = trackingRouteOverview(shipment);
    expect(route.pickup.latitude).toBe(35.86);
    expect(route.destination.latitude).toBe(-15.3875);
    expect(route.approximate).toBe(true);
  });
  it("preserves recorded coordinates instead of replacing them with city anchors", () => {
    const pickup = { ...shipment.pickup, latitude: 30.2, longitude: 120.1 };
    const destination = {
      ...shipment.destination,
      latitude: -15.4,
      longitude: 28.3,
    };
    const route = trackingRouteOverview({ ...shipment, pickup, destination });
    expect(route.pickup).toBe(pickup);
    expect(route.destination).toBe(destination);
    expect(route.approximate).toBe(false);
  });
  it("does not fabricate a location for an unknown address", () => {
    const pickup = {
      ...shipment.pickup,
      city: "Unknown",
      area: "",
      detail: "",
    };
    expect(
      trackingRouteOverview({ ...shipment, pickup }).pickup.latitude,
    ).toBeUndefined();
  });
});
