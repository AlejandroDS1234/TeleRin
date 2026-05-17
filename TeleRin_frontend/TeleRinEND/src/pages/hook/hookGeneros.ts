import { generos } from "../api/apiGeneros";
import { useQuery } from "@tanstack/react-query";

export function useGeneros() {
  return useQuery({
    queryKey: ["generos"],
    queryFn: generos,
  });
}
