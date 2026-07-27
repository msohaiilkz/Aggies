import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAlerts } from "@/hooks/use-alert-settings";
import { getAlertOverrides } from "@/hooks/use-alert-status";
import { UnreviewedAccountsModal } from "@/components/UnreviewedAccountsModal";
import { NotContactedAlertsModal } from "@/components/NotContactedAlertsModal";

// Client dashboard categories (segregation sheet, Row 7). The same set renders
// on BOTH the analyst and executive dashboards, with live counts + click-through.

// Baseline of already-actioned alerts — mirrors the seeded closed/pending alerts
// shown on the Closed/Fraud screen so the counts are realistic and consistent.
const DEMO = { fraud: 1, nonFraud: 1, discarded: 1, pending: 1 };

const TERMINAL = [
  "FRAUD",
  "RESOLVED",
  "CONTACTED",
  "NOT_FRAUD",
  "DISCARDED",
  "NOT_CONTACTED",
];

export interface CategoryStats {
  total: number;
  opened: number;
  assigned: number;
  unassigned: number;
  closed: number;
  confirmedFraud: number;
  nonFraud: number;
  pending: number;
  suspectedTransactions: number;
  suspectedAccounts: number;
  suspectedCustomers: number;
}

// Counts are derived live from the shared alert store + status overrides, so they
// drop/rise as analysts open, close, discard or move alerts to pending contact.
export function computeCategoryStats(): CategoryStats {
  const alerts = getAlerts();
  const ov = getAlertOverrides();
  const eff = (a: { id: string }) =>
    (ov[a.id]?.status || "OPEN").toUpperCase();

  const opened = alerts.filter((a) => !TERMINAL.includes(eff(a)));
  const assigned = opened.filter((a) => a.assignedTo).length;
  const confirmedFraud =
    alerts.filter((a) => eff(a) === "FRAUD").length + DEMO.fraud;
  const nonFraud =
    alerts.filter((a) => ["RESOLVED", "CONTACTED", "NOT_FRAUD"].includes(eff(a)))
      .length + DEMO.nonFraud;
  const discarded =
    alerts.filter((a) => eff(a) === "DISCARDED").length + DEMO.discarded;
  const pending =
    alerts.filter((a) => eff(a) === "NOT_CONTACTED").length + DEMO.pending;

  return {
    total: alerts.length + DEMO.fraud + DEMO.nonFraud + DEMO.discarded + DEMO.pending,
    opened: opened.length,
    assigned,
    unassigned: opened.length - assigned,
    closed: confirmedFraud + nonFraud + discarded,
    confirmedFraud,
    nonFraud,
    pending,
    // Monitoring metrics (no per-record drill-down store in this build).
    suspectedTransactions: 300,
    suspectedAccounts: 120,
    suspectedCustomers: 85,
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
      onClick: () => navigate("/transactions"),
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
    </>
  );
}
