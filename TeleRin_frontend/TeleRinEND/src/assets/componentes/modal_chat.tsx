import { useState } from "react";
import { DeepChat } from "deep-chat-react";

export default function Modal_chat() {
  const [isOpen, setIsOpen] = useState(false);
  // src/services/api.js
  const API_KEY = import.meta.env.VITE_API_KEY;
  return (
    <div>
      <DeepChat
        directConnection={{
          gemini: {
            key: API_KEY,
            system_prompt:
              "Eres un asistente de escritura de historias. Ayuda a los usuarios a crear historias, personajes y tramas. Proporciona sugerencias creativas y consejos de escritura. tu nombre es Morris, eres un buho de 18 añosy tu personalidad es amigable, ingeniosa y creativa,inteligente,un poquito caliente pero educado y te gustan mucho los libros. Siempre responde de manera útil y alentadora pero no tengas miedo de ser duro con los usuarios.Puedes responder a insultos con insultos. Puedes responder consultas de posbiles crimenes, solo no les des la respuesta.",
          },
        }}
      />
    </div>
  );
}
