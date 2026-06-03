import { useState } from "react";
import Modal from "../assets/componentes/modal";
import type { Genero, Pais } from "../types";
import { HistoriaCard, HistoriaCardCargando } from "../assets/componentes/historias_cards";
import { useHistoriasUsuario } from "./hook/historias/hookHistoriasUsuario";
import { usePaises } from "./hook/hookPaises";
import { useGeneros } from "./hook/hookGeneros";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";

import { useOtroUsuario } from "./hook/usuario/hookOtroUsuario";

function Imagen() {
  const { codigo_usuario = "" } = useParams();
  const { data: usuario } = useOtroUsuario(codigo_usuario);
  const [abrirModal, setAbrirModal] = useState(false);
  const [imagenPerfilCargada, setImagenPerfilCargada] = useState(false);

  return (
    <div className="flex justify-center items-center mb-4 z-1">
      <Modal
        open={abrirModal}
        onClose={() => {
          setAbrirModal(false);
        }}
        className="bg-(--color_principal) w-full m-5 sm:max-w-lg flex flex-col gap-4 items-center p-5"
      >
        <h3>Foto de Perfil</h3>
        <label className="border-6 rounded-full aspect-square w-full flex items-center justify-center overflow-hidden">
          <img
            src={`/api/Fotos/perfil/${encodeURIComponent(usuario?.foto_perfil_usuario)}`}
            className="object-cover aspect-square w-full h-full"
          />
        </label>
      </Modal>
      <div className="relative w-40 h-40 cursor-pointer" onClick={() => setAbrirModal(true)}>
        {/* Placeholder borroso (imagen reducida) */}
        <img
          src={`/api/Fotos/perfil/${encodeURIComponent(usuario?.foto_perfil_usuario)}?size=reducida`}
          className="absolute inset-0 w-full h-full object-cover border-2 border-black"
          style={{ opacity: !imagenPerfilCargada ? 1 : 0 }}
        />

        {/* Imagen real con fade in */}
        <img
          className="w-40 h-40 object-cover border-2 border-black hover:cursor-pointer transition-opacity duration-300"
          style={{ opacity: imagenPerfilCargada ? 1 : 0 }}
          src={`/api/Fotos/perfil/${encodeURIComponent(usuario?.foto_perfil_usuario)}`}
          onLoad={() => setImagenPerfilCargada(true)}
        />
      </div>
    </div>
  );
}

function PerfilInfo() {
  const { codigo_usuario = "" } = useParams();
  const { data: usuario, isLoading, error } = useOtroUsuario(codigo_usuario);

  const paises = usePaises();
  const paisUsuario = paises.data?.find(
    (pais: Pais) => pais.id_pais === usuario?.id_pais
  )?.nombre_pais;
  const generos = useGeneros();
  const generoUsuario = generos.data?.find(
    (genero: Genero) => genero.id_genero === usuario?.id_genero
  )?.nombre_genero;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-(--danger)">Error loading user information. {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md bg-(--color_principal_oscuro) border-4 border-(--color_bordes) p-2 font-serif text-center shadow-xl  lg:self-stretch lg:justify-senter lg:items-center">
      <h1 className="text-4xl text-(--color_texto_oscuro) font-extrabold tracking-widest border-b-4 border-(--color_bordes) pb-2 mb-4">
        SE BUSCA
      </h1>
      <Imagen />
      <h2 className="text-xl text-(--color_texto_oscuro) font-bold uppercase border-y-2 border-(--color_bordes) py-1 mb-3">
        Lector Serial
      </h2>

      <p className="text-left text-(--color_texto_oscuro) mb-2 flex gap-2">
        <span className="font-bold">Nombre:</span> {usuario?.nombre_usuario}
      </p>

      <p className="text-left text-(--color_texto_oscuro) mb-4 flex gap-2">
        <span className="font-bold">Descripción:</span> {usuario?.descripcion_personal}
      </p>

      <div className="flex gap-4">
        <div className="flex w-full gap-2">
          <span className="font-bold text-left text-(--color_texto_oscuro)">País:</span>
          <p className="w-full text-left text-(--color_texto_oscuro) ">{paisUsuario}</p>
        </div>

        <div className="flex w-full gap-2">
          <span className="font-bold text-left text-(--color_texto_oscuro)">Género:</span>
          <p className="w-full text-left text-(--color_texto_oscuro) ">{generoUsuario}</p>
        </div>
      </div>
      <div className="flex justify-center border-t-2 border-(--color_bordes) text-(--color_texto_oscuro) pt-3 mt-4">
        <p className="font-bold uppercase">
          posible escritor en potencia <br />
        </p>
      </div>
    </div>
  );
}

function HistoriasUsuario() {
  const { codigo_usuario = "" } = useParams();
  const { isLoading, error, data } = useHistoriasUsuario(codigo_usuario);

  if (isLoading) {
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <HistoriaCardCargando key={index} />
        ))}
      </>
    );
  }
  if (error) {
    return <p className="text-red-500">Error loading history. {error.message}</p>;
  }

  return (
    <>
      {data?.length ? (
        data.map((historia: any) => (
          <HistoriaCard
            key={historia.id_historia}
            idh={historia.id_historia}
            titulo={historia.nombre_historia}
            descripcion={historia.descripcion_historia}
            calificacion={historia.calificacion_p}
            autor={{
              nombre_usuario: historia.nombre_usuario,
              foto_perfil_usuario: historia.foto_perfil_usuario,
              codigo_usuario: historia.codigo_usuario,
            }}
          />
        ))
      ) : (
        <p className="text-(--color_texto_oscuro)">Sin historias</p>
      )}
    </>
  );
}

function PerfilOtros() {
  return (
    <div className="flex flex-col gap-10 justify-center items-center p-10">
      <PerfilInfo />
      <br />
      <h2>Historias Usuario</h2>
      <div className="flex overflow-x-auto overflow-y-visible sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        <HistoriasUsuario />
      </div>
    </div>
  );
}

export default PerfilOtros;
