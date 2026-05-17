import { useQuery } from "@tanstack/react-query";
import { sagasCreadas } from "../../api/sagas/apiSagasCreadas";
import type { Saga } from "../../../types";

export function useSagasCreadas(codigo_usuario?: string) {
  return useQuery<Saga[], Error>({
    queryKey: ["sagas_creadas", codigo_usuario],
    queryFn: () => sagasCreadas(codigo_usuario!),
    enabled: !!codigo_usuario,
  });
}
