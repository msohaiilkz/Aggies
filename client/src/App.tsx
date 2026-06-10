import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import PerformancePage from "@/pages/PerformancePage";
import Transactions from "@/pages/TransactionsTable";
import ReportsPage from "@/pages/reports-page";
import TeamManagementPage from "@/pages/TeamManagementPage";
import SuperAdminPage from "@/pages/SuperAdminPage";
import FilesPage from "@/pages/files-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/category/:category" component={HomePage} />
      <ProtectedRoute path="/performance" component={PerformancePage} />
      <ProtectedRoute path="/transactions" component={Transactions} />
      <ProtectedRoute path="/team-management" component={TeamManagementPage} />
      <ProtectedRoute path="/super-admin" component={SuperAdminPage} />
      <ProtectedRoute path="/reports" component={ReportsPage} />
      <ProtectedRoute path="/files" component={FilesPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
