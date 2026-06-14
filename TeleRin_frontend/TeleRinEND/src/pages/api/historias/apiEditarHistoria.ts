import type Delta from "quill-delta";

type EditarHistoriaDatos = {
  historia: Delta;
  texto_historia: string;
  id_historia: string;
};

type BorradorHistoriaDatos = {
  id_historia: string;
  borrador_historia: Delta;
};

export async function editarHistoria(id_historia: string) {
  const res = await fetch(`/api/editar_historia/${encodeURIComponent(id_historia)}`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function crearBorradorHistoria(info_historia: EditarHistoriaDatos) {
  const res = await fetch(`/api/borrador_historia`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info_historia),
  });
  const data = await res.json();
  return data;
}

export async function guardarBorradorHistoria(datos: BorradorHistoriaDatos) {
  const res = await fetch(`/api/guardar_borrador_historia`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });
  const data = await res.json();
  return data;
}
