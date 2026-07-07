// Approval-request store (localStorage backed).
//
// Rights model (per client matrix):
//   Analyst Add / Remove / Role-Update  → Executive REQUESTS, Super Admin APPROVES.
// The Executive creates a PENDING request here; the Super Admin approves or
// rejects it on the Super Admin page. Only approval applies the actual change.

import {
  addAnalyst,
  removeAnalyst,
  updateAnalyst,
  type Analyst,
} from "./use-analysts";

export type RequestType = "ADD" | "REMOVE" | "ROLE_UPDATE";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AnalystRequest {
  id: string;
  type: RequestType;
  status: RequestStatus;
  requestedBy: string;
  createdAt: string;
  resolvedAt?: string;
  // ADD
  addPayload?: {
    name: string;
    username: string;
    email?: string;
    role: string;
  };
  // REMOVE / ROLE_UPDATE
  analystId?: string;
  analystName?: string;
  // ROLE_UPDATE
  newRole?: string;
  newStatus?: Analyst["status"];
}

const KEY = "agess_analyst_requests";
export const REQUESTS_EVENT = "analyst-requests-change";

export function getRequests(): AnalystRequest[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function getPendingRequests(): AnalystRequest[] {
  return getRequests().filter((r) => r.status === "PENDING");
}

function save(list: AnalystRequest[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(REQUESTS_EVENT));
}

export function addRequest(
  req: Omit<AnalystRequest, "id" | "status" | "createdAt">,
): AnalystRequest {
  const list = getRequests();
  const newReq: AnalystRequest = {
    ...req,
    id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  list.unshift(newReq);
  save(list);
  return newReq;
}

export function approveRequest(id: string): boolean {
  const list = getRequests();
  const req = list.find((r) => r.id === id);
  if (!req || req.status !== "PENDING") return false;

  if (req.type === "ADD" && req.addPayload) {
    addAnalyst({
      name: req.addPayload.name,
      username: req.addPayload.username,
      email: req.addPayload.email,
      role: req.addPayload.role,
      status: "Active",
    });
  } else if (req.type === "REMOVE" && req.analystId) {
    removeAnalyst(req.analystId);
  } else if (req.type === "ROLE_UPDATE" && req.analystId) {
    const updates: Partial<Analyst> = {};
    if (req.newRole) updates.role = req.newRole;
    if (req.newStatus) updates.status = req.newStatus;
    updateAnalyst(req.analystId, updates);
  }

  req.status = "APPROVED";
  req.resolvedAt = new Date().toISOString();
  save(list);
  return true;
}

export function rejectRequest(id: string): boolean {
  const list = getRequests();
  const req = list.find((r) => r.id === id);
  if (!req || req.status !== "PENDING") return false;
  req.status = "REJECTED";
  req.resolvedAt = new Date().toISOString();
  save(list);
  return true;
}
