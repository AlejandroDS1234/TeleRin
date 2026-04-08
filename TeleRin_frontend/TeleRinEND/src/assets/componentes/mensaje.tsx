import { useState, useEffect } from "react";

export function Mensaje({ mensaje, tipo, id, tiempo = 6000, onHide }: { mensaje: string, tipo: string, id: number, tiempo?: number, onHide?: () => void }) {
    //tiempo que se mostrara el mensaje
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            if (onHide) onHide(); // Llamar callback cuando se oculta
        }, tiempo);
        return () => clearTimeout(timer);
    }, [id, tiempo, onHide]);
    if (!visible) {
        return null;
    }

    //funcion para obtener el color del borde segun el tipo de mensaje
    const getBorderColor = () => {
        switch (tipo) {
            case 'success': return 'var(--success)';
            case 'danger': return 'var(--danger)';
            case 'warning': return 'var(--warning)';
            default: return 'var(--color_bordes)';
        }
    };

    return ( //hello
        <div
            className="flex w-max items-stretch justify-center border-2">
            <div className="w-10 border-r-2 " style={{ backgroundColor: getBorderColor() }}></div>
            <div className="flex flex-col items-center p-4">
                <div className="w-[95%] h-[3px] bg-[var(--color_bordes)] "></div>
                <p className="font-bold text-2xl">{mensaje}</p>
            </div>

        </div >
    )
}

export function MensajePlano({ mensaje, tipo, id, tiempo = 6000, onHide }: { mensaje: string, tipo: string, id: number, tiempo?: number, onHide?: () => void }) {
    //tiempo que se mostrara el mensaje
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            if (onHide) onHide(); // Llamar callback cuando se oculta
        }, tiempo);
        return () => clearTimeout(timer);
    }, [id, tiempo, onHide]);
    if (!visible) {
        return null;
    }

    //funcion para obtener el color del borde segun el tipo de mensaje
    const getBorderColor = () => {
        switch (tipo) {
            case 'success': return 'var(--success)';
            case 'danger': return 'var(--danger)';
            case 'warning': return 'var(--warning)';
            default: return 'var(--color_bordes)';
        }
    };

    return (
        <p className={`font-thin`} style={{ color: getBorderColor() }}>{mensaje}</p>
    )
}
