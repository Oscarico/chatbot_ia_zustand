import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { Documentos } from "../../pages/Documentos";

const mocks = vi.hoisted(() => ({
  eliminarDocumento: vi.fn(),
  borrarTodo: vi.fn(),
  renombrarDocumento: vi.fn(),
}));

let mockDocumentos: any[] = [];

vi.mock("../../store/useDocumentosStore", () => ({
  useDocumentosStore: (selector: any) =>
    selector({
      documentos: mockDocumentos,
      eliminarDocumento: mocks.eliminarDocumento,
      borrarTodo: mocks.borrarTodo,
      renombrarDocumento: mocks.renombrarDocumento,
    }),
}));

describe("Documentos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDocumentos = [];
  });

  it("debe mostrar mensaje cuando no hay documentos", () => {
    render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/no hay documentos guardados/i),
    ).toBeInTheDocument();
  });

  it("debe mostrar documentos guardados", () => {
    mockDocumentos = [
      {
        id: 1,
        titulo: "Mi documento",
        contenido: "Contenido de prueba",
        fecha: "2026-05-09",
        tipo: "txt",
      },
    ];

    render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    expect(screen.getByText("Mi documento")).toBeInTheDocument();
  });

  it("debe eliminar un documento", () => {
    mockDocumentos = [
      {
        id: 1,
        titulo: "Mi documento",
        contenido: "Contenido",
        fecha: "2026-05-09",
        tipo: "txt",
      },
    ];

    render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /eliminar/i,
      }),
    );

    expect(mocks.eliminarDocumento).toHaveBeenCalledWith(1);
  });

  it("debe borrar todos los documentos", () => {
    mockDocumentos = [
      {
        id: 1,
        titulo: "Mi documento",
        contenido: "Contenido",
        fecha: "2026-05-09",
        tipo: "txt",
      },
    ];

    render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /borrar todo/i,
      }),
    );

    expect(mocks.borrarTodo).toHaveBeenCalled();
  });

  it("debe renombrar un documento", () => {
    mockDocumentos = [
      {
        id: 1,
        titulo: "Mi documento",
        contenido: "Contenido",
        fecha: "2026-05-09",
        tipo: "txt",
      },
    ];

    render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /editar/i,
      }),
    );

    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: {
        value: "Nuevo nombre",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /aceptar/i,
      }),
    );

    expect(mocks.renombrarDocumento).toHaveBeenCalledWith(1, "Nuevo nombre");
  });
});
