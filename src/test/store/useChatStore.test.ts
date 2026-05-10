import { describe, expect, it } from "vitest";
import { useChatStore } from "../../store/useChatStore";

describe("useChatStore", () => {
  it("debe iniciar con mensaje del bot", () => {
    const mensajes = useChatStore.getState().mensajes;

    expect(mensajes).toHaveLength(1);
    expect(mensajes[0].rol).toBe("bot");
  });

  it("debe agregar un nuevo mensaje", () => {
    useChatStore.getState().agregarMensaje({
      id: 2,
      rol: "usuario",
      texto: "Hola IA",
    });

    const mensajes = useChatStore.getState().mensajes;

    expect(mensajes).toHaveLength(2);
    expect(mensajes[1].texto).toBe("Hola IA");
  });
});
