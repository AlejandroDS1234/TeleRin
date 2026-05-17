import { sesion, editarSesion, cambiarFoto, cerrarSesion } from "../../api/usuario/apiSesion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Usuario } from "../../../types";

type PerfilPayload = Partial<
  Pick<Usuario, "nombre_usuario" | "descripcion_personal" | "id_pais" | "id_genero">
> & { mensaje?: string };

export function useSesion() {
  return useQuery({
    queryKey: ["sesion"],
    queryFn: sesion,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEditarSesion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PerfilPayload) => editarSesion(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["sesion"] });
    },
  });
}

export function useEditarFotoSesion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => cambiarFoto(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["sesion"] });
    },
  });
}

export function useCerrarSesion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cerrarSesion,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["sesion"] });
    },
  });
}
