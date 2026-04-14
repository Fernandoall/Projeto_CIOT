import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useVeiculos, useAddVeiculo, useDeleteVeiculo } from "@/hooks/useTransport";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const tipoLabels: Record<string, string> = {
  caminhao: "Caminhão",
  carreta: "Carreta",
  bitrem: "Bitrem",
  van: "Van",
  outro: "Outro",
};

const Veiculos = () => {
  const { data: veiculos = [], isLoading } = useVeiculos();
  const addVeiculo = useAddVeiculo();
  const deleteVeiculo = useDeleteVeiculo();

  const [open, setOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [ano, setAno] = useState("");
  const [tipo, setTipo] = useState("caminhao");
  const [capacidade, setCapacidade] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa.trim() || !modelo.trim() || !marca.trim()) {
      toast.error("Preencha placa, modelo e marca.");
      return;
    }
    addVeiculo.mutate(
      {
        placa: placa.trim().toUpperCase(),
        modelo: modelo.trim(),
        marca: marca.trim(),
        ano: ano ? parseInt(ano) : undefined,
        tipo,
        capacidade_kg: capacidade ? parseFloat(capacidade) : undefined,
      },
      {
        onSuccess: () => { toast.success("Veículo cadastrado!"); setOpen(false); setPlaca(""); setModelo(""); setMarca(""); setAno(""); setTipo("caminhao"); setCapacidade(""); },
        onError: (err) => toast.error(`Erro: ${err.message}`),
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteId) return;
    deleteVeiculo.mutate(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border">
            <div className="flex items-center gap-2 md:gap-4">
              <SidebarTrigger />
              <h1 className="text-lg md:text-2xl font-semibold text-primary">Veículos</h1>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  <Plus className="mr-1 h-4 w-4" /><span className="hidden sm:inline">Novo Veículo</span><span className="sm:hidden">Novo</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border sm:max-w-[420px] max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="text-primary">Novo Veículo</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-secondary-foreground">Placa *</Label><Input value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="ABC-1D23" className="bg-secondary border-border text-foreground font-mono" maxLength={8} /></div>
                    <div className="space-y-2">
                      <Label className="text-secondary-foreground">Tipo</Label>
                      <Select value={tipo} onValueChange={setTipo}>
                        <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {Object.entries(tipoLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-secondary-foreground">Marca *</Label><Input value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Volvo" className="bg-secondary border-border text-foreground" maxLength={50} /></div>
                    <div className="space-y-2"><Label className="text-secondary-foreground">Modelo *</Label><Input value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="FH 540" className="bg-secondary border-border text-foreground" maxLength={50} /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-secondary-foreground">Ano</Label><Input type="number" min="1990" max="2030" value={ano} onChange={(e) => setAno(e.target.value)} placeholder="2024" className="bg-secondary border-border text-foreground" /></div>
                    <div className="space-y-2"><Label className="text-secondary-foreground">Capacidade (kg)</Label><Input type="number" min="0" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} placeholder="23000" className="bg-secondary border-border text-foreground" /></div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-border text-muted-foreground hover:bg-muted">Cancelar</Button>
                    <Button type="submit" disabled={addVeiculo.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">{addVeiculo.isPending ? "Salvando..." : "Cadastrar"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-4 md:p-6">
                <div className="md:hidden space-y-3">
                  {veiculos.map((v) => (
                    <div key={v.id} className="rounded-lg border border-border bg-secondary/30 p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground font-mono">{v.placa}</span>
                          <span className="text-xs text-muted-foreground">{tipoLabels[v.tipo] ?? v.tipo}</span>
                        </div>
                        <button
                          onClick={() => setConfirmDeleteId(v.id)}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          aria-label="Excluir veículo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-sm text-secondary-foreground">{v.marca} {v.modelo} {v.ano ? `(${v.ano})` : ""}</div>
                      {v.capacidade_kg && <div className="text-sm text-muted-foreground">{Number(v.capacidade_kg).toLocaleString("pt-BR")} kg</div>}
                    </div>
                  ))}
                </div>
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">Placa</TableHead>
                        <TableHead className="text-muted-foreground">Marca</TableHead>
                        <TableHead className="text-muted-foreground">Modelo</TableHead>
                        <TableHead className="text-muted-foreground">Ano</TableHead>
                        <TableHead className="text-muted-foreground">Tipo</TableHead>
                        <TableHead className="text-muted-foreground text-right">Capacidade (kg)</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {veiculos.map((v) => (
                        <TableRow key={v.id} className="border-border hover:bg-muted/30">
                          <TableCell className="font-medium text-foreground font-mono">{v.placa}</TableCell>
                          <TableCell className="text-secondary-foreground">{v.marca}</TableCell>
                          <TableCell className="text-secondary-foreground">{v.modelo}</TableCell>
                          <TableCell className="text-secondary-foreground">{v.ano ?? "—"}</TableCell>
                          <TableCell className="text-secondary-foreground">{tipoLabels[v.tipo] ?? v.tipo}</TableCell>
                          <TableCell className="text-right text-secondary-foreground tabular-nums">{v.capacidade_kg ? Number(v.capacidade_kg).toLocaleString("pt-BR") : "—"}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v.ativo ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                              {v.ativo ? "Ativo" : "Inativo"}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                              onClick={() => setConfirmDeleteId(v.id)}
                              aria-label="Excluir veículo"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => { if (!open) setConfirmDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir veículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O veículo será removido permanentemente do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Veiculos;