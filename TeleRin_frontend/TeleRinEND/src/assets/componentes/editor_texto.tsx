import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function Editor({ onChangeContenido }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null); // guardamos la instancia

  useEffect(() => {
    if (quillRef.current) return;

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

    quill.on("text-change", () => {
      const html = quill.getContents();
      const plainText = quill.getText();
      onChangeContenido?.({ "html": html, "texto": plainText });
    });

  }, []);


  return (
    <div className="w-full h-full inline justify-center">

      {/* CONTENEDOR VISUAL */}
      <div className="w-full h-full max-w-[700px] bg-white p-4 rounded shadow ">

        {/* 🔥 ESTE NO LLEVA FLEX */}
        <div ref={editorRef} />

      </div>

    </div>
  );
}

export default Editor;