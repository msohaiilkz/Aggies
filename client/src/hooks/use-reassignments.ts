// Shared reassignment-notification store (localStorage backed).
//
// When an executive reassigns an alert away from an analyst, we record a
// notification so the analyst's dashboard can (a) disable that alert and
// (b) show a popup. We deliberately DO NOT store which executive performed the
// reassignment — the analyst must never see the executive's identity.

const KEY = "agies_reassignments";
export const REASSIGN_EVENT = "alert-reassign-change";

export interface Reassignment {
  id: string;
  customerName: string;
  alertCode?: string;
  fromAnalyst: string;
  toAnalyst: string;
  at: string;
}

export function getReassignments(): Reassignment[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addReassignment(
  r: Omit<Reassignment, "id" | "at">,
): Reassignment {
  const list = getReassignments();
  const entry: Reassignment = {
    ...r,
    id: `ra-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    at: new Date().toISOString(),
  };
  list.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(REASSIGN_EVENT));
  return entry;
}

export function clearReassignments(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(REASSIGN_EVENT));
}
