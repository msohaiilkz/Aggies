// Shared alert-status store (localStorage backed) so that actions taken by an
// analyst (discard / mark fraud / reopen / reassign) are reflected in the
// executive's monitoring view — across logins and browser tabs.

const STATUS_KEY = "agies_alert_status_overrides";
const VERSION_KEY = "agies_alert_status_version";
// Bump when the alert seed / ids change so stale per-id status overrides (which
// would otherwise hide re-seeded alerts) are cleared once.
const STATUS_VERSION = 2;

export interface AlertOverride {
  status?: string;
  analyst?: string;
}

// One-time reset: if the seed version changed, drop old overrides.
function ensureVersion(): void {
  if (localStorage.getItem(VERSION_KEY) !== String(STATUS_VERSION)) {
    localStorage.removeItem(STATUS_KEY);
    localStorage.setItem(VERSION_KEY, String(STATUS_VERSION));
  }
}

export function getAlertOverrides(): Record<string, AlertOverride> {
  ensureVersion();
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
