import type { ListasLecturaUsuario } from "../../../types/listas";

async function obtenerListasUsuario(codigo_usuario: string): Promise<ListasLecturaUsuario[]> {
  const pro = await fetch(`/api/listas_lectura/${codigo_usuario}`);
  const res = await pro.json();
  return res;
}

export default obtenerListasUsuario;
