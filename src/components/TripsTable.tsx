import { StatusBadge, CiotBadge } from "./StatusBadge";
import { ViagemComRelacoes } from "@/types/transport";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface TripsTableProps {
  trips: ViagemComRelacoes[];
}

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function TripsTable({ trips }: TripsTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-primary mb-4">Viagens</h2>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {trips.map((t) => (
          <div key={t.id} className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{t.codigo}</span>
              <StatusBadge status={t.status} />
            </div>
            <div className="text-sm text-muted-foreground">
              {t.motoristas?.nome ?? "—"} · {t.veiculos?.placa ?? "—"}
            </div>
            <div className="text-sm text-secondary-foreground">
              {t.origem ?? "—"} → {t.destino ?? "—"}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">{fmt(t.frete)}</span>
              <CiotBadge status={t.ciot_status} />
            </div>
            {t.ciot_protocolo && (
              <div className="text-xs text-muted-foreground font-mono">{t.ciot_protocolo}</div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Código</TableHead>
              <TableHead className="text-muted-foreground">Motorista</TableHead>
              <TableHead className="text-muted-foreground">Placa</TableHead>
              <TableHead className="text-muted-foreground">Origem</TableHead>
              <TableHead className="text-muted-foreground">Destino</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">CIOT</TableHead>
              <TableHead className="text-muted-foreground">Protocolo</TableHead>
              <TableHead className="text-muted-foreground text-right">Frete</TableHead>
              <TableHead className="text-muted-foreground text-right">Pedágio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((t) => (
              <TableRow key={t.id} className="border-border hover:bg-muted/30">
                <TableCell className="font-medium text-foreground">{t.codigo}</TableCell>
                <TableCell className="text-secondary-foreground">{t.motoristas?.nome ?? "—"}</TableCell>
                <TableCell className="text-secondary-foreground font-mono">{t.veiculos?.placa ?? "—"}</TableCell>
                <TableCell className="text-secondary-foreground">{t.origem ?? "—"}</TableCell>
                <TableCell className="text-secondary-foreground">{t.destino ?? "—"}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell><CiotBadge status={t.ciot_status} /></TableCell>
                <TableCell className="text-secondary-foreground font-mono text-xs">{t.ciot_protocolo ?? "—"}</TableCell>
                <TableCell className="text-right font-medium text-foreground tabular-nums">{fmt(t.frete)}</TableCell>
                <TableCell className="text-right text-secondary-foreground tabular-nums">{fmt(t.pedagio)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
