import { useState, useEffect } from "react";
import Modal from "../assets/componentes/modal";
import type { Genero, Pais } from "../types";
import { HistoriaCard, HistoriaCardCargando } from "../assets/componentes/historias_cards";
import { useHistoriasUsuario } from "./hook/historias/hookHistoriasUsuario";
import { usePaises } from "./hook/hookPaises";
import { useGeneros } from "./hook/hookGeneros";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useSiguiendo, useSiguiendoUsuario } from "./hook/usuario/hookSiguiendo";
import { useSeguidores } from "./hook/usuario/hookSeguidores";
import {
  CardUsuario,
  CardUsuarioPropio,
  CardUsuarioCargando,
} from "../assets/componentes/card_usuario";
import { useOtroUsuario } from "./hook/usuario/hookOtroUsuario";
import { Sagacard, SagaCardCargando } from "../assets/componentes/sagas_cards";
import { useSagasCreadas } from "./hook/sagas/hookSagasCreadas";
import { useSesion } from "./hook/usuario/hookSesion";
import { useSeguir, useDejarDeSeguir } from "./hook/usuario/hookSeguir";

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

function Siguiendo() {
  const { data: usuario } = useSesion("codigo_usuario");
  const { codigo_usuario = "" } = useParams();
  const { isLoading, error, data } = useSiguiendo(codigo_usuario ?? "");
  const [modalAbierto, setModalAbierto] = useState(false);

  const usuarioPropio = data?.find((u: any) => u.codigo_usuario === usuario?.codigo_usuario);
  const otrosUsuarios = data?.filter((u: any) => u.codigo_usuario !== usuario?.codigo_usuario);

  useEffect(() => {
    data && setModalAbierto(false);
  }, [codigo_usuario]);

  if (error) {
    return <p className="text-red-500">Error {error.message}</p>;
  }
  return (
    <>
      <p
        className="hover:cursor-pointer hover:bg-(--bg-surface-muted) py-0.5 px-1 rounded-md flex"
        onClick={() => setModalAbierto(true)}
      >
        Siguiendo: {isLoading ? <Loader className="animate-spin" /> : data?.length}
      </p>
      <Modal
        className="w-full sm:max-w-lg h-full max-h-120 bg-(--color_principal) m-5 flex flex-col gap-4"
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
      >
        <p>Usuarios que sigue:</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(25%,1fr))] gap-4 over overflow-x-auto scroll-suave">
          {isLoading ? (
            <>
              {[...Array(5)].map((_, index) => (
                <CardUsuarioCargando key={index} />
              ))}
            </>
          ) : data?.length ? (
            <>
              {/* Primero el usuario propio si se encuentra en la lista */}
              {usuarioPropio && (
                <CardUsuarioPropio
                  key={usuarioPropio.codigo_usuario}
                  codigo_usuario={usuarioPropio.codigo_usuario}
                  nombre_usuario={usuarioPropio.nombre_usuario}
                  foto_perfil_usuario={usuarioPropio.foto_perfil_usuario}
                />
              )}

              {/* Después todos los demás usuarios */}
              {otrosUsuarios.map((user: any) => (
                <CardUsuario
                  key={user.codigo_usuario}
                  codigo_usuario={user.codigo_usuario}
                  nombre_usuario={user.nombre_usuario}
                  foto_perfil_usuario={user.foto_perfil_usuario}
                  seguido={user.seguido}
                />
              ))}
            </>
          ) : (
            <p className="text-(--color_texto_oscuro)">Sin usuarios</p>
          )}
        </div>
      </Modal>
    </>
  );
}

function Seguidores() {
  const { data: usuario } = useSesion("codigo_usuario");
  const { codigo_usuario = "" } = useParams();
  const { isLoading, error, data } = useSeguidores(codigo_usuario ?? "");
  const [modalAbierto, setModalAbierto] = useState(false);

  const usuarioPropio = data?.find((u: any) => u.codigo_usuario === usuario?.codigo_usuario);
  const otrosUsuarios = data?.filter((u: any) => u.codigo_usuario !== usuario?.codigo_usuario);

  useEffect(() => {
    data && setModalAbierto(false);
  }, [codigo_usuario]);

  if (error) {
    return <p className="text-red-500">Error {error.message}</p>;
  }
  return (
    <>
      <p
        className="hover:cursor-pointer hover:bg-(--bg-surface-muted) py-0.5 px-1 rounded-md flex"
        onClick={() => setModalAbierto(true)}
      >
        Seguidores: {isLoading ? <Loader className="animate-spin" /> : data?.length}
      </p>
      <Modal
        className="w-full sm:max-w-lg h-full max-h-120 bg-(--color_principal) m-5 flex flex-col gap-4"
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
      >
        <p>Usuarios que lo siguen:</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(25%,1fr))] gap-4 over overflow-x-auto scroll-suave">
          {isLoading ? (
            <>
              {[...Array(5)].map((_, index) => (
                <CardUsuarioCargando key={index} />
              ))}
            </>
          ) : data?.length ? (
            <>
              {/* Primero el usuario propio si se encuentra en la lista */}
              {usuarioPropio && (
                <CardUsuarioPropio
                  key={usuarioPropio.codigo_usuario}
                  codigo_usuario={usuarioPropio.codigo_usuario}
                  nombre_usuario={usuarioPropio.nombre_usuario}
                  foto_perfil_usuario={usuarioPropio.foto_perfil_usuario}
                />
              )}

              {/* Después todos los demás usuarios */}
              {otrosUsuarios.map((user: any) => (
                <CardUsuario
                  key={user.codigo_usuario}
                  codigo_usuario={user.codigo_usuario}
                  nombre_usuario={user.nombre_usuario}
                  foto_perfil_usuario={user.foto_perfil_usuario}
                  seguido={user.seguido}
                />
              ))}
            </>
          ) : (
            <p className="text-(--color_texto_oscuro)">Sin usuarios</p>
          )}
        </div>
      </Modal>
    </>
  );
}

