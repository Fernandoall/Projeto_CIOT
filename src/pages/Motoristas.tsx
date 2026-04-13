import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Users } from "lucide-react";

const Motoristas = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex items-center px-6 py-4 border-b border-border">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold text-primary ml-4">Motoristas</h1>
          </header>
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center space-y-4">
              <Users className="h-16 w-16 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Gestão de Motoristas</h2>
              <p className="text-muted-foreground max-w-md">
                Em breve você poderá cadastrar e gerenciar motoristas aqui.
              </p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Motoristas;
