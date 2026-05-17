export async function paises() {
  const pro = await fetch("/api/paises", { method: "POST", credentials: "include" });
  return await pro.json();
}
