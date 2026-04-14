import { useState } from "react";
import { useUpdateViagemStatus, useUpdateCiotProtocol, useDeleteViagem } from "@/hooks/useTransport";
import { StatusBadge, CiotBadge } from "./StatusBadge";
import { ViagemComRelacoes } from "@/types/transport";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileCheck, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TripsTableProps {
  trips: ViagemComRelacoes[];
}

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function TripsTable({ trips }: TripsTableProps) {
  const updateStatusMutation = useUpdateViagemStatus();
  const updateCiotMutation   = useUpdateCiotProtocol();
  const deleteViagemMutation = useDeleteViagem();

  // id da viagem aguardando confirmação de exclusão (null = dialog fechado)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleGerarCiot = (id: string) => {
    updateCiotMutation.mutate({ id });
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteId) return;
    deleteViagemMutation.mutate(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-primary mb-4">
          Viagens em Andamento
        </h2>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {trips.map((t) => (
            <div
              key={t.id}
              className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{t.codigo}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.status} />
                  <button
                    onClick={() => setConfirmDeleteId(t.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                    aria-label="Excluir viagem"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {t.motoristas?.nome ?? "—"} · {t.veiculos?.placa ?? "—"}
              </div>
              {t.ciot_protocolo && (
                <div className="text-xs text-muted-foreground">
                  CIOT: {t.ciot_protocolo}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUpdateStatus(t.id, "agendada")}>
                      Agendada
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(t.id, "em_transito")}>
                      Em Trânsito
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(t.id, "concluida")}>
                      Concluída
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700"
                  disabled={!!t.ciot_protocolo || updateCiotMutation.isPending}
                  onClick={() => handleGerarCiot(t.id)}
                >
                  {updateCiotMutation.isPending
                    ? "Gerando..."
                    : t.ciot_protocolo
                    ? "Gerado"
                    : "Gerar CIOT"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Código</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CIOT</TableHead>
                <TableHead className="text-right">Frete</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((t) => (
                <TableRow key={t.id} className="border-border hover:bg-muted/30">
                  <TableCell className="font-medium">{t.codigo}</TableCell>
                  <TableCell>{t.motoristas?.nome ?? "—"}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-muted-foreground hover:text-primary transition-colors focus:outline-none">
                            <RefreshCw
                              className={`h-3 w-3 ${updateStatusMutation.isPending ? "animate-spin" : ""}`}
                            />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(t.id, "agendada")}>
                            Agendada
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(t.id, "em_transito")}>
                            Em Trânsito
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(t.id, "concluida")}>
                            Concluída
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <CiotBadge status={t.ciot_status} />
                      {t.ciot_protocolo && (
                        <span className="text-[10px] text-muted-foreground mt-1">
                          Prot: {t.ciot_protocolo}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right tabular-nums">
                    {fmt(t.frete)}
                  </TableCell>

                  {/* Ações: CIOT + Delete */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-500 hover:text-green-600 gap-1"
                        disabled={!!t.ciot_protocolo || updateCiotMutation.isPending}
                        onClick={() => handleGerarCiot(t.id)}
                      >
                        <FileCheck className="h-4 w-4" />
                        {updateCiotMutation.isPending
                          ? "Gerando..."
                          : t.ciot_protocolo
                          ? "Gerado"
                          : "CIOT"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        onClick={() => setConfirmDeleteId(t.id)}
                        aria-label="Excluir viagem"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => { if (!open) setConfirmDeleteId(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir viagem?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A viagem será removida permanentemente do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
