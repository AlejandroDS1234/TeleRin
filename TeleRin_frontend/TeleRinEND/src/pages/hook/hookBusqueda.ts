import { useQuery } from "@tanstack/react-query";
import { busqueda } from "../api/apiBusqueda";

export function useBuscar(palabra: string) {
  return useQuery({
    queryKey: ["busqueda", palabra],
    queryFn: () => busqueda(palabra),
    enabled: palabra.trim().length > 0,
  });
}
