import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMotoristas, useVeiculos, useAddViagem } from "@/hooks/useTransport";

interface NewOperationDialogProps {
  tripCount: number;
}

export function NewOperationDialog({ tripCount }: NewOperationDialogProps) {
  const [open, setOpen] = useState(false);
  const [motoristaId, setMotoristaId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [frete, setFrete] = useState("");
  const [pedagio, setPedagio] = useState("");

  const { data: motoristas = [] } = useMotoristas();
  const { data: veiculos = [] } = useVeiculos();
  const addViagem = useAddViagem();

  const resetForm = () => {
    setMotoristaId("");
    setVeiculoId("");
    setOrigem("");
    setDestino("");
    setFrete("");
    setPedagio("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motoristaId || !veiculoId || !frete.trim()) {
      toast.error("Preencha motorista, veículo e valor do frete.");
      return;
    }

    const codigo = `VG-${String(tripCount + 1).padStart(3, "0")}`;
    addViagem.mutate(
      {
        codigo,
        motorista_id: motoristaId,
        veiculo_id: veiculoId,
        origem: origem.trim(),
        destino: destino.trim(),
        frete: parseFloat(frete) || 0,
        pedagio: parseFloat(pedagio) || 0,
      },
      {
        onSuccess: () => {
          toast.success(`Viagem ${codigo} cadastrada!`);
          resetForm();
          setOpen(false);
        },
        onError: (err) => toast.error(`Erro: ${err.message}`),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <Plus className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Nova Operação</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">Nova Operação de Transporte</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-secondary-foreground">Motorista *</Label>
            <Select value={motoristaId} onValueChange={setMotoristaId}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Selecione o motorista" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {motoristas.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-secondary-foreground">Veículo *</Label>
            <Select value={veiculoId} onValueChange={setVeiculoId}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Selecione o veículo" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {veiculos.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.placa} — {v.modelo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Origem</Label>
              <Input value={origem} onChange={(e) => setOrigem(e.target.value)} placeholder="Cidade, UF" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Destino</Label>
              <Input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Cidade, UF" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" maxLength={100} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Frete (R$) *</Label>
              <Input type="number" min="0" step="0.01" value={frete} onChange={(e) => setFrete(e.target.value)} placeholder="0,00" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground tabular-nums" />
            </div>
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Pedágio (R$)</Label>
              <Input type="number" min="0" step="0.01" value={pedagio} onChange={(e) => setPedagio(e.target.value)} placeholder="0,00" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground tabular-nums" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-border text-muted-foreground hover:bg-muted">Cancelar</Button>
            <Button type="submit" disabled={addViagem.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              {addViagem.isPending ? "Salvando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
