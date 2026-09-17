import { enviarInfoServer } from "../../../function_generales";
import type { ApiMessage } from "../../../types";
import type { GuardarHistoriaDatos } from "../../../types/historias";

type ApiMensajeIdHistoria = ApiMessage & {
  id_historia: string;
};

export async function crearHistoria(data: GuardarHistoriaDatos): Promise<ApiMensajeIdHistoria> {
  const res = enviarInfoServer<ApiMensajeIdHistoria, GuardarHistoriaDatos>(
    "/api/crear_historia",
    data
  );
  return res;
}
