import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout";
import { LanguageProvider } from "@/lib/i18n";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import DrugsList from "@/pages/drugs";
import DrugDetail from "@/pages/drug-detail";
import Interactions from "@/pages/interactions";
import SymptomsPredictor from "@/pages/symptoms";
import AdrReportForm from "@/pages/adr-report";
import Chatbot from "@/pages/chatbot";
import DoctorMode from "@/pages/doctor";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/drugs" component={DrugsList} />
        <Route path="/drugs/:id" component={DrugDetail} />
        <Route path="/interactions" component={Interactions} />
        <Route path="/symptoms" component={SymptomsPredictor} />
        <Route path="/adr-report" component={AdrReportForm} />
        <Route path="/chatbot" component={Chatbot} />
        <Route path="/doctor" component={DoctorMode} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </LanguageProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
