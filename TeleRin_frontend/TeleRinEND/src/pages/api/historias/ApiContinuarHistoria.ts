export async function continuarHistoria() {
  const res = await fetch("/api/continuar_historia", {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}

export async function eliminarBorradorHistoria(id_historia: string) {
  const res = await fetch(`/api/eliminar_borrador/${encodeURIComponent(id_historia)}`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}
