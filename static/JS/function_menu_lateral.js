let pagina = document.getElementsByTagName("main")[0].id

let menu_lateral = document.getElementById("menu_lateral")
let liS = Array.from(menu_lateral.getElementsByTagName("li"))

liS.forEach(li => {
    let liPagina = li.id
    if (liPagina == pagina) {
        let svg = li.querySelector("svg")
        li.style.borderBottom = "1px solid var(--color3)"
        li.style.padding = "20%"
        svg.style.fill = "var(--color3)"
        svg.style.stroke = "var(--color_bordes)" 
    } 
    
});



const modal = document.getElementById("modalPersonalizar");
const abrir = document.getElementById("abrirModal");
const cerrar = document.querySelector(".cerrar");

/* abrir modal */

abrir.addEventListener("click", () => {

    modal.style.display = "flex";

});

/* cerrar con X */

cerrar.addEventListener("click", () => {

    modal.style.display = "none";

});

/* cerrar haciendo click afuera */

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});