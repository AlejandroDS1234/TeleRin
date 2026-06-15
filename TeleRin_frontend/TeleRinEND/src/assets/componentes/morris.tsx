import { useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import morrisAndroid from "../morris/morris_android_prime (1).riv";

function Morris({ onLoad }: { onLoad?: () => void }) {
  const { rive, RiveComponent } = useRive({
    src: morrisAndroid,
    stateMachines: "saludo",
    autoplay: true,
  });

  useEffect(() => {
    if (rive) {
      onLoad?.();
    }
  }, [rive]);

  // triggers
  const triggerGrande = useStateMachineInput(rive, "saludo", "esGrande");
  const triggerPequeno = useStateMachineInput(rive, "saludo", "esPequeño");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const activar = (e: MediaQueryList | MediaQueryListEvent) => {
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
    <div className="w-75 h-75 lg:w-[80vh] lg:h-[80vh]">
      <RiveComponent />
    </div>
  );
}

export default Morris;
