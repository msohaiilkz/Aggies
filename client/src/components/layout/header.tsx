import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, ChevronDown, Bell } from "lucide-react";
import { FaGlobe } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

interface HeaderProps {
  title: string;
  showDateFilter?: boolean;
  onMenuClick?: () => void;
  notifications?: Notification[];
}

export function Header({
  title,
  showDateFilter = true,
  onMenuClick,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "System Alert",
      description: "New high-risk transaction detected in IBFT.",
      time: "2 mins ago",
      isRead: false,
    },
    {
      id: "2",
      title: "Follow-up Reminder",
      description: "Customer Kelvin Harris is pending contact for 30m.",
      time: "15 mins ago",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <header
      className="bg-white border-b border-slate-200 px-4 py-3"
      data-testid="header"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-slate-600"
            onClick={onMenuClick}
            data-testid="button-menu-toggle"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
            {title}
          </h1>
        </div>

        {/* Search Box */}
        <div className="relative flex-1 min-w-[180px] max-w-full sm:max-w-sm md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-slate-50 border-gray-200 rounded-lg focus:ring-blue-500/10 focus:border-blue-500"
            data-testid="input-global-search"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-600 relative hover:bg-gray-100 rounded-full"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] text-blue-600 h-auto p-0 hover:bg-transparent"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-4 border-b last:border-0 hover:bg-gray-50 transition-colors cursor-pointer",
                        !n.isRead && "bg-blue-50/30",
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-gray-900">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t text-center">
                <Button
                  variant="ghost"
                  className="w-full text-[10px] text-gray-500 hover:bg-gray-50 h-8"
                >
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="relative inline-block">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <FaGlobe className="text-gray-500 text-lg" />
              <span>English</span>
              <ChevronDown
                className={`w-4 h-4 ml-1 text-gray-400 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown menu */}
            {isLangOpen && (
              <>
                {/* Invisible overlay to close when clicking outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden ring-1 ring-black ring-opacity-5">
                  <button
                    className="flex w-full items-center px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm font-medium text-gray-700"
                    onClick={() => setIsLangOpen(false)}
                  >
                    English
                  </button>
                  <button
                    className="flex w-full items-center px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm font-medium text-gray-700"
                    onClick={() => setIsLangOpen(false)}
                  >
                    Urdu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