function BotonSeguir() {
  const { codigo_usuario = "" } = useParams();
  const mutateSeguir = useSeguir();
  const mutateDejarDeSeguir = useDejarDeSeguir();
  const { data } = useSiguiendoUsuario(codigo_usuario);

  return !data?.siguiendo ? (
    <button
      className="bg-(--color_botones) hover:bg-(--color_botones_presionado) hover:cursor-pointer rounded-2xl px-2 text-center text-(--color_texto_botones) w-70"
      onClick={() => mutateSeguir.mutate(codigo_usuario)}
    >
      {mutateSeguir.isPending ? "Siguiendo..." : "Seguir"}
    </button>
  ) : (
    <button
      className="bg-(--border-alpha-45) hover:bg-(--card-tint-1) hover:cursor-pointer px-2 rounded-2xl w-70"
      onClick={() => mutateDejarDeSeguir.mutate(codigo_usuario)}
    >
      {mutateDejarDeSeguir.isPending ? "Rompiendo..." : "Romper"}
    </button>
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
      <div className="max-w-md min-w-sm bg-(--color_principal_oscuro) border-4 border-(--color_bordes) p-2 font-serif text-center shadow-xl  lg:self-stretch lg:justify-senter lg:items-center">
        <div className="flex items-center justify-center h-screen">
          <Loader className="animate-spin" />
        </div>
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
    <div className="max-w-md min-w-sm bg-(--color_principal_oscuro) border-4 border-(--color_bordes) p-2 font-serif text-center shadow-xl  lg:self-stretch lg:justify-senter lg:items-center">
      <h1 className="text-4xl text-(--color_texto_oscuro) font-extrabold tracking-widest border-b-4 border-(--color_bordes) pb-2 mb-4">
        SE BUSCA
      </h1>
      <Imagen />
      <h2 className=" text-(--color_texto_oscuro) font-bold border-y-2 border-(--color_bordes) py-1 mb-3 flex justify-center gap-10">
        <Siguiendo />
        <Seguidores />
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
      <div className="flex flex-col gap-5 justify-center items-center border-t-2 border-(--color_bordes)  pt-3 mt-4">
        <p className="font-bold uppercase text-(--color_texto_oscuro)">
          posible escritor en potencia
        </p>
        <BotonSeguir />
      </div>
    </div>
  );
}

function HistoriasUsuario() {
  const { codigo_usuario = "" } = useParams();
  const { isLoading, error, data } = useHistoriasUsuario(codigo_usuario);

  if (isLoading) {
    return (
      <div className="flex overflow-x-auto overflow-y-visible sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        {[...Array(5)].map((_, index) => (
          <HistoriaCardCargando key={index} />
        ))}
      </div>
    );
  }
  if (error) {
    return <p className="text-red-500">Error loading history. {error.message}</p>;
  }

  return (
    <div className="flex overflow-x-auto overflow-y-visible sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
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
    </div>
  );
}

function SagasUsuario() {
  const { codigo_usuario = "" } = useParams();
  const { isLoading, error, data } = useSagasCreadas(codigo_usuario);

  if (isLoading) {
    return (
      <div className="flex overflow-x-auto overflow-y-hidden sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        {[...Array(5)].map((_, index) => (
          <SagaCardCargando key={index} />
        ))}
      </div>
    );
  }
  if (error) {
    return <p className="text-red-500">Error loading sagas. {error.message}</p>;
  }
  return (
    <div className="flex overflow-x-auto overflow-y-hidden sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
      {data?.length ? (
        data.map((saga: any) => (
          <Sagacard
            key={saga.id_saga}
            ids={saga.id_saga}
            titulo={saga.nombre_saga}
            descripcion={saga.descripcion_saga}
            img={saga.imagen_saga}
            libros={saga.libros}
          />
        ))
      ) : (
        <p className="text-(--color_texto_oscuro)">Sin sagas</p>
      )}
    </div>
  );
}

function PerfilOtros() {
  const [menuActivo, setMenuActivo] = useState("historias");
  const menus = {
    historias: <HistoriasUsuario />,
    sagas: <SagasUsuario />,
  };

  return (
    <div className="w-full min-h-[90vh] sm:h-[90vh] sm:max-h-[95vh] flex  justify-center p-4">
      <div className="flex flex-col sm:flex-row w-full gap-2 lg:h-full">
        <PerfilInfo />
        <div className="h-full w-full">
          <div className=" h-10 sm:h-10 flex items-end divide-x divide-(--color_bordes) border-b">
            <button
              className={`flex-1 h-full truncate hover:cursor-pointer ${
                menuActivo === "historias"
                  ? "bg-(--neutral-150) text-(--color_texto_botones) font-bold text-xl"
                  : "bg-(--color_principal_claro)"
              }`}
              onClick={() => setMenuActivo("historias")}
              title="Historias creadas"
            >
              Historias
            </button>
            <button
              className={`flex-1 h-full truncate hover:cursor-pointer ${
                menuActivo === "sagas"
                  ? "bg-(--neutral-150) text-(--color_texto_botones) font-bold text-xl"
                  : "bg-(--color_principal_claro)"
              }`}
              onClick={() => setMenuActivo("sagas")}
              title="Sagas creadas"
            >
              Sagas
            </button>
          </div>
          <div className=" h-[92%] p-5 overflow-auto scroll-suave">
            {menus[menuActivo as keyof typeof menus]}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilOtros;
