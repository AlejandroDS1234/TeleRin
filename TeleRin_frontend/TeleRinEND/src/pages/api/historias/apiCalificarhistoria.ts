export async function enviarCalificacion(id_historia: string, calificacion: number) {
    await fetch(`/api/calificar_historia/${encodeURIComponent(id_historia)}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ calificacion })
    });
}