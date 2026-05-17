export async function generos() {
  const pro = await fetch("/api/generos", { method: "POST", credentials: "include" });
  return await pro.json();
}
