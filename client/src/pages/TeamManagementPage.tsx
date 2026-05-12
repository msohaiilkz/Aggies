import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAnalystModal } from "@/components/CreateAnalystModal";
import { ManageAnalystModal } from "@/components/ManageAnalystModal";
import {
  UserPlus,
  Search,
  Shield,
  ShieldAlert,
  MonitorPlay,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { getAnalysts, initAnalysts, type Analyst } from "@/hooks/use-analysts";

export default function TeamManagementPage() {
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState<Analyst | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadAnalysts = useCallback(() => {
    initAnalysts();
    setAnalysts(getAnalysts());
  }, []);

  // Load on mount + re-load when localStorage changes (cross-tab sync)
  useEffect(() => {
    loadAnalysts();
    const handleStorage = () => loadAnalysts();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [loadAnalysts]);

  const statusOrder: Record<string, number> = { Pending: 0, Active: 1, Inactive: 2 };

  const filteredAnalysts = analysts
    .filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        a.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3));

  const totalActive = analysts.filter((a) => a.status === "Active").length;
  const totalPending = analysts.filter((a) => a.status === "Pending").length;
  const totalResolved = analysts.reduce((s, a) => s + a.casesResolved, 0);

  const getStatusBadge = (status: Analyst["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
            Active
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 border-0">
            Inactive
          </Badge>
        );
    }
  };

  return (
    <MainLayout title="Team Management">
      <div className="flex flex-col min-h-screen bg-transparent">
        <div className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-2 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Team Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage platform analysts and risk specialists
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadAnalysts}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#46CDCF] hover:bg-[#3db8ba] text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 font-semibold transition-all shadow-sm active:scale-95"
              >
                <UserPlus className="w-5 h-5" />
                <span>Create Analyst</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-lg text-blue-600">
                  <Shield className="w-6 h-6" />
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
                  <MonitorPlay className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{totalActive}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm border-amber-100">
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

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-purple-100 rounded-lg text-purple-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Cases Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{totalResolved}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending notice */}
          {totalPending > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-sm text-amber-800">
                <strong>{totalPending} analyst{totalPending > 1 ? "s" : ""} pending activation.</strong>{" "}
                A Super Admin must activate these accounts before they can log in.
              </div>
            </div>
          )}

          {/* Analyst Directory */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="px-6 py-5 border-b border-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <CardTitle className="text-lg font-bold">Analyst Directory</CardTitle>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Status filter tabs */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    {(["all", "active", "pending", "inactive"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                          statusFilter === s
                            ? "bg-white shadow text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search name or username..."
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
                    <th className="p-4 font-medium text-gray-500 text-sm">Full Name</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Username</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Role</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Status</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Cases Resolved</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Created</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalysts.length > 0 ? (
                    (() => {
                      const rows: React.ReactNode[] = [];
                      let lastStatus = "";

                      filteredAnalysts.forEach((analyst, idx) => {
                        const isFirstPending =
                          analyst.status === "Pending" && lastStatus !== "Pending";
                        const isFirstNonPending =
                          analyst.status !== "Pending" && lastStatus === "Pending";
                        const isVeryFirst = idx === 0 && analyst.status === "Pending";

                        if (isVeryFirst || isFirstPending) {
                          rows.push(
                            <tr key={`hdr-pending-${idx}`}>
                              <td colSpan={7} className="px-4 py-2 bg-amber-50 border-b border-amber-200">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                                    Awaiting Super Admin Activation
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        if (isFirstNonPending) {
                          rows.push(
                            <tr key={`hdr-active-${idx}`}>
                              <td colSpan={7} className="px-4 py-2 bg-gray-50 border-b border-gray-100">
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
                              analyst.status === "Pending" ? "bg-amber-50/60" : ""
                            }`}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#46CDCF]/20 text-[#2a9a9c] font-bold flex items-center justify-center text-sm shrink-0">
                                  {analyst.name.charAt(0)}
                                </div>
                                <span className="font-semibold text-gray-900">{analyst.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-500 text-sm font-mono">@{analyst.username}</td>
                            <td className="p-4 text-gray-600 text-sm">{analyst.role}</td>
                            <td className="p-4">{getStatusBadge(analyst.status)}</td>
                            <td className="p-4 text-gray-600 font-medium">{analyst.casesResolved}</td>
                            <td className="p-4 text-gray-400 text-xs">
                              {new Date(analyst.createdAt).toLocaleDateString("en-PK", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="p-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => {
                                  setSelectedAnalyst(analyst);
                                  setIsManageModalOpen(true);
                                }}
                              >
                                Manage
                              </Button>
                            </td>
                          </tr>
                        );
                      });

                      return rows;
                    })()
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-gray-500">
                        No analysts found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Modals */}
          <CreateAnalystModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreated={loadAnalysts}
          />

          <ManageAnalystModal
            isOpen={isManageModalOpen}
            onClose={() => {
              setIsManageModalOpen(false);
              setTimeout(() => setSelectedAnalyst(null), 200);
              loadAnalysts();
            }}
            analyst={selectedAnalyst}
            onUpdate={loadAnalysts}
          />
        </div>
      </div>
    </MainLayout>
  );
}
