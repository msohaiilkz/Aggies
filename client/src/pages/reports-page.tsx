import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Edit2, ShieldAlert, Trash2 } from "lucide-react";
import DownloadInsightsModal from "@/components/DownloadInsightsModal";
import { useAuth } from "@/hooks/use-auth";
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
  const canEdit = role === "SUPER_EXECUTIVE";
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
        {canEdit && (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-0 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            Super Executive Mode
          </Badge>
        )}
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
            {logs.map((log) => (
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

const CaseManagementContent = () => {
  const [allocationMode, setAllocationMode] = useState("Automatic Allocation");

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
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Pending Cases for Allocation
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Assign To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-gray-600">
                      CAS-2025-00{i}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        High
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">Transaction Fraud</td>
                    <td className="p-3">
                      <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500">
                        <option>Select Agent</option>
                        <option>Agent A</option>
                        <option>Agent B</option>
                        <option>Agent C</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ReportsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all-reports");
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
            onClick={() => setActiveTab("case-management")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "case-management"
                ? "bg-gray-200 text-gray-900 shadow-sm border border-gray-300"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Case Management
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
              {reports.map((report, index) => (
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

        {activeTab === "case-management" && <CaseManagementContent />}
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
