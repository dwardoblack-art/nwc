export type LegalDocumentId = "terms" | "privacy" | "payments";

export type LegalSection = { id: string; title: string; body: string };

export type LegalDocument = {
  id: LegalDocumentId;
  title: string;
  shortTitle: string;
  summary: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export const legalDocuments: Record<LegalDocumentId, LegalDocument> = {
  terms: {
    id: "terms",
    title: "Terms and Conditions",
    shortTitle: "Terms",
    summary: "How Newworld Cargo services and customer responsibilities work.",
    effectiveDate: "Effective 12 October 2026",
    sections: [
      { id: "service", title: "Using our services", body: "Newworld Cargo helps customers request local delivery, city-to-city movement, imports, and tailored cargo support. A booking request is not a confirmed transport contract until Newworld Cargo confirms availability, route, pricing, and collection arrangements." },
      { id: "booking", title: "Booking details and cargo", body: "You are responsible for providing accurate pickup, destination, contact, cargo, and handling information. Cargo must be lawful, safely packaged, and suitable for the requested service. We may ask for more details before confirming a request." },
      { id: "collection", title: "Pickup and delivery", body: "Pickup and delivery windows are estimates unless a confirmed schedule says otherwise. Customers should ensure that an authorized person is available at collection and handover. Changes, missed collection, or destination restrictions may affect timing and cost." },
      { id: "pricing", title: "Prices and payment", body: "A displayed estimate is for planning only until Newworld Cargo confirms the final price. Payment methods, wallet use, invoices, receipts, and refund treatment are explained in the Payment and Refund Policy." },
      { id: "help", title: "Changes and support", body: "Use shipment management or Support in the app when you need to update instructions, ask about an exception, cancel an eligible request, or report a problem. We will explain the available next step for the service and shipment stage." },
    ],
  },
  privacy: {
    id: "privacy",
    title: "Privacy Policy",
    shortTitle: "Privacy",
    summary: "How account, route, and shipment information is handled.",
    effectiveDate: "Effective 12 October 2026",
    sections: [
      { id: "information", title: "Information we use", body: "The app may use account details, contact information, saved places, shipment requests, route details, payment records, support messages, and device permission choices to provide cargo services and customer support." },
      { id: "purpose", title: "Why we use it", body: "Information is used to create and manage shipment requests, send operational updates, produce invoices and receipts, improve service support, protect customer accounts, and meet applicable operational requirements." },
      { id: "sharing", title: "When information is shared", body: "Only the information needed for a shipment or support request may be shared with relevant service teams, delivery partners, payment providers, or authorities where required. Marketing preferences do not control essential cargo or billing updates." },
      { id: "choices", title: "Your choices", body: "You can manage communication preferences, saved places, recipients, recognized devices, and data-control requests in Account settings. Requesting data export or account deletion starts a review process; it does not immediately remove records required for an active shipment or legal obligation." },
      { id: "security", title: "Security and contact", body: "Use a unique password and review recognized devices regularly. Contact Support through the app if you believe your account or information has been used without permission." },
      { id: "operator", title: "Who is responsible", body: "Newworld Cargo, operated by New World Investments Limited, provides this app. Contact info@newworldcargo.com about privacy or account deletion, or write to Shop 62/A, Carousel Shopping Centre, Lusaka, Zambia." },
      { id: "permissions", title: "Device permissions and selected files", body: "Camera access is used when you scan labels or take cargo evidence photos. Foreground location helps select pickup and delivery places; the app does not request background location. Contacts access lets you choose delivery contact details. Selected images and documents may be uploaded for your profile or support requests. Android's photo picker provides access only to images you select. Notifications are optional operational updates. You can deny permissions and enter addresses and contact details manually." },
      { id: "diagnostics", title: "App activity and diagnostics", body: "The app sends operational events, app version, platform, and filtered diagnostic properties to Newworld Cargo's API for service reliability. Passwords and authentication tokens are excluded from these event properties. Our service providers may process network information such as IP addresses when delivering API, mapping, hosting, and payment services." },
      { id: "retention", title: "Retention and account deletion", body: "Request deletion from Settings > Delete account or email info@newworldcargo.com with the subject Newworld Cargo account deletion and your registered email or phone number. Do not send passwords or payment PINs. We verify ownership before deleting the account and associated profile, saved contacts, saved places, and uploaded personal data that we no longer need. Shipment, invoice, payment, fraud-prevention, and dispute records may be retained where required to complete a service or satisfy legal obligations, and only for as long as those obligations apply. We explain any retained categories and applicable retention period when responding to your request. Deletion requests are not completed immediately in the app." },
      { id: "rights", title: "Requests and policy changes", body: "You can contact info@newworldcargo.com to request access, correction, export, or deletion of your personal information, or ask about international processing by our delivery and technology providers. We may need to verify your identity. We update this policy when our practices change and show the effective date here. The app is intended for customers arranging cargo services and is not directed at children." },
    ],
  },
  payments: {
    id: "payments",
    title: "Payment and Refund Policy",
    shortTitle: "Payments & refunds",
    summary: "Billing, wallet, proof, refund, and dispute information.",
    effectiveDate: "Effective 12 October 2026",
    sections: [
      { id: "estimates", title: "Quotes, invoices, and payment", body: "Shipment estimates help customers plan before a final price is confirmed. An invoice identifies the charge connected to a shipment or service. Pay only through approved Newworld Cargo payment options shown in the app or confirmed by the service team." },
      { id: "wallet", title: "Cargo Wallet", body: "Cargo Wallet availability, balances, top-ups, and eligible use are displayed in the app. A wallet payment is confirmed only after the related invoice is paid and the transaction appears in customer records." },
      { id: "receipts", title: "Receipts and proof", body: "Paid invoices have customer receipts. Completed shipments may have proof of delivery. These documents help customers retain service records, but customers should review the details and contact Support if a record appears incorrect." },
      { id: "refunds", title: "Refunds and disputes", body: "A refund, credit, or charge review depends on the service, payment stage, and shipment circumstances. Customers can open a charge review from the related invoice. The app will show the request status and next action while the review is in progress." },
      { id: "changes", title: "Cancellations and changes", body: "Cancellation and change eligibility depends on whether collection, movement, or handover has started. The app shows available shipment-management actions and explains when Support review is required." },
    ],
  },
};

export function isLegalDocumentId(value: string | string[] | undefined): value is LegalDocumentId {
  return typeof value === "string" && value in legalDocuments;
}
