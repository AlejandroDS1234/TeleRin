import Navbar from '../assets/botones_componentes/barra_lateral.tsx';
import { UserProvider, useUser } from '../assets/componentes/userContext.tsx'
import Header from '../header.tsx';
import { Outlet } from "react-router-dom";
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
    const cargando = usuario === null;

    if (cargando) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl flex items-center gap-2"><p>Cargando perfil</p><Loader className="animate-spin" /></div>
            </div>
        );
    }



    return (
        <>
            <div className="absolute w-full insert-0 lg:pl-[60px] z-30">
                <Header url="/inicio" />
            </div>
            <div className="w-full min-h-screen pt-27 pb-20 lg:pb-6 lg:pl-[85px]">
                <Outlet />
            </div>
            <div className="fixed bottom-0 left-0 w-[100%] lg:top-0 lg:bottom-auto lg:h-[100vh] lg:w-[80px] insert-0 z-30">
                <Navbar />
            </div>
        </>
    )
}

export default RutasUsuario;
