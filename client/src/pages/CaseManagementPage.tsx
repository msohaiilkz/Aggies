import { useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useSearch } from "@/hooks/use-search";
import { CaseManagementContent } from "./reports-page";

export default function CaseManagementPage() {
  const { setPlaceholder } = useSearch();

  useEffect(() => {
    setPlaceholder("Search cases (Case ID, type, agent)...");
  }, [setPlaceholder]);

  return (
    <MainLayout title="Case Management">
      <div className="flex flex-col min-h-screen bg-transparent">
        <div className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Case Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Allocate and manage pending fraud cases
            </p>
          </div>
          <CaseManagementContent />
        </div>
      </div>
    </MainLayout>
  );
}
