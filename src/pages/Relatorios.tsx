import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FileText } from "lucide-react";

const Relatorios = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center px-4 md:px-6 py-3 md:py-4 border-b border-border">
            <SidebarTrigger />
            <h1 className="text-lg md:text-2xl font-semibold text-primary ml-2 md:ml-4">Relatórios</h1>
          </header>
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Relatórios</h2>
              <p className="text-muted-foreground max-w-md text-sm md:text-base">
                Em breve você poderá gerar relatórios de operações aqui.
              </p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Relatorios;
