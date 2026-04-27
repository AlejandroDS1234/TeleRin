import { useUser } from "../assets/componentes/userContext"
import { UserPen, NotepadText, Loader, ImagePlus, ThumbsUp, SquareX } from 'lucide-react'
import { useState, useEffect } from "react"
import { enviarInfoServer } from "../function_generales"
import { MensajePlano } from "../assets/componentes/mensaje"
import Modal from "../assets/componentes/modal"
import { set } from "react-hook-form"


function Historial() {
    return (
        <div>hi</div>
    )
}

async function cambiarDato(dato, setBoton, setCargando, setRes, setUsuario) {
    setCargando(true)
    setRes(null)
    try {
        const res = await enviarInfoServer("/api/perfil", dato)
        setRes(res)
        if (res.tipo == "success") {
            setBoton(false)
            setUsuario((prev) => ({ ...prev, ...dato }))
        }
    } catch (error) {
        setRes({ mensaje: "Error de conexión", tipo: "danger" })
    } finally {
        setCargando(false)
    }
}

function Nombre() {
    const [res, setRes] = useState(null)
    const { usuario, setUsuario } = useUser()
    const [nombre, setNombre] = useState(usuario.nombre_usuario)
    const [cambioNombre, setCambioNombre] = useState(false)
    const [cargandoNombre, setCargandoNombre] = useState(false)

    return (
        <>
            <p className="text-left mb-2 flex gap-2">
                <span className="font-bold">Nombre:</span>
                <input
                    className="w-full border-b-2"
                    type="text"
                    value={nombre}
                    onChange={(e) => {
                        e.target.value != usuario.nombre_usuario ? setCambioNombre(true) : setCambioNombre(false)
                        setNombre(e.target.value)
                    }}
                />
                <button
                    className="hover:cursor-pointer"
                    disabled={cargandoNombre || !cambioNombre}
                    onClick={
                        () => {
                            cambiarDato({ "nombre_usuario": nombre }, setCambioNombre, setCargandoNombre, setRes, setUsuario)
                        }
                    }>
                    {cargandoNombre ? <Loader className="animate-spin" /> : <UserPen color={cambioNombre ? "#01af02" : "#000"} className={cambioNombre ? "animate-bounce" : "hover:cursor-not-allowed"} />}
                </button>
            </p>
            {res && <MensajePlano mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} onHide={() => setRes(null)} />}
        </>
    )
}

function Descripcion() {
    const [res, setRes] = useState(null)
    const { usuario, setUsuario } = useUser()
    const [descripcion, setDescripcion] = useState(usuario.descripcion_personal)
    const [cambioDescripcion, setCambioDescripcion] = useState(false)
    const [cargandoDescripcion, setCargandoDescripcion] = useState(false)

    return (
        <>
            <p className="text-left mb-4 flex gap-2">
                <span className="font-bold">Descripción:</span>
                <input
                    className="w-full border-b-2"
                    type="text"
                    value={descripcion}
                    onChange={(e) => {
                        e.target.value != usuario.descripcion_personal ? setCambioDescripcion(true) : setCambioDescripcion(false)
                        setDescripcion(e.target.value)
                    }}
                />
                <button
                    className="hover:cursor-pointer "
                    disabled={cargandoDescripcion || !cambioDescripcion}
                    onClick={
                        () => {
                            cambiarDato({ "descripcion_personal": descripcion }, setCambioDescripcion, setCargandoDescripcion, setRes, setUsuario)
                        }
                    }>
                    {cargandoDescripcion ? <Loader className="animate-spin" /> : <NotepadText color={cambioDescripcion ? "#01af02" : "#000"} className={cambioDescripcion ? "animate-bounce" : "hover:cursor-not-allowed"} />}
                </button>
            </p>
            {res && <MensajePlano mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} onHide={() => setRes(null)} />}
        </>
    )
}

