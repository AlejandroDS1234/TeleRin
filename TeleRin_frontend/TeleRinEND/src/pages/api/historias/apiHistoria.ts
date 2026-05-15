export async function obtenerHistoria(id_historia: string) {
  const res = await fetch(`/api/historia/${encodeURIComponent(id_historia)}`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}
