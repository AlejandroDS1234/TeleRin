import type { MessageType, Saga } from "../types";

export type CrearSagaData = {
  mensaje: string;
  tipo: MessageType;
  saga: Saga;
};
