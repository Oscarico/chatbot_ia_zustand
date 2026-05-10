import { describe, it, expect, beforeEach } from "vitest";
import { guardarDocumento } from "../../utils/guardarDocumento";
import { useDocumentosStore } from "../../store/useDocumentosStore";

describe("guardarDocumento", () => {
  beforeEach(() => {
    useDocumentosStore.setState({
      documentos: [],
    });
  });

  it("debe guardar un documento en el store", () => {
    guardarDocumento("pdf", "Hola mundo");

    const documentos = useDocumentosStore.getState().documentos;

    expect(documentos).toHaveLength(1);
    expect(documentos[0].tipo).toBe("pdf");
    expect(documentos[0].contenido).toBe("Hola mundo");
  });
});
