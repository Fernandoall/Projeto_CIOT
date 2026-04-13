import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StatsCards } from "@/components/StatsCards";
import { TripsTable } from "@/components/TripsTable";
import { NewOperationDialog } from "@/components/NewOperationDialog";
import { useTrips, useAddTrip } from "@/hooks/useTrips";
import { TransportOperation } from "@/types/transport";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: trips = [], isLoading } = useTrips();
  const addTrip = useAddTrip();

  const handleAddTrip = (newTrip: TransportOperation) => {
    addTrip.mutate(newTrip);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold text-primary">
                Painel de Viagens
              </h1>
            </div>
            <NewOperationDialog onAdd={handleAddTrip} tripCount={trips.length} />
          </header>
          <main className="flex-1 p-6 overflow-y-auto space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <StatsCards trips={trips} />
                <TripsTable trips={trips} />
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
