import { Link } from "react-router-dom";
import { useState } from "react";
import { useSeguir, useDejarDeSeguir } from "../../pages/hook/usuario/hookSeguir";
import { Loader } from "lucide-react";
type CardUsuarioProps = {
  codigo_usuario: string;
  nombre_usuario: string;
  foto_perfil_usuario: string;
  seguido?: boolean;
};

export function CardUsuario({
  codigo_usuario,
  nombre_usuario,
  foto_perfil_usuario,
  seguido,
}: CardUsuarioProps) {
  const [fotoCargada, setFotoCargada] = useState(false);
  const mutateSeguir = useSeguir();
  const mutateDejarDeSeguir = useDejarDeSeguir();

  return (
    <Link
      to={`/perfil/${encodeURIComponent(codigo_usuario)}`}
      key={codigo_usuario}
      className=" flex flex-col h-35 w-28 items-center justify-between gap-1 p-2 rounded-md transition-colors border-[#9b7d58]/40 border bg-linear-to-br from-[#d7b18a] via-[#f3ede3] to-[#8ca89e] bg-size-[140%_140%] bg-position-[35%_50%] hover:bg-position-[45%_55%] duration-500 hover:brightness-[1.02] shadow-md hover:shadow-lg"
      title={nombre_usuario}
    >
      <div className="h-full min-h-15 rounded-full relative border-2 aspect-square overflow-hidden">
        <img
          src={`/api/Fotos/perfil/${foto_perfil_usuario}?size=reducida`}
          className="w-full h-full rounded-full object-cover absolute"
          style={{ opacity: fotoCargada ? 0 : 1 }}
        />
        <img
          src={`/api/Fotos/perfil/${foto_perfil_usuario}`}
          className="w-full h-full rounded-full object-cover"
          onLoad={() => setFotoCargada(true)}
          style={{ opacity: fotoCargada ? 1 : 0 }}
        />
      </div>
      <p className="text-sm font-bold text-center truncate h-9 w-full">{nombre_usuario}</p>
      {seguido ? (
        <button
          className="bg-(--border-alpha-45) hover:bg-(--card-tint-1) hover:cursor-pointer px-2 rounded-2xl"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            mutateDejarDeSeguir.mutate(codigo_usuario);
          }}
        >
          {mutateDejarDeSeguir.isPending ? (
            <p className="flex gap-2 items-center justify-center">Rompiendo</p>
          ) : (
            "Romper"
          )}
        </button>
      ) : (
        <button
          className="bg-(--color_botones) hover:bg-(--color_botones_presionado) hover:cursor-pointer rounded-2xl px-2 text-center text-(--color_texto_botones)"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            mutateSeguir.mutate(codigo_usuario);
          }}
        >
          {mutateSeguir.isPending ? (
            <p className="flex gap-2 items-center justify-center">Siguiendo</p>
          ) : (
            "Seguir"
          )}
        </button>
      )}
    </Link>
  );
}

export function CardUsuarioPropio({
  codigo_usuario,
  nombre_usuario,
  foto_perfil_usuario,
}: CardUsuarioProps) {
  const [fotoCargada, setFotoCargada] = useState(false);
  return (
    <Link
      to={`/perfil`}
      key={codigo_usuario}
      className=" flex flex-col h-35 w-28 items-center justify-between gap-1 p-2 rounded-md transition-colors border-[#9b7d58]/40 border bg-linear-to-br from-[#d7b18a] via-[#f3ede3] to-[#8ca89e] bg-size-[140%_140%] bg-position-[35%_50%] hover:bg-position-[45%_55%] duration-500 hover:brightness-[1.02] shadow-md hover:shadow-lg"
      title={"Yo"}
    >
      <div className="w-full rounded-full relative border-2 aspect-square overflow-hidden">
        <img
          src={`/api/Fotos/perfil/${foto_perfil_usuario}?size=reducida`}
          className="w-full h-full rounded-full object-cover absolute"
          style={{ opacity: fotoCargada ? 0 : 1 }}
        />
        <img
          src={`/api/Fotos/perfil/${foto_perfil_usuario}`}
          className="w-full h-full rounded-full object-cover"
          onLoad={() => setFotoCargada(true)}
          style={{ opacity: fotoCargada ? 1 : 0 }}
        />
      </div>
      <p className="text-sm font-bold text-center">{nombre_usuario}</p>
    </Link>
  );
}
