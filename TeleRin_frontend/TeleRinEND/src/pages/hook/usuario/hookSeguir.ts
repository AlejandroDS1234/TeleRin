import { seguir, dejarDeSeguir } from "../../api/usuario/apiSeguir";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSeguir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (codigo_usuario: string) => seguir(codigo_usuario),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usuario", "seguidores"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", "siguiendo"] });
      queryClient.invalidateQueries({
        queryKey: ["usuario", "sesion", "siguiendo_usuario", data.codigo],
      });
    },
  });
}

export function useDejarDeSeguir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (codigo_usuario: string) => dejarDeSeguir(codigo_usuario),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usuario", "seguidores"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", "siguiendo"] });
      queryClient.invalidateQueries({
        queryKey: ["usuario", "sesion", "siguiendo_usuario", data.codigo],
      });
    },
  });
}
