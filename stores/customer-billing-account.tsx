import { customerSafeMessageFor } from "@/lib/api/errors";
import { isValidInternationalMobile } from "@/lib/auth-flow";
import type { MobileMoneyDetails } from "@/lib/domain/billing";
import { useQueryClient } from "@tanstack/react-query";
import { customerQueries } from "@/lib/data/customer-queries";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import {
  getDefaultPaymentMethod,
  mockInvoices,
  mockSavedPaymentMethods,
  mockWalletStartingBalance,
  type MockInvoice,
  type MockPaymentMethod,
  type MockPaymentState,
  type MockSavedPaymentMethod,
  type MockWalletActivity,
} from "@/lib/mock-billing";
import {
  canPayWithDisplayWallet,
  displayInvoiceFromCustomerInvoice,
  paymentMethodLabel,
} from "@/lib/domain/billing";
import { featureFlags } from "@/lib/config/feature-flags";
import { repositories } from "@/lib/repositories";

type CustomerBillingAccountContextValue = {
  walletLoading: boolean;
  walletError: string;
  refreshWallet: () => void;
  billingLoading: boolean;
  methodsLoading: boolean;
  billingError: string;
  methodsError: string;
  refreshBilling: () => void;
  refreshMethods: () => void;
  paymentState: MockPaymentState;
  invoices: MockInvoice[];
  selectedInvoiceId?: string;
  selectedInvoice?: MockInvoice;
  lastPaidInvoiceId?: string;
  selectedPaymentMethod: MockPaymentMethod;
  paymentMethods: MockSavedPaymentMethod[];
  selectedPaymentMethodId?: string;
  walletBalance: number;
  walletCurrency: string;
  walletActivity: MockWalletActivity[];
  reminders: Record<string, boolean>;
  actionError: string;
  clearActionError: () => void;
  setPaymentState: (state: MockPaymentState) => void;
  selectInvoice: (invoiceId?: string) => void;
  setSelectedPaymentMethod: (method: MockPaymentMethod) => void;
  selectSavedPaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  addPaymentMethod: (
    method: Exclude<MockPaymentMethod, "wallet">,
    details?: MobileMoneyDetails,
  ) => Promise<boolean>;
  mobileMoney: MobileMoneyDetails;
  setMobileMoney: (details: MobileMoneyDetails) => void;
  removePaymentMethod: (methodId: string) => void;
  confirmSelectedInvoicePayment: () => void;
  toggleInvoiceReminder: (invoiceId: string) => void;
  submitInvoiceDispute: (invoiceId: string) => void;
};

const CustomerBillingAccountContext =
  createContext<CustomerBillingAccountContextValue | null>(null);

