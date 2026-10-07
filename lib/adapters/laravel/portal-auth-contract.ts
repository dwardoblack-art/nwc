import type {
  AuthSession,
  PasswordResetInput,
  RegisterCustomerInput,
} from "@/lib/domain/auth";
import type { CustomerProfile } from "@/lib/domain/customer";
import { MobileApiError } from "@/lib/api/errors";

export type PortalEnvelope<T> = {
  data: T;
  meta?: {
    mobileSession?: {
      token?: string;
      csrfToken?: string;
      expiresAt?: string;
    };
    [key: string]: unknown;
  };
  requestId?: string;
};

export type PortalAuthUser = {
  id: number | string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  provider?: "password" | "google" | string | null;
  verified?: boolean;
};

export function splitPortalName(name: string) {
  const [firstName = "", ...rest] = name.trim().split(/\s+/);
  return {
    firstName: firstName || name.trim() || "Customer",
    lastName: rest.join(" "),
  };
}

export function portalRegisterPayload(input: RegisterCustomerInput) {
  const name = splitPortalName(input.name);
  return {
    firstName: input.firstName?.trim() ?? name.firstName,
    lastName: input.lastName?.trim() ?? name.lastName,
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    password: input.password,
  };
}

export function portalPasswordResetPayload(input: PasswordResetInput) {
  return {
    identifier: input.challengeId,
    code: input.code,
    password: input.password,
    password_confirmation: input.password,
  };
}

export function mapPortalCustomer(user: PortalAuthUser): CustomerProfile {
  const displayName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return {
    id: String(user.id),
    name: displayName || user.email || "Newworld Cargo customer",
    phone: user.phone || "",
    ...(user.email ? { email: user.email } : {}),
    city: "Lusaka",
    ...(user.avatar ? { avatarUrl: user.avatar } : {}),
    ...(typeof user.verified === "boolean" ? { verified: user.verified } : {}),
    portalEnabled: true,
  };
}

export function mapPortalSession(
  response: PortalEnvelope<PortalAuthUser>,
): AuthSession {
  const mobileSession = response.meta?.mobileSession;
  return {
    ...(mobileSession?.token ? { token: mobileSession.token } : {}),
    ...(mobileSession?.csrfToken ? { csrfToken: mobileSession.csrfToken } : {}),
    ...(mobileSession?.expiresAt ? { expiresAt: mobileSession.expiresAt } : {}),
    customer: mapPortalCustomer(response.data),
  };
}

export function mapPortalLoginSession(
  response: PortalEnvelope<PortalAuthUser>,
): AuthSession {
  if (!response.meta?.mobileSession?.token) {
    throw new MobileApiError(
      "SERVER_ERROR",
      "The server did not create a mobile session. Please try again.",
    );
  }
  return mapPortalSession(response);
}
