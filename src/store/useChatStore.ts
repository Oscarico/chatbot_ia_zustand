import { create } from "zustand";
import type { Mensaje } from "../types/mensaje";

type EstadoChat = {
  mensajes: Mensaje[];
  agregarMensaje: (mensaje: Mensaje) => void;
};

export const useChatStore = create<EstadoChat>((set) => ({
  // Estado inicial de - IndexVentanaChat
  mensajes: [
    {
      id: 1,
      rol: "bot",
      texto:
        "Hola, soy el bot super inteligente con IA, ¿cómo puedo ayudarte hoy?",
    },
  ],

  agregarMensaje: (mensaje: Mensaje) =>
    set((state) => ({
      mensajes: [...state.mensajes, mensaje],
    })),
}));
