import {
  Sagacard,
  SagaCardCargando,
} from "../../assets/componentes/sagas&historias_cards_admin.tsx";
import { useEffect, useState } from "react";

function Sagas() {
  const [sagas, setSagas] = useState<Saga[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const sagasBack = async () => {
      try {
        const pro = await fetch("/api/simulacion_recomenda_sagas", {
          method: "POST",
          credentials: "include",
        });

        const sagas = await pro.json();

        setSagas(sagas as Saga[]);
        setCargando(false);
      } catch {
        setError(true);
      }
    };

    sagasBack();
  }, []);

  if (error) {
    return <p className="text-(--color_texto_oscuro)">error al cargar las sagas</p>;
  }

  if (cargando) {
    return (
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <SagaCardCargando key={i} />
        ))}
      </>
    );
  }

  return (
    <>
      {sagas.map((saga) => (
        <Sagacard
          key={saga.id_saga}
          ids={saga.id_saga}
          img={saga.imagen_saga}
          descripcion={saga.descripcion_saga}
          titulo={saga.nombre_saga}
          libros={saga.libros ?? 0}
        />
      ))}
    </>
  );
}

function PanelAdmin() {
  return (
    <div>
      <div>
        <Sagas />
      </div>
    </div>
  );
}

export default PanelAdmin;
