import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  AlertTriangle,
  Ban,
  BarChart3,
  Gauge,
  Plug,
  Menu,
  LayoutDashboard,
  ChartNoAxesCombined,
  Waypoints,
  UsersRound,
  BadgeDollarSign,
  LogOut,
  ArrowRightLeft,
  CreditCard,
  ShoppingBag,
  Shield,
  Landmark,
  ShieldCheck,
  FolderUp,
  ChevronDown,
  ClipboardList,
  Layers,
  KeyRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useState } from "react";
import logo from "../../assets/Original-Logo.png";
import userImage from "../../assets/Avatars.png";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth(); // ✅ dummy logout
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // 🔹 Single navigation array with role info
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      roles: ["BUSINESS_HEAD", "ANALYST", "SUPER_EXECUTIVE"],
    },
    {
      name: "Files",
      href: "/files",
      icon: FolderUp,
      roles: ["BUSINESS_HEAD", "SUPER_EXECUTIVE"],
    },
    {
      name: "Alert Assignments",
      href: "/alert-assignments",
      icon: ClipboardList,
      roles: ["BUSINESS_HEAD", "SUPER_EXECUTIVE"],
    },
    {
      name: "User Management",
      href: "/team-management",
      icon: UsersRound,
      roles: ["BUSINESS_HEAD", "SUPER_EXECUTIVE"],
    },
    {
      name: "Super Admin",
      href: "/super-admin",
      icon: ShieldCheck,
      roles: ["SUPER_EXECUTIVE"],
    },
    {
      name: "File Upload",
      href: "/files",
      icon: FolderUp,
      roles: ["ANALYST"],
    },
    { name: "Frauds", icon: Ban, roles: [] }, //href: "/frauds",
    {
      name: "Alerts",
      icon: AlertTriangle,
      roles: [],
    }, // href: "/alerts",
    {
      name: "Reports & Analysis",
      href: "/reports",
      icon: ChartNoAxesCombined,
      roles: ["BUSINESS_HEAD", "ANALYST", "SUPER_EXECUTIVE"],
    },
    {
      name: "System Performance",
      href: "/performance",
      icon: Gauge,
      roles: [], // hidden for now
    },
    {
      name: "Integrations",
      icon: Waypoints,
      roles: [],
    }, //href: "/integrations",
    {
      name: "Channel",
      icon: Layers,
      roles: ["ANALYST"],
      children: [
        { name: "All Alert", href: "/category/All", roles: ["ANALYST"] },
        { name: "Digital", href: "/category/Digital", roles: ["ANALYST"] },
        { name: "ATM", href: "/category/ATM", roles: ["ANALYST"] },
        { name: "E-Commerce", href: "/category/E-Commerce", roles: ["ANALYST"] },
      ],
    },
    {
      name: "Closed/Fraud Alerts",
      href: "/category/Closed-Alerts",
      icon: Ban,
      roles: ["ANALYST", "BUSINESS_HEAD", "SUPER_EXECUTIVE"],
    },
    {
      name: "Change Password",
      href: "/change-password",
      icon: KeyRound,
      roles: ["ANALYST"],
    },
  ];

  const handleLogout = () => {
    logout(); // ✅ call dummy logout
  };

  const role = user?.role ?? "";
  const isHrefActive = (href?: string) =>
    !!href &&
    (location === href || (href !== "/" && location.startsWith(href)));
  const hasActive = (item: any): boolean =>
    item.children
      ? item.children.some((c: any) => hasActive(c))
      : isHrefActive(item.href);

  // Recursive nav renderer — supports nested dropdowns (Channel → Digital → …)
  const renderItem = (item: any, depth = 0) => {
    if (item.roles && !item.roles.includes(role)) return null;

    // Group with children → collapsible
    if (item.children) {
      const visible = item.children.filter(
        (c: any) => !c.roles || c.roles.includes(role),
      );
      if (visible.length === 0) return null;
      const active = hasActive(item);
      const open = openMenus[item.name] ?? active;
      const Icon = item.icon;
      return (
        <div key={item.name}>
          <button
            type="button"
            onClick={() =>
              setOpenMenus((m) => ({
                ...m,
                [item.name]: !(m[item.name] ?? active),
              }))
            }
            className={cn(
              "w-full flex items-center gap-3 py-2.5 rounded-lg transition-colors",
              depth === 0 ? "px-4" : "pr-4",
              active ? "text-white" : "text-slate-300 hover:bg-slate-700",
            )}
            style={depth > 0 ? { paddingLeft: `${depth * 20 + 16}px` } : undefined}
          >
            {depth === 0 && Icon ? (
              <Icon className="h-5 w-5 shrink-0" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
            )}
            <span className="flex-1 text-left text-sm font-medium">
              {item.name}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform",
                open ? "rotate-180" : "",
              )}
            />
          </button>
          {open && (
            <div className="mt-1 space-y-1">
              {visible.map((c: any) => renderItem(c, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf with href
    const Icon = item.icon;
    const active = isHrefActive(item.href);
    if (item.href) {
      return (
        <Link key={item.name} href={item.href}>
          <a
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 py-2.5 rounded-lg transition-colors",
              depth === 0 ? "px-4" : "pr-4",
              active
                ? "bg-[#46CDCF] text-white"
                : "text-slate-300 hover:bg-slate-700",
            )}
            style={
              depth > 0 ? { paddingLeft: `${depth * 20 + 16}px` } : undefined
            }
          >
            {depth === 0 && Icon ? (
              <Icon className="h-5 w-5 shrink-0" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
            )}
            <span className="flex-1 text-sm font-medium">{item.name}</span>
          </a>
        </Link>
      );
    }

    // Leaf without href → disabled
    return (
      <div
        key={item.name}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 cursor-not-allowed opacity-60"
      >
        {Icon && <Icon className="h-5 w-5 shrink-0" />}
        <span className="flex-1 text-sm font-medium">{item.name}</span>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-[#0F152D] border-r border-slate-200 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 shrink-0 flex flex-col items-center">
            <img src={logo} alt="logo" className="max-h-12 w-auto" />
            <div className="border-b pt-6 border-slate-700"></div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {navigation
              .filter((item: any) => item.roles.includes(user?.role ?? ""))
              .map((item: any) => renderItem(item, 0))}
          </nav>

          {/* Bottom User + Logout */}
          <div className="p-4 space-y-2 mt-auto shrink-0 border-t border-slate-700/50 bg-[#0F152D]">
            <div className="w-full flex items-center gap-3 p-2 rounded-lg bg-slate-800">
              <img
                src={userImage}
                alt="User"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-semibold truncate capitalize">
                  {user?.username || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[11px] font-medium text-[#46CDCF] truncate">
                  {user?.role === "SUPER_EXECUTIVE"
                    ? "Super Admin"
                    : user?.role === "BUSINESS_HEAD"
                      ? "Executive"
                      : user?.role === "ANALYST"
                        ? "Analyst"
                        : ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium truncate">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
