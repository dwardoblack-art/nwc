import { apiClient } from "@/lib/api/client";
import { isValidInternationalMobile } from "@/lib/auth-flow";
import type {
  CustomerInvoice,
  PaymentMethod,
  SavedPaymentMethod,
  WalletActivity,
  WalletSnapshot,
} from "@/lib/domain/billing";
import type { BillingActionsRepository } from "@/lib/repositories/types";

type PortalMoney = { currency?: string; amountMinor?: number | string };
type LaravelWalletResponse = {
  currency?: string;
  balance?: number | string;
  activity?: WalletActivity[];
  availableBalance?: PortalMoney;
  pendingBalance?: PortalMoney;
};
type LaravelWalletLedgerResponse = {
  id?: string | number;
  type?: string;
  status?: string;
  amount?: PortalMoney;
  createdAt?: string | null;
};
type LaravelPaymentIntentResponse = {
  id?: string;
  status?: string;
  clientToken?: string | null;
  providerReference?: string | null;
};
type LaravelPaymentMethodResponse = SavedPaymentMethod;
type LaravelResolutionResponse = NonNullable<CustomerInvoice["resolution"]>;

export function paymentStateFromProvider(
  status?: string,
): "confirmed" | "failed" | "delayed" {
  if (["succeeded", "confirmed", "completed"].includes(status ?? ""))
    return "confirmed";
  if (["requires_action", "processing", "pending"].includes(status ?? ""))
    return "delayed";
  return "failed";
}

function mapWallet(raw: LaravelWalletResponse): WalletSnapshot {
  const balance = raw.availableBalance
    ? Number(raw.availableBalance.amountMinor ?? 0) / 100
    : typeof raw.balance === "number"
      ? raw.balance
      : Number(raw.balance ?? 0);
  return {
    currencyCode: raw.availableBalance?.currency ?? raw.currency ?? "ZMW",
    balance: Number.isFinite(balance) ? balance : 0,
    activity: raw.activity ?? [],
  };
}

function mapWalletActivity(raw: LaravelWalletLedgerResponse): WalletActivity {
  const amount = Number(raw.amount?.amountMinor ?? 0) / 100;
  return {
    id: String(raw.id ?? raw.createdAt ?? Date.now()),
    label:
      raw.type === "payment"
        ? "Wallet payment"
        : raw.status === "pending"
          ? "Deposit awaiting confirmation"
          : raw.status === "failed"
            ? "Deposit not completed"
            : "Wallet deposit",
    detail: raw.status ?? "Posted",
    amount: Number.isFinite(amount) ? amount : 0,
    type: raw.type === "payment" ? "payment" : "topup",
    time: raw.createdAt ?? "Recently",
  };
}

async function getWalletSnapshot(): Promise<WalletSnapshot> {
  const [wallet, activity] = await Promise.all([
    apiClient.get<{ data: LaravelWalletResponse }>("/api/v1/wallet"),
    apiClient.get<{ data: LaravelWalletLedgerResponse[] }>(
      "/api/v1/wallet/transactions",
    ),
  ]);
  return {
    ...mapWallet(wallet.data),
    activity: activity.data.map(mapWalletActivity),
  };
}

export const laravelBillingActionsRepository: BillingActionsRepository = {
  async listPaymentMethods() {
    const response = await apiClient.get<{
      data: LaravelPaymentMethodResponse[];
    }>("/api/v1/payment-methods");
    return response.data.filter((method) => method.method !== "card");
  },
  async savePaymentMethod(method: Exclude<PaymentMethod, "wallet">, details) {
    if (method === "card")
      throw new Error("Bank cards are disabled in the mobile app.");
    if (!details || !isValidInternationalMobile(details.phone))
      throw new Error("Enter a mobile money number with country code.");
    const response = await apiClient.post<{
      data: LaravelPaymentMethodResponse;
    }>("/api/v1/payment-methods", {
      method,
      label: "Mobile money",
      detail: `${details.provider} · ${details.phone}`,
      phone: details.phone,
      provider: details.provider,
    });
    return response.data;
  },
  async removePaymentMethod(methodId) {
    await apiClient.delete(
      `/api/v1/payment-methods/${encodeURIComponent(methodId)}`,
    );
  },
  async setDefaultPaymentMethod(methodId) {
    const response = await apiClient.patch<{
      data: LaravelPaymentMethodResponse[];
    }>(`/api/v1/payment-methods/${encodeURIComponent(methodId)}/default`);
    return response.data.filter((method) => method.method !== "card");
  },
  async getWallet() {
    return getWalletSnapshot();
  },
  async topUpWallet(amount, details, depositId, requestId) {
    if (!depositId && (!details || !isValidInternationalMobile(details.phone)))
      throw new Error("Enter a mobile money number with country code.");
    if (!Number.isFinite(amount) || amount <= 0)
      throw new Error("Enter a valid deposit amount.");
    const response = depositId
      ? await apiClient.get<{ data: { id: string; status: string } }>(
          `/api/v1/wallet/top-ups/${encodeURIComponent(depositId)}`,
        )
      : await apiClient.post<{ data: { id: string; status: string } }>(
          "/api/v1/wallet/top-ups",
          { amount, ...details, requestId },
        );
    return {
      ...(await getWalletSnapshot()),
      paymentState: paymentStateFromProvider(response.data.status),
      depositId: response.data.id,
    };
  },
  async confirmInvoicePayment(input) {
    if (input.method === "card")
      throw new Error("Bank cards are disabled in the mobile app.");
    if (
      !input.intentId &&
      input.method === "mobile" &&
      (!input.mobileMoney ||
        !isValidInternationalMobile(input.mobileMoney.phone))
    )
      throw new Error("Enter a mobile money number with country code.");
    const method = input.method === "wallet" ? "wallet" : "mobile-money";
    const response = input.intentId
      ? await apiClient.get<{ data: LaravelPaymentIntentResponse }>(
          `/api/v1/payments/intents/${encodeURIComponent(input.intentId)}`,
        )
      : await apiClient.post<{ data: LaravelPaymentIntentResponse }>(
          "/api/v1/payments/intents",
          {
            invoiceId: Number(input.invoice.id),
            method,
            ...(input.mobileMoney
              ? {
                  phone: input.mobileMoney.phone,
                  provider: input.mobileMoney.provider,
                }
              : {}),
          },
        );
    return {
      state: paymentStateFromProvider(response.data.status),
      paymentMethodLabel:
        input.method === "wallet" ? "Cargo wallet" : "Mobile money",
      intentId: response.data.id,
    };
  },
  async setInvoiceReminder(invoiceId, enabled) {
    await apiClient.patch(
      `/api/v1/invoices/${encodeURIComponent(invoiceId)}/reminder`,
      { enabled },
    );
  },
  async disputeInvoice(invoiceId) {
    const response = await apiClient.post<{ data: LaravelResolutionResponse }>(
      `/api/v1/invoices/${encodeURIComponent(invoiceId)}/disputes`,
    );
    return response.data;
  },
};
