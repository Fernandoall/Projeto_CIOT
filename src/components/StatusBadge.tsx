import { TripStatus } from "@/types/transport";

const statusConfig: Record<TripStatus, { label: string; className: string }> = {
  em_transito: {
    label: "Em Trânsito",
    className: "bg-warning/20 text-warning",
  },
  concluida: {
    label: "Concluída",
    className: "bg-success/20 text-success",
  },
  atrasada: {
    label: "Atrasada",
    className: "bg-destructive/20 text-destructive",
  },
  agendada: {
    label: "Agendada",
    className: "bg-primary/20 text-primary",
  },
};

export function StatusBadge({ status }: { status: TripStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
