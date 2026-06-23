export async function busqueda(palabra: string) {
  const pro = await fetch("/api/buscar", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ busqueda: palabra }),
  });
  const res = await pro.json();
  return res;
}
