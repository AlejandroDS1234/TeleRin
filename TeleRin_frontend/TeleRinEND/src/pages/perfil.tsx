import { useSesion, useEditarSesion, useEditarFotoSesion } from "./hook/usuario/hookSesion";
import { UserPen, NotepadText, Loader, ImagePlus, ThumbsUp, SquareX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import { MensajePlano } from "../assets/componentes/mensaje";
import Modal from "../assets/componentes/modal";
import type { Genero, Pais } from "../types";
import {
  HistoriaCard,
  HistoriaCardCargando,
  HistoriaCardEditar,
} from "../assets/componentes/historias_cards";
import { useHistorial } from "./hook/historias/hookHistorial";
import { useHistoriasUsuario } from "./hook/historias/hookHistoriasUsuario";
import { usePaises } from "./hook/hookPaises";
import { useGeneros } from "./hook/hookGeneros";
import Consultas from "./admin/consultas_usuarios";
import { useSiguiendo } from "./hook/usuario/hookSiguiendo";
import { useSeguidores } from "./hook/usuario/hookSeguidores";
import {
  CardUsuario,
  CardUsuarioPropio,
  CardUsuarioCargando,
} from "../assets/componentes/card_usuario";
import { useSagasCreadas } from "./hook/sagas/hookSagasCreadas";
import { Sagacard, SagaCardCargando } from "../assets/componentes/sagas_cards";

function Nombre() {
  const { data: usuario } = useSesion("nombre_usuario");
  const mutateSesion = useEditarSesion();
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    setNombre(usuario?.nombre_usuario ?? "");
  }, [usuario?.nombre_usuario]);

  const nombreActualSesion = usuario?.nombre_usuario ?? "";
  const nombreLimpio = nombre.trim();
  const cambioNombre = nombreLimpio !== nombreActualSesion;
  return (
    <>
      <p className="text-left text-(--color_texto_oscuro) mb-2 flex gap-2">
        <span className="font-bold">Nombre:</span>
        <input
          className="w-full border-b-2"
          type="text"
          value={nombre}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNombre(e.target.value);
          }}
        />
        <button
          className="hover:cursor-pointer"
          disabled={mutateSesion.isPending || !cambioNombre}
          onClick={() => {
            mutateSesion.mutate({ nombre_usuario: nombreLimpio });
          }}
        >
          {mutateSesion.isPending ? (
            <Loader className="animate-spin" />
          ) : (
            <UserPen
              color={cambioNombre ? "#01af02" : "#000"}
              className={cambioNombre ? "animate-bounce" : "hover:cursor-not-allowed"}
            />
          )}
        </button>
      </p>
      {mutateSesion.data && (
        <MensajePlano
          mensaje={mutateSesion.data.mensaje.mensaje}
          tipo={mutateSesion.data.mensaje.tipo}
          id={1}
          onHide={() => mutateSesion.reset()}
        />
      )}
    </>
  );
}

function Descripcion() {
  const { data: usuario } = useSesion("descripcion_personal");
  const mutateSesion = useEditarSesion();
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    setDescripcion(usuario?.descripcion_personal ?? "");
  }, [usuario?.descripcion_personal]);

  const descripcionActualSesion = usuario?.descripcion_personal ?? "";
  const descripcionLimpia = descripcion.trim();
  const cambioDescripcion = descripcionLimpia !== descripcionActualSesion;

  return (
    <>
      <p className="text-left text-(--color_texto_oscuro) mb-4 flex gap-2">
        <span className="font-bold">Descripción:</span>
        <input
          className="w-full border-b-2"
          type="text"
          value={descripcion}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setDescripcion(e.target.value);
          }}
        />
        <button
          className="hover:cursor-pointer"
          disabled={mutateSesion.isPending || !cambioDescripcion}
          onClick={() => {
            mutateSesion.mutate({ descripcion_personal: descripcionLimpia });
          }}
        >
          {mutateSesion.isPending ? (
            <Loader className="animate-spin" />
          ) : (
            <NotepadText
              color={cambioDescripcion ? "#01af02" : "#000"}
              className={cambioDescripcion ? "animate-bounce" : "hover:cursor-not-allowed"}
            />
          )}
        </button>
      </p>
      {mutateSesion.data && (
        <MensajePlano
          mensaje={mutateSesion.data.mensaje.mensaje}
          tipo={mutateSesion.data.mensaje.tipo}
          id={1}
          onHide={() => mutateSesion.reset()}
        />
      )}
    </>
  );
}

