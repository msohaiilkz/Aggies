// Global alert-limit + alert-assignment store (localStorage backed)

const LIMIT_KEY = "agess_global_alert_limit";
const ASSIGN_KEY = "agess_alert_assignments";
const ASSIGN_VERSION_KEY = "agess_alert_assignments_version";
// Bump when SEED_ALERTS / analyst ids change so old localStorage re-seeds.
const ASSIGN_VERSION = 4;

export const DEFAULT_GLOBAL_LIMIT = 10;
export const ALERT_LIMIT_OPTIONS = [5, 10, 15, 20, 30, 50, 100];

export function getGlobalAlertLimit(): number {
  const raw = localStorage.getItem(LIMIT_KEY);
  const n = raw ? parseInt(raw, 10) : DEFAULT_GLOBAL_LIMIT;
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_GLOBAL_LIMIT;
}

export function setGlobalAlertLimit(n: number): void {
  localStorage.setItem(LIMIT_KEY, String(n));
  window.dispatchEvent(new Event("alert-settings-change"));
}

// ─── Alert assignments (mock alerts pool) ────────────────────────────────────

export type AlertLifecycleStatus = "Open" | "Closed" | "Reopened";

export interface AlertItem {
  id: string;
  alertCode: string;
  customerName: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  channel: string;
  amount: number;
  assignedTo: string | null; // analyst id
  status?: AlertLifecycleStatus;
  createdAt?: string; // when the alert was generated
  rule?: number; // fraud rule (1..9) that raised this alert
}

// These MIRROR the analyst dashboard's 9 alerts exactly (same id, customer,
// rule, channel and createdAt) so the displayed Alert ID matches across both
// screens and the executive can search an analyst's alert by its id / CNIC.
// assignedTo maps to analyst ids in use-analysts.ts (demo-1 = Ahmed Raza,
// demo-2 = Sana Iqbal).
const SEED_ALERTS: AlertItem[] = [
  { id: "1", alertCode: "P436691BNC140", customerName: "Kelvin Harris", severity: "HIGH", channel: "FT-Raast", amount: 156000, assignedTo: "demo-1", status: "Open", rule: 1, createdAt: "2025-01-10T10:30:00Z" },
  { id: "2", alertCode: "42301-26920823-3", customerName: "Obaid Mehmood", severity: "MEDIUM", channel: "IBFT", amount: 15000, assignedTo: "demo-2", status: "Open", rule: 2, createdAt: "2025-01-09T14:20:00Z" },
  { id: "3", alertCode: "P436691BNC141", customerName: "Abid Ali", severity: "LOW", channel: "POS", amount: 20000, assignedTo: "demo-1", status: "Open", rule: 3, createdAt: "2025-01-08T09:15:00Z" },
  { id: "4", alertCode: "A987654XYZ210", customerName: "Ayesha Khan", severity: "HIGH", channel: "ATM-On-Us", amount: 95000, assignedTo: "demo-2", status: "Open", rule: 4, createdAt: "2025-01-07T16:45:00Z" },
  { id: "5", alertCode: "B123456LMN987", customerName: "Zainab Ali", severity: "MEDIUM", channel: "ATM-Of-Us", amount: 50000, assignedTo: "demo-1", status: "Open", rule: 5, createdAt: "2025-01-06T11:30:00Z" },
  { id: "6", alertCode: "C987654MNO321", customerName: "Fahad Mustafa", severity: "HIGH", channel: "Withdrawal", amount: 500000, assignedTo: "demo-2", status: "Open", rule: 6, createdAt: "2025-01-05T15:45:00Z" },
  { id: "7", alertCode: "P436691BNC142", customerName: "Salman Ahmed", severity: "HIGH", channel: "E-Commerce", amount: 171450, assignedTo: "demo-1", status: "Open", rule: 7, createdAt: "2025-01-09T08:15:00Z" },
  { id: "8", alertCode: "P436691BNC143", customerName: "Mustafa Mahmood", severity: "HIGH", channel: "IBFT", amount: 75000, assignedTo: "demo-2", status: "Open", rule: 8, createdAt: "2025-01-07T13:20:00Z" },
  { id: "9", alertCode: "B123456LM0123", customerName: "Zaheer Ali", severity: "MEDIUM", channel: "FT-Raast", amount: 50000, assignedTo: null, status: "Open", rule: 9, createdAt: "2025-01-08T11:20:00Z" },
];

// Deterministic fallback timestamp so backfilled alerts stay stable.
const BASE_TS = new Date("2025-06-15T09:00:00Z").getTime();
function withDefaults(list: AlertItem[]): AlertItem[] {
  return list.map((a, i) => ({
    ...a,
    status: a.status ?? "Open",
    createdAt:
      a.createdAt ?? new Date(BASE_TS - i * 5 * 3600 * 1000).toISOString(),
  }));
}

export function getAlerts(): AlertItem[] {
  const existing = localStorage.getItem(ASSIGN_KEY);
  const ver = localStorage.getItem(ASSIGN_VERSION_KEY);
  // Re-seed when missing or the seed version changed (analyst ids updated).
  if (!existing || ver !== String(ASSIGN_VERSION)) {
    const seeded = withDefaults(SEED_ALERTS);
    localStorage.setItem(ASSIGN_KEY, JSON.stringify(seeded));
    localStorage.setItem(ASSIGN_VERSION_KEY, String(ASSIGN_VERSION));
    return seeded;
  }
  try {
    const parsed: AlertItem[] = JSON.parse(existing);
    return withDefaults(parsed);
  } catch {
    return withDefaults(SEED_ALERTS);
  }
}

export function setAlertStatus(
  id: string,
  status: AlertLifecycleStatus,
): boolean {
  const alerts = getAlerts();
  const idx = alerts.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  alerts[idx].status = status;
  localStorage.setItem(ASSIGN_KEY, JSON.stringify(alerts));
  window.dispatchEvent(new Event("alert-settings-change"));
  return true;
}

export function reassignAlert(alertId: string, newAnalystId: string | null): boolean {
  const alerts = getAlerts();
  const idx = alerts.findIndex((a) => a.id === alertId);
  if (idx === -1) return false;
  alerts[idx].assignedTo = newAnalystId;
  localStorage.setItem(ASSIGN_KEY, JSON.stringify(alerts));
  window.dispatchEvent(new Event("alert-settings-change"));
  return true;
}

export function countAlertsForAnalyst(analystId: string): number {
  return getAlerts().filter((a) => a.assignedTo === analystId).length;
}
