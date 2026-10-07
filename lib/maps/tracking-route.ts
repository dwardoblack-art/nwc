import type { Address, Shipment } from "@/types/cargo";

// These anchors are for a country/city overview, never a parcel's live location.
const overviewAnchors: Record<string, [number, number]> = {
  china: [35.86, 104.2],
  zambia: [-13.13, 27.85],
  lusaka: [-15.3875, 28.3228],
  kitwe: [-12.8024, 28.2132],
  ndola: [-12.9587, 28.6366],
  livingstone: [-17.8419, 25.8543],
  kabwe: [-14.4469, 28.4464],
  nakonde: [-9.342, 32.745],
  "dar es salaam": [-6.7924, 39.2083],
  dubai: [25.2048, 55.2708],
  tanzania: [-6.37, 34.89],
  zimbabwe: [-19.02, 29.15],
};
function overviewAddress(address: Address) {
  if (Number.isFinite(address.latitude) && Number.isFinite(address.longitude))
    return address;
  const location = [address.city, address.area, address.detail]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const place = Object.keys(overviewAnchors)
    .sort((first, second) => second.length - first.length)
    .find((name) => new RegExp(`\\b${name}\\b`, "i").test(location));
  const anchor = place ? overviewAnchors[place] : undefined;
  return anchor
    ? { ...address, latitude: anchor[0], longitude: anchor[1] }
    : address;
}
export function trackingRouteOverview(shipment: Shipment) {
  const pickup = overviewAddress(shipment.pickup);
  const destination = overviewAddress(shipment.destination);
  return {
    pickup,
    destination,
    approximate:
      pickup !== shipment.pickup || destination !== shipment.destination,
  };
}
