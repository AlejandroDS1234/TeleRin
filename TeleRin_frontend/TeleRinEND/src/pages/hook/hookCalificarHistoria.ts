import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enviarCalificacion } from "../api/historias/apiCalificarhistoria.ts";

export function useCalificarHistoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id_historia,
      calificacion,
    }: {
      id_historia: string;
      calificacion: number;
    }) => {
      await enviarCalificacion(id_historia, calificacion);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["calificacion_historia", variables.id_historia] });
    },
  });
}
