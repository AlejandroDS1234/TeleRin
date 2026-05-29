import { sesion, editarSesion, cambiarFoto, cerrarSesion } from "../../api/usuario/apiSesion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Usuario } from "../../../types";

type PerfilPayload = Partial<
  Pick<Usuario, "nombre_usuario" | "descripcion_personal" | "id_pais" | "id_genero">
> & { mensaje?: string };

export function useSesion(columnas?: string) {
  return useQuery({
    queryKey: ["sesion", columnas],
    queryFn: () => sesion(columnas),
    staleTime: 1000 * 60 * 5,
  });
}

export function useEditarSesion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PerfilPayload) => editarSesion(data),
    onSuccess: (res) => {
      queryClient.setQueryData(["sesion", res.dato.clave], (oldData: any) => ({
        ...oldData,
        [res.dato.clave]: res.dato.valor,
        refrescado: Date.now(),
      }));
      queryClient.refetchQueries({ queryKey: ["sesion", res.dato.clave] });
    },
  });
}

export function useEditarFotoSesion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => cambiarFoto(data),
    onSuccess: (res) => {
      queryClient.setQueryData(["sesion", "foto_perfil_usuario"], () => ({
        foto_perfil_usuario: res.foto_perfil_usuario,
        refrescado: Date.now(),
      }));
    },
  });
}

export function useCerrarSesion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cerrarSesion,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
