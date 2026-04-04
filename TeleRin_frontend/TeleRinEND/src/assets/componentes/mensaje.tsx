import { useState, useEffect } from "react";

function Mensaje({ mensaje, tipo, id, tiempo = 6000, onHide }: { mensaje: string, tipo: string, id: number, tiempo?: number, onHide?: () => void }) {
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
        <div
            className="flex h-15 w-min items-center justify-center border-2">
            <div className="w-10 border-r-2 h-full" style={{ backgroundColor: getBorderColor() }}></div>
            <div className="flex flex-col items-center w-max p-4">
                <div className="w-[95%] h-[3px] bg-[var(--color_bordes)] "></div>
                <p className="font-bold text-2xl">{mensaje}</p>
            </div>

        </div >
    )
}

export default Mensaje;