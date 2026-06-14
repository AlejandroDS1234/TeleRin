import { siguiendo, siguiendo_usuario } from "../../api/usuario/apiSiguiendo";
import { useQuery } from "@tanstack/react-query";

export function useSiguiendo(codigo_usuario: string) {
  return useQuery({
    queryKey: ["usuario", "siguiendo", codigo_usuario],
    queryFn: () => siguiendo(codigo_usuario),
    enabled: !!codigo_usuario,
  });
}

export function useSiguiendoUsuario(codigo_usuario: string) {
  return useQuery({
    queryKey: ["usuario", "sesion", "siguiendo_usuario", codigo_usuario],
    queryFn: () => siguiendo_usuario(codigo_usuario),
    enabled: !!codigo_usuario,
  });
}
