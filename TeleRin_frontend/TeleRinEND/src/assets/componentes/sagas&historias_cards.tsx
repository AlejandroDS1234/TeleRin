import {Book, BookHeart } from 'lucide-react'
import { Link } from 'react-router-dom'


export function Sagacard({ids ,img, titulo, descripcion, libros}  ) {
    return (
        <Link to={ids} className='bg-[#e4e0d6] p-4 flex flex-col aling-center border-2 border-black h-full w-[80%] sm:w-[20%]'>
            <img className='h-40 w-full object-contain' src={`http://localhost:1240/Fotos/fotos_sagas/${img}`} />
            <h3 className='text-bold'>{titulo}</h3>
            <small className='flex'><Book />{ libros }</small>
        </Link>
    )
}

export function HistoriaCard({idh, titulo, descripcion, calificacion}) {
    return (
        <Link 
            to={idh} 
            className="bg-[#e4e0d6] flex flex-col items-center border-2 border-black w-full min-h-[220px] p-4"
        >
            <h3 className="font-bold text-center">{titulo}</h3>

            <div className="mt-auto text-center">
                <p>{descripcion}</p>

                <small className="flex justify-center mt-2">
                    {[...Array(3)].map((_, i) => (
                        <span key={i}>
                            {i < calificacion ? <BookHeart /> : <Book />}
                        </span>
                    ))}
                </small>
            </div>
        </Link>
    );
}
// no se que de diferente tiene este className de historias con el de sagas 
// pero dejalo como el de historias, no se por que el de sagas se ve raro en android
