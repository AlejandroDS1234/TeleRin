export async function historiasUsuario(codigo_usuario: string) {
  const res = await fetch(`/api/historias_creadas/${codigo_usuario}`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}
