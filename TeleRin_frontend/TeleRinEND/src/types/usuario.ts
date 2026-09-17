import type { Usuario } from "../types";

export type PerfilPayload = Partial<
  Pick<Usuario, "nombre_usuario" | "descripcion_personal" | "id_pais" | "id_genero">
> & { mensaje?: string };
