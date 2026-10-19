import { useState } from "react";
import { LocalLocationPicker } from "@/ui/maps/local-location-picker";
import { useAppToast } from "@/ui/app-toast";
import { locationService } from "@/lib/services/device/location-service";
import { routeSuggestionToAddress } from "@/lib/route-autocomplete";
import { router } from "expo-router";
import { BookingMapRouteShell } from "@/features/booking/components/booking-map-route-shell";
import { RouteEntryCard } from "@/features/booking/components/route-entry-card";
import { intercitySteps } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";
import type { Address } from "@/types/cargo";

function cityAddress(
  city?: string,
  branchId?: string,
  fallback = "",
  latitude?: number,
  longitude?: number,
): Address | undefined {
  if (!city) return undefined;
  return {
    city,
    area: city,
    detail: city,
    label: fallback || city,
    branchId,
    latitude,
    longitude,
  };
}

export default function IntercityRouteScreen() {
  const { intercityDraft, updateIntercityDraft } = useBookingDraft();
  const [target, setTarget] = useState<"pickup" | "destination" | null>(null);
  const [mapInitial, setMapInitial] = useState<Address>();
  const toast = useAppToast();
  const openMap = async (next: "pickup" | "destination") => {
    try {
      const address = await locationService.getCurrentAddress();
      setMapInitial(address);
    } catch {
      toast.info("Choose a place on the Zambia map.");
      setMapInitial(undefined);
    }
    setTarget(next);
  };
  const ready = Boolean(
    intercityDraft.originCity && intercityDraft.destinationCity,
  );

  return (
    <>
      <BookingMapRouteShell
        service="intercity"
        activeStep="route"
        serviceLabel="City-to-City"
        progressSteps={intercitySteps}
        title="Which cities are you connecting?"
        detail="Choose pickup and delivery addresses anywhere in Zambia."
        pickup={
          intercityDraft.originAddress ??
          cityAddress(
            intercityDraft.originCity,
            intercityDraft.originBranchId,
            "Origin city",
            intercityDraft.originLatitude,
            intercityDraft.originLongitude,
          )
        }
        destination={
          intercityDraft.destinationAddress ??
          cityAddress(
            intercityDraft.destinationCity,
            intercityDraft.destinationBranchId,
            "Destination city",
            intercityDraft.destinationLatitude,
            intercityDraft.destinationLongitude,
          )
        }
        routeReady={ready}
        continueLabel="Continue to cargo"
        continueDisabled={!ready}
        onContinue={() => router.push("/intercity/cargo" as never)}
      >
        <RouteEntryCard
          scope="intercity"
          from={{
            value:
              intercityDraft.originAddress?.detail ??
              intercityDraft.originCity ??
              "",
            detail: intercityDraft.originBranchId
              ? "Selected branch"
              : "Any address in Zambia",
          }}
          to={{
            value:
              intercityDraft.destinationAddress?.detail ??
              intercityDraft.destinationCity ??
              "",
            detail: intercityDraft.destinationBranchId
              ? "Selected branch"
              : "Home, work, or a branch",
          }}
          onSuggestionSelect={(target, suggestion) =>
            target === "from"
              ? updateIntercityDraft({
                  originAddress: routeSuggestionToAddress(suggestion),
                  quote: undefined,
                  originCity: suggestion.city,
                  originBranchId: suggestion.branchId,
                  originLatitude: suggestion.latitude,
                  originLongitude: suggestion.longitude,
                })
              : updateIntercityDraft({
                  destinationAddress: routeSuggestionToAddress(suggestion),
                  quote: undefined,
                  destinationCity: suggestion.city,
                  destinationBranchId: suggestion.branchId,
                  destinationLatitude: suggestion.latitude,
                  destinationLongitude: suggestion.longitude,
                })
          }
          onManualEntryPress={(next) =>
            void openMap(next === "from" ? "pickup" : "destination")
          }
          manualEntryLabel="Use map"
          accessibilityHint="Set pickup and delivery addresses anywhere in Zambia"
        />
      </BookingMapRouteShell>
      {target ? (
        <LocalLocationPicker
          city={{
            city: mapInitial?.city || "Lusaka",
            latitude: mapInitial?.latitude ?? -15.3875,
            longitude: mapInitial?.longitude ?? 28.3228,
          }}
          restrictToCity={false}
          initial={mapInitial}
          target={target}
          onClose={() => setTarget(null)}
          onConfirm={(address) => {
            updateIntercityDraft(
              target === "pickup"
                ? {
                    originAddress: address,
                    originCity: address.city,
                    originBranchId: address.branchId,
                    originLatitude: address.latitude,
                    originLongitude: address.longitude,
                    quote: undefined,
                  }
                : {
                    destinationAddress: address,
                    destinationCity: address.city,
                    destinationBranchId: address.branchId,
                    destinationLatitude: address.latitude,
                    destinationLongitude: address.longitude,
                    quote: undefined,
                  },
            );
            setTarget(null);
          }}
        />
      ) : null}
    </>
  );
}
