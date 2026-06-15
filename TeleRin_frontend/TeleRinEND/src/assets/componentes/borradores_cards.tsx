import { Shredder, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEliminarBorradorHistoria } from "../../pages/hook/historias/hookContinuarHistoria";
import { useState } from "react";

export function BorradoresCards({ texto, id_historia }: { texto: string; id_historia: string }) {
  const navigate = useNavigate();
  const mutateEliminarBorrador = useEliminarBorradorHistoria();
  const [abierto, setAbierto] = useState(false);
  return (
    <div
      onClick={() => navigate(`/editor?id_historia=${id_historia}`)}
      className="relative w-full h-50 max-h-50 bg-[#fdfbf7] border-t-4 border-neutral-900 border-b border-neutral-300 p-6 font-serif shadow-sm text-neutral-800 flex flex-col justify-between select-none shrink-0"
    >
      <div className="columns-2 gap-6 text-justify text-xs leading-relaxed h-[calc(100%-4px)] overflow-hidden [column-fill:auto] break-words">
        <p className="first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:leading-[0.8] first-letter:pt-1 first-letter:pr-2 first-letter:text-neutral-950">
          {texto}
        </p>
      </div>
      <div
        className="absolute top-0 left-0 w-full h-full bg-gray-600/30 z-3"
        style={{ display: abierto ? "block" : "none" }}
      />
      <div
        className="absolute bottom-10 h-30 right-30 w-50 flex flex-col justify-center items-center gap-2 rounded-lg shadow-lg z-5 bg-(--color_principal)"
        style={{ display: abierto ? "flex" : "none" }}
      >
        <p className="text-center">¿Desea eliminar este borrador de historia?</p>
        <div className="flex gap-2">
          <button
            className="bg-red-500 px-1 rounded-lg hover:cursor-pointer hover:bg-red-600 text-(--color_texto_botones)"
            onClick={() => mutateEliminarBorrador.mutate(id_historia)}
            disabled={mutateEliminarBorrador.isPending}
          >
            {mutateEliminarBorrador.isPending ? "Borrando" : "Eliminar"}
          </button>
          <button
            className="bg-gray-500 px-1 rounded-lg hover:cursor-pointer hover:bg-gray-600 text-(--color_texto_botones)"
            onClick={() => setAbierto(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
      <button
        className="absolute bottom-1.5 right-6 flex gap-2 px-2 bg-gray-400/35 rounded-[10px] py-0.5 hover:cursor-pointer hover:bg-gray-400/50"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setAbierto(true);
        }}
        disabled={abierto}
      >
        <Shredder />
        Eliminar
      </button>
    </div>
  );
}
