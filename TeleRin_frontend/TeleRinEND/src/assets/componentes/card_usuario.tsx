import { Link } from "react-router-dom";
import { useState } from "react";

type CardUsuarioProps = {
  codigo_usuario: string;
  nombre_usuario: string;
  foto_perfil_usuario: string;
};

export function CardUsuario({
  codigo_usuario,
  nombre_usuario,
  foto_perfil_usuario,
}: CardUsuarioProps) {
  const [fotoCargada, setFotoCargada] = useState(false);
  return (
    <Link
      to={`/perfil/${encodeURIComponent(codigo_usuario)}`}
      key={codigo_usuario}
      className=" flex flex-col h-35 w-28 items-center justify-between gap-1 p-2 rounded-md transition-colors border-[#9b7d58]/40 border bg-linear-to-br from-[#d7b18a] via-[#f3ede3] to-[#8ca89e] bg-size-[140%_140%] bg-position-[35%_50%] hover:bg-position-[45%_55%] duration-500 hover:brightness-[1.02] shadow-md hover:shadow-lg"
      title={nombre_usuario}
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
