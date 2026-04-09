import Editor from "../assets/componentes/editor_texto.tsx";

function PaginaEditor() {
  return (
    <div className="flex justify-center lg:items-center">
      <div className="min-h-screen bg-[#e5e3dc] w-full max-w-[700px] h-[90vh] shadow-xl flex flex-col items-center p-4">

        {/* ✏️ EDITOR */}
        <Editor />

      </div>
    </div>

  );
}

export default PaginaEditor;