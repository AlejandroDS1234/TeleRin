import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { FieldValues, UseFormRegisterReturn } from "react-hook-form";

export type MessageType = "success" | "danger" | "warning" | "info";

export type ApiMessage = {
  mensaje: string;
  tipo: MessageType;
  redirigir?: string;
  mensaje_redirigir?: {
    mensaje: string;
    tipo: MessageType;
  };
};

export type Usuario = {
  codigo_usuario: string;
  nombre_usuario: string;
  descripcion_personal: string;
  foto_perfil_usuario: string;
  id_pais: string;
  id_genero: string;
  refrescado?: number;
};

export type Saga = {
  id_saga: string;
  nombre_saga: string;
  descripcion_saga: string;
  imagen_saga: string;
  libros?: number | string;
};

export type Historia = {
  id_historia: string;
  nombre_historia: string;
  descripcion_historia: string;
  calificacion_p: number | string;
  codigo_usuario: string;
  nombre_usuario: string;
  foto_perfil_usuario: string;
  contenido_historia?: unknown;
};

export type Pais = {
  id_pais: string;
  nombre_pais: string;
};

export type Genero = {
  id_genero: string;
  nombre_genero: string;
};

export type UserContextValue = {
  usuario: Usuario | null;
  setUsuario: Dispatch<SetStateAction<Usuario | null>>;
};

export type RedirectPayload = {
  redirigir?: string;
  mensaje_redirigir?: {
    mensaje: string;
    tipo: MessageType;
  };
};

export type FormRegisterLike = UseFormRegisterReturn;

export type InputWithIconBaseProps = {
  icon: ReactNode;
  register?: FormRegisterLike;
  classNamePadre?: string;
};

export type SubmitHandlerData = Record<string, FormDataEntryValue | string | boolean>;

export type GenericFieldValues = FieldValues;
