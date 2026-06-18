import type { Saga } from "../../../types";

export async function sagasCreadas(codigo_usuario: string): Promise<Saga[]> {
  const res = await fetch(`/api/sagas_creadas/${codigo_usuario}`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}
