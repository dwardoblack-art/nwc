# Redesign inventory

All 77 route files remain at their original paths. Parameters, redirects and navigation outcomes are retained. The root layout remains the application bootstrap; other route files re-export feature screens.

| Route file | Components before | Feature screen after |
| --- | --- | --- |
| `app/(tabs)/_layout.tsx` | `@/components/navigation/floating-capsule-tab-bar` | `features/home/screens/tabs/_layout-screen.tsx` |
| `app/(tabs)/account.tsx` | `@/components/account/account-settings-screen` | `features/account/screens/tabs/account-screen.tsx` |
| `app/(tabs)/bills.tsx` | `@/components/ui/skeleton`, `@/components/ui/mobile-input`, `@/components/ui/app-icon`, `@/components/navigation/use-floating-navigation-clearance`, `@/components/ui/nwc-ui` | `features/billing/screens/tabs/bills-screen.tsx` |
| `app/(tabs)/index.tsx` | `@/components/ui/skeleton`, `@/components/home/customer-home-header`, `@/components/home/delivery-snapshot`, `@/components/home/home-service-tile`, `@/components/home/my-order-row`, `@/components/layout/customer-screen-layout`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/home/screens/tabs/index-screen.tsx` |
| `app/(tabs)/send.tsx` | `@/components/domain/cargo-cards`, `@/components/navigation/use-floating-navigation-clearance`, `@/components/ui/nwc-ui` | `features/booking/screens/tabs/send-screen.tsx` |
| `app/(tabs)/shipments.tsx` | `@/components/ui/skeleton`, `@/components/ui/mobile-input`, `@/components/domain/cargo-cards`, `@/components/navigation/use-floating-navigation-clearance`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/tracking/screens/tabs/shipments-screen.tsx` |
| `app/_layout.tsx` | `@/components/ui/app-toast` | `app/_layout.tsx` |
| `app/account/about.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/account/screens/account/about-screen.tsx` |
| `app/account/delete.tsx` | `@/components/ui/nwc-ui`, `@/components/ui/customer-confirmation-dialog` | `features/account/screens/account/delete-screen.tsx` |
| `app/account/legal/[document].tsx` | `@/components/account/legal-document-screen`, `@/components/ui/nwc-ui` | `features/account/screens/account/legal/[document]-screen.tsx` |
| `app/account/legal/index.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/account/screens/account/legal/index-screen.tsx` |
| `app/account/payment-methods.tsx` | `@/components/ui/app-icon`, `@/components/billing/mobile-money-fields`, `@/components/ui/customer-bottom-drawer`, `@/components/ui/customer-confirmation-dialog`, `@/components/ui/nwc-ui` | `features/account/screens/account/payment-methods-screen.tsx` |
| `app/account/profile.tsx` | `@/components/ui/mobile-input`, `@/components/ui/customer-bottom-drawer`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/auth/auth-shell`, `@/components/ui/app-toast` | `features/account/screens/account/profile-screen.tsx` |
| `app/account/recipients.tsx` | `@/components/account/account-directory-screen` | `features/account/screens/account/recipients-screen.tsx` |
| `app/account/recovery.tsx` | `@/components/auth/auth-shell`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/account/screens/account/recovery-screen.tsx` |
| `app/account/saved-places.tsx` | `@/components/account/account-directory-screen` | `features/account/screens/account/saved-places-screen.tsx` |
| `app/account/settings.tsx` | `@/components/account/account-settings-screen` | `features/account/screens/account/settings-screen.tsx` |
| `app/address-search.tsx` | `@/components/ui/mobile-input`, `@/components/map/customer-map`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/booking/screens/address-search-screen.tsx` |
| `app/auth/account-disabled.tsx` | `@/components/auth/auth-shell` | `features/auth/screens/auth/account-disabled-screen.tsx` |
| `app/auth/forgot-password.tsx` | `@/components/auth/auth-shell`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | `features/auth/screens/auth/forgot-password-screen.tsx` |
| `app/auth/permissions.tsx` | `@/components/ui/app-toast`, `@/components/ui/nwc-ui` | `features/auth/screens/auth/permissions-screen.tsx` |
| `app/auth/phone.tsx` | `@/components/auth/auth-shell`, `@/components/ui/app-icon`, `@/components/ui/app-toast` | `features/auth/screens/auth/phone-screen.tsx` |
| `app/auth/register.tsx` | `@/components/auth/auth-shell`, `@/components/ui/app-toast` | `features/auth/screens/auth/register-screen.tsx` |
| `app/auth/session-expired.tsx` | `@/components/auth/auth-shell` | `features/auth/screens/auth/session-expired-screen.tsx` |
| `app/auth/verify.tsx` | `@/components/auth/auth-shell`, `@/components/ui/app-toast` | `features/auth/screens/auth/verify-screen.tsx` |
| `app/auth/welcome.tsx` | `@/components/ui/nwc-ui` | `features/auth/screens/auth/welcome-screen.tsx` |
| `app/bills/[invoiceId].tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | `features/billing/screens/bills/[invoiceId]-screen.tsx` |
| `app/bills/deposit.tsx` | `@/components/billing/mobile-money-fields`, `@/components/ui/nwc-ui` | `features/billing/screens/bills/deposit-screen.tsx` |
| `app/bills/payment-states.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/billing/screens/bills/payment-states-screen.tsx` |
| `app/bills/payment-status.tsx` | `@/components/system/app-state-screen` | `features/billing/screens/bills/payment-status-screen.tsx` |
| `app/bills/payment.tsx` | `@/components/billing/mobile-money-fields`, `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/billing/screens/bills/payment-screen.tsx` |
| `app/bills/receipt.tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | `features/billing/screens/bills/receipt-screen.tsx` |
| `app/bills/receipts.tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | `features/billing/screens/bills/receipts-screen.tsx` |
| `app/bills/wallet.tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/billing/screens/bills/wallet-screen.tsx` |
| `app/bookings/drafts.tsx` | `@/components/ui/customer-confirmation-dialog`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/booking/screens/bookings/drafts-screen.tsx` |
| `app/custom/confirmation.tsx` | `@/components/booking/booking-confirmation` | `features/booking/screens/custom/confirmation-screen.tsx` |
| `app/custom/details.tsx` | `@/components/booking/cargo-items-form`, `@/components/booking/booking-ui` | `features/booking/screens/custom/details-screen.tsx` |
| `app/custom/review.tsx` | `@/components/booking/booking-quick-edit-drawer`, `@/components/booking/booking-ui`, `@/components/ui/nwc-ui` | `features/booking/screens/custom/review-screen.tsx` |
| `app/custom/route.tsx` | `@/components/booking/booking-map-route-shell`, `@/components/booking/booking-ui`, `@/components/booking/route-entry-card` | `features/booking/screens/custom/route-screen.tsx` |
| `app/dev/app-states.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/home/screens/dev/app-states-screen.tsx` |
| `app/dev/device-review.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/home/screens/dev/device-review-screen.tsx` |
| `app/dev/theme-lab.tsx` | `@/components/screen-container`, `@/components/themed-view`, `@/components/ui/icon-symbol` | `features/home/screens/dev/theme-lab-screen.tsx` |
| `app/import/cargo.tsx` | `@/components/booking/cargo-items-form`, `@/components/booking/booking-ui` | `features/booking/screens/import/cargo-screen.tsx` |
| `app/import/confirmation.tsx` | `@/components/booking/booking-confirmation` | `features/booking/screens/import/confirmation-screen.tsx` |
| `app/import/consignee.tsx` | `@/components/booking/booking-ui` | `features/booking/screens/import/consignee-screen.tsx` |
| `app/import/method.tsx` | React Native / router only | `features/booking/screens/import/method-screen.tsx` |
| `app/import/review.tsx` | `@/components/booking/shipment-ticket`, `@/components/booking/shipment-review-screen`, `@/components/booking/booking-quick-edit-drawer`, `@/components/booking/booking-ui` | `features/booking/screens/import/review-screen.tsx` |
| `app/import/route.tsx` | `@/components/map/local-location-picker`, `@/components/ui/nwc-ui`, `@/components/booking/booking-map-route-shell`, `@/components/booking/booking-ui`, `@/components/booking/route-entry-card`, `@/components/ui/app-toast` | `features/booking/screens/import/route-screen.tsx` |
| `app/index.tsx` | React Native / router only | `features/home/screens/entry-screen.tsx` |
| `app/intercity/cargo.tsx` | `@/components/booking/cargo-items-form`, `@/components/booking/booking-ui` | `features/booking/screens/intercity/cargo-screen.tsx` |
| `app/intercity/confirmation.tsx` | `@/components/booking/booking-confirmation` | `features/booking/screens/intercity/confirmation-screen.tsx` |
| `app/intercity/contacts.tsx` | `@/components/booking/booking-ui` | `features/booking/screens/intercity/contacts-screen.tsx` |
| `app/intercity/fulfilment.tsx` | `@/components/booking/booking-ui` | `features/booking/screens/intercity/fulfilment-screen.tsx` |
| `app/intercity/review.tsx` | `@/components/booking/shipment-ticket`, `@/components/booking/shipment-review-screen`, `@/components/booking/booking-quick-edit-drawer`, `@/components/booking/booking-ui` | `features/booking/screens/intercity/review-screen.tsx` |
| `app/intercity/route.tsx` | `@/components/map/local-location-picker`, `@/components/ui/app-toast`, `@/components/booking/booking-map-route-shell`, `@/components/booking/route-entry-card` | `features/booking/screens/intercity/route-screen.tsx` |
| `app/local-delivery/confirmation.tsx` | `@/components/booking/booking-confirmation`, `@/components/ui/nwc-ui` | `features/booking/screens/local-delivery/confirmation-screen.tsx` |
| `app/local-delivery/contacts.tsx` | `@/components/booking/booking-ui` | `features/booking/screens/local-delivery/contacts-screen.tsx` |
| `app/local-delivery/parcel.tsx` | `@/components/booking/cargo-items-form`, `@/components/booking/booking-ui` | `features/booking/screens/local-delivery/parcel-screen.tsx` |
| `app/local-delivery/review.tsx` | `@/components/booking/pickup-schedule-control`, `@/components/booking/shipment-ticket`, `@/components/booking/shipment-review-screen` | `features/booking/screens/local-delivery/review-screen.tsx` |
| `app/local-delivery/route.tsx` | `@/components/map/local-location-picker`, `@/components/booking/route-entry-card`, `@/components/map/local-delivery-map-backdrop`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | `features/booking/screens/local-delivery/route-screen.tsx` |
| `app/local-delivery/schedule.tsx` | React Native / router only | `features/booking/screens/local-delivery/schedule-screen.tsx` |
| `app/notifications.tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/support/screens/notifications-screen.tsx` |
| `app/notifications/preferences.tsx` | `@/components/ui/skeleton`, `@/components/ui/customer-confirmation-dialog`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/support/screens/notifications/preferences-screen.tsx` |
| `app/orders/[shipmentId].tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/tracking/screens/orders/[shipmentId]-screen.tsx` |
| `app/permissions/[permission].tsx` | `@/components/system/app-state-screen` | `features/auth/screens/permissions/[permission]-screen.tsx` |
| `app/permissions/index.tsx` | `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/auth/screens/permissions/index-screen.tsx` |
| `app/pickups/[shipmentId].tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/customer-confirmation-dialog`, `@/components/ui/nwc-ui` | `features/tracking/screens/pickups/[shipmentId]-screen.tsx` |
| `app/returns/[shipmentId].tsx` | `@/components/ui/skeleton`, `@/components/ui/customer-confirmation-dialog`, `@/components/ui/nwc-ui` | `features/tracking/screens/returns/[shipmentId]-screen.tsx` |
| `app/returns/index.tsx` | `@/components/ui/app-icon`, `@/components/ui/skeleton`, `@/components/ui/nwc-ui` | `features/tracking/screens/returns/index-screen.tsx` |
| `app/shipments/[shipmentId].tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/tracking/tracking-cards`, `@/components/ui/nwc-ui`, `@/components/ui/app-toast` | `features/tracking/screens/shipments/[shipmentId]-screen.tsx` |
| `app/shipments/[shipmentId]/manage.tsx` | `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui`, `@/components/ui/customer-confirmation-dialog` | `features/tracking/screens/shipments/[shipmentId]/manage-screen.tsx` |
| `app/startup.tsx` | `@/components/ui/nwc-ui`, `@/components/ui/skeleton`, `@/components/system/app-state-screen` | `features/auth/screens/startup-screen.tsx` |
| `app/support.tsx` | `@/components/ui/mobile-input`, `@/components/ui/customer-bottom-drawer`, `@/components/ui/skeleton`, `@/components/ui/app-icon`, `@/components/support/evidence-attachment-drawer`, `@/components/ui/nwc-ui` | `features/support/screens/support-screen.tsx` |
| `app/tracking/[shipmentId].tsx` | `@/components/ui/skeleton`, `@/components/tracking/shipment-tracking-screen`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/tracking/screens/tracking/[shipmentId]-screen.tsx` |
| `app/tracking/index.tsx` | `@/components/ui/nwc-ui`, `@/components/tracking/tracking-lookup` | `features/tracking/screens/tracking/index-screen.tsx` |
| `app/tracking/result.tsx` | `@/components/tracking/shipment-tracking-screen`, `@/components/ui/skeleton`, `@/components/ui/nwc-ui` | `features/tracking/screens/tracking/result-screen.tsx` |
| `app/tracking/scan.tsx` | `@/components/ui/mobile-input`, `@/components/ui/app-icon`, `@/components/ui/nwc-ui` | `features/tracking/screens/tracking/scan-screen.tsx` |

## Component folder mapping

- `components/account/account-directory-screen.tsx` → `features/account/components/account-directory-screen.tsx`
- `components/account/account-row.tsx` → `features/account/components/account-row.tsx`
- `components/account/account-settings-screen.tsx` → `features/account/components/account-settings-screen.tsx`
- `components/account/directory-entry-modal.tsx` → `features/account/components/directory-entry-modal.tsx`
- `components/account/full-screen-form-drawer.tsx` → `features/account/components/full-screen-form-drawer.tsx`
- `components/account/legal-document-screen.tsx` → `features/account/components/legal-document-screen.tsx`
- `components/account/location-finder-drawer.tsx` → `features/account/components/location-finder-drawer.tsx`
- `components/auth/auth-shell.tsx` → `features/auth/components/auth-shell.tsx`
- `components/billing/mobile-money-fields.tsx` → `features/billing/components/mobile-money-fields.tsx`
- `components/booking/booking-confirmation.tsx` → `features/booking/components/booking-confirmation.tsx`
- `components/booking/booking-map-drawer-frame.tsx` → `features/booking/components/booking-map-drawer-frame.tsx`
- `components/booking/booking-map-route-shell.tsx` → `features/booking/components/booking-map-route-shell.tsx`
- `components/booking/booking-quick-edit-drawer.tsx` → `features/booking/components/booking-quick-edit-drawer.tsx`
- `components/booking/booking-ui.tsx` → `features/booking/components/booking-ui.tsx`
- `components/booking/cargo-items-form.tsx` → `features/booking/components/cargo-items-form.tsx`
- `components/booking/pickup-schedule-control.tsx` → `features/booking/components/pickup-schedule-control.tsx`
- `components/booking/route-entry-card.tsx` → `features/booking/components/route-entry-card.tsx`
- `components/booking/shipment-review-screen.tsx` → `features/booking/components/shipment-review-screen.tsx`
- `components/booking/shipment-ticket.tsx` → `features/booking/components/shipment-ticket.tsx`
- `components/domain/cargo-cards.tsx` → `features/booking/components/cargo-cards.tsx`
- `components/haptic-tab.tsx` → `ui/haptic-tab.tsx`
- `components/home/customer-home-header.tsx` → `features/home/components/customer-home-header.tsx`
- `components/home/delivery-snapshot.tsx` → `features/home/components/delivery-snapshot.tsx`
- `components/home/home-service-tile.tsx` → `features/home/components/home-service-tile.tsx`
- `components/home/my-order-row.tsx` → `features/home/components/my-order-row.tsx`
- `components/layout/customer-screen-layout.ts` → `ui/layout/customer-screen-layout.ts`
- `components/map/branded-map-pin.tsx` → `ui/maps/branded-map-pin.tsx`
- `components/map/customer-map.tsx` → `ui/maps/customer-map.tsx`
- `components/map/international-world-overview.tsx` → `ui/maps/international-world-overview.tsx`
- `components/map/local-delivery-map-backdrop.tsx` → `ui/maps/local-delivery-map-backdrop.tsx`
- `components/map/local-location-picker.native.tsx` → `ui/maps/local-location-picker.native.tsx`
- `components/map/local-location-picker.tsx` → `ui/maps/local-location-picker.tsx`
- `components/map/map-loading-overlay.tsx` → `ui/maps/map-loading-overlay.tsx`
- `components/map/mock-route-map.tsx` → `ui/maps/mock-route-map.tsx`
- `components/map/native-map-surface.native.tsx` → `ui/maps/native-map-surface.native.tsx`
- `components/map/native-map-surface.tsx` → `ui/maps/native-map-surface.tsx`
- `components/navigation/customer-tab-icon.tsx` → `ui/navigation/customer-tab-icon.tsx`
- `components/navigation/floating-capsule-tab-bar.tsx` → `ui/navigation/floating-capsule-tab-bar.tsx`
- `components/navigation/use-floating-navigation-clearance.ts` → `ui/navigation/use-floating-navigation-clearance.ts`
- `components/screen-container.tsx` → `ui/screen-container.tsx`
- `components/support/evidence-attachment-drawer.tsx` → `features/support/components/evidence-attachment-drawer.tsx`
- `components/system/app-state-screen.tsx` → `ui/system/app-state-screen.tsx`
- `components/themed-view.tsx` → `ui/themed-view.tsx`
- `components/tracking/live-tracking-map.tsx` → `features/tracking/components/live-tracking-map.tsx`
- `components/tracking/shipment-tracking-screen.tsx` → `features/tracking/components/shipment-tracking-screen.tsx`
- `components/tracking/tracking-cards.tsx` → `features/tracking/components/tracking-cards.tsx`
- `components/tracking/tracking-lookup.tsx` → `features/tracking/components/tracking-lookup.tsx`
- `components/tracking/tracking-route-map.tsx` → `features/tracking/components/tracking-route-map.tsx`
- `components/ui/app-icon.tsx` → `ui/app-icon.tsx`
- `components/ui/app-toast.tsx` → `ui/app-toast.tsx`
- `components/ui/collapsible.tsx` → `ui/collapsible.tsx`
- `components/ui/contact-picker-action.tsx` → `ui/contact-picker-action.tsx`
- `components/ui/customer-bottom-drawer.tsx` → `ui/customer-bottom-drawer.tsx`
- `components/ui/customer-confirmation-dialog.tsx` → `ui/customer-confirmation-dialog.tsx`
- `components/ui/icon-symbol.ios.tsx` → `ui/icon-symbol.ios.tsx`
- `components/ui/icon-symbol.tsx` → `ui/icon-symbol.tsx`
- `components/ui/mobile-input.tsx` → `ui/mobile-input.tsx`
- `components/ui/nwc-ui.tsx` → `ui/nwc-ui.tsx`
- `components/ui/skeleton.tsx` → `ui/skeleton.tsx`