function Imagen() {
  const { data: usuario } = useSesion("foto_perfil_usuario");
  const mutateSesion = useEditarFotoSesion();
  const [abrirModal, setAbrirModal] = useState(false);
  const [nuevaFoto, setNuevaFoto] = useState<File | null>(null);
  const [imagen, setImagen] = useState("");
  const inputFotoRef = useRef<HTMLInputElement | null>(null);
  const [imagenPerfilCargada, setImagenPerfilCargada] = useState(false);

  function limpiarSeleccionFoto() {
    setNuevaFoto(null);
    setImagen("");
    mutateSesion.reset();
    if (inputFotoRef.current) {
      inputFotoRef.current.value = "";
    }
  }

  return (
    <div className="flex justify-center items-center mb-4 z-1">
      <Modal
        open={abrirModal}
        onClose={() => {
          limpiarSeleccionFoto();
          setAbrirModal(false);
        }}
        className="bg-(--color_principal) w-full sm:max-h-[95%] m-5 sm:max-w-lg flex flex-col gap-4 items-center p-5"
      >
        <h3>Cambiar Foto Perfil</h3>
        <label className="border-6 rounded-full aspect-square sm:h-full sm:min-h-100 sm:w-auto w-full flex items-center justify-center hover:cursor-pointer overflow-hidden">
          {nuevaFoto ? (
            <img src={imagen} className="object-cover aspect-square" />
          ) : (
            <ImagePlus size={200} />
          )}
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const archivo = e.target.files?.[0];
              if (archivo) {
                setNuevaFoto(archivo);
                setImagen(URL.createObjectURL(archivo));
              }
            }}
          />
        </label>
        {nuevaFoto && (
          <div className="flex gap-4">
            {mutateSesion.isPending ? (
              <Loader color="var(--success)" className="animate-spin" />
            ) : (
              <ThumbsUp
                color="var(--success)"
                className="hover:cursor-pointer"
                onClick={async () => {
                  const data = new FormData();
                  data.append("imagen", nuevaFoto);
                  mutateSesion.mutate(data, {
                    onSuccess: (data) => {
                      if (data.tipo == "success") {
                        setTimeout(() => {
                          limpiarSeleccionFoto();
                          setAbrirModal(false);
                        }, 1500);
                      }
                    },
                  });
                }}
              />
            )}
            <SquareX
              color="var(--warning)"
              className="hover:cursor-pointer"
              onClick={() => {
                limpiarSeleccionFoto();
              }}
            />
          </div>
        )}
        {nuevaFoto && !mutateSesion.data && (
          <p className="truncate w-full text-center">{nuevaFoto.name}</p>
        )}
        {mutateSesion.data && (
          <MensajePlano
            mensaje={mutateSesion.data.mensaje}
            tipo={mutateSesion.data.tipo}
            id={1}
            onHide={() => mutateSesion.reset()}
          />
        )}
      </Modal>
      <div className="relative w-40 h-40 cursor-pointer" onClick={() => setAbrirModal(true)}>
        {/* Placeholder borroso (imagen reducida) */}
        <img
          src={`/api/Fotos/perfil/${usuario?.foto_perfil_usuario}?size=reducida&t=${usuario?.refrescado ?? 0}`}
          className="absolute inset-0 w-full h-full object-cover border-2 border-black"
          style={{ opacity: !imagenPerfilCargada ? 1 : 0 }}
        />

        {/* Imagen real con fade in */}
        <img
          className="w-40 h-40 object-cover border-2 border-black hover:cursor-pointer transition-opacity duration-300"
          style={{ opacity: imagenPerfilCargada ? 1 : 0 }}
          src={`/api/Fotos/perfil/${usuario?.foto_perfil_usuario}?t=${usuario?.refrescado ?? 0}`}
          onLoad={() => setImagenPerfilCargada(true)}
        />
      </div>
    </div>
  );
}

