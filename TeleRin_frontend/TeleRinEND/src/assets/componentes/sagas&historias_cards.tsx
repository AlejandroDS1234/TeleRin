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
    return (
        <Link to={ids}
            className={`relative p-4 bg-[#e4e0d6] flex flex-col border-2 border-black border-double h-70 flex-none w-50 sm:w-full`}
        >
            <div>
                <div className=' flex flex-col w-full justify-center items-center gap-px'>
                    <div className='bg-black w-full border-black h-[1.5px]' />
                    <div className='bg-black w-[98%] border-black h-px' />
                </div>

                <h3
                    className='truncate w-full font-bold text-2xl font-serif h-min text-center'
                >{titulo}</h3>

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
            <motion.div className='absolute bottom-0 right-0 left-0 w-full h-[80%] bg-[#e4e0d6]/80 p-4'
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
            ><p className='text-left w-full line-clamp-8'>{descripcion}</p></motion.div>
        </Link>
    )
}

export function HistoriaCard({ idh, titulo, descripcion, calificacion, autor }) {

    const MotionHeart = motion(BookHeart)
    const MotionLink = motion(Link)

    return (
        <MotionLink
            whileHover={{ scale: 0.95 }}
            to={`/historia/${encodeURIComponent(idh)}`}
            className="bg-[#e4e0d6] flex flex-col gap-4 border border-black border-dotted flex-none w-50 sm:w-full h-50 p-4"
        >
            <h3 className="font-bold w-full line-clamp-2">{titulo}</h3>
            <div className="w-full line-clamp-3">
                <p>{descripcion}</p>
            </div>
            <small className="mt-auto w-full flex justify-between">
                <motion.div className="flex gap-[0.5px]"
                    variants={{
                        normal: {},
                        marcado: {
                            transition: {
                                staggerChildren: 0.1,
                                delay: 1
                            }
                        }
                    }}
                    initial="normal"
                    whileInView="marcado"
                    viewport={{ once: true, amount: 1 }}
                >
                    {[...Array(3)].map((_, i) => (
                        <span
                            key={i}>
                            {i < calificacion ?
                                <MotionHeart
                                    variants={{
                                        normal: {
                                            scale: 1
                                        },
                                        marcado: {
                                            scale: [1, 1.15, 1],
                                        }
                                    }}
                                    color="#FF0000" /> :
                                <Book />}
                        </span>
                    ))}
                </motion.div>
                <p className="font-bold truncate">--{autor}</p>
            </small>
        </MotionLink>
    );
}

export function SagasCardHorizontal({ img, titulo, className }) {
    return (
        <div className={`flex items-center gap-4 py-1 px-3 ${className} `}>
            <img className='aspect-square h-full' src={`/api/Fotos/fotos_sagas/${img}`} />
            <p className='truncate font-bold'>{titulo}</p>
        </div>
    )
}

