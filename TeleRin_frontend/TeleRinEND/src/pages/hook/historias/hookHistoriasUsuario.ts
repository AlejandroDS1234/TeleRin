import { useQuery } from "@tanstack/react-query";
import { historiasUsuario } from "../../api/historias/apiHistoriasUsuario";

export function useHistoriasUsuario(codigo_usuario?: string) {
  return useQuery({
    queryFn: () => historiasUsuario(codigo_usuario!),
    queryKey: ["historias", codigo_usuario],
    enabled: !!codigo_usuario,
  });
}
