import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearSaga } from "../../api/sagas/apiCrearSaga";
import type { MessageType, Saga } from "../../../types";
import { useSesion } from "../usuario/hookSesion";

type CrearSagaData = {
  mensaje: string;
  tipo: MessageType;
  saga: Saga;
};

export function useCrearSaga() {
  const { data: usuario } = useSesion();
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
