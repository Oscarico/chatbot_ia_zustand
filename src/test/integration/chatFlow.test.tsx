import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { IndexVentanaChat } from "../../components/IndexVentanaChat";
import { useChatStore } from "../../store/useChatStore";

vi.mock("../../lib/consultarIA", () => ({
  consultarIA: vi
    .fn()
    .mockResolvedValue("Hola, soy Amanda. ¿En qué puedo ayudarte?"),
}));

vi.mock("../../components/AdjuntarArchivo", () => ({
  AdjuntarArchivo: () => <div>Adjuntar Archivo</div>,
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("Chat flow integration", () => {
  beforeEach(() => {
    useChatStore.setState({
      mensajes: [],
    });

    vi.clearAllMocks();
  });

  it("debe completar el flujo de conversación", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    const input = screen.getByRole("textbox");

    // escribir como usuario real
    await user.type(input, "Hola Amanda");

    // enviar
    await user.click(
      screen.getByRole("button", {
        name: /enviar/i,
      }),
    );

    // esperar mensaje usuario
    await waitFor(() => {
      expect(screen.getByText("Hola Amanda")).toBeInTheDocument();
    });

    // esperar mensaje IA
    await waitFor(() => {
      expect(
        screen.getByText("Hola, soy Amanda. ¿En qué puedo ayudarte?"),
      ).toBeInTheDocument();
    });

    // validar store real
    const mensajes = useChatStore.getState().mensajes;

    expect(mensajes).toHaveLength(2);
  });
});
