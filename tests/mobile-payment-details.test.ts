import { beforeEach, describe, expect, it, vi } from "vitest";
const { post, get } = vi.hoisted(() => ({ post: vi.fn(), get: vi.fn() }));
vi.mock("../lib/api/client", () => ({ apiClient: { post, get } }));
import { laravelBillingActionsRepository as billing } from "../lib/adapters/laravel/laravel-billing-actions-adapter";
const invoice = {
  id: "12",
  reference: "INV-12",
  amount: { amount: 20, currencyCode: "ZMW", formatted: "K 20" },
};
beforeEach(() => {
  post.mockReset();
  get.mockReset();
});
describe("mobile payment details", () => {
  it("does not allow a wallet deposit without a mobile money account", async () => {
    await expect(billing.topUpWallet(250)).rejects.toThrow(
      "mobile money number",
    );
    expect(post).not.toHaveBeenCalled();
  });
  it("keeps unconfirmed deposits pending and reuses the deposit for status checks", async () => {
    post.mockResolvedValue({
      data: { id: "deposit-1", status: "requires_action" },
    });
    get.mockImplementation(async (url: string) => {
      if (url === "/api/v1/wallet")
        return { data: { availableBalance: { amountMinor: 0 } } };
      if (url === "/api/v1/wallet/transactions") return { data: [] };
      return { data: { id: "deposit-1", status: "processing" } };
    });
    const details = { phone: "+260971234567", provider: "MTN" as const };
    await expect(
      billing.topUpWallet(250, details, undefined, "request-1"),
    ).resolves.toMatchObject({
      balance: 0,
      paymentState: "delayed",
      depositId: "deposit-1",
    });
    expect(post).toHaveBeenCalledWith("/api/v1/wallet/top-ups", {
      amount: 250,
      ...details,
      requestId: "request-1",
    });
    await billing.topUpWallet(250, details, "deposit-1", "request-1");
    expect(post).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("/api/v1/wallet/top-ups/deposit-1");
  });
  it("requires a payer number before creating a mobile money intent", async () => {
    await expect(
      billing.confirmInvoicePayment({
        invoice,
        method: "mobile",
        walletBalance: 0,
      }),
    ).rejects.toThrow("mobile money number");
    expect(post).not.toHaveBeenCalled();
  });
  it("passes the payer number and provider and waits for provider confirmation", async () => {
    post.mockResolvedValue({
      data: { id: "intent-1", status: "requires_action" },
    });
    await expect(
      billing.confirmInvoicePayment({
        invoice,
        method: "mobile",
        walletBalance: 0,
        mobileMoney: { phone: "+260971234567", provider: "MTN" },
      }),
    ).resolves.toMatchObject({ state: "delayed", intentId: "intent-1" });
    expect(post).toHaveBeenCalledWith("/api/v1/payments/intents", {
      invoiceId: 12,
      method: "mobile-money",
      phone: "+260971234567",
      provider: "MTN",
    });
  });
  it("checks the same intent without creating a second payment", async () => {
    get.mockResolvedValue({ data: { id: "intent-1", status: "succeeded" } });
    await expect(
      billing.confirmInvoicePayment({
        invoice,
        method: "mobile",
        walletBalance: 0,
        intentId: "intent-1",
      }),
    ).resolves.toMatchObject({ state: "confirmed" });
    expect(get).toHaveBeenCalledWith("/api/v1/payments/intents/intent-1");
    expect(post).not.toHaveBeenCalled();
  });
  it("blocks saving or paying with a bank card", async () => {
    await expect(billing.savePaymentMethod("card")).rejects.toThrow("disabled");
    await expect(
      billing.confirmInvoicePayment({
        invoice,
        method: "card",
        walletBalance: 0,
      }),
    ).rejects.toThrow("disabled");
    expect(post).not.toHaveBeenCalled();
  });
  it("saves the entered mobile money details", async () => {
    post.mockResolvedValue({ data: { id: "m-1", method: "mobile" } });
    await billing.savePaymentMethod("mobile", {
      phone: "+260971234567",
      provider: "Airtel",
    });
    expect(post).toHaveBeenCalledWith(
      "/api/v1/payment-methods",
      expect.objectContaining({
        phone: "+260971234567",
        provider: "Airtel",
        detail: "Airtel · +260971234567",
      }),
    );
  });
});
