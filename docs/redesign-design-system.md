# Cargo UI foundations

Keep every existing light/dark brand token unchanged. `ui/use-nwc-colors` resolves the active palette through the existing theme provider. The legacy static `nwcColors` export remains compatible; rendered UI uses the active palette. Additional `tintRRGGBB` tokens retain existing unmatched component colors byte for byte.

Poppins uses 12/18 caption, 16/24 body, 24/32 title, and 32/40 display sizes. Use medium and semibold for hierarchy, and allow native text scaling. Spacing steps are 4, 8, 12, 16, 24, 32, 48. Controls use 14px corners, cards 20px, sheets 28px, and badges fully rounded corners. Buttons have at least 44pt targets and flexible content height. Yellow actions always use primary ink. Content surfaces use fine borders and restrained elevation.

Shared primitives are exported from `ui/primitives`: Screen, Header, PrimaryButton, SecondaryButton, IconButton, Card, Field, Badge, Sheet, EmptyState, ListRow, ProgressSteps. Existing sheet gestures, input callbacks, asynchronous button protection and error semantics are retained. Screen-specific implementations remain where replacing them would risk losing fields or actions.

`ui/touch-target.ts` supplies the shared 44pt minimum for all direct pressable controls, including text links and icon-only actions. Shared button labels shrink and wrap within the available width at larger text sizes.
