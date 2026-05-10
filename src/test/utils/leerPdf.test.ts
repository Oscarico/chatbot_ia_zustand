import { describe, it, expect, vi, beforeEach } from "vitest";

import { leerPdf } from "../../utils/leerPdf";
import { LIMITE_TEXTO } from "../../config/limites";

vi.mock("pdfjs-dist", () => ({
  getDocument: vi.fn(),
  GlobalWorkerOptions: {
    workerSrc: "",
  },
}));

vi.mock("pdfjs-dist/build/pdf.worker.min?url", () => ({
  default: "mock-worker",
}));

describe("leerPdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("debe extraer texto correctamente", async () => {
    const { getDocument } = await import("pdfjs-dist");

    const mockPdf = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue({
        getTextContent: vi.fn().mockResolvedValue({
          items: [{ str: "Hola " }, { str: "PDF" }],
        }),
      }),
    };

    vi.mocked(getDocument).mockReturnValue({
      promise: Promise.resolve(mockPdf),
    } as any);

    const archivo = new File(["pdf"], "archivo.pdf");

    const resultado = await leerPdf(archivo);

    expect(getDocument).toHaveBeenCalled();
    expect(resultado).toContain("Hola PDF");
  });

  it("debe respetar el límite de texto", async () => {
    const { getDocument } = await import("pdfjs-dist");

    const textoLargo = "a".repeat(LIMITE_TEXTO + 200);

    const mockPdf = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue({
        getTextContent: vi.fn().mockResolvedValue({
          items: [{ str: textoLargo }],
        }),
      }),
    };

    vi.mocked(getDocument).mockReturnValue({
      promise: Promise.resolve(mockPdf),
    } as any);

    const archivo = new File(["pdf"], "archivo.pdf");

    const resultado = await leerPdf(archivo);

    expect(resultado.length).toBe(LIMITE_TEXTO);
  });

  it("debe regresar vacío si ocurre un error", async () => {
    const { getDocument } = await import("pdfjs-dist");

    vi.mocked(getDocument).mockImplementation(() => {
      throw new Error("falló pdf");
    });

    const archivo = new File(["pdf"], "archivo.pdf");

    const resultado = await leerPdf(archivo);

    expect(resultado).toBe("");
  });
});
