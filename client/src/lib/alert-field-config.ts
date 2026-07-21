// ─────────────────────────────────────────────────────────────────────────────
// Data-segregation config — transcribed from the client's
// "Rules_Data_seggregation" sheet.
//
// The sheet's left "Tables" column = our SECTIONS. Every column in a table is
// tagged per rule as:
//   Main Page   → shown on the alert list (Alert ID, Timestamp, Engine Type…)
//   Core        → shown by default inside the customer-details modal
//   More        → shown behind the "Fetch information" button
//   (blank)     → not shown for that rule
// Some tables are "Fetch on Button click" lists (list of devices / accounts /
// beneficiaries / transactions).
//
// Core/More per column is the SAME across rules; what changes per rule is WHICH
// sections (tables) appear. That per-rule presence is RULE_SECTIONS below.
// ─────────────────────────────────────────────────────────────────────────────

export type SectionKey =
  | "customer"
  | "account"
  | "transaction"
  | "beneficiary"
  | "device"
  | "session"
  | "activity" // account activity pattern
  | "list_devices"
  | "list_accounts"
  | "list_beneficiaries"
  | "list_transactions";

export interface SectionFields {
  title: string; // section heading (matches the sheet's table)
  core: string[]; // UI Names Mapping — shown by default
  more: string[]; // UI Names Mapping — behind "Fetch information"
  fetchOnButton?: boolean; // whole section loads on button click
}

// Per-section columns (UI Names Mapping), core vs more — from the sheet.
export const SECTION_FIELDS: Record<SectionKey, SectionFields> = {
  customer: {
    title: "Customer",
    core: [
      "Customer Number",
      "Customer Name",
      "Date of Birth",
      "Gender",
      "Customer City",
      "Document Number",
      "Customer Onboard Date",
    ],
    more: [
      "Marital Status",
      "Education Level",
      "Customer Address",
      "Document Expiry Date",
    ],
  },
  account: {
    title: "Account",
    core: [
      "Account Number",
      "Account Title",
      "Account Status",
      "IBAN",
      "Current Balance",
      "Account Holder Address",
      "Branch Code",
      "Branch Description",
      "Phone",
      "Account Opening Date",
    ],
    more: ["Joint Account", "Account Type", "Email", "GL Code", "Currency Code"],
  },
  transaction: {
    title: "Transaction",
    core: [
      "Transaction Id",
      "Stan Number",
      "Transaction Date",
      "Transaction Amount",
      "From Account Number",
      "To Account Number",
      "To Bank",
    ],
    more: [
      "User ID",
      "Transaction Currency Code",
      "Transaction Status",
      "Channel Type",
      "Channel Name",
      "Transaction Type",
    ],
  },
  beneficiary: {
    title: "Beneficiary",
    core: [
      "Customer CNIC",
      "Beneficiary Account Number",
      "Beneficiary Added Date & Time",
    ],
    more: ["Beneficiary Name", "Bank Name"],
  },
  device: {
    title: "Device",
    core: [
      "Device ID",
      "Device Name",
      "User ID",
      "Device Activation Date & Time",
    ],
    more: [
      "Device Operating System",
      "Operating System Type",
      "Device Status",
      "Last Login Date & Time",
    ],
  },
  session: {
    title: "Session",
    core: [
      "Session ID",
      "Login Status",
      "IP Address",
      "Location",
      "Log Date & Time",
      "Error Code",
      "User ID",
      "Channel Type",
      "Channel Name",
      "Log Code",
      "Log Type",
    ],
    more: [],
  },
  activity: {
    title: "Account Activity Pattern",
    core: [
      "Historical Active Days - 90 Days",
      "Historical Average Transactions Per Day",
      "Historical Average Daily Spend",
      "Historical Average Transaction Amount",
      "Current Transaction Count",
      "Current Total Amount",
      "Current Average Transaction Amount",
      "Historical Mean Time Active - 90 Days",
      "Current Mean Time",
      "Current Speed Ratio",
      "Current Speed Ratio Flag",
    ],
    more: [],
  },
  list_devices: {
    title: "List of Devices",
    core: [
      "Device ID",
      "Device Name",
      "User ID",
      "Device Operating System",
      "Operating System Type",
      "Device Status",
      "Device Activation Date & Time",
      "Last Login Date & Time",
    ],
    more: [],
    fetchOnButton: true,
  },
  list_accounts: {
    title: "List of Accounts",
    core: [
      "Account Number",
      "Account Status",
      "IBAN",
      "Current Balance",
      "Joint Account",
      "Account Holder Address",
      "Account Type",
      "Branch Code",
      "Branch Description",
      "GL Code",
      "Currency Code",
    ],
    more: [],
    fetchOnButton: true,
  },
  list_beneficiaries: {
    title: "List of Beneficiaries",
    core: [
      "Beneficiary ID",
      "Customer CNIC",
      "Beneficiary IBAN",
      "Beneficiary Account Number",
      "Beneficiary Added Date & Time",
      "Beneficiary Name",
      "Bank Name",
    ],
    more: [],
    fetchOnButton: true,
  },
  list_transactions: {
    title: "List of Transactions",
    core: [
      "Transaction Id",
      "Stan Number",
      "Transaction Date & Time",
      "Transaction Amount",
      "From Account Number",
      "To Account Number",
      "User ID",
      "Transaction Currency Code",
      "Transaction Status",
      "Channel Type",
      "Channel Name",
      "Transaction Type",
    ],
    more: [],
    fetchOnButton: true,
  },
};

