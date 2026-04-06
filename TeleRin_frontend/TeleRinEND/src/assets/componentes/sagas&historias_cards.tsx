import {Book, BookHeart } from 'lucide-react'
import { Link } from 'react-router-dom'


export function Sagacard({ids ,img, titulo, descripcion, libros}  ) {
    return (
        <Link to={ids} className='bg-[#FCF3CF] p-4 flex flex-col aling-center h-full w-[80%] sm:w-[20%]'>
            <img className='h-[40%]' src={`http://localhost:1240/Fotos/fotos_sagas/${img}`} />
            <h3 className='text-bold'>{titulo}</h3>
            <p>{ descripcion }</p>
            <small className='flex'><Book />{ libros }</small>
        </Link>
    )
}

export function HistoriaCard({idh, titulo, descripcion, calificacion}) {
    return (
        <Link to={idh} className='bg-[#FCF3CF] flex flex-col w-[80%] sm:w-[20%]'>
            <h3 className='text-bold'>{ titulo }</h3>
            <p>{ descripcion }</p>
            <small className='flex'>
                {[...Array(3)].map((_, i) => (
                    <span key={i}>{i < calificacion ? <BookHeart/>  : <Book/>}</span>
                ))}
            </small>
        </Link>
    )
}
// no se que de diferente tiene este className de historias con el de sagas 
// pero dejalo como el de historias, no se por que el de sagas se ve raro en android
