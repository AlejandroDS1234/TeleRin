document.addEventListener("DOMContentLoaded", function() {
    paisesLlenar();
})
async function paisesLlenar(params) {
    const res = await fetch("/api/paises");
    const paisesLi = await res.json();

    const up = paisesLi.pais_usuario;
    const p = paisesLi.paises;

    const lista = document.getElementById("pais");
    lista.options.length = 0;

    const miPais = document.createElement("option");
    miPais.value = String(up.id_pais);
    miPais.textContent = String(up.nombre_pais);
    miPais.selected = true;
    lista.appendChild(miPais);

    p.forEach(pais => {

        if (pais.id_pais === up.id_pais) return;

        const opcion = document.createElement("option");
        opcion.value = String(pais.id_pais);
        opcion.textContent = String(pais.nombre_pais);
        lista.appendChild(opcion);
    });


}

tinymce.init({
    selector: '#editor',
    language: 'es_MX',
    branding: false,
    menubar: false,
    statusbar: false,
});

const formulario = document.getElementById('Historias');
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const contenido = tinymce.get('editor').getContent();
    document.getElementById('editor').value = contenido;
    formulario.submit();
});