import { LocalLocationPicker } from "@/ui/maps/local-location-picker";
import { PrimaryButton } from "@/ui/nwc-ui";
import { useAddressBook } from "@/lib/use-cases/use-address-book";
import { savedPlaceToAddress } from "@/lib/account-directory-booking";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { BookingMapRouteShell } from "@/features/booking/components/booking-map-route-shell";
import {
  BookingSection,
  ChoiceTile,
} from "@/features/booking/components/booking-ui";
import { RouteEntryCard } from "@/features/booking/components/route-entry-card";
import { importSteps } from "@/lib/service-booking";
import {
  loadRouteReferenceData,
  routeSuggestionToAddress,
} from "@/lib/route-autocomplete";
import { useBookingDraft } from "@/stores/booking-draft";
import type { Address } from "@/types/cargo";
import { locationService } from "@/lib/services/device/location-service";
import { nearestReceivingBranch } from "@/lib/maps/international-route";
import { useAppToast } from "@/ui/app-toast";

function laneAddress(
  city?: string,
  country?: string,
  branchId?: string,
  latitude?: number,
  longitude?: number,
): Address | undefined {
  if (!city) return undefined;
  return {
    city,
    area: country || city,
    detail: city,
    label: country ? `${city}, ${country}` : city,
    branchId,
    latitude,
    longitude,
  };
}

export default function ImportRouteScreen() {
  const { importDraft, updateImportDraft } = useBookingDraft();
  const [officeMapPoints, setOfficeMapPoints] = useState<Address[]>([]);
  const toast = useAppToast();
  const { savedPlaces } = useAddressBook();
  const [homeMapOpen, setHomeMapOpen] = useState(false);
  const [homeMapInitial, setHomeMapInitial] = useState<Address>();
  const setHome = (address: Address) => {
    manuallySelectedDestination.current = true;
    updateImportDraft({
      destinationAddress: address,
      destinationCity: address.city,
      destinationBranchId: address.branchId,
      destinationLatitude: address.latitude,
      destinationLongitude: address.longitude,
      quote: undefined,
    });
  };
  const current = useRef({ importDraft, updateImportDraft, toast });
  current.current = { importDraft, updateImportDraft, toast };
  const manuallySelectedDestination = useRef(false);
  useEffect(() => {
    let active = true;
    void loadRouteReferenceData()
      .then(async (offices) => {
        if (!active) return;
        setOfficeMapPoints(offices.map(routeSuggestionToAddress));
        if (
          current.current.importDraft.destinationCity ||
          manuallySelectedDestination.current
        )
          return;
        const location = await locationService.getCurrentLocation();
        if (
          !active ||
          manuallySelectedDestination.current ||
          current.current.importDraft.destinationCity
        )
          return;
        if (!location.ok) {
          current.current.toast.info(
            "Choose your receiving branch manually. Location is unavailable.",
          );
          return;
        }
        const branch = nearestReceivingBranch(
          offices.filter(
            (
              office,
            ): office is typeof office & {
              latitude: number;
              longitude: number;
            } =>
              Number.isFinite(office.latitude) &&
              Number.isFinite(office.longitude),
          ),
          location.value,
        );
        if (!branch) return;
        current.current.updateImportDraft({
          destinationCity: branch.city,
          destinationBranchId: branch.branchId,
          destinationLatitude: branch.latitude,
          destinationLongitude: branch.longitude,
        });
        current.current.toast.info(
          `Nearest receiving branch selected: ${branch.label}. You can change it.`,
        );
      })
      .catch(() => {
        if (active)
          current.current.toast.info(
            "Could not detect your location. Choose a receiving branch.",
          );
      });
    return () => {
      active = false;
    };
  }, []);
  const ready = Boolean(
    importDraft.method &&
    importDraft.originCountry &&
    importDraft.originCity &&
    importDraft.originBranchId &&
    importDraft.destinationCity,
  );
  return (
    <>
      <BookingMapRouteShell
        service="import"
        activeStep="route"
        serviceLabel="International Imports"
        progressSteps={importSteps}
        title="Plan your international shipment"
        detail="Choose a Newworld Cargo origin office and Zambia receiving branch, then select Air or Sea Freight."
        pickup={laneAddress(
          importDraft.originCity,
          importDraft.originCountry,
          importDraft.originBranchId,
          importDraft.originLatitude,
          importDraft.originLongitude,
        )}
        destination={
          importDraft.destinationAddress ??
          laneAddress(
            importDraft.destinationCity,
            "Zambia",
            importDraft.destinationBranchId,
            importDraft.destinationLatitude,
            importDraft.destinationLongitude,
          )
        }
        overviewPoints={officeMapPoints}
        routeReady={ready}
        continueLabel="Continue to cargo"
        continueDisabled={!ready}
        onContinue={() => router.push("/import/cargo" as never)}
      >
        <RouteEntryCard
          scope="import"
          requireBranch="origin"
          from={{
            value: importDraft.originCity ?? "",
            detail:
              importDraft.originCountry ??
              "Select a Newworld Cargo origin office",
          }}
          to={{
            value:
              importDraft.destinationAddress?.detail ??
              importDraft.destinationCity ??
              "",
            detail: importDraft.destinationBranchId
              ? "Selected receiving branch"
              : "Select a Zambia home address or receiving branch",
          }}
          onSuggestionSelect={(target, suggestion) => {
            if (target === "to") manuallySelectedDestination.current = true;
            return target === "from"
              ? updateImportDraft({
                  originCountry:
                    suggestion.country ?? importDraft.originCountry,
                  originCity: suggestion.city,
                  originBranchId: suggestion.branchId,
                  originLatitude: suggestion.latitude,
                  originLongitude: suggestion.longitude,
                })
              : updateImportDraft({
                  destinationAddress: routeSuggestionToAddress(suggestion),
                  quote: undefined,
                  destinationCity: suggestion.city,
                  destinationBranchId: suggestion.branchId,
                  destinationLatitude: suggestion.latitude,
                  destinationLongitude: suggestion.longitude,
                });
          }}
          accessibilityHint="Set your import origin and receiving city"
        />
        <PrimaryButton
          label="Choose home address on map"
          icon="map-marker-outline"
          onPress={async () => {
            try {
              setHomeMapInitial(await locationService.getCurrentAddress());
            } catch {
              setHomeMapInitial(undefined);
            }
            setHomeMapOpen(true);
          }}
        />
        {savedPlaces.map((place) => (
          <PrimaryButton
            key={place.id}
            label={`Deliver to ${place.label}`}
            onPress={() => setHome(savedPlaceToAddress(place))}
          />
        ))}
        <BookingSection label="Shipment type">
          <ChoiceTile
            title="Air Freight"
            detail="Faster for time-sensitive cargo."
            icon="airplane"
            selected={importDraft.method === "air"}
            onPress={() => updateImportDraft({ method: "air" })}
          />
          <ChoiceTile
            title="Sea Freight"
            detail="Best for larger or flexible shipments."
            icon="ferry"
            selected={importDraft.method === "sea"}
            onPress={() => updateImportDraft({ method: "sea" })}
          />
        </BookingSection>
      </BookingMapRouteShell>
      {homeMapOpen ? (
        <LocalLocationPicker
          city={{
            city: homeMapInitial?.city || "Lusaka",
            latitude: homeMapInitial?.latitude ?? -15.3875,
            longitude: homeMapInitial?.longitude ?? 28.3228,
          }}
          restrictToCity={false}
          initial={homeMapInitial}
          target="destination"
          onClose={() => setHomeMapOpen(false)}
          onConfirm={(address) => {
            setHome(address);
            setHomeMapOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
