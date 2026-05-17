export async function historial() {
  const response = await fetch(`/api/historial_usuario`, { method: "POST" });
  const data = await response.json();
  return data;
}
