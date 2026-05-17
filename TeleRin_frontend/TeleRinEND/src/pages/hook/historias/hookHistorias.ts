import { useQuery } from "@tanstack/react-query";
import { obtenerHistoria } from "../../api/historias/apiHistoria.ts";

export function useHistorias(id_historia: string) {
  return useQuery({
    queryKey: ["historia", id_historia],
    queryFn: () => obtenerHistoria(id_historia),
  });
}
