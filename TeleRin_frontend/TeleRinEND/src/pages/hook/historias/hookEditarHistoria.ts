import {
  editarHistoria,
  crearBorradorHistoria,
  guardarBorradorHistoria,
} from "../../api/historias/apiEditarHistoria";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export function useEditarHistoria(id_historia: string) {
  return useQuery({
    queryKey: ["historias", "editar_historia", id_historia],
    queryFn: () => editarHistoria(id_historia),
    enabled: !!id_historia,
  });
}

export function useCrearBorradorHistoria() {
  return useMutation({
    mutationFn: (info_historia: EditarHistoriaDatos) => crearBorradorHistoria(info_historia),
  });
}

export function useGuardarBorradorHistoria() {
  return useMutation({
    mutationFn: (datos: BorradorHistoriaDatos) => guardarBorradorHistoria(datos),
  });
}
