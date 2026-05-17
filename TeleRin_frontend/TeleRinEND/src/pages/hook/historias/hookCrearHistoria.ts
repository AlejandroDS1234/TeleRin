import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearHistoria } from "../../api/historias/apiCrearHistoria.ts";
import { useSesion } from "../usuario/hookSesion.ts";
import type Delta from "quill-delta";

type GuardarHistoriaDatos = {
  nombre_historia: string;
  descripcion_historia: string;
  visibilidad_historia: boolean;
  saga_historia: string | null;
  historia: Delta | null;
  texto_historia: string;
};

export function useCrearHistoria() {
  const { data: usuario } = useSesion();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (historia: GuardarHistoriaDatos) => crearHistoria(historia),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historias", usuario?.codigo_usuario] });
    },
  });
}