// Which sections (tables) each rule shows — read from the sheet's per-rule
// core/more columns (a section is present for a rule if it has any core/more
// cell in that rule's column). Refine any specific rule as the client confirms.
export const RULE_SECTIONS: Record<number, SectionKey[]> = {
  1: ["customer", "device", "session", "list_devices"],
  2: [
    "customer",
    "account",
    "transaction",
    "beneficiary",
    "device",
    "session",
    "list_devices",
    "list_accounts",
    "list_beneficiaries",
    "list_transactions",
  ],
  3: [
    "customer",
    "account",
    "transaction",
    "beneficiary",
    "activity",
    "list_beneficiaries",
    "list_transactions",
  ],
  4: [
    "customer",
    "account",
    "transaction",
    "device",
    "session",
    "list_transactions",
  ],
  5: ["customer", "account", "transaction", "list_transactions"],
  6: ["customer", "account", "transaction", "activity"],
  7: [
    "customer",
    "account",
    "transaction",
    "device",
    "session",
    "list_transactions",
  ],
  8: ["customer", "account", "transaction", "list_transactions"],
  9: [
    "customer",
    "account",
    "transaction",
    "device",
    "session",
    "list_transactions",
  ],
};

// Customer core/more field keys (kept for backward-compat with the modal).
export const CUSTOMER_CORE_FIELDS = [
  "date_of_birth",
  "gender",
  "city",
  "document_number",
  "customer_onboard_datetime",
];
export const CUSTOMER_MORE_FIELDS = [
  "marital_status",
  "education_level",
  "address",
  "document_expiry",
];

// Known app rule sources in order → Rule#1..9 (order-wise mapping).
const KNOWN_RULES = [
  "Rule #105",
  "Rule #302",
  "Rule #404",
  "Rule #55",
  "Rule #12",
  "Rule #88",
  "AI Model (Unusual Location)",
  "AI Model (Behavioral Anomaly)",
  "AI Model (Device Mismatch)",
];

// Map an alert's source string to a rule index 1..9 (deterministic).
export function ruleIndexFor(alertSource = ""): number {
  const idx = KNOWN_RULES.findIndex((r) => alertSource.includes(r));
  if (idx >= 0) return idx + 1;
  let h = 0;
  for (let i = 0; i < alertSource.length; i++)
    h = (h + alertSource.charCodeAt(i)) % 9;
  return h + 1;
}

// Single source of truth for the displayed Alert ID, shared by the analyst
// dashboard and the executive's Alert Assignments so the SAME alert shows the
// SAME id everywhere: 1 + rule(1..9) + yy + mm + dd + alertNo (from the alert's
// own id, stable — not its row position).
export function buildAlertIdShared(
  rule: number,
  createdAt: string | undefined,
  id: string | number,
): string {
  const d = new Date(createdAt ?? "");
  const valid = !Number.isNaN(d.getTime());
  const yy = valid ? String(d.getFullYear()).slice(-2) : "25";
  const mm = valid ? String(d.getMonth() + 1).padStart(2, "0") : "01";
  const dd = valid ? String(d.getDate()).padStart(2, "0") : "01";
  const num = String(id).replace(/\D/g, "") || "0";
  return `1${rule}${yy}${mm}${dd}${num}`;
}

export function sectionsForRule(rule?: number): SectionKey[] {
  if (!rule || !RULE_SECTIONS[rule]) {
    return Object.keys(SECTION_FIELDS) as SectionKey[];
  }
  return RULE_SECTIONS[rule];
}
