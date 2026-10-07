import { beforeEach, describe, expect, it, vi } from "vitest";
const { get, create } = vi.hoisted(() => ({ get: vi.fn(), create: vi.fn() }));
vi.mock("../lib/api/client", () => ({ createApiClient: create }));
import { laravelTrackingRepository } from "../lib/adapters/laravel/laravel-tracking-adapter";
import { mobileEnv } from "../lib/config/env";
import { toUiShipment } from "../lib/mappers/shipment-ui-mapper";
import { getLiveTrackingHistory } from "../lib/live-tracking-history";
beforeEach(() => {
  get.mockReset();
  create.mockReset();
  create.mockReturnValue({ get });
});
describe("guest shipment event lookup", () => {
  it("keeps public shipment events without a customer shipment request", async () => {
    const labels = [
      "Departed from China",
      "Arrived at Dar es Salaam",
      "Departed for Nakonde",
      "Customs clearance",
      "Departed for Lusaka",
      "Ready for collection",
    ];
    get.mockResolvedValue({
      data: {
        id: "17274",
        trackingNumber: "EXP-LUN06501",
        service: "import",
        transportMode: "sea",
        status: "in_transit",
        statusLabel: "In transit",
        origin: "China",
        destination: "Zambia",
        progress: 100,
        events: labels.map((label, index) => ({
          id: `stage-${index}`,
          label,
          detail: "Shipment (Parcel) Code: EXP-LUN06501",
          occurredAt: "2026-05-15T10:20:42+02:00",
          displayTime: "May 15, 2026 10:20 AM",
          complete: true,
          current: index === 5,
        })),
      },
    });
    const result = await laravelTrackingRepository.trackByCode("EXP-LUN06501");
    expect(create).toHaveBeenCalledWith({
      baseUrl: mobileEnv.publicTrackingBaseUrl,
    });
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("/api/v1/public/tracking/EXP-LUN06501", {
      auth: false,
      credentials: "omit",
    });
    expect(result.kind).toBe("found");
    if (result.kind !== "found") throw new Error("Missing tracking result");
    const history = getLiveTrackingHistory(toUiShipment(result.shipment));
    expect(history.map((event) => event.label)).toEqual(labels);
    expect(history[5]).toMatchObject({
      state: "current",
      time: "May 15, 2026 10:20 AM",
    });
    expect(result.events).toHaveLength(6);
  });
});
