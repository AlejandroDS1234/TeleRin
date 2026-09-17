import type Delta from "quill-delta";

export type GuardarHistoriaDatos = {
  nombre_historia: string;
  descripcion_historia: string;
  visibilidad_historia: boolean;
  saga_historia: string | null;
  historia: Delta | null;
  texto_historia: string;
};

export type EditarHistoriaDatos = {
  historia: Delta;
  texto_historia: string;
  id_historia: string;
};

export type BorradorHistoriaDatos = {
  id_historia: string;
  borrador_historia: Delta;
};
