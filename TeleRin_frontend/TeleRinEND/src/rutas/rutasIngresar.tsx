import Index from '../pages/index.tsx'
import Registrarse from '../pages/registrarse.tsx'
import Iniciar_sesion from '../pages/iniciar_sesion.tsx'
import CodigoVerificacion from '../pages/codigo_verificacion.tsx'
import Inicio from '../pages/inicio.tsx'
import CorreoCambiarContraseña from '../pages/correo_cambiar_contraseña.tsx';
import Buscar from '../pages/buscar.tsx'
import Perfil from '../pages/perfil.tsx'
import CambiarContraseña from '../pages/cambiar_contraseña.tsx'
import RutasUsuario from './rutasConSesion.tsx';
import RutaProtegida from './rutaProtegida.tsx';
import RutasSinSesion from './rutasSinSesion.tsx';
import PaginaEditor from '../pages/editor_texto.tsx'
import { Routes, Route } from "react-router-dom";


function RutasIngresar() {
    return (

        <Routes>
            <Route element={<RutasSinSesion />}>
                <Route path="/" element={<Index />} />
                <Route path="/registrarse" element={<Registrarse />} />
                <Route path="/iniciar_sesion" element={<Iniciar_sesion />} />
                <Route path="/olvide_mi_contrasena" element={<CorreoCambiarContraseña />} />
                <Route element={<RutaProtegida verificarUrl="http://localhost:1240/ingresar_codigo_validacion" />}>
                    <Route path="/codigo_verificacion" element={<CodigoVerificacion />} />
                </Route>
                <Route element={<RutaProtegida verificarUrl="http://localhost:1240/cambiar_contraseña" />}>
                    <Route path="/cambiar_contraseña" element={<CambiarContraseña />} />
                </Route>
            </Route>


            <Route element={<RutaProtegida verificarUrl="http://localhost:1240/necesita_usuario" />}>
                <Route element={<RutasUsuario />}>
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path='/perfil' element={<Perfil />} />
                    <Route path='/buscar' element={<Buscar />} />
                    <Route path='/editor' element={<PaginaEditor />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default RutasIngresar;