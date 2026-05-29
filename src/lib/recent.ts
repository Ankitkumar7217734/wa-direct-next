const RKEY = "wadirect_recent";
const MAX_RECENT = 6;

export interface RecentEntry {
  cc: string;
  num: string;
  label: string;
}

export function getRecent(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RKEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRecent(cc: string, num: string) {
  const cleaned = num.replace(/\D/g, "");
  if (!cleaned) return;
  const label = `+${cc.replace(/\D/g, "")} ${cleaned}`;
  let list = getRecent();
  list = list.filter((r) => r.label !== label);
  list.unshift({ cc, num: cleaned, label });
  list = list.slice(0, MAX_RECENT);
  localStorage.setItem(RKEY, JSON.stringify(list));
}

export function clearRecent() {
  localStorage.removeItem(RKEY);
}
