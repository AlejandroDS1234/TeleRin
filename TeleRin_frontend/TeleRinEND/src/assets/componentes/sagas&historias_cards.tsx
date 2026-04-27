import { Book, BookHeart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Lineas({ grosor, espaciado, cantidad }) {
    return (
        <div className={`flex flex-col w-full justify-center`} style={{ gap: espaciado }}>
            {
                Array.from({ length: cantidad || 2 }).map((_, i) => (
                    <div className={`w-full border-black border`} style={{ height: grosor }} />
                ))
            }

        </div>
    )
}

export function Sagacard({ ids, img, titulo, descripcion, libros }) {
    console.log(descripcion)
    return (
        <Link to={ids}
            className={`relative p-4 bg-[#e4e0d6] flex flex-col border-2 border-black border-double h-70 flex-none w-50 sm:w-full`}
        >
            <div>
                <div className=' flex flex-col w-full justify-center items-center gap-px'>
                    <div className='bg-black w-full border-black h-[1.5px]' />
                    <div className='bg-black w-[98%] border-black h-px' />
                </div>

                <h3 className='truncate w-full font-bold text-2xl font-serif h-min text-center'>{titulo}</h3>

                <div className='flex flex-col w-full justify-center items-center gap-px'>
                    <div className='bg-black w-[98%] border-black h-px' />
                    <div className='bg-black w-full border-black h-[1.5px]' />
                </div>
            </div>

            <img className='mt-auto h-43 w-full object-cover' src={`/api/Fotos/fotos_sagas/${img}`} />

            <small className='mt-auto flex justify-center'>
                <div>{libros} libros</div>
            </small>
            <Lineas grosor='0.1px' espaciado='1px' cantidad={2} />
            <motion.p className='absolute bottom-0 h-40'
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >{descripcion}kk</motion.p>
        </Link>
    )
}

export function HistoriaCard({ idh, titulo, descripcion, calificacion }) {
    return (
        <Link
            to={`/historia/${encodeURIComponent(idh)}`}
            className="bg-[#e4e0d6] flex flex-col items-center border-1 border-black flex-none w-50 sm:w-full h-70 p-4"
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

