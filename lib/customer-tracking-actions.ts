import { shareService } from "@/lib/services/device/share-service";

export type TrackingActionResult = {
  status: "copied" | "shared" | "downloaded" | "unavailable";
  message: string;
};

export async function copyTrackingNumber(
  reference: string,
): Promise<TrackingActionResult> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(reference);
    return { status: "copied", message: "Tracking number copied." };
  }
  return {
    status: "unavailable",
    message: "Copy is not available on this device.",
  };
}

export async function shareTrackingNumber(
  reference: string,
): Promise<TrackingActionResult> {
  const url = `https://app.newworldcargo.com/tracking?code=${encodeURIComponent(reference.trim())}`;
  const shared = await shareService
    .shareDocument({
      title: "Newworld Cargo tracking",
      filename: `new-worldcargo-tracking-${reference}.txt`,
      text: `Track shipment ${reference}`,
      url,
    })
    .catch(() => null);
  if (shared?.ok && shared.value.shared) {
    return { status: "shared", message: "Tracking link shared." };
  }
  if (shared?.ok)
    return { status: "unavailable", message: "Sharing cancelled." };
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return { status: "copied", message: "Tracking link copied." };
  }
  return {
    status: "unavailable",
    message: "Sharing is not available on this device.",
  };
}
