# Redesign report

## Baseline — 2026-10-19

- Branch: `redesign/reskin`, starting from `updates`.
- Install: `pnpm.cmd install --frozen-lockfile --reporter=append-only` passed after network escalation. PowerShell blocks the `.ps1` shim, so commands use `.cmd`.
- `pnpm check`: passed.
- `pnpm lint`: passed with two existing warnings: unused `TouchableOpacity` in shipment manage; missing `evidence` effect dependency in the support evidence drawer. Neither is silently fixed.
- `pnpm test`: 66 files passed, one skipped; 214 tests passed, one skipped. The first sandbox run failed while esbuild resolved the config; the authorized retry passed.
- No `.env`, `.env.*`, `credentials.json`, `credentials/**`, or `*.jks` paths are tracked. Secret contents and the credentials directory were not inspected.
- Existing uncommitted release/account work was present at the start, including changes in frozen libraries and tests. Those changes are not redesign changes. The backend is read-only and has not been accessed.

## Changes delivered

- Retained all 77 Expo Router files, paths, dynamic parameters, redirects, fields, actions and existing loading/empty/error/offline branches. The root layout still owns application startup and providers; the other routes re-export feature implementations.
- Applied theme-aware surfaces and text, lighter Poppins weights, more space between content groups, fine borders, restrained elevation and larger small-control targets across the screen families. The welcome screen now scrolls at larger text sizes. Existing asynchronous button protection, sheet gestures, keyboard handling and navigation callbacks remain intact.
- Added shared foundations and primitives documented in `redesign-design-system.md`. Registered the bundled Poppins faces for web without waiting for them during startup. Corrected web theme hydration so dark preferences update the rendered screen, and exposed the complete token palette to NativeWind.
- Existing light/dark palette values are unchanged. Previously unmatched component hex values were retained as named `tintRRGGBB` tokens. The legacy static `nwcColors` export remains compatible with its existing tests; rendered components use the active palette.
- Moved screen implementations and feature components to `features/<feature>/`; shared UI, maps, navigation and layout utilities are in `ui/`. The complete per-file mapping is in `redesign-inventory.md`.
- Removed `hello-wave`, `parallax-scroll-view` and `external-link` only after a zero-reference search.
- Display name: **Newworld Cargo**; slug/package name: `nwcargo-mobile`; iOS/Android identifier: `com.nwcargo.app`. Both `nwcargo` and `newworldcargo` schemes remain accepted. The HTTPS host and API domains are unchanged.
- Updated the local Android namespace, application ID, label, manifest schemes and Kotlin package paths. `/android` was already ignored by Git and EAS; it remains generated local output. The committed source of native release identity is `app.config.ts`, verified through temporary native generation.
- Removed the previous EAS project fallback and all profile project IDs. `EXPO_PUBLIC_EXPO_PROJECT_ID` is the sole source. Removed local-credential overrides; retained remote versioning, production AAB output and automatic version increments.
- Expanded secret exclusions to `.env.*`; `.tmp/` and `.pnpm-store/` are excluded from uploads and Git. Build-required `app/`, `features/`, `ui/`, fonts and assets remain included. No signing commands were run and no credential contents were inspected or modified.

## Folder mapping

| Before | After |
| --- | --- |
| Screen implementations in `app/` | `features/{booking,billing,tracking,account,auth,home,support}/screens/` |
| `components/{booking,billing,tracking,account,auth,home,support}/` | Corresponding `features/<feature>/components/` |
| `components/domain/` | `features/booking/components/` |
| `components/ui/` | `ui/` |
| `components/map/` | `ui/maps/` |
| `components/navigation/` | `ui/navigation/` |
| `components/layout/`, `components/system/` | `ui/layout/`, `ui/system/` |
| Other retained shared components | `ui/` |
| Android `com/newworldcargo/mobile/` | Local generated `com/nwcargo/app/` |

## Verification

| Check | Before | After |
| --- | --- | --- |
| Dependency install | Passed after network approval | Lockfile unchanged |
| TypeScript | Passed | Passed |
| Lint | 0 errors, 2 warnings | 0 errors, same 2 warnings at their new paths |
| Vitest | 66 files passed, 1 skipped; 214 tests passed, 1 skipped | Same results |
| Web export | Not part of the initial four-command baseline | Screen, restructure and final exports generated all route pages |
| Temporary native prebuild | Original identity generated successfully | New name, namespace, application ID and both schemes confirmed; exit 0 |
| Frozen source audit | Recorded source hashes before screen work | No logical changes; three type-import path updates only |
| Callback/input audit | Recorded JSX attributes before screen work | 787 retained callback/input attributes match structurally |