function Pais() {
  const { data: usuario } = useSesion("id_pais");
  const mutateSesion = useEditarSesion();
  const [paisUsuario, setPaisUsuario] = useState(usuario?.id_pais ?? "");
  const { data: paises, isLoading } = usePaises();

  useEffect(() => {
    setPaisUsuario(usuario?.id_pais ?? "");
  }, [usuario?.id_pais]);

  if (isLoading)
    return (
      <p className="flex w-full text-center">
        Cargando <Loader className="animate-spin" />
      </p>
    );

  return (
    <div className="flex flex-col w-full">
      <select
        className="w-full border-b-2 text-(--color_texto_oscuro) "
        disabled={isLoading || mutateSesion.isPending}
        value={paisUsuario}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setPaisUsuario(e.target.value);
          mutateSesion.mutate({ id_pais: e.target.value });
        }}
      >
        {paises.map((pais: Pais) => (
          <option
            className="bg-(--color_principal_claro) text-(--color_texto_oscuro)"
            key={pais.id_pais}
            value={pais.id_pais}
          >
            {pais.nombre_pais}
          </option>
        ))}
      </select>
      {mutateSesion.data && (
        <MensajePlano
          mensaje={mutateSesion.data.mensaje.mensaje}
          tipo={mutateSesion.data.mensaje.tipo}
          id={1}
          onHide={() => mutateSesion.reset()}
        />
      )}
    </div>
  );
}

function Genero() {
  const { data: usuario } = useSesion("id_genero");
  const mutateSesion = useEditarSesion();
  const { data: generos, isLoading } = useGeneros();
  const [generoUsuario, setGeneroUsuario] = useState(usuario?.id_genero ?? "");

  useEffect(() => {
    setGeneroUsuario(usuario?.id_genero ?? "");
  }, [usuario?.id_genero]);

  if (isLoading)
    return (
      <p className="flex w-full text-center">
        Cargando <Loader className="animate-spin" />
      </p>
    );

  return (
    <div className="flex flex-col w-full">
      <select
        className="w-full border-b-2 text-(--color_texto_oscuro) "
        disabled={isLoading || mutateSesion.isPending}
        value={generoUsuario}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setGeneroUsuario(e.target.value);
          mutateSesion.mutate({ id_genero: e.target.value });
        }}
      >
        {generos.map((genero: Genero) => (
          <option
            className="bg-(--color_principal_claro) text-(--color_texto_oscuro)"
            key={genero.id_genero}
            value={genero.id_genero}
          >
            {genero.nombre_genero}
          </option>
        ))}
      </select>
      {mutateSesion.data && (
        <MensajePlano
          mensaje={mutateSesion.data.mensaje.mensaje}
          tipo={mutateSesion.data.mensaje.tipo}
          id={1}
          onHide={() => mutateSesion.reset()}
        />
      )}
    </div>
  );
}

