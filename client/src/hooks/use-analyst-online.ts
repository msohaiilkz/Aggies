// Shared online-status store (localStorage). The executive views read this to
// show who is currently online/offline.
//
// Model — presence reflects real logins, nothing is faked:
//  - An analyst becomes online only when they log in (setOnlyOnline). At that
//    moment they are the ONLY one online; whoever was online before is closed.
//  - Presence persists across logout so the executive keeps seeing who last
//    logged in. If no analyst has ever logged in, everyone is offline.

const KEY = "agies_online_analysts";
export const ONLINE_EVENT = "analyst-online-change";

export function getOnlineMap(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

// Online iff explicitly marked true by a login.
export function isAnalystOnline(name?: string): boolean {
  return !!name && getOnlineMap()[name] === true;
}

// Mark exactly one analyst online (the one logging in); everyone else offline.
export function setOnlyOnline(name: string): void {
  localStorage.setItem(KEY, JSON.stringify({ [name]: true }));
  window.dispatchEvent(new Event(ONLINE_EVENT));
}

// Set one analyst online without touching the others (executive manual control).
export function setAnalystOnline(name: string): void {
  const map = getOnlineMap();
  map[name] = true;
  localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(ONLINE_EVENT));
}

export function setAnalystOffline(name: string): void {
  const map = getOnlineMap();
  map[name] = false;
  localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(ONLINE_EVENT));
}

// Toggle presence for one analyst.
export function toggleAnalystOnline(name: string): void {
  if (isAnalystOnline(name)) setAnalystOffline(name);
  else setAnalystOnline(name);
}
