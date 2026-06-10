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
import { BellRing, UserCog, ArrowRightLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAnalysts, type Analyst } from "@/hooks/use-analysts";
import {
  ALERT_LIMIT_OPTIONS,
  DEFAULT_GLOBAL_LIMIT,
  getAlerts,
  getGlobalAlertLimit,
  reassignAlert,
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

export function AlertControlPanel() {
  const { toast } = useToast();
  const [limit, setLimit] = useState<number>(DEFAULT_GLOBAL_LIMIT);
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const refresh = () => {
    setLimit(getGlobalAlertLimit());
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

  const handleLimit = (v: string) => {
    const n = parseInt(v, 10);
    setGlobalAlertLimit(n);
    setLimit(n);
    toast({
      title: "Global alert limit updated",
      description: `All analysts can now handle up to ${n} alerts.`,
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
    if (reassignAlert(alertId, target)) {
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
          <Select value={String(limit)} onValueChange={handleLimit}>
            <SelectTrigger
              className="h-10 w-[160px] font-semibold"
              data-testid="select-global-limit"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALERT_LIMIT_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} alerts / analyst
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

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
            <div className="hidden md:flex items-center gap-3 text-xs">
              {activeAnalysts.map((a) => {
                const c = loadFor(a.id);
                const ratio = limit > 0 ? c / limit : 0;
                let cls = "bg-emerald-50 text-emerald-700";
                let label = "Low";
                if (c >= limit) {
                  cls = "bg-red-50 text-red-600";
                  label = "Full";
                } else if (ratio >= 0.8) {
                  cls = "bg-red-50 text-red-600";
                  label = "High";
                } else if (ratio >= 0.5) {
                  cls = "bg-amber-50 text-amber-700";
                  label = "Medium";
                }
                return (
                  <span
                    key={a.id}
                    className={`px-2 py-1 rounded font-medium ${cls}`}
                    title={`${label} load`}
                  >
                    {a.name}: {c}/{limit}
                  </span>
                );
              })}
            </div>
          </div>
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
                  </tr>
                ))}
                {alerts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
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