function Siguiendo() {
  const { data: usuario } = useSesion("codigo_usuario");
  const { isLoading, error, data } = useSiguiendo(usuario?.codigo_usuario ?? "");
  const [modalAbierto, setModalAbierto] = useState(false);

  const usuarioPropio = data?.find((u: any) => u.codigo_usuario === usuario?.codigo_usuario);
  const otrosUsuarios = data?.filter((u: any) => u.codigo_usuario !== usuario?.codigo_usuario);

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
        <p>Usuarios que sigues:</p>
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
  const { isLoading, error, data } = useSeguidores(usuario?.codigo_usuario ?? "");
  const [modalAbierto, setModalAbierto] = useState(false);

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
        className="w-full m-5 sm:max-w-lg h-full max-h-120 bg-(--color_principal)  flex flex-col gap-4"
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
      >
        <p>Usuarios que te siguen:</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(25%,1fr))] gap-4 over overflow-x-auto scroll-suave">
          {isLoading ? (
            <>
              {[...Array(5)].map((_, index) => (
                <CardUsuarioCargando key={index} />
              ))}
            </>
          ) : data?.length ? (
            data.map((usuario: any) => (
              <CardUsuario
                key={usuario.codigo_usuario}
                codigo_usuario={usuario.codigo_usuario}
                nombre_usuario={usuario.nombre_usuario}
                foto_perfil_usuario={usuario.foto_perfil_usuario}
                seguido={usuario.seguido}
              />
            ))
          ) : (
            <p className="text-(--color_texto_oscuro)">Sin usuarios</p>
          )}
        </div>
      </Modal>
    </>
  );
}

function PerfilInfo() {
  return (
    <div className="max-w-md sm:min-w-sm bg-(--color_principal_oscuro) border-4 border-(--color_bordes) p-2 font-serif text-center shadow-xl  self-start">
      <h1 className="text-4xl text-(--color_texto_oscuro) font-extrabold tracking-widest border-b-4 border-(--color_bordes) pb-2 mb-4">
        Lector Serial
      </h1>
      <Imagen />
      <h2 className=" text-(--color_texto_oscuro) font-bold border-y-2 border-(--color_bordes) py-1 mb-3 flex justify-center gap-10">
        <Siguiendo />
        <Seguidores />
      </h2>
      <Nombre />
      <Descripcion />
      <div className="flex gap-4">
        <Pais />
        <Genero />
      </div>
      <div className="flex justify-center border-t-2 border-(--color_bordes) text-(--color_texto_oscuro) pt-3 mt-4">
        <p className="font-bold uppercase">
          Se busca información <br />
          <small>(Escribe en los campos para editar)</small>
        </p>
      </div>
    </div>
  );
}

function Historial() {
  const { isLoading, error, data } = useHistorial();

  if (isLoading) {
    return (
      <div className="flex overflow-x-auto sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
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
    <div className="flex overflow-x-auto sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
      {data.length ? (
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

function HistoriasUsuario() {
  const { data: usuario } = useSesion("codigo_usuario");
  const { isLoading, error, data } = useHistoriasUsuario(usuario?.codigo_usuario);

  if (isLoading) {
    return (
      <div className="flex overflow-x-auto sm:grid sm:overflow-visible w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
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
          <HistoriaCardEditar
            key={historia.id_historia}
            idh={historia.id_historia}
            titulo={historia.nombre_historia}
            descripcion={historia.descripcion_historia}
            calificacion={historia.calificacion_p}
            visibilidad={historia.visibilidad_historia}
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
  const { data: usuario } = useSesion("codigo_usuario");
  const { isLoading, error, data } = useSagasCreadas(usuario?.codigo_usuario);

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

function Perfil() {
  const [menuActivo, setMenuActivo] = useState("historial");
  const menus = {
    historial: <Historial />,
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
                menuActivo === "historial"
                  ? "bg-(--neutral-150) text-(--color_texto_botones) font-bold text-xl"
                  : "bg-(--color_principal_claro)"
              }`}
              onClick={() => setMenuActivo("historial")}
              title="Tu historial"
            >
              Historial
            </button>
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
          <div className="contenedor-scroll h-[92%] p-2 overflow-auto scroll-suave ">
            {menus[menuActivo as keyof typeof menus]}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Perfil;
