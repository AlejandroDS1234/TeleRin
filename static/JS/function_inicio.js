document.addEventListener("DOMContentLoaded", async function() {
    const res = await fetch("/sagas_recomendadas")
    const sagas = await res.json()
    const carrucel = document.getElementById("carousel_inner")
    const cardsPorSlide = 3;
    if (sagas.length == 0) {
        carrucel.innerHTML = "No hay sagas"
    }
    for (let i = 0; i < sagas.length; i += cardsPorSlide) {

        const slide = document.createElement("div");
        slide.className = "carousel-item";
        if (i === 0) slide.classList.add("active");

        const row = document.createElement("div");
        row.className = "row justify-content-center";

        sagas.slice(i, i + cardsPorSlide).forEach(historia => {
            const col = document.createElement("div");
            col.className = "col-12 col-md-4 d-flex justify-content-center";

            col.innerHTML = `
                    <div class="card seleccionar-saga" data-url="${historia.id_saga}" style="width: 18rem;">
                            <img class="img_saga_card" src="/Fotos/fotos_sagas/${historia.imagen_saga}" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${historia.nombre_saga}</h5>
                            <p class="card-text">${historia.descripcion_saga}</p>
                            <p class="card-text"><strong>Autor:</strong> ${historia.correo_usuario}</p>
                        </div>
                    </div>
            `;

            row.appendChild(col);
        });

        slide.appendChild(row);
        carrucel.appendChild(slide);
    }

    const sagas_recomensados = document.querySelectorAll(".seleccionar-saga")
    sagas_recomensados.forEach(saga => {
        saga.addEventListener("click", () => {
            let url = saga.getAttribute("data-url").replaceAll("-", "/")
            window.location.href = url
            console.log("hi")
        })
    })
})


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