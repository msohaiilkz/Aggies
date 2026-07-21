import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BellRing,
  UserCog,
  ArrowRightLeft,
  Minus,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAnalysts, type Analyst } from "@/hooks/use-analysts";
import { isAnalystOnline, ONLINE_EVENT } from "@/hooks/use-analyst-online";
import { buildAlertIdShared } from "@/lib/alert-field-config";
import { addReassignment } from "@/hooks/use-reassignments";
import {
  DEFAULT_GLOBAL_LIMIT,
  getAlerts,
  getGlobalAlertLimit,
  reassignAlert,
  setAlertStatus,
  setGlobalAlertLimit,
  type AlertItem,
} from "@/hooks/use-alert-settings";

function loadSeverityBadge(count: number, limit: number) {
  if (count >= limit)
    return <Badge className="bg-red-100 text-red-700 border-0">Full</Badge>;
  const ratio = limit > 0 ? count / limit : 0;
  if (ratio >= 0.8)
    return <Badge className="bg-red-100 text-red-700 border-0">High</Badge>;
  if (ratio >= 0.5)
    return <Badge className="bg-amber-100 text-amber-700 border-0">Medium</Badge>;
  return <Badge className="bg-emerald-100 text-emerald-700 border-0">Low</Badge>;
}

const MAX_ALERT_LIMIT = 100;
const MIN_ALERT_LIMIT = 1;
const clampLimit = (n: number) =>
  Math.max(MIN_ALERT_LIMIT, Math.min(MAX_ALERT_LIMIT, Number.isFinite(n) ? n : MIN_ALERT_LIMIT));

