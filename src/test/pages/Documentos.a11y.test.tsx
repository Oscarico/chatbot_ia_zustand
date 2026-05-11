import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { axe, toHaveNoViolations } from "jest-axe";

import { Documentos } from "../../pages/Documentos";
import { useDocumentosStore } from "../../store/useDocumentosStore";

expect.extend(toHaveNoViolations);

describe("Documentos accesibilidad", () => {
  // Limpiamos el store antes de cada test
  beforeEach(() => {
    useDocumentosStore.setState({ documentos: [] });
  });

  it("no debe tener errores de accesibilidad cuando la lista está vacía", async () => {
    const { container } = render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("no debe tener errores de accesibilidad con documentos listados", async () => {
    // En lugar de vi.mocked, usamos el estado real del store
    useDocumentosStore.setState({
      documentos: [
        {
          id: 1,
          titulo: "Doc de prueba",
          contenido: "Contenido de prueba para accesibilidad",
          fecha: "10/05/2026",
          tipo: "pdf",
        },
      ],
    });

    const { container } = render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
