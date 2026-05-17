export async function historiasUsuario(codigo_usuario: String) {
  const res = await fetch(`/api/historias_creadas/${codigo_usuario}`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}
