import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import type { LucideIcon } from "lucide-react";
import {
  Layers,
  Inbox,
  CheckCircle2,
  ArrowLeftRight,
  Wallet,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";
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

interface CardDef {
  label: string;
  value: number;
  sub?: string;
  icon: LucideIcon;
  chip: string; // icon chip bg + text colour
  value_color: string; // number colour
  hover: string; // hover border colour
  onClick: () => void;
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

  const cards: CardDef[] = [
    {
      label: "Total Alerts",
      value: stats.total,
      sub: "All alerts in the system",
      icon: Layers,
      chip: "bg-slate-100 text-slate-600",
      value_color: "text-gray-900",
      hover: "hover:border-slate-300",
      onClick: () => navigate(alertsHref),
    },
    {
      label: "Opened Alerts",
      value: stats.opened,
      sub: `${stats.assigned} Assigned · ${stats.unassigned} Unassigned`,
      icon: Inbox,
      chip: "bg-blue-50 text-blue-600",
      value_color: "text-gray-900",
      hover: "hover:border-blue-300",
      onClick: () => navigate(alertsHref),
    },
    {
      label: "Closed Alerts",
      value: stats.closed,
      sub: `${stats.confirmedFraud} Fraud · ${stats.nonFraud} Non-Fraud`,
      icon: CheckCircle2,
      chip: "bg-emerald-50 text-emerald-600",
      value_color: "text-gray-900",
      hover: "hover:border-emerald-300",
      onClick: () => navigate("/category/Closed-Alerts"),
    },
    {
      label: "Suspected Transactions",
      value: stats.suspectedTransactions,
      sub: "Flagged for review",
      icon: ArrowLeftRight,
      chip: "bg-violet-50 text-violet-600",
      value_color: "text-gray-900",
      hover: "hover:border-violet-300",
      onClick: () => navigate("/transactions"),
    },
    {
      label: "Suspected Accounts",
      value: stats.suspectedAccounts,
      sub: "Un-reviewed accounts",
      icon: Wallet,
      chip: "bg-amber-50 text-amber-600",
      value_color: "text-gray-900",
      hover: "hover:border-amber-300",
      onClick: () => setUnreviewedOpen(true),
    },
    {
      label: "Suspected Customers",
      value: stats.suspectedCustomers,
      sub: "Under monitoring",
      icon: Users,
      chip: "bg-cyan-50 text-cyan-600",
      value_color: "text-gray-900",
      hover: "hover:border-cyan-300",
      onClick: () => navigate(alertsHref),
    },
    {
      label: "Pending Contact Alerts",
      value: stats.pending,
      sub: "Awaiting customer contact",
      icon: Clock,
      chip: "bg-orange-50 text-orange-600",
      value_color: "text-orange-600",
      hover: "hover:border-orange-300",
      onClick: () => setNotContactedOpen(true),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 p-4 sm:p-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={c.onClick}
              className={`group flex flex-col justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${c.hover}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.chip}`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500" />
              </div>
              <div>
                <div
                  className={`text-2xl xl:text-[26px] font-bold leading-none ${c.value_color}`}
                >
                  {c.value}
                </div>
                <div className="mt-1.5 text-[12.5px] font-semibold text-gray-700 leading-tight">
                  {c.label}
                </div>
                {c.sub && (
                  <div className="mt-1 text-[10.5px] text-gray-400 leading-tight">
                    {c.sub}
                  </div>
                )}
              </div>
            </button>
          );
        })}
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
