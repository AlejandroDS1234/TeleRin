export async function seguir(codigo_usuario: string) {
  const response = await fetch(`/api/seguir_usuario/${encodeURIComponent(codigo_usuario)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function dejarDeSeguir(codigo_usuario: string) {
  const response = await fetch(`/api/dejar_seguir_usuario/${encodeURIComponent(codigo_usuario)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}
