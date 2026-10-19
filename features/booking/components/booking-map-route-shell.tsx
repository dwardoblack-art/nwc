import { BookingMapDrawerFrame } from "@/features/booking/components/booking-map-drawer-frame";
import type { BookingProgressStep } from "@/features/booking/components/booking-ui";
import { PrimaryButton } from "@/ui/nwc-ui";
import type { DeliveryMapService } from "@/lib/domain/delivery-map";
import type { Address } from "@/types/cargo";

type BookingMapRouteShellProps = {
  service: DeliveryMapService;
  serviceLabel: string;
  activeStep: string;
  progressSteps: BookingProgressStep[];
  title: string;
  detail: string;
  pickup?: Address;
  destination?: Address;
  overviewPoints?: Address[];
  routeReady: boolean;
  continueLabel: string;
  continueDisabled?: boolean;
  onContinue: () => void;
  children: React.ReactNode;
};

export function BookingMapRouteShell({
  service,
  serviceLabel,
  activeStep,
  progressSteps,
  title,
  detail,
  pickup,
  destination,
  overviewPoints,
  routeReady,
  continueLabel,
  continueDisabled,
  onContinue,
  children,
}: BookingMapRouteShellProps) {
  const activeIndex = Math.max(
    0,
    progressSteps.findIndex((step) => step.id === activeStep),
  );
  return (
    <BookingMapDrawerFrame
      service={service}
      serviceLabel={serviceLabel}
      stepLabel={progressSteps[activeIndex]?.label ?? "Route"}
      stepPosition={`Step ${activeIndex + 1} of ${progressSteps.length}`}
      title={title}
      detail={detail}
      pickup={pickup}
      destination={destination}
      overviewPoints={overviewPoints}
      routeReady={routeReady}
      footer={
        <PrimaryButton
          label={continueLabel}
          icon="arrow-right"
          disabled={continueDisabled}
          onPress={onContinue}
        />
      }
    >
      {children}
    </BookingMapDrawerFrame>
  );
}
