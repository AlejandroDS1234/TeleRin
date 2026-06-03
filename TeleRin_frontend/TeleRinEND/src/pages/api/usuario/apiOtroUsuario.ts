export async function otroUsuario(codigo_usuario: string) {
  const response = await fetch("/api/perfil/" + encodeURIComponent(codigo_usuario), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}
