const modal = document.getElementById("modal");
const abrir = document.getElementById("boton_crear_saga");

// Abrir modal al presionar botón
abrir.onclick = () => {
    modal.style.display = "flex";
};

// Cerrar modal al hacer click fuera del contenido
window.onclick = (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
    }
};