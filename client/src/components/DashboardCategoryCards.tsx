import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { initialAlerts } from "@/data/alerts-seed";
import { getAlertOverrides } from "@/hooks/use-alert-status";
import { UnreviewedAccountsModal } from "@/components/UnreviewedAccountsModal";
import { NotContactedAlertsModal } from "@/components/NotContactedAlertsModal";
import { SuspectedTransactionsModal } from "@/components/SuspectedTransactionsModal";

// Client dashboard categories (segregation sheet, Row 7). The same set renders
// on BOTH the analyst and executive dashboards, with live counts + click-through.

const OPEN_STATUSES = ["OPEN", "ASSIGNED", "REOPENED"];

export interface CategoryStats {
  total: number;
  opened: number;
  assigned: number;
  unassigned: number;
  closed: number;
  confirmedFraud: number;
  nonFraud: number;
  pending: number;
  suspended: number;
  suspectedTransactions: number;
  suspectedAccounts: number;
  suspectedCustomers: number;
}

// Every count is derived from the SAME alert dataset the analyst dashboard shows
// (initialAlerts) plus the live status overrides — so the cards always match the
// real alerts, and drop/rise as analysts open, close, discard or move alerts to
// pending contact. Alert Count (grouped child alerts) feeds Suspected Transactions.
export function computeCategoryStats(): CategoryStats {
  const ov = getAlertOverrides();
  const eff = (a: { id: string; status: string }) =>
    (ov[a.id]?.status || a.status || "ASSIGNED").toUpperCase();

  let opened = 0,
    assigned = 0,
    unassigned = 0,
    confirmedFraud = 0,
    nonFraud = 0,
    discarded = 0,
    pending = 0,
    suspended = 0,
    suspectedTransactions = 0;
  const accounts = new Set<string>();
  const customers = new Set<string>();

  for (const a of initialAlerts) {
    const s = eff(a);
    suspectedTransactions += a.alertCount || 1; // each grouped alert = a flagged txn
    accounts.add(a.alertCode);
    customers.add(a.customerName);
    if (ov[a.id]?.suspended) suspended += 1;

    if (OPEN_STATUSES.includes(s)) {
      opened += 1;
      if (a.assignedTo) assigned += 1;
      else unassigned += 1;
    } else if (s === "FRAUD") confirmedFraud += 1;
    else if (["RESOLVED", "CONTACTED", "NOT_FRAUD"].includes(s)) nonFraud += 1;
    else if (s === "DISCARDED") discarded += 1;
    else if (s === "NOT_CONTACTED") pending += 1;
  }

  return {
    total: initialAlerts.length,
    opened,
    assigned,
    unassigned,
    closed: confirmedFraud + nonFraud + discarded,
    confirmedFraud,
    nonFraud,
    pending,
    suspended,
    suspectedTransactions,
    suspectedAccounts: accounts.size,
    suspectedCustomers: customers.size,
  };
}

export function DashboardCategoryCards({
  role,
}: {
  role: "ANALYST" | "EXECUTIVE";
}) {
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<CategoryStats>(computeCategoryStats);
  const [unreviewedOpen, setUnreviewedOpen] = useState(false);
  const [notContactedOpen, setNotContactedOpen] = useState(false);
  const [suspectedTxnOpen, setSuspectedTxnOpen] = useState(false);

  // Recompute whenever an alert is actioned/reassigned (any tab or login).
  useEffect(() => {
    const refresh = () => setStats(computeCategoryStats());
    refresh();
    window.addEventListener("alert-status-change", refresh);
    window.addEventListener("alert-settings-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("alert-status-change", refresh);
      window.removeEventListener("alert-settings-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const alertsHref = role === "EXECUTIVE" ? "/alert-assignments" : "/category/All";

  const cards: {
    label: string;
    value: number;
    sub?: string;
    color?: string;
    onClick: () => void;
  }[] = [
    {
      label: "Total Alerts",
      value: stats.total,
      onClick: () => navigate(alertsHref),
    },
    {
      label: "Opened Alerts",
      value: stats.opened,
      sub: `Assigned ${stats.assigned} · Unassigned ${stats.unassigned}`,
      onClick: () => navigate(alertsHref),
    },
    {
      label: "Closed Alerts",
      value: stats.closed,
      sub: `Confirmed Fraud ${stats.confirmedFraud} · Non-Fraud ${stats.nonFraud}`,
      onClick: () => navigate("/category/Closed-Alerts"),
    },
    {
      label: "Suspected Transactions",
      value: stats.suspectedTransactions,
      onClick: () => setSuspectedTxnOpen(true),
    },
    {
      label: "Suspected Accounts",
      value: stats.suspectedAccounts,
      onClick: () => setUnreviewedOpen(true),
    },
    {
      label: "Suspected Customers",
      value: stats.suspectedCustomers,
      onClick: () => navigate(alertsHref),
    },
    {
      label: "Pending Contact Alerts",
      value: stats.pending,
      color: "text-amber-600",
      onClick: () => setNotContactedOpen(true),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 divide-x divide-y xl:divide-y-0 divide-gray-100 border-t border-gray-100">
        {cards.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={c.onClick}
            className="flex flex-col items-center justify-center gap-1 px-3 py-6 text-center min-w-0 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span
              className={`text-2xl xl:text-3xl font-bold ${c.color || "text-gray-900"}`}
            >
              {c.value}
            </span>
            <span className="text-[12px] xl:text-[13px] font-medium text-slate-500 leading-tight">
              {c.label}
            </span>
            {c.sub && (
              <span className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                {c.sub}
              </span>
            )}
          </button>
        ))}
      </div>

      <UnreviewedAccountsModal
        open={unreviewedOpen}
        onOpenChange={setUnreviewedOpen}
      />
      <NotContactedAlertsModal
        open={notContactedOpen}
        onOpenChange={setNotContactedOpen}
      />
      <SuspectedTransactionsModal
        open={suspectedTxnOpen}
        onOpenChange={setSuspectedTxnOpen}
      />
    </>
  );
}
