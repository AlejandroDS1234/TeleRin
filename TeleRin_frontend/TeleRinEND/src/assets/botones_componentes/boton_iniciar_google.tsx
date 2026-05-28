import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import type { ApiMessage } from "../../types";
import { redirigir } from "../../function_generales";
import { useNavigate } from "react-router-dom";
import { MensajePlano } from "../../assets/componentes/mensaje";

function BotonGoogle() {
  const [res, setRes] = useState<ApiMessage | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const res = await fetch("/api/iniciar_google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: credentialResponse.credential }),
          });
          const data = await res.json();
          setRes(data);
          redirigir(navigate, data);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      {res && <MensajePlano mensaje={res.mensaje} tipo={res.tipo} id={1} />}
    </>
  );
}

export default BotonGoogle;
