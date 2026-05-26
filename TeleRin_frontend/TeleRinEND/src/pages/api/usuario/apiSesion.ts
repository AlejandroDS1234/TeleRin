import type { Usuario } from "../../../types";
import { enviarInfoServer } from "../../../function_generales";
import type { ApiMessage, RedirectPayload } from "../../../types";

type PerfilPayload = Partial<
  Pick<Usuario, "nombre_usuario" | "descripcion_personal" | "id_pais" | "id_genero">
> & { mensaje?: string };
type FotoPerfilResponse = ApiMessage & { foto_perfil_usuario?: string };

export async function sesion(columnas: string): Promise<Usuario | null> {
  const response = await fetch("/api/usuario", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify([columnas]),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log("Respuesta del servidor:", data, "Columna solicitada:", columnas);
  return data;
}

export async function editarSesion(dato: PerfilPayload) {
  const res = await enviarInfoServer<ApiMessage, PerfilPayload>("/api/perfil", dato);
  return res;
}

export async function cambiarFoto(dato: FormData) {
  const res = await enviarInfoServer<FotoPerfilResponse, FormData>(
    "/api/guardar_foto_perfil",
    dato
  );
  return res;
}

export async function cerrarSesion(): Promise<RedirectPayload> {
  const pro = await fetch("/api/cerrar_sesion", {
    method: "POST",
    credentials: "include",
  });
  const res = await pro.json();
  return res;
}
