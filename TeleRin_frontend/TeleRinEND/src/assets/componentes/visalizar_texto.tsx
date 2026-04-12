import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";


function Historia({
    contenidoInicial = null,
    toolbar = null,
}) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current || quillRef.current) return;

        const quill = new Quill(editorRef.current, {
            theme: "snow",
            readOnly: true,
            modules: {
                toolbar,
            },
        });

        quillRef.current = quill;

        if (contenidoInicial) {
            quill.setContents(contenidoInicial);
        }
    }, []);

    useEffect(() => {
        if (!quillRef.current || !contenidoInicial) return;
        quillRef.current.setContents(contenidoInicial);
    }, [contenidoInicial]);

    return (
        <div className="w-full h-full inline justify-center">
            <div className="w-full h-full max-w-[700px] bg-white p-4 rounded shadow">
                <div ref={editorRef} />
            </div>
        </div>
    );
}

export default Historia;
