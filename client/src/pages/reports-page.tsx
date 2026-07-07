import { useState, useMemo, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Download,
  Edit2,
  ShieldAlert,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import DownloadInsightsModal from "@/components/DownloadInsightsModal";
import { useAuth } from "@/hooks/use-auth";
import { useSearch } from "@/hooks/use-search";
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
import { useToast } from "@/hooks/use-toast";

const AuditLogsContent = ({ role }: { role: string }) => {
  const { toast } = useToast();
  const { query: globalQuery } = useSearch();
  // Rights model: logs are immutable — NO role (not even Super Admin) can edit
  // or delete audit logs.
  const canEdit = false;
  const [logToDelete, setLogToDelete] = useState<string | null>(null);

  const logs = [
    {
      id: "LOG-001",
      user: "analyst_a",
      action: "Resolved Alert #P4366",
      date: "2025-02-17 10:30",
      status: "Success",
    },
    {
      id: "LOG-002",
      user: "exec_b",
      action: "Updated Fraud Threshold",
      date: "2025-02-17 11:15",
      status: "Warning",
    },
    {
      id: "LOG-003",
      user: "analyst_c",
      action: "Flagged Account #A122",
      date: "2025-02-17 12:00",
      status: "Critical",
    },
    {
      id: "LOG-004",
      user: "super_admin",
      action: "System Config Update",
      date: "2025-02-17 12:45",
      status: "Info",
    },
  ];

  const confirmDelete = () => {
    if (logToDelete) {
      console.log(`Deleted log: ${logToDelete}`);
      toast({
        title: "Log Deleted",
        description: `Audit log ${logToDelete} has been successfully removed.`,
      });
      setLogToDelete(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            System Audit Logs
          </h2>
          <p className="text-sm text-gray-500">
            History of all system actions and configuration changes.
          </p>
        </div>
        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 flex items-center gap-1">
          <ShieldAlert className="h-3 w-3" />
          Read-only · Immutable
        </Badge>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-medium">
            <tr>
              <th className="p-3">Log ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Status</th>
              {canEdit && <th className="p-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs
              .filter((log) => {
                const lq = globalQuery.trim().toLowerCase();
                return (
                  !lq ||
                  log.id.toLowerCase().includes(lq) ||
                  log.user.toLowerCase().includes(lq) ||
                  log.action.toLowerCase().includes(lq) ||
                  log.status.toLowerCase().includes(lq)
                );
              })
              .map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 font-mono text-gray-400">{log.id}</td>
                <td className="p-3 font-medium text-gray-900">{log.user}</td>
                <td className="p-3 text-gray-600">{log.action}</td>
                <td className="p-3 text-gray-500">{log.date}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : log.status === "Warning"
                          ? "bg-orange-100 text-orange-700"
                          : log.status === "Critical"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                {canEdit && (
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setLogToDelete(log.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={!!logToDelete}
        onOpenChange={() => setLogToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              audit log entry and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ─── Mock pending-cases dataset (spread across ~90 days) ─────────────────────
const CASE_TYPES = [
  "Transaction Fraud",
  "Account Takeover",
  "Card Skimming",
  "Identity Theft",
  "Money Laundering",
  "Phishing Attempt",
];
const CASE_SEVERITIES = ["High", "Medium", "Low"];
const CASE_AGENTS = ["Agent A", "Agent B", "Agent C", "Unassigned"];

function generatePendingCases() {
  const today = new Date();
  return Array.from({ length: 60 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - Math.floor(i * 1.5)); // ~0–88 days back
    return {
      id: `CAS-2025-${String(i + 1).padStart(3, "0")}`,
      severity: CASE_SEVERITIES[i % CASE_SEVERITIES.length],
      type: CASE_TYPES[i % CASE_TYPES.length],
      assignedTo: CASE_AGENTS[i % CASE_AGENTS.length],
      createdAt: d.toISOString(),
    };
  });
}

const CASE_PAGE_SIZE = 20;

export const CaseManagementContent = () => {
  const { query: globalQuery } = useSearch();
  const [allocationMode, setAllocationMode] = useState("Automatic Allocation");
  const allCases = useMemo(() => generatePendingCases(), []);

  // Default view: last 45 days of pending cases.
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    return { from: addDays(today, -60), to: today };
  });
  const [page, setPage] = useState(1);

  const filteredCases = useMemo(() => {
    // Combine the in-page search box with the top-bar (page-scoped) search.
    const q = `${searchQuery} ${globalQuery}`.trim().toLowerCase();
    const from = dateRange?.from
      ? new Date(dateRange.from).setHours(0, 0, 0, 0)
      : -Infinity;
    const to = dateRange?.to
      ? new Date(dateRange.to).setHours(23, 59, 59, 999)
      : Infinity;

    const terms = q.split(/\s+/).filter(Boolean);
    return allCases
      .filter((c) => {
        const haystack =
          `${c.id} ${c.type} ${c.severity} ${c.assignedTo}`.toLowerCase();
        const matchesSearch =
          terms.length === 0 || terms.every((term) => haystack.includes(term));
        const t = new Date(c.createdAt).getTime();
        const matchesDate = t >= from && t <= to;
        return matchesSearch && matchesDate;
      })
      // Current (most recent) cases on top.
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [allCases, searchQuery, globalQuery, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / CASE_PAGE_SIZE));

  // Keep the current page valid whenever filters change.
  useEffect(() => {
    setPage(1);
  }, [searchQuery, globalQuery, dateRange]);

  const pageItems = filteredCases.slice(
    (page - 1) * CASE_PAGE_SIZE,
    page * CASE_PAGE_SIZE,
  );

  const severityClass = (s: string) =>
    s === "High"
      ? "bg-red-100 text-red-700"
      : s === "Medium"
        ? "bg-orange-100 text-orange-700"
        : "bg-teal-100 text-teal-700";

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Case Allocation Settings
        </h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Allocation Mode:
          </label>
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setAllocationMode("Automatic Allocation")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                allocationMode === "Automatic Allocation"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Automatic Allocation
            </button>
            <button
              onClick={() => setAllocationMode("Manual Allocation")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                allocationMode === "Manual Allocation"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Manual Allocation
            </button>
          </div>
        </div>
      </div>

      {allocationMode === "Automatic Allocation" ? (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-blue-900 font-semibold mb-2">
              Automatic Distribution Active
            </h3>
            <p className="text-blue-700 text-sm">
              Cases are currently being distributed evenly among available
              agents to ensure balanced workload allocation. No manual action is
              required.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Pending Cases for Allocation
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Showing pending cases in the selected range (default: last 60
                days). Newest cases appear first.
              </p>
            </div>
          </div>

          {/* Filters: search + date range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-500">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Case ID, type, agent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-500">
                Date Range
              </label>
              <DatePickerWithRange
                value={dateRange}
                onChange={setDateRange}
                align="start"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                className="h-10"
                onClick={() => {
                  const today = new Date();
                  setSearchQuery("");
                  setDateRange({ from: addDays(today, -60), to: today });
                }}
              >
                Reset (Last 60 days)
              </Button>
            </div>
          </div>

          <div className="mb-3 text-sm font-medium text-slate-500">
            Found{" "}
            <span className="text-gray-900">{filteredCases.length}</span> pending
            case{filteredCases.length !== 1 ? "s" : ""}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Assign To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No pending cases match your filters.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-gray-600">{c.id}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${severityClass(
                            c.severity,
                          )}`}
                        >
                          {c.severity}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{c.type}</td>
                      <td className="p-3 text-gray-500 whitespace-nowrap">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="p-3">
                        <select
                          defaultValue={c.assignedTo}
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500"
                        >
                          <option>Select Agent</option>
                          <option>Agent A</option>
                          <option>Agent B</option>
                          <option>Agent C</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredCases.length > CASE_PAGE_SIZE && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
              <div className="text-sm text-slate-500">
                Showing{" "}
                <span className="text-gray-900 font-medium">
                  {(page - 1) * CASE_PAGE_SIZE + 1}
                </span>{" "}
                –{" "}
                <span className="text-gray-900 font-medium">
                  {Math.min(page * CASE_PAGE_SIZE, filteredCases.length)}
                </span>{" "}
                of{" "}
                <span className="text-gray-900 font-medium">
                  {filteredCases.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 h-9"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "ghost"}
                        size="sm"
                        className={`w-9 h-9 p-0 font-semibold ${
                          p === page
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-slate-600 hover:bg-gray-100"
                        }`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 h-9"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ReportsPage() {
  const { user } = useAuth();
  const { query: globalQuery, setPlaceholder } = useSearch();
  const [activeTab, setActiveTab] = useState("all-reports");

  useEffect(() => {
    setPlaceholder(
      activeTab === "audit-logs"
        ? "Search logs (user, action)..."
        : "Search reports...",
    );
  }, [activeTab, setPlaceholder]);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const reports = [
    {
      type: "Fraud List",
      description: "A list of frauds on selected date range",
    },
    {
      type: "Fraud Trend Summary",
      description: "Shows monthly trends in fraud volume and losses.",
    },
    {
      type: "Analyst Performance",
      description: "Aggregates each analyst's handled cases and outcomes.",
    },
    {
      type: "False Positives Rate",
      description: "Focuses on false positive metrics over time.",
    },
    {
      type: "Financial Impact",
      description:
        "Summarizes the monetary impact (losses prevented/incurred).",
    },
    {
      type: "Analyst wise Report",
      description:
        "Detailed performance report based on individual analyst metrics.",
    },
    {
      type: "Issuer rule Type Report",
      description: "Breakdown of alerts and frauds by issuer rule types.",
    },
    {
      type: "Issuer Alert Status",
      description:
        "Current status overview of all alerts triggered by issuer rules.",
    },
    {
      type: "Issuer Fraud Type",
      description:
        "ClasCIFication of detected fraud incidents by issuer fraud types.",
    },
    {
      type: "Issuer Rule by Fraud",
      description: "Analysis of which issuer rules are most effective.",
    },
    {
      type: "Number of Alerts Per Hour",
      description: "Temporal analysis showing distribution of alerts per hour.",
    },
    {
      type: "Confirmed Fraud Cases",
      description: "Comprehensive list of all cases confirmed as fraud.",
    },
  ];

  const handleDownloadClick = (report: any) => {
    setSelectedReport(report);
    setIsDownloadModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDownloadModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <MainLayout title="Report and Analysis">
      <div className="p-4 sm:p-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">
          Report and Analysis
        </h1>

        <div className="flex flex-wrap space-x-2 mb-6">
          <button
            onClick={() => setActiveTab("all-reports")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "all-reports"
                ? "bg-gray-200 text-gray-900 shadow-sm border border-gray-300"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setActiveTab("audit-logs")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "audit-logs"
                ? "bg-gray-200 text-gray-900 shadow-sm border border-gray-300"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Audit & Logs
          </button>
        </div>

        {activeTab === "all-reports" && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 sm:px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Reports for Download
              </h2>
            </div>
            <div className="divide-y divide-gray-200 overflow-x-auto">
              {reports
                .filter((report) => {
                  const rq = globalQuery.trim().toLowerCase();
                  return (
                    !rq ||
                    report.type.toLowerCase().includes(rq) ||
                    report.description.toLowerCase().includes(rq)
                  );
                })
                .map((report, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-12 px-4 sm:px-6 py-4 items-center hover:bg-gray-50 gap-2 sm:gap-0"
                >
                  <div className="col-span-3 font-medium text-gray-900">
                    {report.type}
                  </div>
                  <div className="col-span-7 text-sm text-gray-600">
                    {report.description}
                  </div>
                  <div className="col-span-2 flex justify-start sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadClick(report)}
                    >
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "audit-logs" && (
          <AuditLogsContent role={user?.role || "ANALYST"} />
        )}
      </div>

      {isDownloadModalOpen && (
        <DownloadInsightsModal
          isOpen={isDownloadModalOpen}
          onClose={handleCloseModal}
          report={selectedReport}
        />
      )}
    </MainLayout>
  );
}
