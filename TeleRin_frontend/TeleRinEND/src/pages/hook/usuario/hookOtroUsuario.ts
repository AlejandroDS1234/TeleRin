import { otroUsuario } from "../../api/usuario/apiOtroUsuario";
import { useQuery } from "@tanstack/react-query";
import { redirigir } from "../../../function_generales";
import { useNavigate } from "react-router-dom";

export function useOtroUsuario(codigo_usuario: string) {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["usuario", codigo_usuario],
    queryFn: async () => {
      const data = await otroUsuario(codigo_usuario);
      redirigir(navigate, data);
      return data;
    },
  });
}
