export async function calificacionHistoria(id_historia: string) {
  const res = await fetch(`/api/calificacion_historia/${encodeURIComponent(id_historia)}`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}
