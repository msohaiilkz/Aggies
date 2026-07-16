// ─────────────────────────────────────────────────────────────────────────────
// Data-segregation config (from the client's "Frontend rules data segregation"
// sheet). Controls which detail SECTIONS / fields are visible per rule.
//
// Placement values in the sheet:
//   Main Page              → shown on the alert list (Alert ID, Timestamp, …)
//   core                   → shown by default inside the customer-details modal
//   more                   → shown behind the "More" toggle
//   Fetch on Button (+More)→ lists loaded on button click (devices, accounts, …)
//   (blank)                → not shown for that rule
//
// Rules in the sheet are Rule#1..9. The app's alerts use sources like
// "Rule #105", "AI Model (…)"; we map them to 1..9 order-wise via ruleIndexFor().
// ⇩ EDIT the mapping below to match the real rule→field spec exactly.
// ─────────────────────────────────────────────────────────────────────────────

export type SectionKey =
  | "customer"
  | "account"
  | "transaction"
  | "beneficiary"
  | "device"
  | "session"
  | "activity";

// Which sections each rule (1..9) shows. Derived from the sheet's core/fetch
// columns; refine per the exact matrix as needed.
export const RULE_SECTIONS: Record<number, SectionKey[]> = {
  1: ["customer", "device", "session"],
  2: ["customer", "account", "beneficiary", "device", "session"],
  3: ["customer", "account", "transaction", "beneficiary", "activity"],
  4: ["customer", "account", "transaction", "device", "session"],
  5: ["customer", "account", "transaction"],
  6: ["customer", "account", "transaction", "device", "session"],
  7: ["customer", "account", "transaction", "device", "session"],
  8: ["customer", "account", "transaction"],
  9: ["customer", "account", "transaction", "device", "session"],
};

// Customer fields: core = default, more = behind "More" (consistent across rules).
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
  // Fallback: stable hash into 1..9 so unknown sources still segregate.
  let h = 0;
  for (let i = 0; i < alertSource.length; i++)
    h = (h + alertSource.charCodeAt(i)) % 9;
  return h + 1;
}

export function sectionsForRule(rule?: number): SectionKey[] {
  if (!rule || !RULE_SECTIONS[rule]) {
    // Unknown rule → show everything.
    return [
      "customer",
      "account",
      "transaction",
      "beneficiary",
      "device",
      "session",
      "activity",
    ];
  }
  return RULE_SECTIONS[rule];
}
