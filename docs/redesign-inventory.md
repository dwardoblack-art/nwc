# Redesign inventory

Baseline: 2026-10-19. Route filenames and parameters are preserved. Imports below list each route’s direct UI dependencies; shared components can compose additional primitives.

| Route file | Components before | Feature screen after |
| --- | --- | --- |
| `app/(tabs)/_layout.tsx` | `@/components/navigation/floating-capsule-tab-bar` | Pending |
| `app/(tabs)/account.tsx` | `@/components/account/account-settings-screen` | Pending |
| `app/(tabs)/bills.tsx` | `@/components/ui/skeleton`, `@/components/ui/mobile-input`, `@/components/ui/app-icon`, `@/components/navigation/use-floating-navigation-clearance`, `@/components/ui/nwc-ui` | Pending |
| `app/(tabs)/index.tsx` | `@/components/ui/skeleton`, `@/components/home/customer-home-header`, `@/components/home/delivery-snapshot`, `@/components/home/home-service-tile`, `@/components/home/my-order-row`, `@/components/layout/customer-screen-layout`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/(tabs)/send.tsx` | `@/components/domain/cargo-cards`, `@/components/navigation/use-floating-navigation-clearance`, `@/components/ui/nwc-ui` | Pending |
| `app/(tabs)/shipments.tsx` | `@/components/ui/skeleton`, `@/components/ui/mobile-input`, `@/components/domain/cargo-cards`, `@/components/navigation/use-floating-navigation-clearance`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/_layout.tsx` | `@/components/ui/app-toast` | Pending |
| `app/account/about.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/account/delete.tsx` | `@/components/ui/nwc-ui`, `@/components/ui/customer-confirmation-dialog` | Pending |
| `app/account/legal/[document].tsx` | `@/components/account/legal-document-screen`, `@/components/ui/nwc-ui` | Pending |
| `app/account/legal/index.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/account/payment-methods.tsx` | `@/components/ui/app-icon`, `@/components/billing/mobile-money-fields`, `@/components/ui/customer-bottom-drawer`, `@/components/ui/customer-confirmation-dialog`, `@/components/ui/nwc-ui` | Pending |
| `app/account/profile.tsx` | `@/components/ui/mobile-input`, `@/components/ui/customer-bottom-drawer`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/auth/auth-shell`, `@/components/ui/app-toast` | Pending |
| `app/account/recipients.tsx` | `@/components/account/account-directory-screen` | Pending |
| `app/account/recovery.tsx` | `@/components/auth/auth-shell`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/account/saved-places.tsx` | `@/components/account/account-directory-screen` | Pending |
| `app/account/settings.tsx` | `@/components/account/account-settings-screen` | Pending |
| `app/address-search.tsx` | `@/components/ui/mobile-input`, `@/components/map/customer-map`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/auth/account-disabled.tsx` | `@/components/auth/auth-shell` | Pending |
| `app/auth/forgot-password.tsx` | `@/components/auth/auth-shell`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | Pending |
| `app/auth/permissions.tsx` | `@/components/ui/app-toast`, `@/components/ui/nwc-ui` | Pending |
| `app/auth/phone.tsx` | `@/components/auth/auth-shell`, `@/components/ui/app-icon`, `@/components/ui/app-toast` | Pending |
| `app/auth/register.tsx` | `@/components/auth/auth-shell`, `@/components/ui/app-toast` | Pending |
| `app/auth/session-expired.tsx` | `@/components/auth/auth-shell` | Pending |
| `app/auth/verify.tsx` | `@/components/auth/auth-shell`, `@/components/ui/app-toast` | Pending |
| `app/auth/welcome.tsx` | `@/components/ui/nwc-ui` | Pending |
| `app/bills/[invoiceId].tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | Pending |
| `app/bills/deposit.tsx` | `@/components/billing/mobile-money-fields`, `@/components/ui/nwc-ui` | Pending |
| `app/bills/payment-states.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/bills/payment-status.tsx` | `@/components/system/app-state-screen` | Pending |
| `app/bills/payment.tsx` | `@/components/billing/mobile-money-fields`, `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/bills/receipt.tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | Pending |
| `app/bills/receipts.tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | Pending |
| `app/bills/wallet.tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/bookings/drafts.tsx` | `@/components/ui/customer-confirmation-dialog`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/custom/confirmation.tsx` | `@/components/booking/booking-confirmation` | Pending |
| `app/custom/details.tsx` | `@/components/booking/cargo-items-form`, `@/components/booking/booking-ui` | Pending |
| `app/custom/review.tsx` | `@/components/booking/booking-quick-edit-drawer`, `@/components/booking/booking-ui`, `@/components/ui/nwc-ui` | Pending |
| `app/custom/route.tsx` | `@/components/booking/booking-map-route-shell`, `@/components/booking/booking-ui`, `@/components/booking/route-entry-card` | Pending |
| `app/dev/app-states.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/dev/device-review.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/dev/theme-lab.tsx` | `@/components/screen-container`, `@/components/themed-view`, `@/components/ui/icon-symbol` | Pending |
| `app/import/cargo.tsx` | `@/components/booking/cargo-items-form`, `@/components/booking/booking-ui` | Pending |
| `app/import/confirmation.tsx` | `@/components/booking/booking-confirmation` | Pending |
| `app/import/consignee.tsx` | `@/components/booking/booking-ui` | Pending |
| `app/import/method.tsx` | React Native / router only | Pending |
| `app/import/review.tsx` | `@/components/booking/shipment-ticket`, `@/components/booking/shipment-review-screen`, `@/components/booking/booking-quick-edit-drawer`, `@/components/booking/booking-ui` | Pending |
| `app/import/route.tsx` | `@/components/map/local-location-picker`, `@/components/ui/nwc-ui`, `@/components/booking/booking-map-route-shell`, `@/components/booking/booking-ui`, `@/components/booking/route-entry-card`, `@/components/ui/app-toast` | Pending |
| `app/index.tsx` | React Native / router only | Pending |
| `app/intercity/cargo.tsx` | `@/components/booking/cargo-items-form`, `@/components/booking/booking-ui` | Pending |
| `app/intercity/confirmation.tsx` | `@/components/booking/booking-confirmation` | Pending |
| `app/intercity/contacts.tsx` | `@/components/booking/booking-ui` | Pending |
| `app/intercity/fulfilment.tsx` | `@/components/booking/booking-ui` | Pending |
| `app/intercity/review.tsx` | `@/components/booking/shipment-ticket`, `@/components/booking/shipment-review-screen`, `@/components/booking/booking-quick-edit-drawer`, `@/components/booking/booking-ui` | Pending |
| `app/intercity/route.tsx` | `@/components/map/local-location-picker`, `@/components/ui/app-toast`, `@/components/booking/booking-map-route-shell`, `@/components/booking/route-entry-card` | Pending |
| `app/local-delivery/confirmation.tsx` | `@/components/booking/booking-confirmation`, `@/components/ui/nwc-ui` | Pending |
| `app/local-delivery/contacts.tsx` | `@/components/booking/booking-ui` | Pending |
| `app/local-delivery/parcel.tsx` | `@/components/booking/cargo-items-form`, `@/components/booking/booking-ui` | Pending |
| `app/local-delivery/review.tsx` | `@/components/booking/pickup-schedule-control`, `@/components/booking/shipment-ticket`, `@/components/booking/shipment-review-screen` | Pending |
| `app/local-delivery/route.tsx` | `@/components/map/local-location-picker`, `@/components/booking/route-entry-card`, `@/components/map/local-delivery-map-backdrop`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | Pending |
| `app/local-delivery/schedule.tsx` | React Native / router only | Pending |
| `app/notifications.tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/notifications/preferences.tsx` | `@/components/ui/skeleton`, `@/components/ui/customer-confirmation-dialog`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/orders/[shipmentId].tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/permissions/[permission].tsx` | `@/components/system/app-state-screen` | Pending |
| `app/permissions/index.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/pickups/[shipmentId].tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/customer-confirmation-dialog`, `@/components/ui/nwc-ui` | Pending |
| `app/returns/[shipmentId].tsx` | `@/components/ui/skeleton`, `@/components/ui/customer-confirmation-dialog`, `@/components/ui/nwc-ui` | Pending |
| `app/returns/index.tsx` | `@/components/ui/app-icon`, `@/components/ui/skeleton`, `@/components/ui/nwc-ui` | Pending |
| `app/shipments/[shipmentId].tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/tracking/tracking-cards`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | Pending |
| `app/shipments/[shipmentId]/manage.tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/ui/customer-confirmation-dialog` | Pending |
| `app/startup.tsx` | `@/components/ui/nwc-ui`, `@/components/ui/skeleton`, `@/components/system/app-state-screen` | Pending |
| `app/support.tsx` | `@/components/ui/mobile-input`, `@/components/ui/customer-bottom-drawer`, `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/support/evidence-attachment-drawer`, `@/components/ui/nwc-ui` | Pending |
| `app/tracking/[shipmentId].tsx` | `@/components/ui/skeleton`, `@/components/tracking/shipment-tracking-screen`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
| `app/tracking/index.tsx` | `@/components/ui/nwc-ui`, `@/components/tracking/tracking-lookup` | Pending |
| `app/tracking/result.tsx` | `@/components/tracking/shipment-tracking-screen`, `@/components/ui/skeleton`, `@/components/ui/nwc-ui` | Pending |
| `app/tracking/scan.tsx` | `@/components/ui/mobile-input`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | Pending |
