import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export function useAddMotorista() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (m: { nome: string; cpf: string; cnh: string; telefone?: string; email?: string }) => {
      const { error } = await supabase.from("motoristas").insert(m);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["motoristas"] }),
  });
}

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

export function useAddVeiculo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: { placa: string; modelo: string; marca: string; ano?: number; tipo?: string; capacidade_kg?: number }) => {
      const { error } = await supabase.from("veiculos").insert(v);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["veiculos"] }),
  });
}
