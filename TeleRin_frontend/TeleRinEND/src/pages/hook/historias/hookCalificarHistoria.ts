import { useMutation } from "@tanstack/react-query";
import { enviarCalificacion } from "../../api/historias/apiCalificarhistoria.ts";

export function useCalificarHistoria() {
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
  });
}
