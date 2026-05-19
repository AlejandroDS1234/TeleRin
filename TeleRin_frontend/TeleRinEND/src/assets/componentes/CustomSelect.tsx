import { useState, useRef, useEffect } from "react";

// ==============================
type Option = {
    label: React.ReactNode;
    value: string;
};

type Props = {
    titulo: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    className: string;
};

// ==============================
export function CustomSelect({ titulo, options, value, onChange, className = "w-32" }: Props) {

    const [open, setOpen] = useState(false);
    const [openUp, setOpenUp] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const selected = options.find(o => o.value === value);

    // Detectar tamaño pantalla REAL (no solo CSS)
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!open) return;

            if (ref.current && !ref.current.contains(e.target as Node)) {
                e.stopPropagation();
                e.preventDefault();
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside, true);
        return () => document.removeEventListener("click", handleClickOutside, true);
    }, [open]);

    return (
        <div ref={ref} className={`relative ${className} `}>

            {/* BOTÓN */}
            <button
                type="button"
                ref={buttonRef}
                onClick={() => {
                    if (!open && !isMobile) {
                        const rect = buttonRef.current?.getBoundingClientRect();
                        if (rect) {
                            const spaceBelow = window.innerHeight - rect.bottom;
                            const spaceAbove = rect.top;
                            setOpenUp(spaceBelow < 250 && spaceAbove > spaceBelow);
                        }
                    }
                    setOpen(!open)
                }}
                className="w-full px-4 py-2 border-b rounded flex justify-between items-center"
            >
                <span className="truncate">{selected ? selected.label : titulo}</span>
                <span className={`transition ${open ? "rotate-180" : ""}`}>▼</span>
            </button>

            {/* =========================
                DESKTOP (solo si NO es móvil)
            ========================== */}
            {open && !isMobile && (
                <div
                    className={`
                        absolute z-50 w-full border rounded bg-(--bg-surface-soft) shadow scroll-suave
                        ${openUp ? "bottom-full mb-2" : "top-full mt-2"}
                    `}
                    style={{
                        maxHeight: "min(250px, 40vh)",
                        overflowY: "auto"
                    }}
                >
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`py-2 cursor-pointer hover:bg-(--bg-surface-hover) ${value === opt.value ? "bg-(--bg-surface)" : ""}`}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}

            {/* =========================
                MOBILE REAL (solo si es móvil)
            ========================== */}
            {open && isMobile && (
                <div className=" fixed inset-0 z-50 bg-(--bg-overlay-soft) flex justify-center items-center">

                    <div className="bg-(--bg-surface-soft) w-full rounded-t-xl p-4 max-h-[80vh] overflow-y-auto ">

                        <div className="text-center font-semibold mb-3">
                            {titulo}
                        </div>

                        {options.map(opt => (
                            <div
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className="py-3 border-b"
                            >
                                {opt.label}
                            </div>
                        ))}

                        <button
                            onClick={() => setOpen(false)}
                            className="mt-4 w-full py-2 bg-(--bg-surface) rounded"
                        >
                            Cancelar
                        </button>
                    </div>

                </div>
            )}

        </div>
    );
}
