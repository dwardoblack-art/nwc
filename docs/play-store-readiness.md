# Google Play Readiness - 12 October 2026

## Release configuration verified

- Package: `com.nwcargo.app`; display name: `Newworld Cargo`; slug: `nwcargo-mobile`; app version: `1.0.0`.
- Production uses an Android App Bundle with EAS-managed remote signing. A new EAS project and a new Play listing are required; see `redesign-report.md` for the setup checklist.
- Remote EAS version codes increment automatically. Failed build attempts can consume version codes; gaps are valid.
- Compile and target API: 36; minimum API: 24; includes arm64-v8a.
- Expo regenerates Android from `app.config.ts` during EAS Build because `/android` is excluded by `.easignore`. The local generated Android folder is not the release source.
- Manifest introspection confirmed removal rules for microphone recording, contact writing, broad photo/video and storage access, overlays, and background location.
- Android image selection uses the system picker without requesting broad media permission.
- Production public environment values use Expo-compatible static references. The existing local Google Maps key was added to the EAS production environment as sensitive.
- TypeScript and release audit passed: 213 tests passed, one skipped. Device testing is separate.

## Policy URLs

- Privacy: https://newworld-cargo-policies.cloudy-beech-2099.chatgpt.site/
- Account deletion: https://newworld-cargo-policies.cloudy-beech-2099.chatgpt.site/delete-account.html
- The public privacy page is generated from `lib/legal-documents.ts` by `scripts/export-policy-pages.ts`.
- In-app deletion: Settings > Delete account. The authenticated request uses the existing `/api/v1/account/deletion-request` adapter. Email provides an alternative without sign-in.
- Privacy contact and deletion requests: `info@newworldcargo.com`, as listed on the company's public website.

## Required Before Submission

These items are not certified by source tests or by a successful AAB build:

1. Verify that the support inbox is monitored and that requests result in deletion of accounts AND associated personal data, not just deactivation. Test the authenticated deletion endpoint with a dedicated test account. Confirm actual retention categories and periods with the operator; update the policy if actual practice differs.
2. Review the generated policies against actual backend, delivery partner, mapping, hosting, payment, and diagnostic data practices. The policies were newly authored for this release; publication is not evidence of legal approval or of backend behavior.
3. Complete Play Console Data safety, content rating, target audience, ads, and app access declarations. Give reviewers working test credentials and instructions for any verification challenge.
4. Check the complete third-party SDK inventory and actual backend collection before finalizing Data safety. Do not claim 'no data collected'.
5. Run physical-device smoke tests for sign-in, registration, booking, uploads, payments, tracking, permission denial, and deletion, including Android 16 and a 16 KB page-size device or emulator.
6. Inspect the final AAB signature, target SDK, merged permissions, and every bundled native library for 16 KB alignment. React Native 0.81 provides a compatible foundation; that alone does not verify every dependency. Confirm Play Console's bundle validation and pre-launch report after an internal-test upload.
7. Confirm the upload certificate matches Play Console for any existing app, and restrict the Maps API key to the Android package and the PLAY APP SIGNING certificate. The upload certificate and Play signing certificate can differ.
8. Complete the store listing, screenshots, support details, developer verification, and any testing requirements applicable to the developer account. No Play Console submission was performed.

## Data Safety Working Inventory

This is a review aid, not an automatically approved declaration. Classify collection, sharing, optionality, and purposes against the current Google form and actual providers.

| Data | Evidence and likely purpose |
| --- | --- |
| Name, email, phone, account identifiers | Registration, sign-in, customer profile, account management |
| Addresses and selected location | Saved places, routes, pickup/delivery service; review Google Maps processing |
| Selected contact details | Recipient and sender information for bookings; address book access is permission-gated |
| Photos and documents | Profile images and customer-selected support/cargo evidence uploads |
| Shipment history and support messages | Cargo service, delivery coordination, customer support |
| Payment and purchase records | Invoices, receipts, wallet/mobile-money actions; inspect provider handling of payment credentials |
| App interactions and diagnostics | Operational telemetry when enabled; review server logs, SDK identifiers, and IP handling |

No advertising SDK was identified in the direct dependency list. Check transitive SDKs and backend behavior before declaring ads or device identifiers absent. HTTPS URLs are configured; verify every actual data flow before attesting to encryption in transit.

## Official References

- https://developer.android.com/google/play/requirements/target-sdk
- https://developer.android.com/guide/practices/page-sizes
- https://support.google.com/googleplay/android-developer/answer/10144311
- https://support.google.com/googleplay/android-developer/answer/13327111
- https://support.google.com/googleplay/android-developer/answer/10787469
