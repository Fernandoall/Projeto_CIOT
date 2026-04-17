import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useMotoristas, useAddMotorista, useDeleteMotorista } from "@/hooks/useTransport";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Motoristas = () => {
  const { data: motoristas = [], isLoading } = useMotoristas();
  const addMotorista = useAddMotorista();
  const deleteMotorista = useDeleteMotorista();
  
  const [open, setOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  // Novos Estados
  const [rntrc, setRntrc] = useState("");
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [tipoConta, setTipoConta] = useState("");

  const resetForm = () => {
    setNome(""); setCpf(""); setCnh(""); setTelefone(""); setEmail("");
    setRntrc(""); setBanco(""); setAgencia(""); setConta(""); setTipoConta("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !cpf.trim() || !cnh.trim()) {
      toast.error("Preencha nome, CPF e CNH.");
      return;
    }
    addMotorista.mutate(
      { 
        nome: nome.trim(), cpf: cpf.trim(), cnh: cnh.trim(), 
        telefone: telefone.trim() || undefined, 
        email: email.trim() || undefined,
        rntrc: rntrc.trim() || undefined,
        banco: banco.trim() || undefined,
        agencia: agencia.trim() || undefined,
        conta: conta.trim() || undefined,
        tipo_conta: tipoConta.trim() || undefined
      },
      {
        onSuccess: () => { toast.success("Motorista cadastrado!"); setOpen(false); resetForm(); },
        onError: (err) => toast.error(`Erro: ${err.message}`),
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteId) return;
    deleteMotorista.mutate(confirmDeleteId);
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
              <h1 className="text-lg md:text-2xl font-semibold text-primary">Motoristas</h1>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  <Plus className="mr-1 h-4 w-4" /><span className="hidden sm:inline">Novo Motorista</span><span className="sm:hidden">Novo</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="text-primary">Novo Motorista</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  
                  {/* Dados Pessoais */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground border-b pb-1">Dados Pessoais</h3>
                    <div className="space-y-2"><Label className="text-secondary-foreground">Nome *</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" className="bg-secondary border-border" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-secondary-foreground">CPF *</Label><Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" className="bg-secondary border-border" /></div>
                      <div className="space-y-2"><Label className="text-secondary-foreground">CNH *</Label><Input value={cnh} onChange={(e) => setCnh(e.target.value)} placeholder="00000000000" className="bg-secondary border-border" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-secondary-foreground">Telefone</Label><Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" className="bg-secondary border-border" /></div>
                      <div className="space-y-2"><Label className="text-secondary-foreground">Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" className="bg-secondary border-border" /></div>
                    </div>
                  </div>

                  {/* Regulatório e Bancário */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground border-b pb-1">CIOT / Repasse de Frete</h3>
                    <div className="space-y-2"><Label className="text-secondary-foreground">RNTRC</Label><Input value={rntrc} onChange={(e) => setRntrc(e.target.value)} placeholder="Ex: 123456789" className="bg-secondary border-border" /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-2 col-span-2"><Label className="text-secondary-foreground">Banco</Label><Input value={banco} onChange={(e) => setBanco(e.target.value)} placeholder="Ex: 341 (Itaú)" className="bg-secondary border-border" /></div>
                      <div className="space-y-2 col-span-2"><Label className="text-secondary-foreground">Agência</Label><Input value={agencia} onChange={(e) => setAgencia(e.target.value)} placeholder="0000" className="bg-secondary border-border" /></div>
                      <div className="space-y-2 col-span-2"><Label className="text-secondary-foreground">Conta</Label><Input value={conta} onChange={(e) => setConta(e.target.value)} placeholder="00000-0" className="bg-secondary border-border" /></div>
                      <div className="space-y-2 col-span-2"><Label className="text-secondary-foreground">Tipo</Label><Input value={tipoConta} onChange={(e) => setTipoConta(e.target.value)} placeholder="Corrente/Poupança" className="bg-secondary border-border" /></div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-border text-muted-foreground hover:bg-muted">Cancelar</Button>
                    <Button type="submit" disabled={addMotorista.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">{addMotorista.isPending ? "Salvando..." : "Cadastrar"}</Button>
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
                  {motoristas.map((m) => (
                    <div key={m.id} className="rounded-lg border border-border bg-secondary/30 p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-foreground">{m.nome}</div>
                        <button onClick={() => setConfirmDeleteId(m.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <div className="text-sm text-muted-foreground">CPF: {m.cpf} | RNTRC: {m.rntrc || "—"}</div>
                    </div>
                  ))}
                </div>
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">Nome</TableHead>
                        <TableHead className="text-muted-foreground">CPF</TableHead>
                        <TableHead className="text-muted-foreground">RNTRC</TableHead>
                        <TableHead className="text-muted-foreground">Banco</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {motoristas.map((m) => (
                        <TableRow key={m.id} className="border-border hover:bg-muted/30">
                          <TableCell className="font-medium text-foreground">{m.nome}</TableCell>
                          <TableCell className="text-secondary-foreground font-mono">{m.cpf}</TableCell>
                          <TableCell className="text-secondary-foreground font-mono">{m.rntrc || "—"}</TableCell>
                          <TableCell className="text-secondary-foreground font-mono">{m.banco ? `${m.banco} (Ag: ${m.agencia})` : "—"}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.ativo ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>{m.ativo ? "Ativo" : "Inativo"}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80 hover:bg-destructive/10" onClick={() => setConfirmDeleteId(m.id)}><Trash2 className="h-4 w-4" /></Button>
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

      <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => { if (!open) setConfirmDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir motorista?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Motoristas;