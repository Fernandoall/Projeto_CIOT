import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// UTILITÁRIO — Geração de protocolo simulado (formato realista de IPEF)
// Quando a integração real com a IPEF for implementada, este bloco será
// substituído pela chamada à Supabase Edge Function que faz o SOAP para a IPEF.
// ---------------------------------------------------------------------------
function gerarProtocoloSimulado(): string {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = String(now.getMonth() + 1).padStart(2, "0");
  const dia = String(now.getDate()).padStart(2, "0");
  const seq = Math.floor(Math.random() * 9000000 + 1000000); // 7 dígitos
  return `${ano}${mes}${dia}${seq}`;
}

// ---------------------------------------------------------------------------
// TODO (integração real): substituir gerarProtocoloSimulado() pela chamada abaixo
//
// const { data } = await supabase.functions.invoke("gerar-ciot", {
//   body: {
//     viagemId: id,
//     motoristaCpf: ...,
//     veiculoPlaca: ...,
//     origem: ...,
//     destino: ...,
//     valorFrete: ...,
//   },
// });
// const protocolo = data.numeroCiot;
// ---------------------------------------------------------------------------

// 1. BUSCAR VIAGENS
export function useViagens() {
  return useQuery({
    queryKey: ["viagens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("viagens")
        .select("*, motoristas(*), veiculos(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// 2. ATUALIZAR STATUS DA VIAGEM
export function useUpdateViagemStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("viagens")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["viagens"] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro Supabase Status:", error.message);
      toast.error("Erro ao atualizar status.");
    },
  });
}

// 3. GERAR PROTOCOLO CIOT
export function useUpdateCiotProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      // --- SIMULAÇÃO (remover quando Edge Function estiver pronta) ---
      const protocolo = gerarProtocoloSimulado();
      // ---------------------------------------------------------------

      const { error } = await supabase
        .from("viagens")
        .update({
          ciot_protocolo: protocolo,
          ciot_status: "emitido",
        })
        .eq("id", id);

      if (error) throw error;
      return protocolo;
    },
    onSuccess: (protocolo) => {
      qc.invalidateQueries({ queryKey: ["viagens"] });
      toast.success(`CIOT gerado: ${protocolo}`);
    },
    onError: (error: Error) => {
      console.error("Erro Supabase CIOT:", error.message);
      toast.error("Falha ao salvar protocolo CIOT.");
    },
  });
}

// 4. ADICIONAR VIAGEM
export function useAddViagem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (viagem: {
      codigo: string;
      motorista_id: string | null;
      veiculo_id: string | null;
      origem: string;
      destino: string;
      frete: number;
      pedagio: number;
    }) => {
      const { error } = await supabase.from("viagens").insert(viagem);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["viagens"] }),
  });
}

// 5. DELETAR VIAGEM
export function useDeleteViagem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("viagens").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["viagens"] });
      toast.success("Viagem excluída.");
    },
    onError: (error: Error) => {
      console.error("Erro ao deletar viagem:", error.message);
      toast.error("Erro ao excluir viagem.");
    },
  });
}

// 6. MOTORISTAS — buscar
export function useMotoristas() {
  return useQuery({
    queryKey: ["motoristas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("motoristas")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data ?? [];
    },
  });
}

// 7. MOTORISTAS — adicionar
export function useAddMotorista() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (m: {
      nome: string;
      cpf: string;
      cnh: string;
      telefone?: string;
      email?: string;
    }) => {
      const { error } = await supabase.from("motoristas").insert(m);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["motoristas"] }),
  });
}

// 8. MOTORISTAS — deletar
export function useDeleteMotorista() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("motoristas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["motoristas"] });
      toast.success("Motorista excluído.");
    },
    onError: (error: Error) => {
      console.error("Erro ao deletar motorista:", error.message);
      toast.error("Erro ao excluir motorista. Verifique se há viagens vinculadas.");
    },
  });
}

// 9. VEÍCULOS — buscar
export function useVeiculos() {
  return useQuery({
    queryKey: ["veiculos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("veiculos")
        .select("*")
        .order("placa");
      if (error) throw error;
      return data ?? [];
    },
  });
}

// 10. VEÍCULOS — adicionar
export function useAddVeiculo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: {
      placa: string;
      modelo: string;
      marca: string;
      ano?: number;
      tipo?: string;
      capacidade_kg?: number;
    }) => {
      const { error } = await supabase.from("veiculos").insert(v);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["veiculos"] }),
  });
}

// 11. VEÍCULOS — deletar
export function useDeleteVeiculo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("veiculos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["veiculos"] });
      toast.success("Veículo excluído.");
    },
    onError: (error: Error) => {
      console.error("Erro ao deletar veículo:", error.message);
      toast.error("Erro ao excluir veículo. Verifique se há viagens vinculadas.");
    },
  });
}