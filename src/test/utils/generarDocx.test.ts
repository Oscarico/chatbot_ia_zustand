import { describe, it, expect, vi, beforeEach } from "vitest";
import { generarDocx } from "../../utils/generarDocx";

const mocks = vi.hoisted(() => ({
  saveAs: vi.fn(),
  toBlob: vi.fn(),

  document: vi.fn(function (config) {
    return config;
  }),

  paragraph: vi.fn(function (config) {
    return config;
  }),

  textRun: vi.fn(function (texto) {
    return texto;
  }),
}));

vi.mock("file-saver", () => ({
  saveAs: mocks.saveAs,
}));

vi.mock("docx", () => ({
  Document: mocks.document,
  Paragraph: mocks.paragraph,
  TextRun: mocks.textRun,
  Packer: {
    toBlob: mocks.toBlob,
  },
}));

describe("generarDocx", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.toBlob.mockResolvedValue(new Blob(["contenido"]));
  });

  it("debe generar el documento", () => {
    generarDocx("Hola mundo", "archivo");

    expect(mocks.document).toHaveBeenCalled();
    expect(mocks.toBlob).toHaveBeenCalled();
  });

  it("debe guardar con el nombre correcto", async () => {
    generarDocx("Hola mundo", "archivo");

    await Promise.resolve();

    expect(mocks.saveAs).toHaveBeenCalledWith(expect.any(Blob), "archivo.docx");
  });

  it("debe dividir el contenido por líneas", () => {
    generarDocx("Linea 1\nLinea 2", "archivo");

    expect(mocks.paragraph).toHaveBeenCalledTimes(2);
  });
});
