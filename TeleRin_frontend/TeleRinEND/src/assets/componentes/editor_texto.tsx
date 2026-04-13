import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function renderToolbarItem(item, index, quillRef) {
  if (item.type === "quill") {
    if (item.tag === "select") {
      return (
        <select
          key={`${item.value}-${index}`}
          className={`ql-${item.value}`}
          defaultValue={item.defaultValue ?? ""}
        >
          {(item.options || []).map((option, optionIndex) => (
            <option key={`${item.value}-${optionIndex}`} value={option.value}>
              {option.label ?? option.value}
            </option>
          ))}
        </select>
      );
    }

    return (
      <button
        key={`${item.value}-${index}`}
        type="button"
        className={`ql-${item.value}`}
        value={item.buttonValue}
      />
    );
  }

  if (item.type === "custom") {
    return (
      <div
        key={`${item.label}-${index}`}
        className={item.className}
        style={item.style}
      >
        {item.content ?? item.label}
      </div>
    );
  }

  return null;
}

function Editor({
  onChangeContenido,
  contenidoInicial = null,
  soloLectura = false,
  toolbarItems = [
    {
      type: "quill",
      value: "header",
      tag: "select",
      options: [
        { value: "1", label: "H1" },
        { value: "2", label: "H2" },
        { value: "", label: "Normal" },
      ],
    },
    { type: "quill", value: "bold" },
    { type: "quill", value: "italic" },
    { type: "quill", value: "underline" },
    { type: "quill", value: "image" },
    { type: "quill", value: "code-block" },
  ],
}) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const toolbarIdRef = useRef(`toolbar-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      readOnly: soloLectura,
      placeholder: soloLectura ? "" : "Escribe algo épico...",
      modules: {
        toolbar: soloLectura ? false : `#${toolbarIdRef.current}`,
      },
    });

    quillRef.current = quill;

    if (contenidoInicial) {
      quill.setContents(contenidoInicial);
    }

    if (!soloLectura) {
      quill.on("text-change", () => {
        const delta = quill.getContents();
        const html = quill.root.innerHTML;
        const texto = quill.getText();
        onChangeContenido?.({ html, texto, delta });
      });
    }
  }, []);

  useEffect(() => {
    if (!quillRef.current || !contenidoInicial) return;
    quillRef.current.setContents(contenidoInicial);
  }, [contenidoInicial]);

  useEffect(() => {
    if (!quillRef.current) return;
    quillRef.current.enable(!soloLectura);
  }, [soloLectura]);

  return (
    <div className="w-full h-full inline justify-center">
      <div className="w-full h-full max-w-[700px] bg-white p-4 rounded shadow ">
        {!soloLectura && (
          <div id={toolbarIdRef.current} className="flex justify-between p-4">
            {toolbarItems.map((item, index) => renderToolbarItem(item, index, quillRef))}
          </div>
        )}

        <div ref={editorRef} />
      </div>
    </div>
  );
}

export default Editor;
