import { enviarInfoServer } from "../../../function_generales";
import type Delta from "quill-delta";
import type { ApiMessage } from "../../../types";

type GuardarHistoriaDatos = {
  nombre_historia: string;
  descripcion_historia: string;
  visibilidad_historia: boolean;
  saga_historia: string | null;
  historia: Delta | null;
  texto_historia: string;
};

export async function crearHistoria(data: GuardarHistoriaDatos): Promise<ApiMessage> {
  const res = enviarInfoServer<ApiMessage, GuardarHistoriaDatos>("/api/crear_historia", data);
  return res;
}
