import { useQuery } from "@tanstack/react-query";
import { historial } from "../../api/historias/apihistorial.ts";

export function useHistorial() {
  return useQuery({
    queryKey: ["historial"],
    queryFn: historial,
  });
}
