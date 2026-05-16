import { enviarInfoServer } from "../../../function_generales";
import type { MessageType, Saga } from "../../../types";

type CrearSagaData = {
  mensaje: string;
  tipo: MessageType;
  saga: Saga;
};

export async function crearSaga(data: FormData): Promise<CrearSagaData> {
  const res = await enviarInfoServer<CrearSagaData, FormData>("/api/crear_saga", data);
  return res;
}
