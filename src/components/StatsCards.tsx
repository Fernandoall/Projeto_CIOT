import { Truck, Route, DollarSign } from "lucide-react";
import { TransportOperation } from "@/types/transport";

interface StatsCardsProps {
  trips: TransportOperation[];
}

export function StatsCards({ trips }: StatsCardsProps) {
  const totalTrips = trips.length;
  const activeTrips = trips.filter((t) => t.status === "em_transito").length;
  const totalFrete = trips.reduce((acc, t) => acc + t.frete, 0);

  const stats = [
    {
      label: "Total Viagens",
      value: totalTrips.toString(),
      icon: Truck,
    },
    {
      label: "Rotas Ativas",
      value: activeTrips.toString(),
      icon: Route,
    },
    {
      label: "Frete Total",
      value: `R$ ${totalFrete.toLocaleString("pt-BR")}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </span>
            <stat.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary tabular-nums">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
