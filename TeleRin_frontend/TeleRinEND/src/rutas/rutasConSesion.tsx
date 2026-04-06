import Navbar from '../assets/botones_componentes/barra_lateral.tsx';
import { UserProvider, useUser } from '../assets/componentes/userContext.tsx'
import Header from '../header.tsx';
import { Outlet } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react'


function RutasUsuario() {
    return (
        <UserProvider>
            <RutasConSesion />
        </UserProvider>
    )
}

function RutasConSesion() {

    const { usuario } = useUser();
    const [cargando, setcargando] = useState(true);

    useEffect(() => {
        if (usuario !== null) {
            setcargando(false);
        }
    }, [usuario]);

    if (cargando) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl flex items-center gap-2"><p>Cargando perfil</p><Loader className="animate-spin" /></div>
            </div>
        );
    }

    return (
        <>
            <div className="absolute w-full insert-0 z-30">
                <Header url="/inicio" />
            </div>
            <div className='w-full pt-30 pb-20 h-full'>
                <Outlet/>
            </div>
            <div className="fixed bottom-0 left-0 w-full z-50">
                <Navbar />
            </div>
        </>
    )
}

export default RutasUsuario;