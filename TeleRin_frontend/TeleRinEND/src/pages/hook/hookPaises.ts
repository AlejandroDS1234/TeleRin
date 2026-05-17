import { paises } from "../api/apiPaises";
import { useQuery } from "@tanstack/react-query";

export function usePaises() {
  return useQuery({
    queryKey: ["paises"],
    queryFn: paises,
  });
}
