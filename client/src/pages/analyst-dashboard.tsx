import { useState, useEffect, useRef, Fragment } from "react";
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
  ArrowRightLeft,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import CustomerDetailsModal from "./CustomerDetailsModal";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { UnreviewedAccountsModal } from "@/components/UnreviewedAccountsModal";
import ForceCloseModal from "@/components/ForceCloseModal";
import { useToast } from "@/hooks/use-toast";
import { getAlertOverrides, setAlertOverride } from "@/hooks/use-alert-status";
import { getReassignments, REASSIGN_EVENT } from "@/hooks/use-reassignments";
import { ruleIndexFor, buildAlertIdShared } from "@/lib/alert-field-config";
import { ANALYST_NAMES } from "@/lib/analysts";
import {
  isAnalystOnline,
  ONLINE_EVENT,
} from "@/hooks/use-analyst-online";
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

// Mock data for demonstration

// Mock data for demonstration
// Mock data for demonstration
// One active alert per rule (Rule 1..9) so every rule's data-segregation can be
// verified on the analyst dashboard. Order maps directly: id "1" → Rule 1, …,
// id "9" → Rule 9 (via ruleIndexFor on alertSource).
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
    alertCode: "42301-26920823-3",
    customerName: "Obaid Mehmood",
    globalId: "42301-26920823-3",
    idType: "CNIC",
    alertCount: 3,
    amount: 15000.0,
    severity: "MEDIUM",
    status: "OPEN",
    city: "Lahore",
    createdAt: "2025-01-09T14:20:00Z",
    alertSource: "Rule #302 (Structuring)",
    channel: "IBFT",
  },
  {
    id: "3",
    alertCode: "P436691BNC141",
    customerName: "Abid Ali",
    globalId: "P436691BNC141",
    idType: "Passport",
    alertCount: 1,
    amount: 20000.0,
    severity: "LOW",
    status: "OPEN",
    city: "Islamabad",
    createdAt: "2025-01-08T09:15:00Z",
    alertSource: "Rule #404 (Large Transaction)",
    channel: "POS",
  },
  {
    id: "4",
    alertCode: "A987654XYZ210",
    customerName: "Ayesha Khan",
    globalId: "A987654XYZ210",
    idType: "CNIC",
    alertCount: 2,
    amount: 95000.0,
    severity: "HIGH",
    status: "OPEN",
    city: "Karachi",
    createdAt: "2025-01-07T16:45:00Z",
    alertSource: "Rule #55 (Multiple ATM Attempts)",
    channel: "ATM-On-Us",
  },
  {
    id: "5",
    alertCode: "B123456LMN987",
    customerName: "Zainab Ali",
    globalId: "B123456LMN987",
    idType: "Passport",
    alertCount: 1,
    amount: 50000.0,
    severity: "MEDIUM",
    status: "OPEN",
    city: "Multan",
    createdAt: "2025-01-06T11:30:00Z",
    alertSource: "Rule #12 (Off-us withdrawal pattern)",
    channel: "ATM-Of-Us",
  },
  {
    id: "6",
    alertCode: "C987654MNO321",
    customerName: "Fahad Mustafa",
    globalId: "C987654MNO321",
    idType: "CNIC",
    alertCount: 2,
    amount: 500000.0,
    severity: "HIGH",
    status: "OPEN",
    city: "Islamabad",
    createdAt: "2025-01-05T15:45:00Z",
    alertSource: "Rule #88 (Large Cash Tx)",
    channel: "Withdrawal",
  },
  {
    id: "7",
    alertCode: "P436691BNC142",
    customerName: "Salman Ahmed",
    globalId: "P436691BNC142",
    idType: "Passport",
    alertCount: 4,
    amount: 171450.0,
    severity: "HIGH",
    status: "OPEN",
    city: "Hyderabad",
    createdAt: "2025-01-09T08:15:00Z",
    alertSource: "AI Model (Unusual Location)",
    channel: "E-Commerce",
  },
  {
    id: "8",
    alertCode: "P436691BNC143",
    customerName: "Mustafa Mahmood",
    globalId: "P436691BNC143",
    idType: "Passport",
    alertCount: 5,
    amount: 75000.0,
    severity: "HIGH",
    status: "OPEN",
    city: "Karachi",
    createdAt: "2025-01-07T13:20:00Z",
    alertSource: "AI Model (Behavioral Anomaly)",
    channel: "IBFT",
  },
  {
    id: "9",
    alertCode: "B123456LM0123",
    customerName: "Zaheer Ali",
    globalId: "B123456LM0123",
    idType: "CNIC",
    alertCount: 1,
    amount: 50000.0,
    severity: "MEDIUM",
    status: "OPEN",
    city: "Karachi",
    createdAt: "2025-01-08T11:20:00Z",
    alertSource: "AI Model (Device Mismatch)",
    channel: "FT-Raast",
  },
  // Already-actioned demo alerts — they appear in the Closed/Fraud screen for
  // BOTH analyst and executive (they live in code, so they show in every
  // browser even when live cross-browser sync isn't available).
  {
    id: "10",
    alertCode: "A987654XYZ211",
    customerName: "Ayesha Khan",
    globalId: "A987654XYZ211",
    idType: "CNIC",
    alertCount: 1,
    amount: 95000.0,
    severity: "HIGH",
    status: "FRAUD",
    city: "Karachi",
    createdAt: "2025-01-04T10:00:00Z",
    alertSource: "Rule #55 (Multiple ATM Attempts)",
    channel: "ATM-On-Us",
  },
  {
    id: "11",
    alertCode: "P436691BNC144",
    customerName: "Salman Ahmed",
    globalId: "P436691BNC144",
    idType: "Passport",
    alertCount: 2,
    amount: 120000.0,
    severity: "MEDIUM",
    status: "RESOLVED",
    city: "Hyderabad",
    createdAt: "2025-01-03T11:00:00Z",
    alertSource: "AI Model (Unusual Location)",
    channel: "E-Commerce",
  },
  {
    id: "12",
    alertCode: "C987654MNO322",
    customerName: "Fahad Mustafa",
    globalId: "C987654MNO322",
    idType: "CNIC",
    alertCount: 1,
    amount: 300000.0,
    severity: "HIGH",
    status: "DISCARDED",
    city: "Islamabad",
    createdAt: "2025-01-02T12:00:00Z",
    alertSource: "Rule #88 (Large Cash Tx)",
    channel: "Withdrawal",
  },
  {
    id: "13",
    alertCode: "B123456LMN988",
    customerName: "Zaheer Ali",
    globalId: "B123456LMN988",
    idType: "CNIC",
    alertCount: 1,
    amount: 60000.0,
    severity: "MEDIUM",
    status: "NOT_CONTACTED",
    city: "Karachi",
    createdAt: "2025-01-01T09:30:00Z",
    alertSource: "AI Model (Device Mismatch)",
    channel: "FT-Raast",
  },
];

