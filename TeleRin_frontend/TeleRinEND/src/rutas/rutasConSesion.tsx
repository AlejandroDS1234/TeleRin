import Navbar from "../assets/botones_componentes/barra_lateral.tsx";
import Header from "../header.tsx";
import { Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSesion } from "../pages/hook/usuario/hookSesion";

const queryClient = new QueryClient();

function RutasUsuario() {
  return (
    <QueryClientProvider client={queryClient}>
      <RutasConSesion />
    </QueryClientProvider>
  );
}

function RutasConSesion() {
  const { isPending, error } = useSesion();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl flex items-center gap-2">
          <p>Cargando perfil</p>
          <Loader className="animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl flex items-center gap-2">
          <p>No se pudo acceder al perfil: {error.message}</p>
          <Loader className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute w-full insert-0 lg:pl-15 z-30">
        <Header url="/inicio" />
      </div>
      <div className="w-full min-h-screen pt-27 pb-20 lg:pb-6 lg:pl-21.25 ">
        <Outlet />
      </div>
      <div className="fixed bottom-0 left-0 w-full lg:top-0 lg:bottom-auto lg:h-screen lg:w-20 insert-0 z-30 ">
        <Navbar />
      </div>
    </>
  );
}

export default RutasUsuario;
