import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { axe, toHaveNoViolations } from "jest-axe";

import { Documentos } from "../../pages/Documentos";

expect.extend(toHaveNoViolations);

vi.mock("../../store/useDocumentosStore", () => ({
  useDocumentosStore: (selector: any) =>
    selector({
      documentos: [],
      eliminarDocumento: vi.fn(),
      borrarTodo: vi.fn(),
      renombrarDocumento: vi.fn(),
    }),
}));

describe("Documentos accesibilidad", () => {
  it("no debe tener errores de accesibilidad", async () => {
    const { container } = render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
