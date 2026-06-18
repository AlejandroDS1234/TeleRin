export async function historiasSagas(id_saga: string) {
  const response = await fetch(`/api/sagas_historias/${encodeURIComponent(id_saga)}`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
}
