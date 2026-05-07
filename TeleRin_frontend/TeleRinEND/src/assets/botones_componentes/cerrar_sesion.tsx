import Modal from "../componentes/modal"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useUser } from "../componentes/userContext";
import { redirigir } from "../../function_generales";
import { motion } from "framer-motion";

type CerrarSesionProps = {
    boton: React.ReactElement;
}


function CerrarSesion({ boton }: CerrarSesionProps) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const { setUsuario } = useUser();
    const navigate = useNavigate();

    const botonConFuncion = React.cloneElement(boton as React.ReactElement<any>, {
        onClick: () => setMostrarModal(true)
    });

    return (
        <>
            <Modal
                onClose={() => setMostrarModal(false)}
                open={mostrarModal}
                className="bg-(--color_principal) p-6 w-full m-5 flex justify-center items-center flex-col gap-4 aspect-video sm:w-auto"
            >
                <p>¿Deseas cerrar sesión?</p>
                <div className="flex flex-col gap-5 sm:flex-row w-full justify-center items-center sm:w-auto">
                    <motion.button
                        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer w-40"
                        whileHover={{ scale: 1.05 }}
                        onClick={async () => {
                            const pro = await fetch("/api/cerrar_sesion", {
                                method: "POST",
                                credentials: "include"
                            })
                            const res = await pro.json()
                            if (pro.ok) {
                                setUsuario(null);
                                sessionStorage.clear();
                                redirigir(navigate, res)
                            }
                        }}
                    >
                        Salir
                    </motion.button>
                </div>
            </Modal>

            {botonConFuncion}
        </>
    )
}

export default CerrarSesion 