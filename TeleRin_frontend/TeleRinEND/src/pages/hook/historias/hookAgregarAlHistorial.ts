import { agregarAlHistorial } from "../../api/historias/apiAgregarAlHistorial";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSesion } from "../usuario/hookSesion";

export function useAgregarAlHistorial() {
  const queryClient = useQueryClient();
  const { data } = useSesion("codigo_usuario");
  return useMutation({
    mutationFn: (id_historia: string) => agregarAlHistorial(id_historia),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historial", data?.codigo_usuario] });
    },
  });
}
