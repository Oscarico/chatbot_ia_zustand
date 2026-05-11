import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { Documentos } from "../../pages/Documentos";
import { useDocumentosStore } from "../../store/useDocumentosStore";

describe("Documentos flow integration", () => {
  // Limpiamos el store antes de cada test para evitar datos persistentes
  beforeEach(() => {
    useDocumentosStore.setState({ documentos: [] });
  });

  it("debe completar el flujo de edición (renombrar) un documento", async () => {
    const user = userEvent.setup();

    // 1. Seteamos un estado inicial real
    useDocumentosStore.setState({
      documentos: [
        {
          id: 1,
          titulo: "Documento Original",
          contenido: "Contenido de prueba",
          fecha: "10/05/2026",
          tipo: "pdf",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    // 2. Verificar que aparece en la UI
    expect(screen.getByText("Documento Original")).toBeInTheDocument();

    // 3. Simular clic en editar
    const botonEditar = screen.getByRole("button", { name: /editar/i });
    await user.click(botonEditar);

    // 4. Cambiar el nombre en el input
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Documento Actualizado");

    // 5. Confirmar cambio
    const botonAceptar = screen.getByRole("button", { name: /aceptar/i });
    await user.click(botonAceptar);

    // 6. Validar UI y Store
    expect(screen.getByText("Documento Actualizado")).toBeInTheDocument();
    expect(screen.queryByText("Documento Original")).not.toBeInTheDocument();

    const docEnStore = useDocumentosStore.getState().documentos[0];
    expect(docEnStore.titulo).toBe("Documento Actualizado");
  });

  it("debe completar el flujo de eliminación de un documento", async () => {
    const user = userEvent.setup();

    useDocumentosStore.setState({
      documentos: [
        {
          id: 99,
          titulo: "Archivo para borrar",
          contenido: "Bye bye",
          fecha: "10/05/2026",
          tipo: "txt",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    // Verificamos que existe
    expect(screen.getByText("Archivo para borrar")).toBeInTheDocument();

    // Clic en eliminar
    const botonEliminar = screen.getByRole("button", { name: /eliminar/i });
    await user.click(botonEliminar);

    // Validar que desapareció de la UI
    expect(screen.queryByText("Archivo para borrar")).not.toBeInTheDocument();
    expect(
      screen.getByText(/no hay documentos guardados/i),
    ).toBeInTheDocument();

    // Validar que el store está vacío
    expect(useDocumentosStore.getState().documentos).toHaveLength(0);
  });

  // Test para borrar todo
  it("debe borrar todos los documentos de la interfaz y del store", async () => {
    const user = userEvent.setup();

    // 1. Seteamos el estado con varios documentos
    useDocumentosStore.setState({
      documentos: [
        {
          id: 1,
          titulo: "Doc A",
          contenido: "C1",
          fecha: "10/05/2026",
          tipo: "pdf",
        },
        {
          id: 2,
          titulo: "Doc B",
          contenido: "C2",
          fecha: "11/05/2026",
          tipo: "txt",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Documentos />
      </MemoryRouter>,
    );

    // 2. Verificar que los documentos están presentes
    expect(screen.getByText("Doc A")).toBeInTheDocument();
    expect(screen.getByText("Doc B")).toBeInTheDocument();

    // 3. Clic directo en "Borrar todo"
    const botonBorrarTodo = screen.getByRole("button", {
      name: /borrar todo/i,
    });
    await user.click(botonBorrarTodo);

    // 4. Validar que la UI se actualizó (ya no están los docs y está el mensaje de vacío)
    expect(screen.queryByText("Doc A")).not.toBeInTheDocument();
    expect(screen.queryByText("Doc B")).not.toBeInTheDocument();
    expect(
      screen.getByText(/no hay documentos guardados todavía/i),
    ).toBeInTheDocument();

    // 5. Validar que el store quedó vacío
    expect(useDocumentosStore.getState().documentos).toHaveLength(0);
  });
});
