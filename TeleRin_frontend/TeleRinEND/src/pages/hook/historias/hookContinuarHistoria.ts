import {
  continuarHistoria,
  eliminarBorradorHistoria,
} from "../../api/historias/ApiContinuarHistoria";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSesion } from "../usuario/hookSesion";

export function useContinuarHistoria() {
  const { data } = useSesion("codigo_usuario");
  return useQuery({
    queryKey: ["continuar", data?.codigo_usuario],
    queryFn: continuarHistoria,
  });
}

export function useEliminarBorradorHistoria() {
  const queryClient = useQueryClient();
  const { data } = useSesion("codigo_usuario");
  return useMutation({
    mutationFn: (id_historia: string) => eliminarBorradorHistoria(id_historia),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["continuar", data?.codigo_usuario],
      });
    },
  });
}
