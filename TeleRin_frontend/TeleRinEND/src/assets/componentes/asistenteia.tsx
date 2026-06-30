import { useState, useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

function Morris_asistente() {
  const [abierto, setAbierto] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: "/src/assets/morris/morris_entrada_esquina.riv",
    stateMachines: "saludo",
    autoplay: true,
  });

  const triggerGrande = useStateMachineInput(rive, "saludo", "esGrande");
  const triggerPequeno = useStateMachineInput(rive, "saludo", "esPequeño");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const activar = (e: MediaQueryList | MediaQueryListEvent) => {
      if (!rive) return;

      if (e.matches) {
        triggerGrande?.fire();
      } else {
        triggerPequeno?.fire();
      }
    };

    activar(mq);

    mq.addEventListener("change", activar);
    return () => mq.removeEventListener("change", activar);
  }, [rive, triggerGrande, triggerPequeno]);

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="w-100 h-100 lg:w-[80vh] lg:h-[80vh] cursor-pointer"
      >
        <RiveComponent />
      </button>

      {abierto && <div>Aquí irá tu modal</div>}
    </>
  );
}

export default Morris_asistente;
