import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Settings,
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
      name: "Negative DB Upload",
      href: "/files",
      icon: FolderUp,
      roles: ["BUSINESS_HEAD", "SUPER_EXECUTIVE"],
    },
    {
      name: "Management",
      icon: Shield,
      roles: ["BUSINESS_HEAD", "SUPER_EXECUTIVE"],
      children: [
        {
          name: "Team Management",
          href: "/team-management",
          roles: ["BUSINESS_HEAD", "SUPER_EXECUTIVE"],
        },
        {
          name: "Case Management",
          href: "/case-management",
          roles: ["BUSINESS_HEAD", "SUPER_EXECUTIVE"],
        },
      ],
    },
    {
      name: "Super Admin",
      href: "/super-admin",
      icon: ShieldCheck,
      roles: ["SUPER_EXECUTIVE"],
    },
    { name: "All Accounts", icon: UsersRound, roles: ["ANALYST"] }, //href: "/accounts",
    { name: "Frauds", icon: Ban, roles: ["BUSINESS_HEAD", "SUPER_EXECUTIVE"] }, //href: "/frauds",
    {
      name: "Alerts",
      icon: AlertTriangle,
      roles: ["BUSINESS_HEAD", "SUPER_EXECUTIVE"],
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
      roles: ["BUSINESS_HEAD", "SUPER_EXECUTIVE"],
    }, //href: "/integrations",
    {
      name: "All Transactions",
      href: "/transactions",
      icon: BadgeDollarSign,
      roles: ["ANALYST"],
    },
    {
      name: "Closed/Fraud Alerts",
      href: "/category/Closed-Alerts",
      icon: Ban,
      roles: ["ANALYST", "BUSINESS_HEAD", "SUPER_EXECUTIVE"],
    },
    {
      name: "FT, Raast",
      href: "/category/FT-Raast",
      icon: ArrowRightLeft,
      roles: ["ANALYST"],
    },
    {
      name: "IBFT",
      href: "/category/IBFT",
      icon: Landmark,
      roles: ["ANALYST"],
    },
    {
      name: "POS",
      href: "/category/POS",
      icon: CreditCard,
      roles: ["ANALYST"],
    },
    {
      name: "E-Commerce",
      href: "/category/E-Commerce",
      icon: ShoppingBag,
      roles: ["ANALYST"],
    },
    {
      name: "Withdrawal",
      href: "/category/Withdrawal",
      icon: CreditCard,
      roles: ["ANALYST"],
    },
    {
      name: "ATM withdrawal (On-us)",
      href: "/category/ATM-On-Us",
      icon: ArrowRightLeft,
      roles: ["ANALYST"],
      isSubItem: true,
    },
    {
      name: "ATM diff Atm (Of-us)",
      href: "/category/ATM-Of-Us",
      icon: ArrowRightLeft,
      roles: ["ANALYST"],
      isSubItem: true,
    },
  ];

  const handleLogout = () => {
    logout(); // ✅ call dummy logout
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
              .filter((item) => item.roles.includes(user?.role ?? ""))
              .map((item: any) => {
                // Dropdown group (e.g. Management → Team / Case Management)
                if (item.children) {
                  const visibleChildren = item.children.filter((c: any) =>
                    c.roles.includes(user?.role ?? ""),
                  );
                  if (visibleChildren.length === 0) return null;
                  const childActive = visibleChildren.some((c: any) =>
                    location.startsWith(c.href),
                  );
                  const open = openMenus[item.name] ?? childActive;
                  return (
                    <div key={item.name}>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenus((m) => ({
                            ...m,
                            [item.name]: !(m[item.name] ?? childActive),
                          }))
                        }
                        className={cn(
                          "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                          childActive
                            ? "text-white"
                            : "text-slate-300 hover:bg-slate-700",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.name}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            open ? "rotate-180" : "",
                          )}
                        />
                      </button>
                      {open && (
                        <div className="mt-1 space-y-1">
                          {visibleChildren.map((c: any) => {
                            const active = location.startsWith(c.href);
                            return (
                              <Link key={c.name} href={c.href}>
                                <a
                                  onClick={() => setIsOpen(false)}
                                  className={cn(
                                    "flex items-center space-x-3 py-2.5 rounded-lg transition-colors pl-12 text-sm border-l border-slate-700 ml-4 rounded-l-none",
                                    active
                                      ? "bg-[#46CDCF] text-white"
                                      : "text-slate-300 hover:bg-slate-700",
                                  )}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                                  <span className="flex-1 text-sm font-medium">
                                    {c.name}
                                  </span>
                                </a>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive =
                  item.href &&
                  (location === item.href ||
                    (item.href !== "/" && location.startsWith(item.href)));

                return item.href ? (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-[#46CDCF] text-white"
                          : "text-slate-300 hover:bg-slate-700",
                        item.isSubItem
                          ? "pl-12 text-sm border-l border-slate-700 ml-4 rounded-l-none"
                          : "",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {!item.isSubItem && <item.icon className="h-5 w-5" />}
                      {item.isSubItem && (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                      )}
                      <span className="flex-1 text-sm font-medium">
                        {item.name}
                      </span>
                    </a>
                  </Link>
                ) : (
                  <div
                    key={item.name}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-slate-300 cursor-not-allowed opacity-60",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1 text-sm font-medium">
                      {item.name}
                    </span>
                  </div>
                );
              })}
          </nav>

          {/* Bottom Settings + User + Logout */}
          <div className="p-4 space-y-2 mt-auto shrink-0 border-t border-slate-700/50 bg-[#0F152D]">
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 transition-colors">
              <Settings className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium truncate">
                Setting
              </span>
            </button>
            <div className="w-full flex items-center gap-3 p-2 rounded-lg bg-slate-800">
              <img
                src={userImage}
                alt="User"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              {/* <span className="text-white text-sm font-medium truncate">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || "User"}
              </span> */}
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
