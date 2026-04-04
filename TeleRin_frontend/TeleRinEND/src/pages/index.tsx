import { LogIn, UserRoundPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import rasgado from '../assets/imagenes/texturas/rasgadura.png'
import UseMensajeRedirigir from '../assets/componentes/mensajeRedirigir'


function Index() {
    return (
        <>
            <h2>index</h2>
            <UseMensajeRedirigir />
            <Link to="/registrarse" className="flex items-center gap-2 text-[#333] hover:text-[#555] transition-colors duration-300">
                <UserRoundPlus size={24} />
                Registrarse
            </Link>
            <Link to="/iniciar_sesion" className="flex items-center gap-2 text-[#333] hover:text-[#555] transition-colors duration-300">
                <LogIn size={24} />
                Iniciar Sesión
            </Link>
        </>
    )
}

export default Index;
