import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function Editor() {
  const editorRef = useRef(null);
  const quillRef = useRef(null); // guardamos la instancia

  useEffect(() => {
    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Escribe algo épico...",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
      },
    });

    quillRef.current = quill;

    // 📌 Detecta cambios en el editor
    quill.on("text-change", () => {
      obtenerContenido(); // llamas tu función
    });

  }, []);

  // 🧠 FUNCIÓN PARA CAPTURAR CONTENIDO (LA DEJAMOS LISTA)
  const obtenerContenido = () => {
    if (!quillRef.current) return;

    const contenidoHTML = quillRef.current.root.innerHTML;

    // 👉 AQUÍ VAS A HACER ALGO CON EL CONTENIDO
    // Ejemplo futuro:
    // - guardarlo en estado
    // - enviarlo al backend
    // - validarlo

    // console.log(contenidoHTML);
  };

  return (
    <div className="flex justify-center w-full">
      <div
        ref={editorRef}
        className="bg-white w-full max-w-[700px] min-h-[400px]"
      />
    </div>
  );
}

export default Editor;