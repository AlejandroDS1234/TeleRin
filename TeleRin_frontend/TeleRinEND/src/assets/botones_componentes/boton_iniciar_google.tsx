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
  const [cargando, setCargando] = useState(false);

  return (
    <>
      {cargando ? (
        <button
          disabled
          className="flex items-center justify-center gap-3 w-full h-10 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 cursor-not-allowed shadow-sm"
        >
          {/* Spinner animado */}
          <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Iniciando sesión...
        </button>
      ) : (
        <>
          <GoogleLogin
            text={text}
            size={size}
            width={width}
            onSuccess={async (credentialResponse) => {
              setCargando(true);
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
      )}
    </>
  );
}

export default BotonGoogle;
