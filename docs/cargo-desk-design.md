# Cargo desk — visual redesign

The previous pass preserved too much of the original composition. This revision changes the visual identity through layout while retaining the existing palette and product behavior.

## Design decisions

- A full-width navy identity band and a large greeting establish Home as a cargo desk, with tracking as a clear primary action.
- Numbered service rows replace the repeated pale rounded illustration cards. Vehicle artwork becomes a supporting thumbnail rather than the main subject.
- Large editorial page headings, narrow yellow rules and consistent section numbering give Send, Shipments and Bills distinct hierarchy.
- Shipment routes read vertically as a journey. Bills use a statement layout with a strong balance panel and a flat invoice ledger.
- Navigation keeps the same routes and visibility, but every displayed tab has a label. The dock is quieter and less capsule-shaped.
- Booking drawers keep their existing gestures, map, keyboard handling, fields and footer actions. A visible step line and an asymmetric header distinguish the new booking layout.
- Auth and account screens share the navy identity band. Welcome uses a navy canvas, white headline and yellow primary action.
- Shared controls use 8–12pt corners, generous vertical space and at least 44pt targets. Existing light/dark tokens remain authoritative.

## Review captures

Screens in `cargo-desk-screens/` use the real UI components. Home, Send, Shipments and Bills design-review captures use clearly identified sample data and inert preview callbacks; they do not represent authenticated accounts or completed transactions. The temporary preview route is removed before committing. Welcome, sign-in and tracking captures use the actual public screens.

The original Play Store assets remain untouched for comparison. They should be regenerated from the final device build after this visual direction is reviewed.
