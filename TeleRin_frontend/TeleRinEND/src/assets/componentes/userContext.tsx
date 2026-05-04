/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import type { UserContextValue, Usuario } from "../../types";

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch("/api/sesion", {
                    method: "POST",
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsuario(data.usuario as Usuario | null);
                } else {
                    console.error("Error en respuesta:", response.status, response.statusText);
                    const errorData = await response.json();
                    console.error("Detalles del error:", errorData);
                    setUsuario(null);
                }
            } catch (error) {
                console.error("Error fetching usuario:", error);
                setUsuario(null);
            }
        }
        fetchUsuario();
    }, []);
    return (
        <UserContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser debe usarse dentro de UserProvider");
    }
    return context;
};
