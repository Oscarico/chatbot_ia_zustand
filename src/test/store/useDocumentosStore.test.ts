import { beforeEach, describe, expect, it } from "vitest";
import { useDocumentosStore } from "../../store/useDocumentosStore";

describe("useDocumentosStore", () => {
  beforeEach(() => {
    useDocumentosStore.setState({
      documentos: [],
    });
  });

  it("debe agregar un documento", () => {
    useDocumentosStore.getState().agregarDocumento({
      id: 1,
      titulo: "Mi archivo",
      fecha: "09/05/2026",
      contenido: "Contenido test",
      tipo: "pdf",
    });

    const documentos = useDocumentosStore.getState().documentos;

    expect(documentos).toHaveLength(1);
    expect(documentos[0].titulo).toBe("Mi archivo");
  });

  it("debe eliminar un documento", () => {
    const store = useDocumentosStore.getState();

    store.agregarDocumento({
      id: 1,
      titulo: "Test",
      fecha: "09/05/2026",
      contenido: "Contenido",
      tipo: "pdf",
    });

    store.eliminarDocumento(1);

    expect(useDocumentosStore.getState().documentos).toHaveLength(0);
  });

  it("debe borrar todos los documentos", () => {
    const store = useDocumentosStore.getState();

    store.agregarDocumento({
      id: 1,
      titulo: "Test",
      fecha: "09/05/2026",
      contenido: "Contenido",
      tipo: "pdf",
    });

    store.borrarTodo();

    expect(useDocumentosStore.getState().documentos).toEqual([]);
  });
});
