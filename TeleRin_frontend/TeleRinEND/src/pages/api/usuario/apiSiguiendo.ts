export async function siguiendo(codigo_usuario: string) {
  const response = await fetch(`/api/seguidos/${encodeURIComponent(codigo_usuario)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function siguiendo_usuario(codigo_usuario: string) {
  const response = await fetch(`/api/siguiendo_usuario/${encodeURIComponent(codigo_usuario)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}
