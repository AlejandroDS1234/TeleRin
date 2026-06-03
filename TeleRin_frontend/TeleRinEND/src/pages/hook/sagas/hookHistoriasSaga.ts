import { historiasSagas } from "../../api/sagas/apiHistoriasSagas";
import { useQuery } from "@tanstack/react-query";

export function useHistoriasSagas(id_saga: string) {
  return useQuery({
    queryKey: ["sagas_historia", id_saga],
    queryFn: async () => {
      return await historiasSagas(id_saga);
    },
  });
}
