import { useAuth } from "@/hooks/use-auth";
import BusinessDashboard from "./business-dashboard";
import AnalystDashboard from "./analyst-dashboard";
import { MainLayout } from "@/components/layout/main-layout";

export default function HomePage({
  params,
}: {
  params?: { category?: string };
}) {
  const { user } = useAuth();

  const getPageTitle = () => {
    if (params?.category === "Closed-Alerts") {
      return "Closed & Fraud Alerts";
    }
    if (user?.role === "BUSINESS_HEAD" || user?.role === "SUPER_EXECUTIVE") {
      return "Fraud Insights";
    }
    return "Alert Management";
  };

  return (
    <MainLayout title={getPageTitle()}>
      {(user?.role === "BUSINESS_HEAD" || user?.role === "SUPER_EXECUTIVE") &&
      params?.category !== "Closed-Alerts" ? (
        <BusinessDashboard />
      ) : (
        <AnalystDashboard category={params?.category} />
      )}
    </MainLayout>
  );
}