export function AlertControlPanel() {
  const { toast } = useToast();
  const [limit, setLimit] = useState<number>(DEFAULT_GLOBAL_LIMIT);
  const [draftLimit, setDraftLimit] = useState<number>(DEFAULT_GLOBAL_LIMIT);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [analystFilter, setAnalystFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [onlineTick, setOnlineTick] = useState(0);

  const refresh = () => {
    const l = getGlobalAlertLimit();
    setLimit(l);
    setDraftLimit(l);
    setAnalysts(getAnalysts());
    setAlerts(getAlerts());
  };

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    const onOnline = () => setOnlineTick((t) => t + 1);
    window.addEventListener("alert-settings-change", onChange);
    window.addEventListener("storage", onChange);
    window.addEventListener(ONLINE_EVENT, onOnline);
    return () => {
      window.removeEventListener("alert-settings-change", onChange);
      window.removeEventListener("storage", onChange);
      window.removeEventListener(ONLINE_EVENT, onOnline);
    };
  }, []);

  const activeAnalysts = analysts.filter((a) => a.status === "Active");
  // onlineTick keeps this recomputing when an analyst logs in/out.
  void onlineTick;
  const onlineCount = activeAnalysts.filter((a) => isAnalystOnline(a.name)).length;
  const atCapacityCount = activeAnalysts.filter(
    (a) => alerts.filter((x) => x.assignedTo === a.id).length >= limit,
  ).length;
  // Same Alert ID as the analyst dashboard (shared formula) so the executive can
  // search an analyst's alert by its id.
  const displayId = (al: AlertItem) =>
    buildAlertIdShared(al.rule ?? 1, al.createdAt, al.id);

  const searchQ = search.trim().toLowerCase();
  const visibleAlerts = alerts.filter((al) => {
    const matchesAnalyst =
      analystFilter === "all"
        ? true
        : analystFilter === "__unassigned"
          ? !al.assignedTo
          : al.assignedTo === analystFilter;
    // Search by Alert ID, Customer, Rule Number, or CNIC/Passport (alertCode).
    const matchesSearch =
      !searchQ ||
      displayId(al).toLowerCase().includes(searchQ) ||
      al.customerName.toLowerCase().includes(searchQ) ||
      (al.alertCode ?? "").toLowerCase().includes(searchQ) ||
      (al.rule != null &&
        (`rule ${al.rule}`.includes(searchQ) || String(al.rule) === searchQ));
    return matchesAnalyst && matchesSearch;
  });
  const analystName = (id: string | null) =>
    !id ? "Unassigned" : analysts.find((a) => a.id === id)?.name ?? "Unknown";
  const loadFor = (id: string) =>
    alerts.filter((a) => a.assignedTo === id).length;

  const applyLimit = () => {
    const n = clampLimit(draftLimit);
    setGlobalAlertLimit(n);
    setLimit(n);
    setDraftLimit(n);
    setConfirmOpen(false);
    toast({
      title: "Global alert limit updated",
      description: `All analysts can now handle up to ${n} alerts.`,
    });
  };

  const handleAlertStatus = (
    alertId: string,
    status: "Open" | "Closed" | "Reopened",
  ) => {
    if (setAlertStatus(alertId, status)) {
      refresh();
      toast({
        title: status === "Reopened" ? "Alert reopened" : "Alert updated",
        description: `Alert ${alertId} is now ${status}.`,
      });
    }
  };

  const handleReassign = (alertId: string, newId: string) => {
    const target = newId === "__unassign" ? null : newId;
    if (target && loadFor(target) >= limit) {
      toast({
        title: "Analyst at limit",
        description: `${analystName(target)} already has ${limit}/${limit} alerts.`,
        variant: "destructive",
      });
      return;
    }
    const alert = alerts.find((a) => a.id === alertId);
    const previousAnalystId = alert?.assignedTo ?? null;
    if (reassignAlert(alertId, target)) {
      // Notify the analyst it was taken from — WITHOUT the executive's name.
      if (previousAnalystId && previousAnalystId !== target && alert) {
        addReassignment({
          customerName: alert.customerName,
          alertCode: alert.alertCode,
          fromAnalyst: analystName(previousAnalystId),
          toAnalyst: target ? analystName(target) : "Unassigned",
        });
      }
      refresh();
      toast({
        title: "Alert reassigned",
        description: `Alert ${alertId} → ${target ? analystName(target) : "Unassigned"}`,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Per-analyst active alert limit */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#46CDCF]/10 rounded-lg text-[#46CDCF]">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  Per-Analyst Active Alert Limit
                </p>
                <p className="text-xs text-gray-500">
                  Maximum active alerts per analyst — applies to all
                  active/live analysts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Stepper + typeable number input (max 100) */}
              <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDraftLimit((l) => clampLimit(l - 1))}
                  disabled={draftLimit <= MIN_ALERT_LIMIT}
                  className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease limit"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <Input
                  type="number"
                  min={MIN_ALERT_LIMIT}
                  max={MAX_ALERT_LIMIT}
                  value={draftLimit}
                  onChange={(e) =>
                    setDraftLimit(clampLimit(parseInt(e.target.value, 10)))
                  }
                  className="h-10 w-16 border-0 border-x border-gray-200 rounded-none text-center font-bold text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                  data-testid="input-global-limit"
                />
                <button
                  type="button"
                  onClick={() => setDraftLimit((l) => clampLimit(l + 1))}
                  disabled={draftLimit >= MAX_ALERT_LIMIT}
                  className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Increase limit"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                / {MAX_ALERT_LIMIT} max
              </span>
              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={draftLimit === limit}
                className="h-10 bg-[#46CDCF] hover:bg-[#3db8ba] text-white font-semibold"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Add change reason */}
          <div className="mt-3">
            {!showReason ? (
              <button
                type="button"
                onClick={() => setShowReason(true)}
                className="text-sm font-medium text-[#46CDCF] hover:text-[#3db8ba]"
              >
                + Add change reason
              </button>
            ) : (
              <Input
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Reason for changing the limit (optional)..."
                className="h-10 max-w-md text-sm"
              />
            )}
          </div>

          {/* Note */}
          <p className="mt-3 text-xs text-gray-400 leading-relaxed">
            Active alerts include Pending, Reviewed and Flagged. Fraud, Not
            Fraud, False Positive and Discarded alerts do not count.
          </p>
        </CardContent>
      </Card>

      {/* Save confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save global alert limit?</AlertDialogTitle>
            <AlertDialogDescription>
              Set the global alert limit to{" "}
              <strong>{clampLimit(draftLimit)} alerts per analyst</strong>? This
              applies to all analysts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={applyLimit}
              className="bg-[#46CDCF] hover:bg-[#3db8ba]"
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert assignments */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <UserCog className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Alert Assignments</p>
                <p className="text-xs text-gray-500">
                  Reassign active alerts from busy analysts to others
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full sm:w-auto">
              {/* Search by Alert ID / Customer / Rule / CNIC */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Alert ID, customer, rule…"
                  className="h-9 pl-9 text-sm"
                />
              </div>
              {/* All analysts filter */}
              <Select value={analystFilter} onValueChange={setAnalystFilter}>
                <SelectTrigger className="h-9 w-full sm:w-[190px] text-sm">
                  <SelectValue placeholder="All analysts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All analysts</SelectItem>
                  <SelectItem value="__unassigned">Unassigned</SelectItem>
                  {activeAnalysts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats row */}
          <div className="px-6 py-3 border-b border-gray-50 bg-gray-50/40 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            <span className="text-gray-600">{activeAnalysts.length}</span>
            <span>Analysts</span>
            <span className="text-gray-300">·</span>
            <span className="text-emerald-600">{onlineCount}</span>
            <span>Online</span>
            <span className="text-gray-300">·</span>
            <span className="text-red-500">{atCapacityCount}</span>
            <span>At Capacity</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-600">{alerts.length}</span>
            <span>Active Alerts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4 font-medium text-gray-500 text-sm">Alert ID</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Customer</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Rule Number</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Status</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Channel</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Assigned To</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Analyst Load</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Reassign</th>
                </tr>
              </thead>
              <tbody>
                {visibleAlerts.map((al) => (
                  <tr
                    key={al.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 last:border-0"
                    data-testid={`alert-row-${al.id}`}
                  >
                    <td className="p-4 font-mono text-xs text-gray-700">
                      {displayId(al)}
                    </td>
                    <td className="p-4 text-sm text-gray-900">{al.customerName}</td>
                    {/* Rule Number */}
                    <td className="p-4 text-sm text-gray-700 whitespace-nowrap">
                      {al.rule ? `Rule ${al.rule}` : "—"}
                    </td>
                    {/* Status */}
                    <td className="p-4">
                      {al.status === "Closed" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAlertStatus(al.id, "Reopened")}
                          className="h-8 gap-1 border-blue-200 text-xs text-blue-600 hover:bg-blue-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reopen
                        </Button>
                      ) : (
                        <Badge
                          className={`rounded-md border-0 ${
                            al.status === "Reopened"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {al.status === "Reopened" ? "Reopened" : "Open"}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{al.channel}</td>
                    <td className="p-4 text-sm">
                      {al.assignedTo ? (
                        <span className="font-medium text-gray-800">
                          {analystName(al.assignedTo)}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">Unassigned</span>
                      )}
                    </td>
                    {/* Analyst load of the currently-assigned analyst */}
                    <td className="p-4">
                      {al.assignedTo ? (
                        <span className="inline-flex items-center gap-1.5">
                          {loadSeverityBadge(loadFor(al.assignedTo), limit)}
                          <span className="text-xs font-bold tabular-nums text-gray-500">
                            {loadFor(al.assignedTo)}/{limit}
                          </span>
                        </span>
                      ) : (
                        <Badge className="rounded-md bg-gray-100 text-gray-500 border-0">
                          —
                        </Badge>
                      )}
                    </td>
                    {/* Reassign */}
                    <td className="p-4">
                      <Select
                        value={al.assignedTo ?? ""}
                        onValueChange={(v) => handleReassign(al.id, v)}
                      >
                        <SelectTrigger
                          className="h-8 w-[170px] text-xs"
                          data-testid={`select-reassign-${al.id}`}
                        >
                          <div className="flex items-center gap-1.5">
                            <ArrowRightLeft className="w-3.5 h-3.5 text-[#46CDCF]" />
                            <SelectValue placeholder="Pick analyst" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__unassign">— Unassign —</SelectItem>
                          {activeAnalysts.map((a) => {
                            const c = loadFor(a.id);
                            const full = c >= limit && al.assignedTo !== a.id;
                            return (
                              <SelectItem
                                key={a.id}
                                value={a.id}
                                disabled={full}
                              >
                                {a.name} ({c}/{limit})
                                {full ? " — full" : ""}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {visibleAlerts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      No alerts to assign
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
