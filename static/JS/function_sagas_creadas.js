document.addEventListener("DOMContentLoaded", async function() {
    try {
        const usuario = document.querySelector(".header").getAttribute("data-usuario-correo")
        cargarSagas(1, usuario)
    } catch {
        null
    }
    
})

export async function cargarSagas(tipo, usuario) {
    const respuesta = await fetch(`/sagas_creadas/${usuario}`, {method:"POST"});
    const sagas = await respuesta.json();
    const contenedor = document.getElementById("listaSagas");
    contenedor.innerHTML = ""; // limpiar
    sagas.forEach(saga => {
        let html
        if (tipo==1) {
            html = `
                <div class="dropdown-item p-0 seleccionar-saga"  
                    data-id="${saga.id_saga}"
                    data-nombre="${saga.nombre_saga}">
                    
                    <div class="card mb-2 sagas_creadas_item" style="max-width: 100%;">
                        <div class="row g-0">
                            <div class="col-md-4 img_centrada">
                                <img src="/Fotos/fotos_sagas/${saga.imagen_saga}" class="img-fluid rounded-start foto_saga_creada">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h6 class="card-title m-0">${saga.nombre_saga}</h6>
                                    <p class="card-text"><small>${saga.descripcion_saga}</small></p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            `;
        } else {
            html= ` <div class="card seleccionar-saga" style="width: 18rem;">
                        <img class="card-img-top" src="/Fotos/fotos_sagas/${saga.imagen_saga}" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>`
        }



        contenedor.insertAdjacentHTML("beforeend", html);
    });
    document.querySelectorAll('.seleccionar-saga').forEach(item => {
        item.addEventListener('click', function() {
            let nombre = this.dataset.nombre;
            let id = this.dataset.id;
            try {
                // Cambiar el texto del botón
                const elegirSaga = document.querySelector("#elegir_saga")
                elegirSaga.innerHTML = nombre;
                // Guardar en un input oculto
                document.getElementById('id_saga').value = id;
            } catch (error) {
                console.log("estoy en esta pagina", error)
            }
        });
    });

}