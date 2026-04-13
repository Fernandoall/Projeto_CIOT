import { Tables } from "@/integrations/supabase/types";

export type TripStatus = "agendada" | "em_transito" | "concluida" | "atrasada" | "cancelada";
export type CiotStatus = "pendente" | "emitido" | "encerrado" | "cancelado";
export type VeiculoTipo = "caminhao" | "carreta" | "bitrem" | "van" | "outro";

export type Motorista = Tables<"motoristas">;
export type Veiculo = Tables<"veiculos">;
export type Viagem = Tables<"viagens">;

export interface ViagemComRelacoes extends Viagem {
  motoristas?: Motorista | null;
  veiculos?: Veiculo | null;
}
