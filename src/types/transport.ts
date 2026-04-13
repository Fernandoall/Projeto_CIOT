export type TripStatus = "em_transito" | "concluida" | "atrasada" | "agendada";

export interface TransportOperation {
  id: string;
  dbId?: string;
  motorista: string;
  placa: string;
  origem: string;
  destino: string;
  status: TripStatus;
  frete: number;
  pedagio: number;
  dataCriacao: string;
}
