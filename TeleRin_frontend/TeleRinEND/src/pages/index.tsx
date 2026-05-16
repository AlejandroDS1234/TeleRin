import Header from "../header.tsx";
import Sobrefondo from "../assets/sobre_fondos_de_menus/sobrefondo.tsx";
import Boton_registro from "../assets/botones_componentes/boton_registro.tsx";
import Boton_inicio_sesion from "../assets/botones_componentes/boton_inicio_sesion.tsx";
import Boton_mas_de_nosotros from "../assets/botones_componentes/boton_mas_de_nosotros.tsx";
import Morris from "../assets/componentes/morris.tsx";

function CallToAction() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full lg:text-[2vw] text-center">
      <p className="font-[sloganPequeño] text-(--color_texto_oscuro)">publica eso que</p>
      <div className="font-[sloganGrande] text-5xl text-center lg:text-[10vw] lg:leading-[1.1]">
        <span className="text-(--color_botones_presionado) block">TE DARIA</span>
        <span className="block text-(--color_texto_oscuro)">PENA</span>
      </div>
      <p className="font-[sloganPequeño] text-(--color_texto_oscuro)">leer en voz alta</p>
    </div>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-30">
        <Header />
      </div>

      <div className="absolute top-0 left-0 h-full w-full lg:w-2/3 z-10">
        <Sobrefondo />
      </div>

      {/* 2. FRASE LLAMATIVA */}
      <div className="absolute top-[15%] right-[1%] h-[20%] aspect-square w-full text-center lg:top-[40%] lg:left-[10%] lg:h-[25%] lg:w-[35%] z-40">
        <CallToAction />
      </div>

      {/* 2. BOTÓN DE REGISTRO (encima de todo) */}
      <div className="absolute top-[35%] left-[45%] h-[25%] aspect-square lg:top-[22.5%] lg:left-[80%] lg:h-[25%]  z-40">
        <Boton_registro />
      </div>

      {/* 3. BOTÓN DE INICIO DE SESIÓN (encima de todo) */}
      <div className="absolute top-[50%] left-[1%] h-[25%] aspect-square lg:top-[40%] lg:left-auto lg:right-[20%] lg:h-[25%] z-50">
        <Boton_inicio_sesion />
      </div>

      {/* 4. BOTÓN DE MÁS DE NOSOTROS (encima de todo) */}
      <div className="absolute top-[65%] left-[45%] h-[25%] aspect-square lg:top-[60%] lg:left-[80%] lg:h-[25%]  z-60">
        <Boton_mas_de_nosotros />
      </div>

      {/* 5. MORRIS (encima de todo) */}
      <div className="absolute top-[0%] right-[40%] h-[25%] aspect-square lg:fixed lg:top-[10vh] lg:left-1/2 lg:-translate-x-1/2 lg:w-[10vh] lg:h-[10vh]  z-60">
        <Morris />
      </div>
    </div>
  );
}
export default Index;
