import { beforeEach, describe, expect, it, vi } from "vitest";
const { share } = vi.hoisted(() => ({ share: vi.fn() }));
vi.mock("react-native", () => ({
  Platform: { OS: "android" },
  Share: { share, sharedAction: "sharedAction" },
}));
import { shareService } from "../lib/services/device/share-service";
beforeEach(() => share.mockReset());
describe("native tracking share", () => {
  it("opens the mobile share sheet with the public tracking URL", async () => {
    share.mockResolvedValue({ action: "sharedAction" });
    const url = "https://app.newworldcargo.com/tracking?code=EXP-LUN06501";
    await expect(
      shareService.shareDocument({
        title: "Tracking",
        text: "Track shipment EXP-LUN06501",
        url,
        filename: "tracking.txt",
      }),
    ).resolves.toMatchObject({ ok: true, value: { shared: true } });
    expect(share).toHaveBeenCalledWith({
      title: "Tracking",
      message: `Track shipment EXP-LUN06501\n${url}`,
    });
  });
  it("does not report a cancelled share as successful", async () => {
    share.mockResolvedValue({ action: "dismissedAction" });
    await expect(
      shareService.shareDocument({
        title: "Tracking",
        text: "Track shipment",
        filename: "tracking.txt",
      }),
    ).resolves.toMatchObject({ ok: true, value: { shared: false } });
  });
});
