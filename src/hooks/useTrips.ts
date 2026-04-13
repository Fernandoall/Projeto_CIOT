import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransportOperation, TripStatus } from "@/types/transport";

function mapRow(row: any): TransportOperation {
  return {
    id: row.operation_code,
    dbId: row.id,
    motorista: row.motorista,
    placa: row.placa,
    origem: row.origem ?? "",
    destino: row.destino ?? "",
    status: row.status as TripStatus,
    frete: Number(row.frete),
    pedagio: Number(row.pedagio),
    dataCriacao: row.created_at.split("T")[0],
  };
}

export function useTrips() {
  return useQuery({
    queryKey: ["transport_operations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transport_operations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
  });
}

export function useAddTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trip: Omit<TransportOperation, "dbId">) => {
      const { error } = await supabase.from("transport_operations").insert({
        operation_code: trip.id,
        motorista: trip.motorista,
        placa: trip.placa,
        origem: trip.origem || null,
        destino: trip.destino || null,
        status: trip.status,
        frete: trip.frete,
        pedagio: trip.pedagio,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport_operations"] });
    },
  });
}
