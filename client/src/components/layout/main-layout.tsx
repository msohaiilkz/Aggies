import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  showDateFilter?: boolean;
}

export function MainLayout({
  children,
  title,
  showDateFilter = true,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Overlay for mobile is now handled by Sidebar's backdrop logic or we can keep it here */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 min-h-screen flex flex-col">
        <Header
          title={title}
          showDateFilter={showDateFilter}
          onMenuClick={toggleSidebar}
        />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
