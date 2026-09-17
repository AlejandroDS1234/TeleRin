import { useQuery } from "@tanstack/react-query";
import obtenerListasUsuario from "../../api/listas/apiListasLecturaUsuario";

export function useListasLecturaUsuario(codigo_usuario?: string) {
  return useQuery({
    queryKey: ["usuario", codigo_usuario, "listas"],
    queryFn: () => obtenerListasUsuario(codigo_usuario!),
    enabled: !!codigo_usuario,
  });
}
