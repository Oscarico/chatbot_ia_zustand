import { describe, it, expect, vi, beforeEach } from "vitest";

import { leerDocx } from "../../utils/leerDocx";
import { LIMITE_TEXTO } from "../../config/limites";

vi.mock("docx-preview", () => ({
  renderAsync: vi.fn(),
}));

vi.mock("html-to-text", () => ({
  convert: vi.fn(),
}));

describe("leerDocx", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("debe extraer texto correctamente", async () => {
    const { renderAsync } = await import("docx-preview");
    const { convert } = await import("html-to-text");

    vi.mocked(renderAsync).mockResolvedValue(undefined);
    vi.mocked(convert).mockReturnValue("Hola desde DOCX");

    const archivo = new File(["contenido"], "archivo.docx");

    const resultado = await leerDocx(archivo);

    expect(renderAsync).toHaveBeenCalled();
    expect(convert).toHaveBeenCalled();
    expect(resultado).toBe("Hola desde DOCX");
  });

  it("debe limitar el texto al máximo permitido", async () => {
    const { renderAsync } = await import("docx-preview");
    const { convert } = await import("html-to-text");

    vi.mocked(renderAsync).mockResolvedValue(undefined);

    const textoLargo = "a".repeat(LIMITE_TEXTO + 100);

    vi.mocked(convert).mockReturnValue(textoLargo);

    const archivo = new File(["contenido"], "archivo.docx");

    const resultado = await leerDocx(archivo);

    expect(resultado.length).toBe(LIMITE_TEXTO);
  });

  it("debe regresar vacío si ocurre un error", async () => {
    const { renderAsync } = await import("docx-preview");

    vi.mocked(renderAsync).mockRejectedValueOnce(new Error("falló docx"));

    const archivo = new File(["contenido"], "archivo.docx");

    const resultado = await leerDocx(archivo);

    expect(resultado).toBe("");
  });
});
