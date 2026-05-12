import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  UserCheck,
  Users,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  getAnalysts,
  initAnalysts,
  updateAnalystStatus,
  type Analyst,
} from "@/hooks/use-analysts";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── Activate confirmation dialog ────────────────────────────────────────────
function ActivateConfirmModal({
  analyst,
  onConfirm,
  onClose,
}: {
  analyst: Analyst | null;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      onConfirm();
      setLoading(false);
    }, 900);
  };

  if (!analyst) return null;

  return (
    <Dialog open={!!analyst} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            Activate Analyst Account
          </DialogTitle>
          <DialogDescription>
            You are about to activate <strong>{analyst.name}</strong> (@
            {analyst.username}). They will gain access to the analyst dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
          Once activated, the analyst will appear as <strong>Active</strong> in
          the Executive's Team Management view instantly.
        </div>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handle}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activating...
              </>
            ) : (
              "Confirm Activation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SuperAdminPage() {
  const { toast } = useToast();
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activatingAnalyst, setActivatingAnalyst] = useState<Analyst | null>(null);

  const load = useCallback(() => {
    initAnalysts();
    setAnalysts(getAnalysts());
  }, []);

  useEffect(() => {
    load();
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [load]);

  // Sort: Pending first, then Active, then Inactive
  const statusOrder: Record<string, number> = { Pending: 0, Active: 1, Inactive: 2 };

  const filtered = analysts
    .filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        a.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    })
    .sort((a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3));

  const handleActivate = (analyst: Analyst) => setActivatingAnalyst(analyst);

  const confirmActivate = () => {
    if (!activatingAnalyst) return;
    updateAnalystStatus(activatingAnalyst.id, "Active");
    load();
    toast({
      title: "Analyst Activated ✅",
      description: `${activatingAnalyst.name} is now active and can access the system.`,
    });
    setActivatingAnalyst(null);
  };

  const handleDeactivate = (analyst: Analyst) => {
    updateAnalystStatus(analyst.id, "Inactive");
    load();
    toast({
      title: "Analyst Deactivated",
      description: `${analyst.name}'s account has been suspended.`,
      variant: "destructive",
    });
  };

  const totalActive = analysts.filter((a) => a.status === "Active").length;
  const totalPending = analysts.filter((a) => a.status === "Pending").length;

  const getStatusBadge = (status: Analyst["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" /> Active
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 border-0 flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" /> Inactive
          </Badge>
        );
    }
  };

  // Build flat list of rows (section headers + data rows) for the table
  const buildRows = (): React.ReactNode[] => {
    const rows: React.ReactNode[] = [];
    let lastStatus = "";

    filtered.forEach((analyst, idx) => {
      const isFirstPending = analyst.status === "Pending" && lastStatus !== "Pending";
      const isFirstNonPending =
        analyst.status !== "Pending" && lastStatus === "Pending";
      const isVeryFirst = idx === 0 && analyst.status === "Pending";

      if (isVeryFirst || isFirstPending) {
        rows.push(
          <tr key={`hdr-pending-${idx}`}>
            <td colSpan={6} className="px-4 py-2 bg-amber-50 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Awaiting Activation — Action Required
                </span>
              </div>
            </td>
          </tr>
        );
      }

      if (isFirstNonPending) {
        rows.push(
          <tr key={`hdr-active-${idx}`}>
            <td colSpan={6} className="px-4 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Active & Inactive Analysts
              </span>
            </td>
          </tr>
        );
      }

      lastStatus = analyst.status;

      rows.push(
        <tr
          key={analyst.id}
          className={`border-b border-gray-50 hover:bg-gray-50/50 last:border-0 transition-colors ${
            analyst.status === "Pending" ? "bg-amber-50/40" : ""
          }`}
        >
          {/* Analyst */}
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#46CDCF]/20 text-[#2a9a9c] font-bold flex items-center justify-center text-sm shrink-0">
                {analyst.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{analyst.name}</p>
                {analyst.email && (
                  <p className="text-xs text-gray-400">{analyst.email}</p>
                )}
              </div>
            </div>
          </td>
          {/* Username */}
          <td className="p-4 text-gray-500 text-sm font-mono">@{analyst.username}</td>
          {/* Role */}
          <td className="p-4 text-gray-600 text-sm">{analyst.role}</td>
          {/* Status */}
          <td className="p-4">{getStatusBadge(analyst.status)}</td>
          {/* Created */}
          <td className="p-4 text-gray-400 text-xs">
            {new Date(analyst.createdAt).toLocaleDateString("en-PK", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </td>
          {/* Actions */}
          <td className="p-4">
            <div className="flex items-center gap-2">
              {analyst.status === "Pending" && (
                <Button
                  size="sm"
                  className="h-8 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleActivate(analyst)}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Activate
                </Button>
              )}
              {analyst.status === "Active" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleDeactivate(analyst)}
                >
                  Deactivate
                </Button>
              )}
              {analyst.status === "Inactive" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => handleActivate(analyst)}
                >
                  Re-Activate
                </Button>
              )}
            </div>
          </td>
        </tr>
      );
    });

    return rows;
  };

  return (
    <MainLayout title="Super Admin — Analyst Management">
      <div className="flex flex-col min-h-screen bg-transparent">
        <div className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-2 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Analyst Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Review pending analysts and manage account activation
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={load} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-lg text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Total Analysts</p>
                  <p className="text-2xl font-bold text-gray-900">{analysts.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-green-100 rounded-lg text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{totalActive}</p>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-0 shadow-sm ${totalPending > 0 ? "ring-2 ring-amber-300" : ""}`}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-amber-100 rounded-lg text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Pending Activation</p>
                  <p className="text-2xl font-bold text-amber-600">{totalPending}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert banner */}
          {totalPending > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center gap-3 animate-pulse-once">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-sm text-amber-800">
                <strong>Action Required:</strong> {totalPending} analyst
                {totalPending > 1 ? "s are" : " is"} waiting for activation.
                Review and activate in the table below.
              </div>
            </div>
          )}

          {/* Table */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="px-6 py-5 border-b border-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <CardTitle className="text-lg font-bold">All Analysts</CardTitle>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Status tabs */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    {(["all", "pending", "active", "inactive"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                          statusFilter === s
                            ? "bg-white shadow text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {s === "pending" && totalPending > 0
                          ? `Pending (${totalPending})`
                          : s}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search analyst..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-9 border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <table className="w-full text-left bg-white">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-4 font-medium text-gray-500 text-sm">Analyst</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Username</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Role</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Status</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Created</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    buildRows()
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-gray-500">
                        No analysts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activation dialog */}
      <ActivateConfirmModal
        analyst={activatingAnalyst}
        onConfirm={confirmActivate}
        onClose={() => setActivatingAnalyst(null)}
      />
    </MainLayout>
  );
}
