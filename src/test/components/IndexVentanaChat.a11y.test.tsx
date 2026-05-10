import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { axe, toHaveNoViolations } from "jest-axe";

import { IndexVentanaChat } from "../../components/IndexVentanaChat";

// Extiende expect con axe
expect.extend(toHaveNoViolations);

// Mock del store
vi.mock("../../store/useChatStore", () => ({
  useChatStore: (selector) =>
    selector({
      mensajes: [],
      agregarMensaje: vi.fn(),
    }),
}));

// Mock IA
vi.mock("../../lib/consultarIA", () => ({
  consultarIA: vi.fn(),
}));

// Mock componente hijo
vi.mock("../../components/AdjuntarArchivo", () => ({
  AdjuntarArchivo: () => <div>Adjuntar Archivo</div>,
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("IndexVentanaChat accesibilidad", () => {
  it("no debe tener errores de accesibilidad", async () => {
    const { container } = render(
      <MemoryRouter>
        <IndexVentanaChat />
      </MemoryRouter>,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
