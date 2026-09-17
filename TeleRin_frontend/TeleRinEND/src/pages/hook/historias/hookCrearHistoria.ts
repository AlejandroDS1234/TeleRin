import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearHistoria } from "../../api/historias/apiCrearHistoria.ts";
import { useSesion } from "../usuario/hookSesion.ts";
import type { GuardarHistoriaDatos } from "../../../types/historias";

export function useCrearHistoria() {
  const queryClient = useQueryClient();
  const { data: user } = useSesion("codigo_usuario");
  return useMutation({
    mutationFn: (historia: GuardarHistoriaDatos) => crearHistoria(historia),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["historias", data.id_historia],
        exact: true,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["historias", "editar_historia", data.id_historia],
        exact: true,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["continuar", user?.codigo_usuario],
      });
    },
  });
}
