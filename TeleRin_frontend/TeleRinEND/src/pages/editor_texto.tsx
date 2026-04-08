import Editor from "../assets/componentes/editor_texto.tsx";

function PaginaEditor() {
  return (
    <div className="min-h-screen bg-[#e5e3dc] flex flex-col items-center p-4">

      {/* 🧾 HOJA */}
      <div className="
        w-full max-w-[700px]
        bg-white
        shadow-xl
        rounded-md
        p-4
      ">

        {/* ✏️ EDITOR */}
        <Editor />

      </div>

    </div>
  );
}

export default PaginaEditor;