export function CustomerBillingAccountProvider({
  children,
}: PropsWithChildren) {
  const queryClient = useQueryClient();
  const refreshBillingCache = () => {
    for (const key of ["invoices", "methods", "wallet", "shipments"])
      void queryClient.invalidateQueries({ queryKey: [key] });
  };
  const useLiveBilling = featureFlags.useLaravelBilling;
  const useLiveBillingActions = featureFlags.useLaravelBillingActions;
  const seededInvoices = useLiveBilling ? [] : mockInvoices;
  const seededPaymentMethods = useLiveBillingActions
    ? []
    : mockSavedPaymentMethods;
  const [mobileMoney, setMobileMoney] = useState<MobileMoneyDetails>({
    phone: "",
    provider: "MTN",
  });
  const [intentId, setIntentId] = useState<string>();
  const paymentBusy = useRef(false);
  const [chosenMethod, setChosenMethod] = useState<MockPaymentMethod>();
  const [paymentState, setPaymentState] = useState<MockPaymentState>("ready");
  const [invoices, setInvoices] = useState<MockInvoice[]>(seededInvoices);
  const [selectedInvoiceId, selectInvoice] = useState<string | undefined>(
    seededInvoices.find((invoice) => invoice.status === "unpaid")?.id,
  );
  const [lastPaidInvoiceId, setLastPaidInvoiceId] = useState<
    string | undefined
  >();
  const [paymentMethods, setPaymentMethods] =
    useState<MockSavedPaymentMethod[]>(seededPaymentMethods);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | undefined
  >(getDefaultPaymentMethod(seededPaymentMethods)?.id);
  const [walletCurrency, setWalletCurrency] = useState("ZMW");
  const [walletBalance, setWalletBalance] = useState(
    useLiveBillingActions ? 0 : mockWalletStartingBalance,
  );
  const [walletActivity, setWalletActivity] = useState<MockWalletActivity[]>(
    useLiveBillingActions
      ? []
      : [
          {
            id: "wallet-opening",
            label: "Wallet balance",
            detail: "Opening balance",
            amount: mockWalletStartingBalance,
            type: "topup",
            time: "1 Sep",
          },
        ],
  );
  const [reminders, setReminders] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      seededInvoices
        .filter((invoice) => invoice.status === "unpaid")
        .map((invoice) => [invoice.id, true]),
    ),
  );
  const [actionError, setActionError] = useState("");

  const billingQuery = useCustomerQuery(customerQueries.invoices);
  const methodsQuery = useCustomerQuery(customerQueries.methods);
  const walletQuery = useCustomerQuery(customerQueries.wallet);
  const billingLoading = billingQuery.status === "loading";
  const methodsLoading = methodsQuery.status === "loading";
  const billingError = billingQuery.errorMessage;
  const methodsError = methodsQuery.errorMessage;
  useEffect(() => {
    const next = (billingQuery.data ?? []).map(
      displayInvoiceFromCustomerInvoice,
    );
    setInvoices(next);
    selectInvoice((current) =>
      current && next.some((item) => item.id === current)
        ? current
        : (next.find((item) => item.status === "unpaid")?.id ?? next[0]?.id),
    );
  }, [billingQuery.data]);
  useEffect(() => {
    const methods = (methodsQuery.data ?? []).filter(
      (item) => item.method !== "card",
    );
    setPaymentMethods(methods);
    setSelectedPaymentMethodId((current) =>
      current && methods.some((item) => item.id === current)
        ? current
        : getDefaultPaymentMethod(methods)?.id,
    );
  }, [methodsQuery.data]);
  useEffect(() => {
    if (walletQuery.data) {
      setWalletBalance(walletQuery.data.balance);
      setWalletCurrency(walletQuery.data.currencyCode ?? "ZMW");
      setWalletActivity(walletQuery.data.activity);
    }
  }, [walletQuery.data]);

  const selectedInvoice = invoices.find(
    (invoice) => invoice.id === selectedInvoiceId,
  );
  const selectedSavedPaymentMethod =
    paymentMethods.find((item) => item.id === selectedPaymentMethodId) ??
    getDefaultPaymentMethod(paymentMethods);
  const selectedPaymentMethod =
    chosenMethod ?? selectedSavedPaymentMethod?.method ?? "mobile";
  const setSelectedPaymentMethod = (method: MockPaymentMethod) => {
    if (method === "card") return;
    setChosenMethod(method);
    setSelectedPaymentMethodId(
      paymentMethods.find((item) => item.method === method)?.id,
    );
    setIntentId(undefined);
  };
  const selectSavedPaymentMethod = (methodId: string) => {
    const saved = paymentMethods.find((item) => item.id === methodId);
    if (!saved || saved.method === "card") return;
    setChosenMethod(saved.method);
    setSelectedPaymentMethodId(methodId);
    setIntentId(undefined);
    if (saved.phone)
      setMobileMoney({
        phone: saved.phone,
        provider:
          saved.provider === "Airtel" || saved.provider === "Zamtel"
            ? saved.provider
            : "MTN",
      });
  };
  const setDefaultPaymentMethod = (methodId: string) => {
    setActionError("");
    void repositories.billingActions
      .setDefaultPaymentMethod(methodId)
      .then((methods) => {
        setPaymentMethods(methods);
        refreshBillingCache();
      })
      .catch(() =>
        setActionError(
          "We could not change the default payment method. Please try again.",
        ),
      );
  };
  const addPaymentMethod = async (
    method: Exclude<MockPaymentMethod, "wallet">,
    details?: MobileMoneyDetails,
  ) => {
    setActionError("");
    if (
      method === "card" ||
      !details ||
      !isValidInternationalMobile(details.phone)
    ) {
      setActionError("Enter a valid mobile money number.");
      return false;
    }
    try {
      const saved = await repositories.billingActions.savePaymentMethod(
        method,
        details,
      );
      setPaymentMethods((current) => [
        ...current.filter((item) => item.id !== saved.id),
        saved,
      ]);
      refreshBillingCache();
      return true;
    } catch {
      setActionError("Could not save this payment method. Please try again.");
      return false;
    }
  };
  const removePaymentMethod = (methodId: string) => {
    setActionError("");
    void repositories.billingActions
      .removePaymentMethod(methodId)
      .then(() => {
        refreshBillingCache();
        setPaymentMethods((current) => {
          const next = current.filter((item) => item.id !== methodId);
          const selectedRemoved = methodId === selectedPaymentMethodId;
          if (selectedRemoved)
            setSelectedPaymentMethodId(getDefaultPaymentMethod(next)?.id);
          return next.some((item) => item.isDefault)
            ? next
            : next.map((item, index) => ({ ...item, isDefault: index === 0 }));
        });
      })
      .catch(() =>
        setActionError(
          "We could not remove that payment method. Please try again.",
        ),
      );
  };
  const confirmSelectedInvoicePayment = () => {
    if (
      !selectedInvoiceId ||
      !selectedInvoice ||
      paymentBusy.current ||
      selectedPaymentMethod === "card"
    )
      return;
    if (
      selectedPaymentMethod === "mobile" &&
      !intentId &&
      !isValidInternationalMobile(mobileMoney.phone)
    ) {
      setActionError("Enter your mobile money number first.");
      setPaymentState("failed");
      return;
    }
    if (
      selectedPaymentMethod === "wallet" &&
      !canPayWithDisplayWallet(walletBalance, selectedInvoice)
    ) {
      setPaymentState("failed");
      return;
    }
    paymentBusy.current = true;
    setActionError("");
    void repositories.billingActions
      .confirmInvoicePayment({
        invoice: {
          id: selectedInvoice.id,
          reference: selectedInvoice.reference,
          amount: {
            amount: selectedInvoice.amountValue,
            currencyCode: "ZMW",
            formatted: selectedInvoice.amount,
          },
        },
        method: selectedPaymentMethod,
        walletBalance,
        ...(selectedPaymentMethod === "mobile" ? { mobileMoney } : {}),
        intentId,
      })
      .then((result) => {
        refreshBillingCache();
        if (result.intentId) setIntentId(result.intentId);
        if (result.state !== "confirmed") {
          setPaymentState(result.state);
          return;
        }
        setInvoices((current) =>
          current.map((invoice) =>
            invoice.id === selectedInvoiceId
              ? {
                  ...invoice,
                  status: "paid",
                  dueAt: undefined,
                  paidAt: result.paidAt ?? "Just now",
                  paymentMethod:
                    result.paymentMethodLabel ??
                    paymentMethodLabel(selectedPaymentMethod),
                }
              : invoice,
          ),
        );
        if (typeof result.walletBalance === "number")
          setWalletBalance(result.walletBalance);
        if (result.walletActivity)
          setWalletActivity((current) => [
            result.walletActivity!,
            ...current.filter((item) => item.id !== result.walletActivity!.id),
          ]);
        setLastPaidInvoiceId(selectedInvoiceId);
        setPaymentState("confirmed");
      })
      .catch((error) => {
        setPaymentState("failed");
        setActionError(customerSafeMessageFor(error));
      })
      .finally(() => {
        paymentBusy.current = false;
      });
  };
  const toggleInvoiceReminder = (invoiceId: string) => {
    const enabled = !reminders[invoiceId];
    setActionError("");
    void repositories.billingActions
      .setInvoiceReminder(invoiceId, enabled)
      .then(() =>
        setReminders((current) => ({ ...current, [invoiceId]: enabled })),
      )
      .catch(() =>
        setActionError("We could not update this reminder. Please try again."),
      );
  };
  const submitInvoiceDispute = (invoiceId: string) => {
    setActionError("");
    void repositories.billingActions
      .disputeInvoice(invoiceId)
      .then((resolution) =>
        setInvoices((current) =>
          current.map((invoice) =>
            invoice.id === invoiceId
              ? { ...invoice, ...(resolution ? { resolution } : {}) }
              : invoice,
          ),
        ),
      )
      .catch(() =>
        setActionError(
          "We could not submit the invoice dispute. Please try again.",
        ),
      );
  };
  const value: CustomerBillingAccountContextValue = {
    walletLoading: walletQuery.status === "loading",
    walletError: walletQuery.data ? "" : walletQuery.errorMessage,
    refreshWallet: () => {
      void walletQuery.refetch();
    },
    billingLoading,
    methodsLoading,
    billingError,
    methodsError,
    refreshBilling: () => {
      void billingQuery.refetch();
    },
    refreshMethods: () => {
      void methodsQuery.refetch();
    },
    paymentState,
    invoices,
    selectedInvoiceId,
    selectedInvoice,
    lastPaidInvoiceId,
    selectedPaymentMethod,
    paymentMethods,
    selectedPaymentMethodId,
    walletBalance,
    walletCurrency,
    walletActivity,
    reminders,
    actionError,
    clearActionError: () => setActionError(""),
    setPaymentState,
    mobileMoney,
    setMobileMoney,
    selectInvoice: (id) => {
      selectInvoice(id);
      setIntentId(undefined);
    },
    setSelectedPaymentMethod,
    selectSavedPaymentMethod,
    setDefaultPaymentMethod,
    addPaymentMethod,
    removePaymentMethod,
    confirmSelectedInvoicePayment,
    toggleInvoiceReminder,
    submitInvoiceDispute,
  };
  return (
    <CustomerBillingAccountContext.Provider value={value}>
      {children}
    </CustomerBillingAccountContext.Provider>
  );
}

export function useCustomerBillingAccount() {
  const context = useContext(CustomerBillingAccountContext);
  if (!context)
    throw new Error(
      "useCustomerBillingAccount must be used within CustomerBillingAccountProvider",
    );
  return context;
}
