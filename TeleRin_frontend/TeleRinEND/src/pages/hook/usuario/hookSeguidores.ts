import { seguidores } from "../../api/usuario/apiSeguidores";
import { useQuery } from "@tanstack/react-query";

export function useSeguidores(codigo_usuario: string) {
  return useQuery({
    queryKey: ["usuario", "seguidores", codigo_usuario],
    queryFn: () => seguidores(codigo_usuario),
    enabled: !!codigo_usuario,
  });
}
