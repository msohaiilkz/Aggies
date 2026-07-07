// Global alert-limit + alert-assignment store (localStorage backed)

const LIMIT_KEY = "agess_global_alert_limit";
const ASSIGN_KEY = "agess_alert_assignments";

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
}

const SEED_ALERTS: AlertItem[] = [
  { id: "AL-1001", alertCode: "P436691BNC140", customerName: "Kelvin Harris", severity: "HIGH", channel: "FT-Raast", amount: 156000, assignedTo: "demo-1", status: "Open" },
  { id: "AL-1002", alertCode: "P436691BNC141", customerName: "Obaid Mehmood", severity: "MEDIUM", channel: "IBFT", amount: 15000, assignedTo: "demo-2", status: "Open" },
  { id: "AL-1003", alertCode: "42301-26920823-3", customerName: "Abid Ali", severity: "LOW", channel: "POS", amount: 20000, assignedTo: "demo-1", status: "Closed" },
  { id: "AL-1004", alertCode: "P436691BNC142", customerName: "Mustafa Mahmood", severity: "HIGH", channel: "E-Commerce", amount: 75000, assignedTo: "demo-4", status: "Open" },
  { id: "AL-1005", alertCode: "P436691BNC143", customerName: "Kelvin Harris", severity: "HIGH", channel: "FT-Raast", amount: 230000, assignedTo: "demo-2", status: "Reopened" },
  { id: "AL-1006", alertCode: "A987654XYZ210", customerName: "Ayesha Khan", severity: "HIGH", channel: "ATM-On-Us", amount: 150000, assignedTo: "demo-4", status: "Closed" },
  { id: "AL-1007", alertCode: "B123456LMN987", customerName: "Zainab Ali", severity: "MEDIUM", channel: "ATM-Of-Us", amount: 50000, assignedTo: "demo-1", status: "Open" },
  { id: "AL-1008", alertCode: "B1234160MN0123", customerName: "Zaheer Ali", severity: "LOW", channel: "IBFT", amount: 50000, assignedTo: null, status: "Open" },
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
  if (!existing) {
    const seeded = withDefaults(SEED_ALERTS);
    localStorage.setItem(ASSIGN_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed: AlertItem[] = JSON.parse(existing);
    // Migrate old schema (no lifecycle status) to the new seed so the
    // Open/Reopen demo has variety.
    if (parsed.length > 0 && parsed.every((a) => a.status === undefined)) {
      const seeded = withDefaults(SEED_ALERTS);
      localStorage.setItem(ASSIGN_KEY, JSON.stringify(seeded));
      return seeded;
    }
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
