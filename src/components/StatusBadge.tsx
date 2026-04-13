import { TripStatus } from "@/types/transport";

const statusConfig: Record<TripStatus, { label: string; className: string }> = {
  em_transito: { label: "Em Trânsito", className: "bg-warning/20 text-warning" },
  concluida: { label: "Concluída", className: "bg-success/20 text-success" },
  atrasada: { label: "Atrasada", className: "bg-destructive/20 text-destructive" },
  agendada: { label: "Agendada", className: "bg-primary/20 text-primary" },
  cancelada: { label: "Cancelada", className: "bg-muted text-muted-foreground" },
};

const ciotConfig: Record<string, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-muted text-muted-foreground" },
  emitido: { label: "Emitido", className: "bg-primary/20 text-primary" },
  encerrado: { label: "Encerrado", className: "bg-success/20 text-success" },
  cancelado: { label: "Cancelado", className: "bg-destructive/20 text-destructive" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as TripStatus] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export function CiotBadge({ status }: { status: string }) {
  const config = ciotConfig[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
