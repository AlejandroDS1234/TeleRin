import { GoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import type { ApiMessage } from "../../types";
import { redirigir } from "../../function_generales";
import { useNavigate } from "react-router-dom";
import { MensajePlano } from "../../assets/componentes/mensaje";

interface Props {
  text: React.ComponentProps<typeof GoogleLogin>["text"];
  size: React.ComponentProps<typeof GoogleLogin>["size"];
  width?: React.ComponentProps<typeof GoogleLogin>["width"];
}

function BotonGoogle({ text, size, width }: Props) {
  const [res, setRes] = useState<ApiMessage | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <GoogleLogin
        text={text}
        size={size}
        width={width}
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