const ANALYSTS = ANALYST_NAMES;

// A channel group opens its own screen; its sub-channels become in-page tabs.
const CHANNEL_GROUPS: Record<string, string[]> = {
  Digital: ["FT-Raast", "IBFT", "Withdrawal"],
  ATM: ["ATM-On-Us", "ATM-Of-Us"],
  "E-Commerce": ["E-Commerce", "POS"],
};

export default function FraudDashboard({
  category,
  isExecutive = false,
}: {
  category?: string;
  isExecutive?: boolean;
}) {
  const { toast } = useToast();
  const { query: globalQuery, setPlaceholder } = useSearch();

  useEffect(() => {
    setPlaceholder("Search alerts (customer, CIF, alert source)...");
  }, [setPlaceholder]);

  const [alerts, setAlerts] = useState(() => {
    const overrides = getAlertOverrides();
    // Stable 6-digit customer number per customer (same name → same number).
    const custNumberFor = (name: string) =>
      100000 +
      (name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 899999);
    return initialAlerts.map((alert, i) => {
      const base = {
        ...alert,
        // Default lifecycle: an assigned alert starts as "Assigned" (not Open)
        // until the analyst actually opens it.
        status: alert.status === "OPEN" ? "ASSIGNED" : alert.status,
        analyst: ANALYSTS[i % ANALYSTS.length],
        customerNumber: custNumberFor(alert.customerName),
        movedToPendingAt: null as number | null,
        lastNotifiedAt: 0,
      };
      const ov = overrides[alert.id];
      return ov ? { ...base, ...ov } : base;
    });
  });

  // Keep this view in sync with actions taken elsewhere (e.g. an analyst
  // discarding an alert should show up in the executive's view).
  useEffect(() => {
    const sync = () => {
      const overrides = getAlertOverrides();
      setAlerts((prev) =>
        prev.map((a) => {
          const ov = overrides[a.id];
          return ov ? { ...a, ...ov } : a;
        }),
      );
    };
    window.addEventListener("alert-status-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("alert-status-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Reassignment notifications: when an executive reassigns an alert away from
  // an analyst, the analyst sees it disabled + a popup — WITHOUT the executive's
  // name. (Executives don't get these popups.)
  const reassignSeen = useRef<Set<string>>(new Set());
  const [reassignedCustomers, setReassignedCustomers] = useState<string[]>([]);

  useEffect(() => {
    if (isExecutive) return;
    const applyAndNotify = (initial: boolean) => {
      const list = getReassignments();
      setReassignedCustomers(list.map((r) => r.customerName));
      const fresh = list.filter((r) => !reassignSeen.current.has(r.id));
      fresh.forEach((r) => reassignSeen.current.add(r.id));
      if (fresh.length === 0) return;
      if (initial) {
        toast({
          title: "🔔 Alerts Reassigned",
          description: `${fresh.length} alert(s) have been reassigned away from you and disabled.`,
        });
      } else {
        fresh.forEach((r) =>
          toast({
            title: "🔔 Alert Reassigned",
            description: `${r.customerName}'s alert has been reassigned to ${r.toAnalyst} and removed from your active queue.`,
          }),
        );
      }
    };
    applyAndNotify(true);
    const onChange = () => applyAndNotify(false);
    window.addEventListener(REASSIGN_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(REASSIGN_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [isExecutive, toast]);

  // Re-render when analyst online status changes (login/logout in another tab).
  const [, forceOnlineTick] = useState(0);
  useEffect(() => {
    const onChange = () => forceOnlineTick((n) => n + 1);
    window.addEventListener(ONLINE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(ONLINE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

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

  // Stable, rule-based Alert ID (shared with the executive's Alert Assignments
  // so the SAME alert has the SAME id everywhere and can be searched by it).
  const buildAlertId = (alert: (typeof alerts)[number]) =>
    buildAlertIdShared(ruleIndexFor(alert.alertSource), alert.createdAt, alert.id);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cityFilter, setCityFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("All");
  // When a channel group (Digital/ATM/E-Commerce) is opened, the sub-channels
  // become in-page tabs. activeGroup = the group; subChannel = the picked tab.
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [subChannel, setSubChannel] = useState("All");
  // Initialise from the category so the Closed-Alerts filter applies on the very
  // first render — otherwise the active (OPEN) alerts flash in on refresh before
  // the filter kicks in and hides them.
  const [statusFilter, setStatusFilter] = useState<string | null>(
    category === "Closed-Alerts" ? "CLOSED_ALERTS" : null,
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  // The specific alert (parent OR child) whose status actions should change.
  const [actionAlertId, setActionAlertId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreviewedModalOpen, setUnreviewedModalOpen] = useState(false);
  const [isForceCloseModalOpen, setIsForceCloseModalOpen] = useState(false);
  const GROUP_PAGE_SIZE = 5;
  const [reopenTargetId, setReopenTargetId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [groupVisible, setGroupVisible] = useState<Record<string, number>>({});

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
    // Reset the visible window to the first page whenever a group is opened.
    setGroupVisible((prev) => ({ ...prev, [key]: GROUP_PAGE_SIZE }));
  };

  const showMoreInGroup = (key: string) => {
    setGroupVisible((prev) => ({
      ...prev,
      [key]: (prev[key] || GROUP_PAGE_SIZE) + GROUP_PAGE_SIZE,
    }));
  };

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

            // Pending-contact reminder fires after 10 minutes, then repeats
            // every 10 minutes until the alert is actioned.
            const threshold = 10; // minutes before the first reminder
            const repeatDelay = 10; // minutes between repeat reminders

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
    setSubChannel("All");
    if (category === "Closed-Alerts") {
      setActiveGroup(null);
      setSelectedChannel("All");
      setStatusFilter("CLOSED_ALERTS");
    } else if (category && CHANNEL_GROUPS[category]) {
      // A channel group screen (Digital / ATM / E-Commerce).
      setActiveGroup(category);
      setSelectedChannel("All");
      setStatusFilter(null);
    } else if (category && category !== "All") {
      // A specific channel (legacy deep link).
      setActiveGroup(null);
      setSelectedChannel(category);
      setStatusFilter(null);
    } else {
      setActiveGroup(null);
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
    // Suspend Account marks the account suspended WITHOUT closing the alert —
    // the alert stays active until the analyst closes it with Mark as Fraud.
    if (action === "SUSPEND_ACCOUNT") {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId ? { ...a, suspended: true } : a,
        ),
      );
      setAlertOverride(alertId, { suspended: true });
      return;
    }

    // Map the action to the resulting status and persist it to the shared
    // store so other views (analyst ⇄ executive) stay in sync.
    const statusMap: Record<string, string> = {
      NOT_CONTACTED: "NOT_CONTACTED",
      CONTACTED: "RESOLVED",
      FRAUD: "FRAUD",
      OPEN: "OPEN",
      DISCARDED: "DISCARDED",
      SUSPENDED: "SUSPENDED",
    };
    const newStatus = statusMap[action];

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
          if (newStatus) {
            return { ...alert, status: newStatus, movedToPendingAt: null };
          }
        }
        return alert;
      }),
    );

    if (newStatus) setAlertOverride(alertId, { status: newStatus });
  };

  const filteredAlerts = alerts.filter((alert) => {
    // Closed & Fraud Alerts screen (analyst AND executive): only alerts an
    // analyst has ACTIONED appear, and each row's status is exactly that action
    // — Fraud Confirmed, Not Fraud, Discarded, Account Suspended, or Pending
    // Customer Contact. A pending alert also stays in the analyst's active list.
    if (statusFilter === "CLOSED_ALERTS") {
      const actioned = [
        "FRAUD",
        "DISCARDED",
        "RESOLVED",
        "SUSPENDED",
        "NOT_CONTACTED",
      ];
      if (!actioned.includes(alert.status)) return false;
    } else if (!isExecutive) {
      if (statusFilter && alert.status !== statusFilter) {
        return false;
      }
      // Active view shows ONLY Assigned / Open. Any alert the analyst has
      // actioned — Fraud, Not Fraud, Discarded, Suspended or Pending Customer
      // Contact — leaves the active list and moves to the Closed/Fraud screen.
      if (
        !statusFilter &&
        (alert.status === "RESOLVED" ||
          alert.status === "FRAUD" ||
          alert.status === "DISCARDED" ||
          alert.status === "SUSPENDED" ||
          alert.status === "NOT_CONTACTED")
      )
        return false;
    }

    const matchesSearch =
      !searchQuery ||
      alert.globalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    // Top-bar (page-scoped) search — filters this page's alerts.
    const gq = globalQuery.trim().toLowerCase();
    const matchesGlobal =
      !gq ||
      alert.globalId.toLowerCase().includes(gq) ||
      alert.customerName.toLowerCase().includes(gq) ||
      alert.idType.toLowerCase().includes(gq) ||
      alert.alertSource.toLowerCase().includes(gq) ||
      (alert as any).analyst?.toLowerCase().includes(gq);

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

    let matchesChannel: boolean;
    if (activeGroup) {
      // Inside a channel group: restrict to the group's channels, then narrow
      // to the picked sub-channel tab.
      const groupChannels = CHANNEL_GROUPS[activeGroup] ?? [];
      matchesChannel =
        groupChannels.includes(alert.channel) &&
        (subChannel === "All" || alert.channel === subChannel);
    } else {
      matchesChannel =
        selectedChannel === "All" || alert.channel === selectedChannel;
    }

    return (
      matchesChannel &&
      matchesSearch &&
      matchesGlobal &&
      matchesCity &&
      matchesAmount
    );
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

  const openModal = (customerId: string, statusAlertId?: string) => {
    setSelectedCustomerId(customerId);
    setActionAlertId(statusAlertId ?? customerId);
    setIsModalOpen(true);
    // Opening an assigned alert moves ONLY that alert to "Open" (under review).
    // For a child (expanded) alert, statusAlertId is its own id so siblings are
    // unaffected. It won't close by itself — only an action closes it.
    const sid = statusAlertId ?? customerId;
    const parent = alerts.find((a) => a.id === sid);
    if (parent) {
      if (parent.status === "ASSIGNED") handleAlertAction(sid, "OPEN");
    } else {
      // Synthetic child alert — track its own status independently.
      const overrides = getAlertOverrides();
      if ((overrides[sid]?.status ?? "ASSIGNED") === "ASSIGNED") {
        setAlertOverride(sid, { status: "OPEN" });
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null);
    setActionAlertId(null);
  };

  // Status of any alert id — real parent (in state) or synthetic child (override).
  const statusOfAlert = (id: string | null) => {
    if (!id) return undefined;
    const parent = alerts.find((a) => a.id === id);
    if (parent) return parent.status;
    return getAlertOverrides()[id]?.status ?? "ASSIGNED";
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

  // Any customer whose Alert Count is greater than 1 becomes an expandable
  // row. The extra alerts (alertCount - 1) are shown in the dropdown, 5 at a
  // time. In this demo they are derived from the primary alert.
  const CHILD_SOURCES = [
    "Rule #105 (High Velocity)",
    "AI Model (Unusual Location)",
    "Rule #302 (Structuring)",
    "Rule #404 (Large Transaction)",
    "AI Model (Device Mismatch)",
    "AI Model (Behavioral Anomaly)",
  ];

  const buildChildAlerts = (alert: (typeof filteredAlerts)[number]) => {
    const childCount = Math.max(0, (alert.alertCount || 1) - 1);
    const base = new Date(alert.createdAt);
    // Each child is a SEPARATE alert with its OWN status (not inherited from
    // the parent). Its status is tracked independently in the shared store.
    const overrides = getAlertOverrides();
    return Array.from({ length: childCount }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() - (i + 1));
      const childId = `${alert.id}-sub-${i + 1}`;
      return {
        ...alert,
        id: childId,
        _modalId: alert.id,
        status: overrides[childId]?.status ?? "ASSIGNED",
        alertSource: CHILD_SOURCES[(i + 1) % CHILD_SOURCES.length],
        createdAt: d.toISOString(),
        alertCount: 1,
      };
    });
  };

  // Main-page fields derived from the alert source (per the segregation sheet:
  // Engine Type + Rule Number are separate columns).
  const engineTypeOf = (src = "") =>
    /rule\s*#/i.test(src) ? "Rule Based" : /ai model/i.test(src) ? "AI Model" : "—";
  const ruleNumberOf = (src = "") => {
    const m = src.match(/Rule\s*#?\s*(\d+)/i);
    if (m) return `Rule #${m[1]}`;
    const ai = src.match(/AI Model\s*\((.+)\)/i);
    return ai ? ai[1].trim() : "—";
  };
  const formatAlertDate = (iso: string) =>
    new Date(iso).toLocaleString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const renderAlertRow = (
    alert: (typeof filteredAlerts)[number],
    isChild = false,
    group?: { key: string; children: any[] },
    displayNumber?: number,
  ) => {
    const extraCount = group ? group.children.length : 0;
    const isExpanded = group ? expandedGroups.includes(group.key) : false;
    // Reassigned-away alerts are disabled for the analyst.
    const isReassigned =
      !isExecutive && reassignedCustomers.includes(alert.customerName);
    // Child (expanded) rows are more compact than primary rows.
    const cellPad = isChild ? "px-3 py-2" : "px-3 py-3.5";
    return (
      <tr
        key={alert.id}
        onClick={
          isReassigned
            ? undefined
            : () => openModal((alert as any)._modalId ?? alert.id, alert.id)
        }
        className={`border-b transition-colors ${
          isReassigned
            ? "bg-gray-50 opacity-50 cursor-not-allowed"
            : `cursor-pointer ${
                isChild
                  ? "bg-indigo-50/50 hover:bg-indigo-50"
                  : "bg-white hover:bg-gray-50"
              }`
        }`}
      >
        <td
          className={`${cellPad} ${
            isChild ? "border-l-4 border-indigo-300 pl-6" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={selectedAlerts.includes(alert.id)}
            onChange={() => toggleSelectAlert(alert.id)}
            onClick={(e) => e.stopPropagation()}
            disabled={isReassigned}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={`Select alert ${alert.id}`}
          />
        </td>
        <td
          className={`${cellPad} text-sm font-mono font-bold text-blue-600 hover:text-blue-800`}
        >
          <span className={isChild ? "pl-4 inline-block" : ""}>
            {buildAlertId(alert)}
          </span>
        </td>
        <td className={`${cellPad} font-medium text-gray-900`}>
          {alert.customerName}
        </td>
        <td className={`${cellPad} text-sm font-mono text-gray-700`}>
          {(alert as any).customerNumber ?? "—"}
        </td>
        <td className={cellPad}>
          <div className="space-y-1">
            <div className="font-mono font-bold text-sm text-gray-900">
              {alert.globalId}
            </div>
            <div className="text-xs text-blue-600 font-medium">
              ID Type: {alert.idType}
            </div>
          </div>
        </td>
        <td className={`${cellPad} text-sm font-medium text-gray-800`}>
          {engineTypeOf(alert.alertSource) === "AI Model"
            ? "—"
            : `Rule ${ruleIndexFor(alert.alertSource)}`}
        </td>
        <td className={cellPad}>
          <span
            className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${
              engineTypeOf(alert.alertSource) === "AI Model"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {engineTypeOf(alert.alertSource)}
          </span>
        </td>
        <td className={`${cellPad} text-sm text-gray-500`}>
          {formatAlertDate(alert.createdAt)}
        </td>
        <td className={`${cellPad} text-center`}>
          {isReassigned ? (
            <Badge className="bg-purple-500 text-white hover:bg-purple-600 border-0 rounded-md text-xs px-3 py-1">
              Reassigned
            </Badge>
          ) : (
            statusBadge(alert.status)
          )}
        </td>
        <td className={`${cellPad} text-center font-medium text-gray-900`}>
          {extraCount > 0 ? group!.children.length + 1 : alert.alertCount}
        </td>
        <td className={`${cellPad} text-right`}>
          {/* "Show more" child-expander only on the active list — the client
              did not request it on the Closed/Fraud screen. */}
          {extraCount > 0 && category !== "Closed-Alerts" ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleGroup(group!.key);
              }}
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
            >
              {isExpanded ? "Show less" : "Show more"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => e.stopPropagation()}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <span className="text-lg font-bold">⋮</span>
            </Button>
          )}
        </td>
      </tr>
    );
  };

  // ---- Executive (monitoring) view helpers ----
  const ruleLabel = (alertSource: string) => {
    const m = alertSource.match(/Rule\s*#?\s*(\d+)/i);
    return m ? `Rule ${m[1]}` : "AI Model";
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const statusBadge = (status: string) => {
    if (status === "FRAUD")
      return (
        <Badge className="bg-red-500 text-white hover:bg-red-600 border-0 rounded-md text-xs px-2 py-1 leading-tight">
          Closed (Fraud Confirmed)
        </Badge>
      );
    if (status === "DISCARDED")
      return (
        <Badge className="bg-gray-500 text-white hover:bg-gray-600 border-0 rounded-md text-xs px-2 py-1 leading-tight">
          Discarded
        </Badge>
      );
    if (status === "RESOLVED")
      return (
        <Badge className="bg-green-500 text-white hover:bg-green-600 border-0 rounded-md text-xs px-2 py-1 leading-tight">
          Closed (Not Fraud)
        </Badge>
      );
    if (status === "NOT_CONTACTED")
      return (
        <Badge className="bg-amber-500 text-white hover:bg-amber-600 border-0 rounded-md text-xs px-2 py-1 leading-tight">
          Pending
        </Badge>
      );
    if (status === "SUSPENDED")
      return (
        <Badge className="bg-orange-600 text-white hover:bg-orange-700 border-0 rounded-md text-xs px-2 py-1 leading-tight">
          Account Suspended
        </Badge>
      );
    if (status === "ASSIGNED")
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 rounded-md text-xs px-2 py-1 leading-tight">
          Assigned
        </Badge>
      );
    return (
      <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-300 border-0 rounded-md text-xs px-2 py-1 leading-tight">
        Open
      </Badge>
    );
  };

  const handleReassignAnalyst = (alertId: string, name: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, analyst: name } : a)),
    );
    setAlertOverride(alertId, { analyst: name });
    toast({
      title: "Alert reassigned",
      description: `Alert has been reassigned to ${name}.`,
    });
  };

  const handleReopenAlert = (alertId: string) => {
    handleAlertAction(alertId, "OPEN");
    toast({
      title: "Alert reopened",
      description: "The alert has been reopened and is active again.",
    });
  };

  const isClosedStatus = (status: string) =>
    status === "FRAUD" ||
    status === "DISCARDED" ||
    status === "RESOLVED" ||
    status === "SUSPENDED";

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 overflow-x-hidden">
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
              : activeGroup
                ? `${activeGroup} Alerts`
                : "Active Alerts List"}
          </CardTitle>
          {/* Total Alerts count lives on the dashboard (client PDF pt.8/10,
              sheet row 7) — not on the alert-list header. */}
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

            {/* Channel Filter — inside a group the options are that group's sub-channels */}
            <div className="space-y-2 min-w-0">
              <label className="text-[13px] font-semibold text-slate-500">
                Channel
              </label>
              {activeGroup ? (
                <Select value={subChannel} onValueChange={setSubChannel}>
                  <SelectTrigger className="w-full h-10 border-gray-200 focus:ring-blue-500/10 focus:border-blue-500 rounded-lg text-sm">
                    <SelectValue placeholder="Choose channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All {activeGroup}</SelectItem>
                    {(CHANNEL_GROUPS[activeGroup] ?? []).map((ch) => (
                      <SelectItem key={ch} value={ch}>
                        {ch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
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
              )}
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

          {/* Executive monitoring table */}
          {isExecutive && (
            <div className="overflow-x-auto border rounded-xl shadow-sm">
              <table className="w-full min-w-[1120px] bg-white">
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
                        aria-label="Select all alerts"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                      Alert ID
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                      Customer
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                      CNIC / Passport No
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                      Rule
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                      Engine Type
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                      Assigned To
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                      Date / Time
                    </th>
                    <th className="p-4 text-center font-medium text-gray-900 text-sm">
                      Status
                    </th>
                    <th className="p-4 text-right font-medium text-gray-900 text-sm">
                      Reassign / Reopen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="p-8 text-center text-gray-500"
                      >
                        No alerts found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredAlerts.map((alert, index) => {
                      const online = isAnalystOnline((alert as any).analyst);
                      const closed = isClosedStatus(alert.status);
                      return (
                        <tr
                          key={alert.id}
                          className="border-b bg-white align-top hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedAlerts.includes(alert.id)}
                              onChange={() => toggleSelectAlert(alert.id)}
                              aria-label={`Select alert ${alert.id}`}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td
                            onClick={() => openModal(alert.id)}
                            className="p-4 text-sm font-mono font-bold text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap"
                          >
                            {buildAlertId(alert)}
                          </td>
                          <td className="p-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {alert.customerName}
                          </td>
                          <td className="p-4">
                            <div className="font-mono font-bold text-sm text-gray-900">
                              {alert.globalId}
                            </div>
                            <div className="text-xs text-blue-600 font-medium">
                              ID Type: {alert.idType}
                            </div>
                          </td>
                          <td className="p-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                            {engineTypeOf(alert.alertSource) === "AI Model"
                              ? "—"
                              : `Rule ${ruleIndexFor(alert.alertSource)}`}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${
                                engineTypeOf(alert.alertSource) === "AI Model"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {engineTypeOf(alert.alertSource)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
                                {((alert as any).analyst || "?")
                                  .split(" ")
                                  .map((w: string) => w[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                  {(alert as any).analyst || "—"}
                                </div>
                                <div
                                  className={`flex items-center gap-1 text-[11px] font-medium ${
                                    online ? "text-green-600" : "text-gray-400"
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      online ? "bg-green-500" : "bg-gray-400"
                                    }`}
                                  />
                                  {online ? "Online" : "Offline"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                            {formatDateTime(alert.createdAt)}
                          </td>
                          <td className="p-4 text-center">
                            {statusBadge(alert.status)}
                          </td>
                          <td className="p-4">
                            <div className="flex w-[170px] flex-col gap-1.5">
                              <Select
                                value={(alert as any).analyst}
                                onValueChange={(v) =>
                                  handleReassignAnalyst(alert.id, v)
                                }
                              >
                                <SelectTrigger className="h-8 w-full bg-white text-xs">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <ArrowRightLeft className="h-3.5 w-3.5 shrink-0 text-[#46CDCF]" />
                                    <SelectValue />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {ANALYSTS.map((name) => (
                                    <SelectItem key={name} value={name}>
                                      {name}
                                      {name === (alert as any).analyst
                                        ? " (current)"
                                        : ""}
                                      {!isAnalystOnline(name)
                                        ? " — offline"
                                        : ""}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {closed && (
                                <Button
                                  size="sm"
                                  onClick={() => setReopenTargetId(alert.id)}
                                  className="h-8 w-full gap-1.5 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  Reopen
                                </Button>
                              )}
                              {closed && !online && (
                                <p className="flex items-start gap-1 text-[10px] leading-tight text-amber-600">
                                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                                  Owner offline — stays assigned till they return.
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Alerts Table */}
          {!isExecutive && (
          <div className="overflow-x-auto border rounded-xl shadow-sm">
            <table className="w-full min-w-[880px] bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="w-8 px-2 py-3 text-left">
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
                  <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                    Alert ID
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                    Customer Name
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                    Customer Number
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                    CNIC/NICOP/Passport No.
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                    Rule Number
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                    Engine Type
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-gray-900 text-sm">
                    Alert Timestamp
                  </th>
                  <th className="px-2 py-3 font-medium text-gray-900 text-sm text-center">
                    Status
                  </th>
                  <th className="px-2 py-3 font-medium text-gray-900 text-sm text-center">
                    Alert Count
                  </th>
                  <th className="px-2 py-3 font-medium text-gray-900 text-sm text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-gray-500">
                      No alerts found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert, index) => {
                    const hasChildren = (alert.alertCount || 1) > 1;
                    const children = hasChildren ? buildChildAlerts(alert) : [];
                    const group = hasChildren
                      ? { key: alert.id, children }
                      : undefined;
                    const isExpanded =
                      hasChildren && expandedGroups.includes(alert.id);
                    const visible = groupVisible[alert.id] || GROUP_PAGE_SIZE;
                    const shownChildren = isExpanded
                      ? children.slice(0, visible)
                      : [];
                    const remaining = children.length - shownChildren.length;
                    const baseNo = index + 1;
                    return (
                      <Fragment key={alert.id}>
                        {renderAlertRow(alert, false, group, baseNo)}

                        {isExpanded &&
                          shownChildren.map((child, i) =>
                            renderAlertRow(
                              child,
                              true,
                              undefined,
                              baseNo * 100 + i + 1,
                            ),
                          )}

                        {isExpanded && remaining > 0 && (
                          <tr className="border-b bg-slate-50/70">
                            <td className="border-l-4 border-blue-300 p-0" />
                            <td colSpan={10} className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => showMoreInGroup(alert.id)}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
                              >
                                <ChevronDown className="h-4 w-4" />
                                Show {Math.min(GROUP_PAGE_SIZE, remaining)} more
                                {remaining > GROUP_PAGE_SIZE
                                  ? ` (${remaining} remaining)`
                                  : ""}
                              </button>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          )}

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
        onAction={(_, action, data) =>
          handleAlertAction(actionAlertId ?? selectedCustomerId ?? "", action, data)
        }
        alertStatus={statusOfAlert(actionAlertId)}
        rule={ruleIndexFor(
          alerts.find((a) => a.id === selectedCustomerId)?.alertSource,
        )}
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

      {/* Reopen confirmation */}
      <AlertDialog
        open={reopenTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setReopenTargetId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reopen this alert?</AlertDialogTitle>
            <AlertDialogDescription>
              {(() => {
                const target = alerts.find((a) => a.id === reopenTargetId);
                return target
                  ? `This will move ${target.customerName}'s alert back to an active (Open) state. Are you sure you want to reopen it?`
                  : "This will move the alert back to an active (Open) state.";
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                if (reopenTargetId) handleReopenAlert(reopenTargetId);
                setReopenTargetId(null);
              }}
            >
              Confirm Reopen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
