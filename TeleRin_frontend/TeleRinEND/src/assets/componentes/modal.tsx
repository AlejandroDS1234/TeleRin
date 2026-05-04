import { useEffect } from "react"
import type { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom"
import { SquareX } from 'lucide-react'

type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
};

function Modal({ open, onClose, children, className = "" }: ModalProps) {

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto"
    }, [open])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [onClose])

    return createPortal(
        <div
            className={`
                fixed inset-0 flex items-center justify-center z-50
                transition-all duration-300
                ${open ? "bg-black/50 opacity-100" : "opacity-0 pointer-events-none"}
            `}
            onClick={onClose}>


            <div
                className={`${className}
                    p-6 rounded shadow-xl
                    transform transition-all duration-300
                    ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}
                `}
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <SquareX
                    onClick={onClose}
                    className="
                        absolute top-1 right-1
                        hover:animate-spin animate-[0.2s] hover:cursor-pointer
                        "
                />
                {children}
            </div>

        </div>,
        document.body
    )
}

export default Modal
