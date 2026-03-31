import Index from '../pages/index.tsx'
import Registrarse from '../pages/registrarse.tsx'
import Iniciar_sesion from '../pages/iniciar_sesion.tsx'
import { Routes, Route } from "react-router-dom";

function RutasIngresar() {
    return (
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/registrarse" element={<Registrarse />} />
            <Route path="/iniciar_sesion" element={<Iniciar_sesion />} />
        </Routes>)
}

export default RutasIngresar;