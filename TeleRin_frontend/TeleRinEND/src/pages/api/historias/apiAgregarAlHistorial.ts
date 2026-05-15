export async function agregarAlHistorial(id_historia: string) {
  await fetch(`/api/guardar_historial/${encodeURIComponent(id_historia)}`, {
    method: "POST",
    credentials: "include",
  });
}