function Imagen() {
    const { usuario, setUsuario } = useUser()
    const [abrirModal, setAbrirModal] = useState(false)

    const [nuevaFoto, setNuevaFoto] = useState(null)
    const [imagen, setImagen] = useState("")

    const [res, setRes] = useState(null)



    return (
        < div className="flex justify-center items-center mb-4 z-1" >
            <Modal open={abrirModal}
                onClose={() => setAbrirModal(false)}
                className="bg-[var(--color_principal)] w-full m-5 sm:max-w-lg flex flex-col gap-4 items-center">


                <h3>Cambiar Foto Perfil</h3>
                <label className={`border border-6 rounded-full aspect-square w-sm
                    flex items-center justify-center hover:cursor-pointer overflow-hidden`} >
                    {nuevaFoto ? <img src={imagen} className="object-cover aspect-square" /> : <ImagePlus size={200} className="" />}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onInput={(e) => {
                            if (e.target.files[0]) {
                                setNuevaFoto(e.target.files[0])
                                setImagen(URL.createObjectURL(e.target.files[0]))
                            }
                        }} />
                </label>
                {nuevaFoto && (<div className="flex gap-4">
                    <ThumbsUp
                        color="#01af02"
                        className="hover:cursor-pointer"
                        onClick={async () => {
                            const data = new FormData()
                            data.append("imagen", nuevaFoto)
                            const res = await enviarInfoServer("/api/guardar_foto_perfil", data)
                            setRes(res)
                            if (res.tipo == "success") {
                                setUsuario((prev) => ({ ...prev, foto_perfil_usuario: res.foto_perfil_usuario }))
                                setTimeout(() => {
                                    setNuevaFoto(null)
                                    setImagen("")
                                    setRes(null)
                                    setAbrirModal(false)
                                }, 1500)
                            }
                        }} />
                    <SquareX
                        color="#FF0000"
                        className="hover:cursor-pointer"
                        onClick={() => {
                            setNuevaFoto(null)
                            setImagen("")
                        }} />
                </div>)}
                {nuevaFoto && (<p>{nuevaFoto.name}</p>)}
                {res && (<MensajePlano mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} onHide={() => setRes(null)} />)}

            </Modal>
            <img
                className="w-40 h-40 object-cover border-2 border-black hover:cursor-pointer"
                src={`/api/Fotos/perfil/${usuario.foto_perfil_usuario}?t=${Date.now()}`}
                onClick={() => setAbrirModal(true)}
            />
        </div >
    )
}

function Pais() {
    const { usuario, setUsuario } = useUser()
    const [res, setRes] = useState(null)
    const [paises, setPaises] = useState([])
    const [paisUsuario, setPaisUsuario] = useState(usuario.id_pais)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const fetchPaises = async () => {
            try {
                const pro = await fetch("/api/paises", { method: "POST", credentials: "include" })
                const paises = await pro.json()
                setPaises(paises)
            } catch {
                return (
                    <div>error</div>
                )
            } finally {

                setCargando(false)
            }
        }
        fetchPaises()
    }, [])

    if (cargando) {
        return (
            <div>
                <p>Cargando <Loader className="animate-spin" /></p>
            </div>
        )
    }

    function hola(ji) { console.log("hola") }

    return (
        <div className="flex flex-col w-full">
            <select
                className="w-full border-b-2"
                disabled={cargando}
                value={paisUsuario}
                onChange={(e) => {
                    setPaisUsuario(e.target.value)
                    cambiarDato({ "id_pais": e.target.value }, hola, setCargando, setRes, setUsuario)
                }
                }
            >
                {paises.map(pais => (
                    <option key={pais.id_pais} value={pais.id_pais}>
                        {pais.nombre_pais}
                    </option>
                ))}
            </select>
            {res && <MensajePlano mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} onHide={() => setRes(null)} />}
        </div>
    )
}


function Genero() {
    const { usuario, setUsuario } = useUser()
    const [res, setRes] = useState(null)
    const [generos, setGeneros] = useState([])
    const [generoUsuario, setGeneroUsuario] = useState(usuario.id_genero)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                const pro = await fetch("/api/generos", { method: "POST", credentials: "include" })
                const generos = await pro.json()
                setGeneros(generos)
            } catch {
                return (
                    <div>error</div>
                )
            } finally {

                setCargando(false)
            }
        }
        fetchGeneros()
    }, [])

    if (cargando) {
        return (
            <div>
                <p>Cargando <Loader className="animate-spin" /></p>
            </div>
        )
    }

    function hola(ji) { let a = "malas practicas, creo" }

    return (
        <div className="flex flex-col w-full">
            <select
                className="w-full border-b-2"
                disabled={cargando}
                value={generoUsuario}
                onChange={(e) => {
                    setGeneroUsuario(e.target.value)
                    cambiarDato({ "id_genero": e.target.value }, hola, setCargando, setRes, setUsuario)
                }
                }
            >
                {generos.map(genero => (
                    <option key={genero.id_genero} value={genero.id_genero}>
                        {genero.nombre_genero}
                    </option>
                ))}
            </select>
            {res && <MensajePlano mensaje={res.mensaje} tipo={res.tipo} id={Date.now()} onHide={() => setRes(null)} />}
        </div>
    )
}

function Perfil() {
    return (
        <div className="max-w-md mx-auto bg-[#F4E2B6] border-4 border-black p-6 font-serif text-center shadow-xl">
            <h1 className="text-4xl font-extrabold tracking-widest border-b-4 border-black pb-2 mb-4">
                SE BUSCA
            </h1>
            <Imagen />
            <h2 className="text-xl font-bold uppercase border-y-2 border-black py-2 mb-3">
                Lector Serial
            </h2>
            <Nombre />
            <Descripcion />
            <div className="flex gap-4">
                <Pais />
                <Genero />
            </div>


            <div className="flex justify-center border-t-2 border-black pt-3 mt-4">
                <p className="font-bold uppercase">Se busca información <br /><small className="font-thin">(Escribe en los campos para editar)</small></p>
            </div>
        </div >
    )
}

export default Perfil
