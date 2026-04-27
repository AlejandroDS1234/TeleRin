import { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch("/api/sesion", {
                    method: "POST",
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsuario(data.usuario);
                } else {
                    console.error("Error en respuesta:", response.status, response.statusText);
                    const errorData = await response.json();
                    console.error("Detalles del error:", errorData);
                    setUsuario({ error: true }); // Marca como cargado pero con error
                }
            } catch (error) {
                console.error("Error fetching usuario:", error);
                setUsuario({ error: true });
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
    return useContext(UserContext);
};
