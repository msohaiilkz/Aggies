import { MainLayout } from "@/components/layout/main-layout";
import { AlertControlPanel } from "@/components/AlertControlPanel";

export default function AlertAssignmentsPage() {
  return (
    <MainLayout title="Alert Assignments">
      <div className="flex flex-col min-h-screen bg-transparent">
        <div className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Alert Assignments
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage per-analyst capacity and assign or reassign active alert
              workload.
            </p>
          </div>
          <AlertControlPanel />
        </div>
      </div>
    </MainLayout>
  );
}
