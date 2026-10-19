# Redesign report

## Baseline — 2026-10-19

- Branch: `redesign/reskin`, starting from `updates`.
- Install: `pnpm.cmd install --frozen-lockfile --reporter=append-only` passed after network escalation. PowerShell blocks the `.ps1` shim, so commands use `.cmd`.
- `pnpm check`: passed.
- `pnpm lint`: passed with two existing warnings: unused `TouchableOpacity` in shipment manage; missing `evidence` effect dependency in the support evidence drawer. Neither is silently fixed.
- `pnpm test`: 66 files passed, one skipped; 214 tests passed, one skipped. The first sandbox run failed while esbuild resolved the config; the authorized retry passed.
- No `.env`, `.env.*`, `credentials.json`, `credentials/**`, or `*.jks` paths are tracked. Secret contents and the credentials directory were not inspected.
- Existing uncommitted release/account work was present at the start, including changes in frozen libraries and tests. Those changes are not redesign changes. The backend is read-only and has not been accessed.

## Verification and remaining work

Implementation and per-phase verification will be recorded here as work proceeds.
