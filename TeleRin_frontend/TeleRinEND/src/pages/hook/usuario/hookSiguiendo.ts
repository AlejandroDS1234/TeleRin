import { siguiendo } from "../../api/usuario/apiSiguiendo";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useSiguiendo(codigo_usuario: string) {
  return useQuery({
    queryKey: ["usuario", "siguiendo", codigo_usuario],
    queryFn: () => siguiendo(codigo_usuario),
    enabled: !!codigo_usuario,
  });
}
