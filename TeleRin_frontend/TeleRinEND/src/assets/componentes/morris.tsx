import { useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

function Morris() {

  const { rive, RiveComponent } = useRive({
    src: "/src/assets/morris/morris_android_prime (1).riv",
    stateMachines: "saludo",
    autoplay: true,
  });

  // triggers
  const triggerGrande = useStateMachineInput(rive, "saludo", "esGrande");
  const triggerPequeno = useStateMachineInput(rive, "saludo", "esPequeño");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const activar = (e) => {
      if (!rive) return;

      if (e.matches) {
        // pantalla grande
        if (triggerGrande) triggerGrande.fire();
      } else {
        // pantalla pequeña
        if (triggerPequeno) triggerPequeno.fire();
      }
    };

    // ejecutar al inicio
    activar(mq);

    // escuchar cambios
    mq.addEventListener("change", activar);

    return () => mq.removeEventListener("change", activar);
  }, [rive, triggerGrande, triggerPequeno]);

  return (
    <div className="w-[300px] h-[300px] lg:w-[80vh] lg:h-[80vh]">
      <RiveComponent />
    </div>
  );
}

export default Morris;