import { useQuery } from "@tanstack/react-query";
import { historial } from "../../api/historias/apihistorial.ts";
import { useSesion } from "../usuario/hookSesion.ts";

export function useHistorial() {
  const { data } = useSesion("codigo_usuario");
  return useQuery({
    queryKey: ["historial", data?.codigo_usuario],
    queryFn: historial,
  });
}
