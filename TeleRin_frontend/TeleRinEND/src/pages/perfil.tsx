import { useSesion, useEditarSesion, useEditarFotoSesion } from "./hook/usuario/hookSesion";
import { UserPen, NotepadText, Loader, ImagePlus, ThumbsUp, SquareX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import { MensajePlano } from "../assets/componentes/mensaje";
import Modal from "../assets/componentes/modal";
import type { Genero, Pais } from "../types";
import { HistoriaCard, HistoriaCardCargando } from "../assets/componentes/sagas&historias_cards";
import { useHistorial } from "./hook/historias/hookHistorial";
import { useHistoriasUsuario } from "./hook/historias/hookHistoriasUsuario";
import { usePaises } from "./hook/hookPaises";
import { useGeneros } from "./hook/hookGeneros";

function Nombre() {
  const { data: usuario } = useSesion();
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
          mensaje={mutateSesion.data.mensaje}
          tipo={mutateSesion.data.tipo}
          id={1}
          onHide={() => mutateSesion.reset()}
        />
      )}
    </>
  );
}

function Descripcion() {
  const { data: usuario } = useSesion();
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
          mensaje={mutateSesion.data.mensaje}
          tipo={mutateSesion.data.tipo}
          id={1}
          onHide={() => mutateSesion.reset()}
        />
      )}
    </>
  );
}

function Imagen() {
  const { data: usuario } = useSesion();
  const mutateSesion = useEditarFotoSesion();
  const [abrirModal, setAbrirModal] = useState(false);
  const [nuevaFoto, setNuevaFoto] = useState<File | null>(null);
  const [imagen, setImagen] = useState("");
  const inputFotoRef = useRef<HTMLInputElement | null>(null);
  const [imagenPerfilCargada, setImagenPerfilCargada] = useState(false);

  function limpiarSeleccionFoto() {
    setNuevaFoto(null);
    setImagen("");
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
        className="bg-(--color_principal) w-full m-5 sm:max-w-lg flex flex-col gap-4 items-center"
      >
        <h3>Cambiar Foto Perfil</h3>
        <label className="border-6 rounded-full aspect-square w-sm flex items-center justify-center hover:cursor-pointer overflow-hidden">
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
            <SquareX
              color="var(--warning)"
              className="hover:cursor-pointer"
              onClick={() => {
                limpiarSeleccionFoto();
              }}
            />
          </div>
        )}
        {nuevaFoto && <p>{nuevaFoto.name}</p>}
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
          src={`/api/Fotos/perfil/${usuario?.foto_perfil_usuario}?size=reducida&t=${Date.now()}`}
          className="absolute inset-0 w-full h-full object-cover border-2 border-black"
          style={{ opacity: !imagenPerfilCargada ? 1 : 0 }}
        />

        {/* Imagen real con fade in */}
        <img
          className="w-40 h-40 object-cover border-2 border-black hover:cursor-pointer transition-opacity duration-300"
          style={{ opacity: imagenPerfilCargada ? 1 : 0 }}
          src={`/api/Fotos/perfil/${usuario?.foto_perfil_usuario}?t=${Date.now()}`}
          onLoad={() => setImagenPerfilCargada(true)}
        />
      </div>
    </div>
  );
}

function Pais() {
  const { data: usuario } = useSesion();
  const mutateSesion = useEditarSesion();
  const [paisUsuario, setPaisUsuario] = useState(usuario?.id_pais ?? "");
  const { data: paises, isLoading } = usePaises();

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
          mensaje={mutateSesion.data.mensaje}
          tipo={mutateSesion.data.tipo}
          id={1}
          onHide={() => mutateSesion.reset()}
        />
      )}
    </div>
  );
}

function Genero() {
  const { data: usuario } = useSesion();
  const mutateSesion = useEditarSesion();
  const { data: generos, isLoading } = useGeneros();
  const [generoUsuario, setGeneroUsuario] = useState(usuario?.id_genero ?? "");

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
          mensaje={mutateSesion.data.mensaje}
          tipo={mutateSesion.data.tipo}
          id={1}
          onHide={() => mutateSesion.reset()}
        />
      )}
    </div>
  );
}

function PerfilInfo() {
  return (
    <div className="max-w-md bg-(--color_principal_oscuro) border-4 border-(--color_bordes) p-2 font-serif text-center shadow-xl  lg:self-stretch lg:justify-senter lg:items-center">
      <h1 className="text-4xl text-(--color_texto_oscuro) font-extrabold tracking-widest border-b-4 border-(--color_bordes) pb-2 mb-4">
        SE BUSCA
      </h1>
      <Imagen />
      <h2 className="text-xl text-(--color_texto_oscuro) font-bold uppercase border-y-2 border-(--color_bordes) py-1 mb-3">
        Lector Serial
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
      {data.length ? (
        data.map((historia: any) => (
          <HistoriaCard
            key={historia.id_historia}
            idh={historia.id_historia}
            titulo={historia.nombre_historia}
            descripcion={historia.descripcion_historia}
            calificacion={historia.calificacion_p}
            autor={historia.nombre_usuario}
          />
        ))
      ) : (
        <p className="text-(--color_texto_oscuro)">Sin historias</p>
      )}
    </>
  );
}

function HistoriasUsuario() {
  const { data: usuario } = useSesion();
  const { isLoading, error, data } = useHistoriasUsuario(usuario?.codigo_usuario);

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
      {data.length ? (
        data.map((historia: any) => (
          <HistoriaCard
            key={historia.id_historia}
            idh={historia.id_historia}
            titulo={historia.nombre_historia}
            descripcion={historia.descripcion_historia}
            calificacion={historia.calificacion_p}
            autor={historia.nombre_usuario}
          />
        ))
      ) : (
        <p className="text-(--color_texto_oscuro)">Sin historias</p>
      )}
    </>
  );
}

function Perfil() {
  return (
    <div className="flex flex-col gap-10 justify-center items-center p-10">
      <PerfilInfo />
      <br />
      <h2>Historial</h2>
      <div className="flex overflow-x-scroll sm:overflow-auto sm:grid w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 z-20">
        <Historial />
      </div>
      <br />
      <h2>Historias Usuario</h2>
      <div className="flex overflow-x-scroll sm:overflow-auto sm:grid w-full sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 z-20">
        <HistoriasUsuario />
      </div>
    </div>
  );
}

export default Perfil;
