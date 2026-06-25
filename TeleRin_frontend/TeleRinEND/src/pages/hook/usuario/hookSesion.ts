import { sesion, editarSesion, cambiarFoto, cerrarSesion } from "../../api/usuario/apiSesion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Usuario } from "../../../types";

type PerfilPayload = Partial<
  Pick<Usuario, "nombre_usuario" | "descripcion_personal" | "id_pais" | "id_genero">
> & { mensaje?: string };

export function useSesion(columnas?: string) {
  return useQuery({
    queryKey: ["usuario", "sesion", columnas],
    queryFn: () => sesion(columnas),
    staleTime: 1000 * 60 * 5,
  });
}

export function useEditarSesion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PerfilPayload) => editarSesion(data),
    onSuccess: (res) => {
      queryClient.setQueryData(["usuario", "sesion", res.dato.clave], (oldData: any) => ({
        ...oldData,
        [res.dato.clave]: res.dato.valor,
        refrescado: Date.now(),
      }));
      queryClient.refetchQueries({ queryKey: ["usuario", "sesion", res.dato.clave] });
    },
  });
}

export function useEditarFotoSesion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => cambiarFoto(data),
    onSuccess: (res) => {
      if (res.tipo == "success") {
        queryClient.setQueryData(["usuario", "sesion", "foto_perfil_usuario"], () => ({
          foto_perfil_usuario: res.foto_perfil_usuario,
          refrescado: Date.now(),
        }));
        queryClient.invalidateQueries({ queryKey: ["historias"] });
      }
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
