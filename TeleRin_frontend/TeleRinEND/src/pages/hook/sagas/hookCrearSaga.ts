import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearSaga } from "../../api/sagas/apiCrearSaga";
import type { Saga } from "../../../types";
import type { CrearSagaData } from "../../../types/sagas";
import { useSesion } from "../usuario/hookSesion";

export function useCrearSaga() {
  const { data: usuario } = useSesion("codigo_usuario");
  const queryClient = useQueryClient();

  return useMutation<CrearSagaData, Error, FormData>({
    mutationFn: crearSaga,

    onSuccess: async (res) => {
      await queryClient.setQueryData<Saga[]>(
        ["sagas_creadas", usuario?.codigo_usuario],
        (old = []) => {
          return [...old, res.saga];
        }
      );
    },
  });
}
