// Shared alert-status store (localStorage backed) so that actions taken by an
// analyst (discard / mark fraud / reopen / reassign) are reflected in the
// executive's monitoring view — across logins and browser tabs.

const STATUS_KEY = "agies_alert_status_overrides";

export interface AlertOverride {
  status?: string;
  analyst?: string;
}

export function getAlertOverrides(): Record<string, AlertOverride> {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, AlertOverride>) : {};
  } catch {
    return {};
  }
}

export function setAlertOverride(id: string, patch: AlertOverride): void {
  const all = getAlertOverrides();
  all[id] = { ...all[id], ...patch };
  localStorage.setItem(STATUS_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("alert-status-change"));
}

export function clearAlertOverrides(): void {
  localStorage.removeItem(STATUS_KEY);
  window.dispatchEvent(new Event("alert-status-change"));
}
