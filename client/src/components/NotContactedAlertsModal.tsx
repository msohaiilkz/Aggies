import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function NotContactedAlertsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const alerts = [
    {
      id: "P436691BNC140",
      customer: "Kelvin Harris",
      date: "2025-04-16",
      createdAt: "2025-04-16T10:30:00Z",
      amount: "PKR 156,000",
      reason: "High Velocity Transaction",
      alertSource: "Rule #105 (High Velocity)",
      severity: "HIGH",
    },
    {
      id: "P436691BNC141",
      customer: "Obaid Mehmood",
      date: "2025-04-15",
      createdAt: "2025-04-15T14:20:00Z",
      amount: "PKR 15,000",
      reason: "Unusual Location",
      alertSource: "Rule #302 (Structuring)",
      severity: "MEDIUM",
    },
    {
      id: "P436691BNC142",
      customer: "Abid Ali",
      date: "2025-04-14",
      createdAt: "2025-04-14T09:15:00Z",
      amount: "PKR 20,000",
      reason: "Structuring Pattern",
      alertSource: "Rule #88 (Large Cash Tx)",
      severity: "LOW",
    },
    {
      id: "P436691BNC143",
      customer: "Mustafa Mahmood",
      date: "2025-04-13",
      createdAt: "2025-04-13T16:45:00Z",
      amount: "PKR 75,000",
      reason: "Behavioral Anomaly",
      alertSource: "Rule #404 (Large Transaction)",
      severity: "HIGH",
    },
    {
      id: "P436691BNC144",
      customer: "Farhan Ahmed",
      date: "2025-04-12",
      createdAt: "2025-04-12T11:30:00Z",
      amount: "PKR 100,000",
      reason: "New Beneficiary",
      alertSource: "Rule #55 (Multiple ATM Attempts)",
      severity: "HIGH",
    },
  ];

  const normalizeAlertRuleKey = (alertSource: string) => {
    const matchedRule = alertSource.match(/Rule\s*#\s*(\d+)/i);
    if (matchedRule) return `RULE_${matchedRule[1]}`;
    if (/AI Model/i.test(alertSource)) return "AI_MODEL";
    return alertSource.toUpperCase().replace(/\s+/g, "_");
  };

  const ruleSequenceMap = alerts.reduce(
    (map, alert) => {
      const ruleKey = normalizeAlertRuleKey(alert.alertSource);
      if (!map[ruleKey]) {
        map[ruleKey] = String(Object.keys(map).length + 1);
      }
      return map;
    },
    {} as Record<string, string>,
  );

  const buildAlertId = (alert: (typeof alerts)[number], alertNumber: number) => {
    const createdAt = new Date(alert.createdAt);
    const yy = String(createdAt.getFullYear()).slice(-2);
    const mm = String(createdAt.getMonth() + 1).padStart(2, "0");
    const dd = String(createdAt.getDate()).padStart(2, "0");
    const ruleSequence =
      ruleSequenceMap[normalizeAlertRuleKey(alert.alertSource)] || "1";
    return `1${ruleSequence}${yy}${mm}${dd}${alertNumber}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Not Contacted Alerts
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto mt-4">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Action Needed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert, index) => (
                <TableRow key={alert.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-mono font-bold text-blue-600">
                    {buildAlertId(alert, index + 1)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {alert.customer}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {alert.reason}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {alert.amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        alert.severity === "HIGH"
                          ? "bg-red-500"
                          : alert.severity === "MEDIUM"
                            ? "bg-orange-500"
                            : "bg-teal-500"
                      } text-white border-0`}
                    >
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button className="text-[11px] font-bold text-blue-600 hover:underline">
                      Review & Call
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
