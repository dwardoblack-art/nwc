import type { CustomerMapMode } from "@/ui/maps/customer-map";

export const initialMapZoom: Record<CustomerMapMode, number> = { "location-picker": 1, "route-preview": 1, "live-local": 1, international: 0.82, completed: 1 };

export function clampMockMapZoom(zoom: number) { return Math.round(Math.max(0.7, Math.min(1.55, zoom)) * 100) / 100; }

export function isInternationalMapMode(mode: CustomerMapMode) { return mode === "international"; }
