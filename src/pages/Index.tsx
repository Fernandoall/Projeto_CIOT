import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StatsCards } from "@/components/StatsCards";
import { TripsTable } from "@/components/TripsTable";
import { NewOperationDialog } from "@/components/NewOperationDialog";
import { useViagens } from "@/hooks/useTransport";
import { ViagemComRelacoes } from "@/types/transport";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: trips = [], isLoading } = useViagens();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border">
            <div className="flex items-center gap-2 md:gap-4">
              <SidebarTrigger />
              <h1 className="text-lg md:text-2xl font-semibold text-primary">Dashboard</h1>
            </div>
            <NewOperationDialog tripCount={trips.length} />
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <StatsCards trips={trips as ViagemComRelacoes[]} />
                <TripsTable trips={trips as ViagemComRelacoes[]} />
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
