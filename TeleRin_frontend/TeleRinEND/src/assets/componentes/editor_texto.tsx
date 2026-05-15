import { useEffect, useRef } from "react";
import Quill from "quill";
import type Delta from "quill-delta";
import "quill/dist/quill.snow.css";

type ToolbarOption = {
  value: string;
  label?: string;
};

type QuillToolbarItem = {
  type: "quill";
  value: string;
  tag?: "select";
  options?: ToolbarOption[];
  defaultValue?: string;
  buttonValue?: string;
  className?: string;
};

type CustomToolbarItem = {
  type: "custom";
  value: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
};

type ToolbarItem = QuillToolbarItem | CustomToolbarItem;

type EditorChange = {
  html: string;
  texto: string;
  delta: Delta;
};

type EditorProps = {
  onChangeContenido?: ((contenido: EditorChange) => void) | null;
  contenidoInicial?: Delta | null;
  soloLectura?: boolean;
  toolbarItems?: ToolbarItem[];
};

const DEFAULT_TOOLBAR_ITEMS: ToolbarItem[] = [
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
];

function renderToolbarItem(item: ToolbarItem, index: number) {
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

  return (
    <div key={`${item.label ?? item.value}-${index}`} className={item.className} style={item.style}>
      {item.content ?? item.label}
    </div>
  );
}

function Editor({
  onChangeContenido,
  contenidoInicial = null,
  soloLectura = false,
  toolbarItems = DEFAULT_TOOLBAR_ITEMS,
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const toolbarId = "toolbar-principal";
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      readOnly: soloLectura,
      placeholder: soloLectura ? "" : "Escribe algo épico...",
      modules: {
        toolbar: `#${toolbarId}`,
      },
    });

    quillRef.current = quill;

    if (contenidoInicial && !initializedRef.current) {
      quill.setContents(contenidoInicial);
      initializedRef.current = true;
    }

    if (!soloLectura) {
      quill.on("text-change", () => {
        const delta = quill.getContents();
        const html = quill.root.innerHTML;
        const texto = quill.getText();
        onChangeContenido?.({ html, texto, delta });
      });
    }
  }, [soloLectura, onChangeContenido]);

  useEffect(() => {
    if (!quillRef.current) return;
    quillRef.current.enable(!soloLectura);
  }, [soloLectura]);

  return (
    <div className="w-full h-full inline justify-center">
      <div className="w-full h-full max-w-175 bg-white p-4 rounded shadow">
        <div id={toolbarId} className="flex justify-between p-4">
          {toolbarItems.map((item, index) => renderToolbarItem(item, index))}
        </div>

        <div ref={editorRef} />
      </div>
    </div>
  );
}

export default Editor;