The two baseline lint warnings are the support evidence effect dependency and unused `TouchableOpacity` in shipment management. The lint command now explicitly includes `features/` and `ui/` instead of the removed `components/` directory. Existing module-format and tool deprecation notices remain.

The first web attempt hit a temporary missing palette import during implementation; it was corrected. Later exports completed successfully. Expo sometimes prints that it forced its own exit after export; the final Node-run export and native checks return exit 0. Windows native generation covers Android; an iOS compile/signing run was not performed. Separate export/prebuild artifacts were not retained for every individual commit.

`redesign-behavior-audit.json` records the source comparison. The three frozen files with type-import updates are `lib/booking-review-edits.ts`, `lib/customer-map-state.ts` and `lib/domain/permission.ts`. The backend was not modified or accessed.

## Review artifacts and limits

### Follow-up compliance audit

The follow-up audit found and corrected undersized touch controls, missing explicit accessibility labels, selected mobile-money text contrast, and an Android custom-scheme override edge case. All 138 direct `TouchableOpacity`/`Pressable` controls now apply the shared 44pt minimum; 18 previously implicit labels are explicit. Existing roles and handlers are preserved. `redesign-accessibility-audit.json` records zero remaining static target/label findings.

Simulated 200% browser text exposed horizontal clipping in public tracking. The screen panel now stays within its viewport and shared button labels wrap. The tracking overlay also uses the active theme surface rather than a fixed translucent white background. Additional large-text captures are browser simulations; native system text scaling still needs device review.

All 13 original theme token pairs match the baseline exactly, build-profile API URLs are unchanged, and no secret paths are tracked. The expanded source comparison checks 133 screen/component modules with presentation, types and import relocation normalized; it found no remaining executable-logic differences. The separate 787 callback/input-attribute comparison remains unchanged. Runtime checks with both legacy and custom scheme overrides confirm that `nwcargo` and `newworldcargo` remain accepted with the new package identifiers.

This does not certify real-device interaction or every authenticated state. The initial workflow also did not retain independent web/native verification artifacts after every phase; that historical process gap cannot be retroactively claimed as completed. Final and follow-up full checks are recorded instead.

Light/dark browser screenshots of welcome, sign-in, public tracking and the theme lab are in `redesign-screens/`. These are browser captures at a mobile viewport, not physical-device certification. Authenticated booking, payment, map, contact-picker, notification and account flows still need device review with a dedicated test account; no real bookings or payments were submitted.

The Send route remains hidden from the floating tab bar, matching the original navigation configuration. Existing entry points remain intact. Scheduling, pricing, mappers, request shapes, permission decisions, session recovery and payment state transitions were deliberately left alone.

The workspace began with unrelated uncommitted changes in `lib/config/env.ts`, `lib/legal-documents.ts`, `lib/services/device/file-service.ts`, `lib/services/device/permission-service.ts`, `tests/legal-documents.test.ts` and `tests/mobile-native-services.test.ts`. They remain uncommitted and unchanged by this task. Other original assets, policy-site files and helper scripts remain as found. Existing account UI and release-configuration edits were preserved in explicitly named commits before the corresponding redesign/rename changes, keeping those deltas reviewable.

## Manual release checklist

- [ ] Run `eas init` to create the new project. Set `EXPO_PUBLIC_EXPO_PROJECT_ID` to its new ID in the local/EAS build environment. Do not reuse the previous project ID. Keep any explicit app identity overrides consistent with `com.nwcargo.app`, `nwcargo-mobile` and `nwcargo`.
- [ ] Run the first `eas build --platform android --profile production`. Answer yes to generating a new remote keystore, then download a backup through `eas credentials`. Store the backup securely outside this repository.
- [ ] Create the new Play Console listing for `com.nwcargo.app`, enable Play App Signing and upload the `.aab`. This also confirms package availability. Run `scripts/verify-play-bundle.ps1` against that new bundle.
- [ ] Copy the **app signing** SHA-256 from Play Console. Add the new package name and that fingerprint to the Google Maps API key restrictions.
- [ ] Add `com.nwcargo.app` and its Play app-signing SHA-256 to `assetlinks.json` on `app.newworldcargo.com`. Keep the existing host and legacy associations needed by installed apps.
- [ ] Register `com.nwcargo.app` in the Apple Developer account if shipping iOS, then validate iOS signing, permissions and links on a device.
- [ ] Review authenticated screens in both modes and at larger system text sizes; smoke-test every booking service, uploads, billing, tracking, denied permissions, notifications and account recovery/deletion before submission.
