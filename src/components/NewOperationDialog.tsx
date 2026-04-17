import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useMotoristas, useVeiculos, useAddViagem } from "@/hooks/useTransport";

interface NewOperationDialogProps {
  tripCount: number;
}

export function NewOperationDialog({ tripCount }: NewOperationDialogProps) {
  const [open, setOpen] = useState(false);
  
  // Vínculos
  const [motoristaId, setMotoristaId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  
  // Documentação
  const [contratanteDoc, setContratanteDoc] = useState("");
  const [destinatarioDoc, setDestinatarioDoc] = useState("");

  // Rota
  const [origem, setOrigem] = useState("");
  const [ibgeOrigem, setIbgeOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [ibgeDestino, setIbgeDestino] = useState("");

  // Valores
  const [frete, setFrete] = useState("");
  const [pedagio, setPedagio] = useState("");

  const { data: motoristas = [] } = useMotoristas();
  const { data: veiculos = [] } = useVeiculos();
  const addViagem = useAddViagem();

  const resetForm = () => {
    setMotoristaId(""); setVeiculoId(""); 
    setContratanteDoc(""); setDestinatarioDoc("");
    setOrigem(""); setIbgeOrigem(""); setDestino(""); setIbgeDestino("");
    setFrete(""); setPedagio("");
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
        contratante_documento: contratanteDoc.trim() || undefined,
        destinatario_documento: destinatarioDoc.trim() || undefined,
        ibge_origem: ibgeOrigem.trim() || undefined,
        ibge_destino: ibgeDestino.trim() || undefined,
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
      <DialogContent className="bg-card border-border sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">Nova Operação de Transporte</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          
          {/* Seção 1: Vínculos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Motorista *</Label>
              <Select value={motoristaId} onValueChange={setMotoristaId}>
                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {motoristas.map((m) => (<SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Veículo *</Label>
              <Select value={veiculoId} onValueChange={setVeiculoId}>
                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {veiculos.map((v) => (<SelectItem key={v.id} value={v.id}>{v.placa} — {v.modelo}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seção 2: Documentação das Partes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label className="text-secondary-foreground">CNPJ/CPF Contratante</Label>
              <Input value={contratanteDoc} onChange={(e) => setContratanteDoc(e.target.value)} placeholder="Pagador do frete" className="bg-secondary border-border text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-secondary-foreground">CNPJ/CPF Destinatário</Label>
              <Input value={destinatarioDoc} onChange={(e) => setDestinatarioDoc(e.target.value)} placeholder="Recebedor da carga" className="bg-secondary border-border text-foreground" />
            </div>
          </div>

          {/* Seção 3: Rota e Localização */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Origem</Label>
              <div className="flex gap-2">
                <Input value={origem} onChange={(e) => setOrigem(e.target.value)} placeholder="Cidade, UF" className="bg-secondary border-border w-2/3" />
                <Input value={ibgeOrigem} onChange={(e) => setIbgeOrigem(e.target.value)} placeholder="Cód IBGE" className="bg-secondary border-border w-1/3" maxLength={7} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Destino</Label>
              <div className="flex gap-2">
                <Input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Cidade, UF" className="bg-secondary border-border w-2/3" />
                <Input value={ibgeDestino} onChange={(e) => setIbgeDestino(e.target.value)} placeholder="Cód IBGE" className="bg-secondary border-border w-1/3" maxLength={7} />
              </div>
            </div>
          </div>

          {/* Seção 4: Valores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Frete (R$) *</Label>
              <Input type="number" min="0" step="0.01" value={frete} onChange={(e) => setFrete(e.target.value)} placeholder="0,00" className="bg-secondary border-border tabular-nums" />
            </div>
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Pedágio (R$)</Label>
              <Input type="number" min="0" step="0.01" value={pedagio} onChange={(e) => setPedagio(e.target.value)} placeholder="0,00" className="bg-secondary border-border tabular-nums" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-border text-muted-foreground hover:bg-muted">Cancelar</Button>
            <Button type="submit" disabled={addViagem.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              {addViagem.isPending ? "Salvando..." : "Cadastrar Operação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}