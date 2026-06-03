export async function sagaInfo(id_saga: string) {
  const response = await fetch(`/api/saga_info/${encodeURIComponent(id_saga)}`);
  const data = await response.json();
  return data;
}
