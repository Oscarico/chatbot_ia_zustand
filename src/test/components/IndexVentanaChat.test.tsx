import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { IndexVentanaChat } from "../../components/IndexVentanaChat";
import "@testing-library/jest-dom";

// Mock del store
const mockAgregarMensaje = vi.fn();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockMensajes: any[] = [];

vi.mock("../../store/useChatStore", () => ({
  useChatStore: (selector) =>
    selector({
      mensajes: mockMensajes,
      agregarMensaje: mockAgregarMensaje,
    }),
}));

// Mock de la IA
vi.mock("../../lib/consultarIA", () => ({
  consultarIA: vi.fn(() => Promise.resolve("Hola, soy la IA")),
}));

vi.mock("../../components/AdjuntarArchivo", () => ({
  AdjuntarArchivo: () => (
    <div data-testid="adjuntar-archivo">Mock AdjuntarArchivo</div>
  ),
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("IndexVentanaChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMensajes = [];

    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("debe renderizar el formulario", () => {
    render(
      <MemoryRouter>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    expect(screen.getByText(/este es el chat/i)).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/escribe tu consulta/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /enviar/i,
      }),
    ).toBeInTheDocument();
  });

  it("debe mostrar error si el input está vacío", async () => {
    render(
      <MemoryRouter>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /enviar/i,
      }),
    );

    expect(
      await screen.findByText(/el texto no puede ser vacío/i),
    ).toBeInTheDocument();
  });

  it("debe enviar mensaje del usuario", async () => {
    render(
      <MemoryRouter>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/escribe tu consulta/i);

    fireEvent.change(input, {
      target: {
        value: "Hola bot",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /enviar/i,
      }),
    );

    await waitFor(() => {
      expect(mockAgregarMensaje).toHaveBeenCalled();
    });
  });

  it("debe agregar respuesta del bot cuando la IA responde", async () => {
    render(
      <MemoryRouter>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/escribe tu consulta/i);

    fireEvent.change(input, {
      target: {
        value: "Hola IA",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /enviar/i,
      }),
    );

    await waitFor(() => {
      expect(mockAgregarMensaje).toHaveBeenCalledTimes(2);
    });
  });

  it("debe manejar error cuando la IA falla", async () => {
    const { consultarIA } = await import("../../lib/consultarIA");

    vi.mocked(consultarIA).mockRejectedValueOnce(new Error("falló la IA"));

    render(
      <MemoryRouter>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/escribe tu consulta/i);

    fireEvent.change(input, {
      target: {
        value: "Hola IA",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /enviar/i,
      }),
    );

    await waitFor(() => {
      expect(mockAgregarMensaje).toHaveBeenCalledTimes(2);
    });
  });

  it("debe mostrar link para ir a documentos", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: /ir a documentos/i,
      }),
    ).toBeInTheDocument();
  });

  it("debe mostrar link para volver al chat cuando está en documentos", () => {
    render(
      <MemoryRouter initialEntries={["/documentos"]}>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: /volver al chat/i,
      }),
    ).toBeInTheDocument();
  });

  it("debe renderizar el componente de adjuntar archivo", () => {
    render(
      <MemoryRouter>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("adjuntar-archivo")).toBeInTheDocument();
  });

  it("debe mostrar botón descargar cuando existe mensaje del bot", () => {
    mockMensajes = [
      {
        id: 1,
        rol: "bot",
        texto: "Hola, soy la IA",
      },
    ];

    render(
      <MemoryRouter>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", {
        name: /descargar/i,
      }),
    ).toBeInTheDocument();
  });
});
