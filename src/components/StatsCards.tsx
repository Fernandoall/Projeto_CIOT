import { Truck, Route, DollarSign, Calendar } from "lucide-react";
import { ViagemComRelacoes } from "@/types/transport";

interface StatsCardsProps {
  trips: ViagemComRelacoes[];
}

export function StatsCards({ trips }: StatsCardsProps) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const tripsThisMonth = trips.filter((t) => {
    const d = new Date(t.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalFreteMonth = tripsThisMonth.reduce((acc, t) => acc + Number(t.frete), 0);
  const activeTrips = trips.filter((t) => t.status === "em_transito").length;
  const completedMonth = tripsThisMonth.filter((t) => t.status === "concluida").length;

  const stats = [
    { label: "Viagens no Mês", value: tripsThisMonth.length.toString(), icon: Calendar },
    { label: "Rotas Ativas", value: activeTrips.toString(), icon: Route },
    { label: "Concluídas no Mês", value: completedMonth.toString(), icon: Truck },
    {
      label: "Frete Total do Mês",
      value: totalFreteMonth.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-border bg-card p-4 md:p-5">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <span className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</span>
            <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
          <div className="text-xl md:text-3xl font-bold text-primary tabular-nums">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
