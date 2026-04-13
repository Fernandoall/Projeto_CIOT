import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransportOperation } from "@/types/transport";
import { toast } from "sonner";

interface NewOperationDialogProps {
  onAdd: (op: TransportOperation) => void;
  tripCount: number;
}

export function NewOperationDialog({ onAdd, tripCount }: NewOperationDialogProps) {
  const [open, setOpen] = useState(false);
  const [motorista, setMotorista] = useState("");
  const [placa, setPlaca] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [frete, setFrete] = useState("");
  const [pedagio, setPedagio] = useState("");

  const resetForm = () => {
    setMotorista("");
    setPlaca("");
    setOrigem("");
    setDestino("");
    setFrete("");
    setPedagio("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!motorista.trim() || !placa.trim() || !frete.trim()) {
      toast.error("Preencha os campos obrigatórios: Motorista, Placa e Frete.");
      return;
    }

    const newOp: TransportOperation = {
      id: `OP-${String(tripCount + 1).padStart(3, "0")}`,
      motorista: motorista.trim(),
      placa: placa.trim().toUpperCase(),
      origem: origem.trim(),
      destino: destino.trim(),
      status: "agendada",
      frete: parseFloat(frete) || 0,
      pedagio: parseFloat(pedagio) || 0,
      dataCriacao: new Date().toISOString().split("T")[0],
    };

    onAdd(newOp);
    toast.success(`Operação ${newOp.id} cadastrada com sucesso!`);
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Nova Operação
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">
            Nova Operação de Transporte
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="motorista" className="text-secondary-foreground">
              Motorista *
            </Label>
            <Input
              id="motorista"
              value={motorista}
              onChange={(e) => setMotorista(e.target.value)}
              placeholder="Nome do motorista"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placa" className="text-secondary-foreground">
              Placa do Caminhão *
            </Label>
            <Input
              id="placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              placeholder="ABC-1D23"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono"
              maxLength={8}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origem" className="text-secondary-foreground">
                Origem
              </Label>
              <Input
                id="origem"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="Cidade, UF"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destino" className="text-secondary-foreground">
                Destino
              </Label>
              <Input
                id="destino"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Cidade, UF"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                maxLength={100}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frete" className="text-secondary-foreground">
                Valor do Frete (R$) *
              </Label>
              <Input
                id="frete"
                type="number"
                min="0"
                step="0.01"
                value={frete}
                onChange={(e) => setFrete(e.target.value)}
                placeholder="0,00"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground tabular-nums"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pedagio" className="text-secondary-foreground">
                Valor do Pedágio (R$)
              </Label>
              <Input
                id="pedagio"
                type="number"
                min="0"
                step="0.01"
                value={pedagio}
                onChange={(e) => setPedagio(e.target.value)}
                placeholder="0,00"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground tabular-nums"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border text-muted-foreground hover:bg-muted"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            >
              Cadastrar Operação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
