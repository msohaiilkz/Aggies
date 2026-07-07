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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAnalysts, type Analyst } from "@/hooks/use-analysts";
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
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

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
    window.addEventListener("alert-settings-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("alert-settings-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const activeAnalysts = analysts.filter((a) => a.status === "Active");
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

  const formatGeneratedAt = (iso?: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-PK", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
      {/* Global limit */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#46CDCF]/10 rounded-lg text-[#46CDCF]">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Global Alert Limit</p>
              <p className="text-xs text-gray-500">
                Maximum alerts per analyst — applies to all analysts
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
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <UserCog className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Alert Assignments</p>
                <p className="text-xs text-gray-500">
                  Reassign alerts from busy analysts to others
                </p>
              </div>
            </div>
            <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-0 shrink-0">
              {activeAnalysts.length} analyst
              {activeAnalysts.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Analyst load — wraps + scrolls so any number of analysts fits */}
          {activeAnalysts.length > 0 && (
            <div className="px-6 py-3 border-b border-gray-50 bg-gray-50/40">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Analyst Load
                </span>
                <span className="text-[11px] text-gray-400">
                  ({activeAnalysts.length})
                </span>
              </div>
              <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto pr-1">
                {activeAnalysts.map((a) => {
                  const c = loadFor(a.id);
                  const ratio = limit > 0 ? c / limit : 0;
                  let cls = "bg-emerald-50 text-emerald-700 ring-emerald-100";
                  let label = "Low";
                  if (c >= limit) {
                    cls = "bg-red-50 text-red-600 ring-red-100";
                    label = "Full";
                  } else if (ratio >= 0.8) {
                    cls = "bg-red-50 text-red-600 ring-red-100";
                    label = "High";
                  } else if (ratio >= 0.5) {
                    cls = "bg-amber-50 text-amber-700 ring-amber-100";
                    label = "Medium";
                  }
                  return (
                    <span
                      key={a.id}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ${cls}`}
                      title={`${label} load`}
                    >
                      <span className="max-w-[120px] truncate">{a.name}</span>
                      <span className="font-bold tabular-nums">
                        {c}/{limit}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4 font-medium text-gray-500 text-sm">Alert ID</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Customer</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Severity</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Channel</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Assigned To</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Reassign</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Open / Reopen</th>
                  <th className="p-4 font-medium text-gray-500 text-sm">Generated</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((al) => (
                  <tr
                    key={al.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 last:border-0"
                    data-testid={`alert-row-${al.id}`}
                  >
                    <td className="p-4 font-mono text-xs text-gray-700">{al.id}</td>
                    <td className="p-4 text-sm text-gray-900">{al.customerName}</td>
                    <td className="p-4">
                      {al.assignedTo ? (
                        loadSeverityBadge(loadFor(al.assignedTo), limit)
                      ) : (
                        <Badge className="bg-gray-100 text-gray-500 border-0">—</Badge>
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
                    {/* Open / Reopen */}
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
                          className={`border-0 ${
                            al.status === "Reopened"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {al.status === "Reopened" ? "Reopened" : "Open"}
                        </Badge>
                      )}
                    </td>
                    {/* Generated timestamp */}
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatGeneratedAt(al.createdAt)}
                    </td>
                  </tr>
                ))}
                {alerts.length === 0 && (
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
