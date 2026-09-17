export type ListasLecturaUsuario = {
  id_lista: string;
  nombre_lista: string;
  cantidad_elementos: number;
  autor: {
    codigo_usuario: string;
    nombre_usuario: string;
    foto_perfil_usuario: string;
  };
};
