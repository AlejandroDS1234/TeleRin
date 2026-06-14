export async function seguidores(codigo_usuario: string) {
  const response = await fetch(`/api/seguidores/${encodeURIComponent(codigo_usuario)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}
