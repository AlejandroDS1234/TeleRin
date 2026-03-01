
const editodiv = document.getElementById("leer")

const contenido = JSON.parse(editodiv.dataset.contenido)

const editor = new Quill('#leer', {
    theme: 'snow',
    readOnly: true,
    modules: {toolbar: false}
});

editor.setContents(contenido);