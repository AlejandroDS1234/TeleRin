import Header from "../header";
import { UserRoundPlus } from 'lucide-react'
import { Link } from "react-router-dom";
import botones from '../assets/styles/style.ts'


function Iniciar_sesion_Form() {
    return (
        <form className="flex flex-col bg-amber-200 w-full">
            <input placeholder="Correos" />
            <input placeholder="Contraseña" />
            <button className={`${botones.primario}`}>Iniciar Sesión</button>
        </form>
    )
}

function CallToAction() {
    return (
        <div className="flex flex-col justify-center items-center">
            <p className="font-[sloganPequeño]">publica eso que</p>
            <p className="font-[sloganGrande] text-5xl text-center"><p className="text-[#f85001]">TE DARIA</p><p>PENA</p></p>
            <p className="font-[sloganPequeño]">leer en voz alta</p>
        </div>
    )
}

function Iniciar_sesion() {
    return (
        <>
            <Header cosas={
                <>
                    <Link to='/registrarse' className={`group flex space-x-3 ${botones.primario} `} >
                        <p className='hidden sm:block'>Registrarse</p>
                        <UserRoundPlus className='animate-pulse [animation-duration:2s] group-hover:animate-bounce' />
                    </Link>
                </>
            } />
            <main className="grid grid-rows-2 w-full gap-4">
                <CallToAction />
                <Iniciar_sesion_Form />
            </main>

        </>
    )
}



export default Iniciar_sesion;



