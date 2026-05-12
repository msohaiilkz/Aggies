import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CustomerDetailsModal from "./CustomerDetailsModal";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { UnreviewedAccountsModal } from "@/components/UnreviewedAccountsModal";
import ForceCloseModal from "@/components/ForceCloseModal";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration

// Mock data for demonstration
// Mock data for demonstration
const initialAlerts = [
  {
    id: "1",
    alertCode: "P436691BNC140",
    customerName: "Kelvin Harris",
    globalId: "P436691BNC140",
    idType: "Passport",
    alertCount: 2,
    amount: 156000.0,
    severity: "HIGH",
    status: "OPEN",
    city: "Karachi",
    createdAt: "2025-01-10T10:30:00Z",
    alertSource: "Rule #105 (High Velocity)",
    channel: "FT-Raast",
  },
  {
    id: "2",
    alertCode: "P436691BNC140",
    customerName: "Obaid Mehmood",
    globalId: "P436691BNC140",
    idType: "Passport",
    alertCount: 4,
    amount: 15000.0,
    severity: "MEDIUM",
    status: "OPEN",
    city: "Lahore",
    createdAt: "2025-01-09T14:20:00Z",
    alertSource: "AI Model (Unusual Location)",
    channel: "IBFT",
  },
  {
    id: "3",
    alertCode: "42301-26920823-3",
    customerName: "Abid Ali",
    globalId: "42301-26920823-3",
    idType: "CNIC",
    alertCount: 1,
    amount: 20000.0,
    severity: "LOW",
    status: "OPEN",
    city: "Islamabad",
    createdAt: "2025-01-08T09:15:00Z",
    alertSource: "Rule #302 (Structuring)",
    channel: "POS",
  },
  {
    id: "4",
    alertCode: "P436691BNC140",
    customerName: "Mustafa Mahmood",
    globalId: "P436691BNC140",
    idType: "Passport",
    alertCount: 5,
    amount: 75000.0,
    severity: "HIGH",
    status: "OPEN",
    city: "Karachi",
    createdAt: "2025-01-07T16:45:00Z",
    alertSource: "AI Model (Behavioral Anomaly)",
    channel: "E-Commerce",
  },
  {
    id: "5",
    alertCode: "P436691BNC140",
    customerName: "Kelvin Harris",
    globalId: "P436691BNC140",
    idType: "Passport",
    alertCount: 3,
    amount: 230000.0,
    severity: "HIGH",
    status: "OPEN",
    city: "Multan",
    createdAt: "2025-01-06T11:30:00Z",
    alertSource: "Rule #404 (Large Transaction)",
    channel: "FT-Raast",
  },
  {
    id: "6",
    alertCode: "P436691BNC140",
    customerName: "Obaid Mehmood",
    globalId: "P436691BNC140",
    idType: "Passport",
    alertCount: 1,
    amount: 171450.0,
    severity: "HIGH",
    status: "OPEN",
    city: "Hyderabad",
    createdAt: "2025-01-05T13:20:00Z",
    alertSource: "AI Model (Device Mismatch)",
    channel: "IBFT",
  },
  {
    id: "7",
    alertCode: "A987654XYZ210",
    customerName: "Ayesha Khan",
    globalId: "A987654XYZ210",
    idType: "CNIC",
    alertCount: 3,
    amount: 150000.0,
    severity: "HIGH",
    status: "FRAUD",
    city: "Karachi",
    createdAt: "2025-01-04T09:30:00Z",
    alertSource: "Rule #55 (Multiple ATM Attempts)",
    channel: "ATM-On-Us",
  },
  {
    id: "8",
    alertCode: "B123456LMN987",
    customerName: "Zainab Ali",
    globalId: "B123456LMN987",
    idType: "Passport",
    alertCount: 1,
    amount: 50000.0,
    severity: "MEDIUM",
    status: "OPEN",
    city: "Lahore",
    createdAt: "2025-01-08T11:20:00Z",
    alertSource: "Rule #12 (Off-us withdrawal pattern)",
    channel: "ATM-Of-Us",
  },
  {
    id: "43",
    alertCode: "B1234160MN0123",
    customerName: "Zaheer Ali",
    globalId: "B123456LM0123",
    idType: "CNIC",
    alertCount: 1,
    amount: 50000.0,
    severity: "MEDIUM",
    status: "OPEN",
    city: "Karachi",
    createdAt: "2025-01-08T11:20:00Z",
    alertSource: "Rule #12 (On-us withdrawal pattern)",
    channel: "ATM-On-Us",
  },
  {
    id: "9",
    alertCode: "C987654MNO321",
    customerName: "Fahad Mustafa",
    globalId: "C987654MNO321",
    idType: "CNIC",
    alertCount: 2,
    amount: 500000.0,
    severity: "HIGH",
    status: "FRAUD",
    city: "Islamabad",
    createdAt: "2025-01-02T15:45:00Z",
    alertSource: "Rule #88 (Large Cash Tx)",
    channel: "Withdrawal",
  },
  {
    id: "10",
    alertCode: "D456789PQR654",
    customerName: "Salman Ahmed",
    globalId: "D456789PQR654",
    idType: "CNIC",
    alertCount: 4,
    amount: 320000.0,
    severity: "HIGH",
    status: "OPEN",
    city: "Karachi",
    createdAt: "2025-01-09T08:15:00Z",
    alertSource: "AI Model (Location Mismatch)",
    channel: "Withdrawal",
  },
];

