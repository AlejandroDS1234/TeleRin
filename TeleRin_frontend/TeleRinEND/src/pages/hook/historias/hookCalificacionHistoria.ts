import { useQuery } from "@tanstack/react-query";
import { calificacionHistoria } from "../../api/historias/apiCalificacionHistoria.ts";

export function useCalificacionHistoria(id_historia: string) {
  return useQuery({
    queryKey: ["calificacion_historia", id_historia],
    queryFn: () => calificacionHistoria(id_historia),
    enabled: !!id_historia,
  });
}
