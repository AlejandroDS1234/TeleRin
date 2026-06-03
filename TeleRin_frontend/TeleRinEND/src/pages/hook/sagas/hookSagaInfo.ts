import { sagaInfo } from "../../api/sagas/apiSagaInfo";
import { useQuery } from "@tanstack/react-query";
import { redirigir } from "../../../function_generales";
import { useNavigate } from "react-router-dom";

export function useSagaInfo(id_saga: string) {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["sagas", id_saga],
    queryFn: async () => {
      const data = await sagaInfo(id_saga);
      redirigir(navigate, data);
      return data;
    },
  });
}