export default function FraudDashboard({ category }: { category?: string }) {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState(() =>
    initialAlerts.map((alert) => ({
      ...alert,
      movedToPendingAt: null as number | null,
      lastNotifiedAt: 0,
    })),
  );

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
    const alertNum = String(alertNumber);

    return `1${ruleSequence}${yy}${mm}${dd}${alertNum}`;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cityFilter, setCityFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreviewedModalOpen, setUnreviewedModalOpen] = useState(false);
  const [isForceCloseModalOpen, setIsForceCloseModalOpen] = useState(false);

  // Frontend Notification Logic - FIXED
  useEffect(() => {
    const notifyInterval = setInterval(() => {
      const now = Date.now();

      setAlerts((currentAlerts) => {
        let hasChanges = false;
        const updatedAlerts = currentAlerts.map((alert) => {
          if (alert.status === "NOT_CONTACTED" && alert.movedToPendingAt) {
            const elapsedMinutes = (now - alert.movedToPendingAt) / (60 * 1000);
            const sinceLastNotification =
              (now - alert.lastNotifiedAt) / (60 * 1000);

            // REAL CONDITION: Notify Every 30 Minutes
            // FOR DEMO: Notify almost immediately (9 seconds)
            const threshold = 0.15; // 1 minute for first alert
            const repeatDelay = 0.15; // 5 minutes for subsequent alerts

            if (
              elapsedMinutes >= threshold &&
              sinceLastNotification >= repeatDelay
            ) {
              toast({
                title: "🔴 Action Required: Pending Contact",
                description: `Customer ${alert.customerName} (ID: ${alert.globalId}) is still pending contact.`,
                variant: "destructive",
              });
              hasChanges = true;
              return { ...alert, lastNotifiedAt: now };
            }
          }
          return alert;
        });

        return hasChanges ? updatedAlerts : currentAlerts;
      });
    }, 3000);

    return () => clearInterval(notifyInterval);
  }, [toast]);

  useEffect(() => {
    if (category) {
      if (category === "Closed-Alerts") {
        setSelectedChannel("All");
        setStatusFilter("CLOSED_ALERTS");
      } else {
        setSelectedChannel(category);
        setStatusFilter(null);
      }
    } else {
      setSelectedChannel("All");
      setStatusFilter(null);
    }
  }, [category]);

  const channels = [
    "All",
    "FT-Raast",
    "IBFT",
    "POS",
    "E-Commerce",
    "Withdrawal",
    "ATM-On-Us",
    "ATM-Of-Us",
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "bg-red-500 text-white hover:bg-red-600";
      case "MEDIUM":
        return "bg-orange-500 text-white hover:bg-orange-600";
      case "LOW":
        return "bg-teal-500 text-white hover:bg-teal-600";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const handleAlertAction = (alertId: string, action: string, data?: any) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === alertId) {
          if (action === "NOT_CONTACTED") {
            return {
              ...alert,
              status: "NOT_CONTACTED",
              movedToPendingAt: Date.now(),
              lastNotifiedAt: 0,
            };
          }
          if (action === "CONTACTED") {
            return { ...alert, status: "RESOLVED", movedToPendingAt: null };
          }
          if (action === "FRAUD") {
            return { ...alert, status: "FRAUD", movedToPendingAt: null };
          }
          if (action === "OPEN") {
            return { ...alert, status: "OPEN", movedToPendingAt: null };
          }
          if (action === "DISCARDED") {
            return { ...alert, status: "DISCARDED", movedToPendingAt: null };
          }
        }
        return alert;
      }),
    );
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (statusFilter === "CLOSED_ALERTS") {
      if (alert.status !== "FRAUD" && alert.status !== "DISCARDED")
        return false;
    } else if (statusFilter && alert.status !== statusFilter) {
      return false;
    }

    // Normal view: hide resolved, fraud, discarded, not_contacted
    if (
      !statusFilter &&
      (alert.status === "RESOLVED" ||
        alert.status === "FRAUD" ||
        alert.status === "DISCARDED" ||
        alert.status === "NOT_CONTACTED")
    )
      return false;

    const matchesSearch =
      !searchQuery ||
      alert.globalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      cityFilter === "all" ||
      alert.city.toLowerCase() === cityFilter.toLowerCase();

    const matchesAmount =
      amountFilter === "all" ||
      (amountFilter === "low" && alert.amount <= 50000) ||
      (amountFilter === "medium" &&
        alert.amount > 50000 &&
        alert.amount <= 200000) ||
      (amountFilter === "high" && alert.amount > 200000);

    const matchesChannel =
      selectedChannel === "All" || alert.channel === selectedChannel;

    return matchesChannel && matchesSearch && matchesCity && matchesAmount;
  });

  const toggleSelectAlert = (alertId: string) => {
    setSelectedAlerts((prev) =>
      prev.includes(alertId)
        ? prev.filter((id) => id !== alertId)
        : [...prev, alertId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map((alert) => alert.id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openModal = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null);
  };

  const handleForceCloseSubmit = (reason: string, notes: string) => {
    console.log(
      "Force closing alerts:",
      selectedAlerts,
      "Reason:",
      reason,
      "Notes:",
      notes,
    );

    // Remove selected alerts from the list
    setAlerts((prev) =>
      prev.filter((alert) => !selectedAlerts.includes(alert.id)),
    );

    // Clear selection and close modal
    setSelectedAlerts([]);
    setIsForceCloseModalOpen(false);
  };

  // Calculate stats from filtered data
  const stats = {
    suspectedAccounts: 120,
    suspendedTransactions: 300,
    unReviewedAccounts: 45,
    notContacted:
      alerts.filter((a) => a.status === "NOT_CONTACTED").length + 15, // Mocking some existing ones
    actualFrauds: 13,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <Card className="bg-white border-0 shadow-sm mb-6">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 gap-4 flex-wrap">
              <h2 className="text-lg font-bold text-gray-900 shrink-0">
                Fraud Insights
              </h2>
              <DatePickerWithRange className="w-full sm:w-auto" />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 py-4 sm:py-6">
              {/* Suspected Accounts */}
              <div className="bg-white p-5 lg:p-6 xl:p-8 flex flex-col justify-between min-w-0 min-h-[160px]">
                <div>
                  <p className="text-3xl sm:text-4xl xl:text-[44px] font-bold text-gray-900 leading-tight">
                    {stats.suspectedAccounts}
                  </p>
                  <p className="text-sm font-medium text-slate-500 mt-1 mb-8">
                    Suspected Accounts
                  </p>
                </div>
                <button
                  onClick={() => setStatusFilter(null)}
                  className="w-full sm:w-max border border-slate-300 text-slate-700 px-4 xl:px-6 py-2 xl:py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95 whitespace-nowrap"
                >
                  View all accounts
                </button>
              </div>

              {/* Suspended Transactions */}
              <div className="bg-white p-5 lg:p-6 xl:p-8 flex flex-col justify-between min-w-0 min-h-[160px] border-t sm:border-t-0">
                <div>
                  <p className="text-3xl sm:text-4xl xl:text-[44px] font-bold text-gray-900 leading-tight">
                    {stats.suspendedTransactions}
                  </p>
                  <p className="text-sm font-medium text-slate-500 mt-1 mb-8">
                    Suspended Transactions
                  </p>
                </div>
                <button className="w-full sm:w-max border border-slate-300 text-slate-700 px-4 xl:px-6 py-2 xl:py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95 whitespace-nowrap">
                  View all transactions
                </button>
              </div>

              {/* Total Un-Reviewed Accounts */}
              <div className="bg-white p-5 lg:p-6 xl:p-8 flex flex-col justify-between min-w-0 min-h-[160px] border-t xl:border-t-0">
                <div>
                  <p className="text-3xl sm:text-4xl xl:text-[44px] font-bold text-gray-900 leading-tight">
                    45
                  </p>
                  <p className="text-sm font-medium text-slate-500 mt-1 mb-8">
                    Total Un-Reviewed Accounts
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStatusFilter(null);
                    setUnreviewedModalOpen(true);
                  }}
                  className="w-full sm:w-max border border-slate-300 text-slate-700 px-4 xl:px-6 py-2 xl:py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95 whitespace-nowrap"
                >
                  View all accounts
                </button>
              </div>

              {/* Not Contacted Alerts */}
              <div className="bg-white p-5 lg:p-6 xl:p-8 flex flex-col justify-between min-w-0 min-h-[160px] border-t sm:border-t-0 xl:border-t-0 border-r-0 xl:border-r">
                <div>
                  <p className="text-3xl sm:text-4xl xl:text-[44px] font-bold text-red-600 leading-tight">
                    {stats.notContacted}
                  </p>
                  <p className="text-sm font-medium text-slate-500 mt-1 mb-8">
                    Not Contacted Alerts
                  </p>
                </div>
                <button
                  onClick={() => setStatusFilter("NOT_CONTACTED")}
                  className="w-full sm:w-max border border-red-200 bg-red-50 text-red-700 px-4 xl:px-6 py-2 xl:py-2.5 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all active:scale-95 whitespace-nowrap"
                >
                  View not contacted
                </button>
              </div>

              {/* Actual Frauds */}
              <div className="bg-white p-5 lg:p-6 xl:p-8 flex flex-col justify-between min-w-0 min-h-[160px] border-t xl:border-t-0">
                <div>
                  <p className="text-3xl sm:text-4xl xl:text-[44px] font-bold text-gray-900 leading-tight">
                    13
                  </p>
                  <p className="text-sm font-medium text-slate-500 mt-1 mb-8">
                    Actual Frauds
                  </p>
                </div>
                <button className="w-full sm:w-max border border-slate-300 text-slate-700 px-4 xl:px-6 py-2 xl:py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95 whitespace-nowrap">
                  View all frauds
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts Section */}
      <Card className="bg-white shadow-sm border-0">
        <CardHeader className="px-6 py-6 border-b border-gray-50">
          <CardTitle className="text-xl font-bold text-gray-900">
            {category === "Closed-Alerts"
              ? "Closed & Fraud Alerts"
              : "Active Alerts List"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6 mb-8">
            {/* Search Filter */}
            <div className="space-y-2 min-w-0">
              <label className="text-[13px] font-semibold text-slate-500">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="CIF Number or Customer ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-gray-200 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm w-full"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2 min-w-0">
              <label className="text-[13px] font-semibold text-slate-500">
                Date Range
              </label>
              <DatePickerWithRange />
            </div>

            {/* Channel Filter */}
            <div className="space-y-2 min-w-0">
              <label className="text-[13px] font-semibold text-slate-500">
                Channel
              </label>
              <Select
                value={selectedChannel}
                onValueChange={setSelectedChannel}
              >
                <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm">
                  <SelectValue placeholder="Choose channel" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div className="space-y-2 min-w-0">
              <label className="text-[13px] font-semibold text-slate-500">
                Branch/City
              </label>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm">
                  <SelectValue placeholder="Choose city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="karachi">Karachi</SelectItem>
                  <SelectItem value="lahore">Lahore</SelectItem>
                  <SelectItem value="islamabad">Islamabad</SelectItem>
                  <SelectItem value="multan">Multan</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Filter */}
            <div className="space-y-2 min-w-0">
              <label className="text-[13px] font-semibold text-slate-500">
                Amount
              </label>
              <Select value={amountFilter} onValueChange={setAmountFilter}>
                <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm">
                  <SelectValue placeholder="Choose amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="low">0 - 50,000</SelectItem>
                  <SelectItem value="medium">50,000 - 200,000</SelectItem>
                  <SelectItem value="high">200,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions Header */}
          {selectedAlerts.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm shadow-red-50/50">
              <div className="text-sm text-red-700 font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {selectedAlerts.length} alert(s) selected
              </div>
              <Button
                size="sm"
                onClick={() => setIsForceCloseModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg shadow-red-200/50 font-bold px-6"
              >
                Force Close Cases
              </Button>
            </div>
          )}

          {/* Results Summary */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-500">
              Found{" "}
              <span className="text-gray-900">{filteredAlerts.length}</span>{" "}
              results
            </div>
            {selectedChannel !== "All" && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Active Folder
                </span>
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md shadow-blue-100">
                  {selectedChannel}
                </span>
              </div>
            )}
          </div>

          {/* Alerts Table */}
          <div className="overflow-x-auto border rounded-xl shadow-sm">
            <table className="w-full min-w-[700px] bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="w-12 p-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedAlerts.length === filteredAlerts.length &&
                        filteredAlerts.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  {/* <th className="p-4 text-left font-medium text-gray-900 text-sm">
                    No.
                  </th> */}
                  <th className="p-4 text-left font-medium text-gray-900 text-sm">
                    Alert ID
                  </th>
                  <th className="p-4 text-left font-medium text-gray-900 text-sm">
                    Customer Name
                  </th>
                  <th className="p-4 text-left font-medium text-gray-900 text-sm">
                    <div className="flex items-center">
                      CIF Number
                      <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                  <th className="p-4 text-left font-medium text-gray-900 text-sm">
                    Alert Source
                  </th>
                  <th className="p-4 text-left font-medium text-gray-900 text-sm">
                    Alert Count
                  </th>
                  {/* <th className="p-4 text-left font-medium text-gray-900 text-sm">
                    Alert Amount
                  </th>
                  <th className="p-4 text-left font-medium text-gray-900 text-sm">
                    Severity Level
                  </th> */}
                  <th className="p-4 font-medium text-gray-900 text-sm text-center">
                    Status
                  </th>
                  {/* <th className="p-4 font-medium text-gray-900 text-sm text-center">
                    Channel
                  </th> */}
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      No alerts found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert, index) => (
                    <tr
                      key={alert.id}
                      onClick={() => openModal(alert.id)}
                      className="border-b bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedAlerts.includes(alert.id)}
                          onChange={() => toggleSelectAlert(alert.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      {/* <td className="p-4 text-sm text-gray-500 font-medium">
                        {index + 1}
                      </td> */}
                      <td 
                        className="p-4 text-sm font-mono font-bold text-blue-600 hover:text-blue-800"
                      >
                        {buildAlertId(alert, index + 1)}
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {alert.customerName}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-mono font-bold text-sm text-gray-900">
                            {alert.globalId}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            ID Type: {alert.idType}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {alert.alertSource}
                      </td>
                      <td className="p-4 text-center font-medium text-gray-900">
                        {alert.alertCount}
                      </td>
                      {/* <td className="p-4 font-semibold text-gray-900">
                        PKR{" "}
                        {alert.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4">
                        <Badge
                          className={`${getSeverityColor(alert.severity)} text-xs px-3 py-1 rounded-full font-medium border-0`}
                        >
                          {alert.severity === "HIGH"
                            ? "High"
                            : alert.severity === "MEDIUM"
                              ? "Medium"
                              : "Low"}
                        </Badge>
                      </td> */}
                      <td className="p-4 text-center">
                        {alert.status === "FRAUD" ? (
                          <Badge className="bg-red-500 text-white hover:bg-red-600 border-0 rounded-full text-xs px-3 py-1">
                            Fraud
                          </Badge>
                        ) : alert.status === "DISCARDED" ? (
                          <Badge className="bg-gray-500 text-white hover:bg-gray-600 border-0 rounded-full text-xs px-3 py-1">
                            Discarded
                          </Badge>
                        ) : alert.status === "RESOLVED" ? (
                          <Badge className="bg-green-500 text-white hover:bg-green-600 border-0 rounded-full text-xs px-3 py-1">
                            Resolved
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-300 border-0 rounded-full text-xs px-3 py-1">
                            Open
                          </Badge>
                        )}
                      </td>
                      {/* <td className="p-4 text-center">
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 uppercase tracking-tighter">
                          {alert.channel}
                        </span>
                      </td> */}
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                          <span className="text-lg font-bold">⋮</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredAlerts.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-50 gap-4">
              <div className="text-sm font-medium text-slate-500">
                Showing{" "}
                <span className="text-gray-900">
                  {(currentPage - 1) * 10 + 1}
                </span>{" "}
                to{" "}
                <span className="text-gray-900">
                  {Math.min(currentPage * 10, 60)}
                </span>{" "}
                of <span className="text-gray-900">60</span> results
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 px-3 h-9 text-slate-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6].map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      className={`w-9 h-9 p-0 font-semibold transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100"
                          : "text-slate-600 hover:bg-gray-100"
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 px-3 h-9 text-slate-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === 6}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerDetailsModal
        customerId={selectedCustomerId}
        isOpen={isModalOpen}
        onClose={closeModal}
        onAction={handleAlertAction}
        alertStatus={alerts.find((a) => a.id === selectedCustomerId)?.status}
      />
      <UnreviewedAccountsModal
        open={unreviewedModalOpen}
        onOpenChange={setUnreviewedModalOpen}
      />
      <ForceCloseModal
        isOpen={isForceCloseModalOpen}
        onClose={() => setIsForceCloseModalOpen(false)}
        onSubmit={handleForceCloseSubmit}
        selectedCount={selectedAlerts.length}
      />
    </div>
  );
}
