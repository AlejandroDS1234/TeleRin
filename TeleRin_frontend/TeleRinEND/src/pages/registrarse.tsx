import Header from "../header";
import { LogIn } from 'lucide-react'
import { Link } from "react-router-dom";

function Registrarse() {
    return (
        <>
            <Header cosas={
                <>
                    <Link to='/iniciar_sesion' className='group flex space-x-3 font-[fuente2] bg-white px-4 py-2 rounded hover:bg-gray-200 transition'>
                        <p className='hidden sm:block'>Iniciar Sesión</p>
                        < LogIn className='animate-pulse [animation-duration:2s] group-hover:animate-bounce' />
                    </Link>
                </>
            } />
            <h1>registrarse</h1>
        </>
    )
}

export default Registrarse;

//