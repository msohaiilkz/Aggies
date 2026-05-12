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
}

const STORAGE_KEY = "agess_analysts";

// Seed demo data only once
const SEED_DATA: Analyst[] = [
  {
    id: "demo-1",
    name: "Ali Khan",
    username: "ali_analyst",
    email: "ali@agess.com",
    role: "Junior Analyst",
    status: "Active",
    casesResolved: 45,
    createdAt: "2025-03-01T10:00:00Z",
  },
  {
    id: "demo-2",
    name: "Sara Ahmed",
    username: "sara_ahmed",
    email: "sara@agess.com",
    role: "Senior Analyst",
    status: "Active",
    casesResolved: 120,
    createdAt: "2025-02-15T09:00:00Z",
  },
  {
    id: "demo-3",
    name: "Zainab Raza",
    username: "zainab_raza",
    email: "zainab@agess.com",
    role: "Junior Analyst",
    status: "Inactive",
    casesResolved: 15,
    createdAt: "2025-01-20T08:30:00Z",
  },
  {
    id: "demo-4",
    name: "Bilal Qureshi",
    username: "bilal_q",
    email: "bilal@agess.com",
    role: "Risk Specialist",
    status: "Active",
    casesResolved: 310,
    createdAt: "2024-12-05T11:00:00Z",
  },
  {
    id: "demo-5",
    name: "Hassan Syed",
    username: "hassan_s",
    email: "hassan@agess.com",
    role: "Junior Analyst",
    status: "Active",
    casesResolved: 8,
    createdAt: "2025-04-01T07:45:00Z",
  },
  {
    id: "demo-6",
    name: "Nadia Malik",
    username: "nadia_m",
    email: "nadia@agess.com",
    role: "Senior Analyst",
    status: "Pending",
    casesResolved: 0,
    createdAt: "2025-05-01T09:00:00Z",
  },
];

export function initAnalysts(): void {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
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

export function removeAnalyst(id: string): boolean {
  const analysts = getAnalysts();
  const filtered = analysts.filter((a) => a.id !== id);
  if (filtered.length === analysts.length) return false;
  saveAnalysts(filtered);
  return true;
}
