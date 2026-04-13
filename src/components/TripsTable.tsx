import { TransportOperation } from "@/types/transport";
import { StatusBadge } from "./StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TripsTableProps {
  trips: TransportOperation[];
}

export function TripsTable({ trips }: TripsTableProps) {
  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-xl font-semibold text-primary mb-4">
        Viagens Recentes
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Motorista</TableHead>
              <TableHead className="text-muted-foreground">Placa</TableHead>
              <TableHead className="text-muted-foreground">Origem</TableHead>
              <TableHead className="text-muted-foreground">Destino</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Frete</TableHead>
              <TableHead className="text-muted-foreground text-right">Pedágio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id} className="border-border hover:bg-muted/30">
                <TableCell className="font-medium text-foreground">{trip.id}</TableCell>
                <TableCell className="text-secondary-foreground">{trip.motorista}</TableCell>
                <TableCell className="text-secondary-foreground font-mono">{trip.placa}</TableCell>
                <TableCell className="text-secondary-foreground">{trip.origem}</TableCell>
                <TableCell className="text-secondary-foreground">{trip.destino}</TableCell>
                <TableCell>
                  <StatusBadge status={trip.status} />
                </TableCell>
                <TableCell className="text-right font-medium text-foreground tabular-nums">
                  {formatCurrency(trip.frete)}
                </TableCell>
                <TableCell className="text-right text-secondary-foreground tabular-nums">
                  {formatCurrency(trip.pedagio)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
