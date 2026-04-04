import { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                console.log("Intentando cargar usuario...");
                const response = await fetch("http://localhost:1240/sesion", {
                    method: "POST",
                    credentials: "include"
                });
                console.log("Response status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Datos recibidos:", data);
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