// Shared localStorage-based analyst store — both dashboards read/write here

export type AnalystStatus = "Pending" | "Active" | "Inactive";

export interface Analyst {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: string;
  status: AnalystStatus;
  casesResolved: number;
  createdAt: string;
  createdBy?: string;
  maxAlerts?: number;
}

const STORAGE_KEY = "agess_analysts";
const VERSION_KEY = "agess_analysts_version";
// Bump when SEED_DATA changes so old localStorage re-seeds.
const SEED_VERSION = 2;
export const DEFAULT_MAX_ALERTS = 10;
export const MAX_ALERTS_OPTIONS = [5, 10, 20, 30, 50, 100];

// The two live demo analysts — must match ANALYST_NAMES in lib/analysts.ts and
// the online-status store so the executive views stay consistent.
const SEED_DATA: Analyst[] = [
  {
    id: "demo-1",
    name: "Ahmed Raza",
    username: "ahmed_raza",
    email: "analyst@example.com",
    role: "Senior Analyst",
    status: "Active",
    casesResolved: 128,
    createdAt: "2025-02-15T09:00:00Z",
  },
  {
    id: "demo-2",
    name: "Sana Iqbal",
    username: "sana_iqbal",
    email: "analyst2@example.com",
    role: "Junior Analyst",
    status: "Active",
    casesResolved: 76,
    createdAt: "2025-03-01T10:00:00Z",
  },
];

export function initAnalysts(): void {
  const existing = localStorage.getItem(STORAGE_KEY);
  const ver = localStorage.getItem(VERSION_KEY);
  if (!existing || ver !== String(SEED_VERSION)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    localStorage.setItem(VERSION_KEY, String(SEED_VERSION));
  }
}

export function getAnalysts(): Analyst[] {
  initAnalysts();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return SEED_DATA;
  }
}

export function saveAnalysts(analysts: Analyst[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analysts));
}

export function addAnalyst(analyst: Omit<Analyst, "id" | "casesResolved" | "createdAt"> & { createdBy?: string }): Analyst {
  const analysts = getAnalysts();
  const newAnalyst: Analyst = {
    ...analyst,
    id: `analyst-${Date.now()}`,
    casesResolved: 0,
    createdAt: new Date().toISOString(),
  };
  analysts.push(newAnalyst);
  saveAnalysts(analysts);
  return newAnalyst;
}

export function updateAnalystStatus(id: string, status: AnalystStatus): boolean {
  const analysts = getAnalysts();
  const idx = analysts.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  analysts[idx].status = status;
  saveAnalysts(analysts);
  return true;
}

export function updateAnalyst(id: string, updates: Partial<Analyst>): boolean {
  const analysts = getAnalysts();
  const idx = analysts.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  analysts[idx] = { ...analysts[idx], ...updates };
  saveAnalysts(analysts);
  return true;
}

export function updateAnalystMaxAlerts(id: string, maxAlerts: number): boolean {
  const analysts = getAnalysts();
  const idx = analysts.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  analysts[idx].maxAlerts = maxAlerts;
  saveAnalysts(analysts);
  return true;
}

export function removeAnalyst(id: string): boolean {
  const analysts = getAnalysts();
  const filtered = analysts.filter((a) => a.id !== id);
  if (filtered.length === analysts.length) return false;
  saveAnalysts(filtered);
  return true;
}
