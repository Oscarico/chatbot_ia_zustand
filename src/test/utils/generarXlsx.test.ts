import { describe, it, expect, vi, beforeEach } from "vitest";
import { generarXlsx } from "../../utils/generarXlsx";

const mocks = vi.hoisted(() => ({
  saveAs: vi.fn(),

  aoaToSheet: vi.fn(() => ({
    A1: { v: "Hola" },
  })),

  bookNew: vi.fn(() => ({
    Sheets: {},
  })),

  bookAppendSheet: vi.fn(),

  write: vi.fn(() => new ArrayBuffer(8)),
}));

vi.mock("file-saver", () => ({
  saveAs: mocks.saveAs,
}));

vi.mock("xlsx", () => ({
  default: {
    utils: {
      aoa_to_sheet: mocks.aoaToSheet,
      book_new: mocks.bookNew,
      book_append_sheet: mocks.bookAppendSheet,
    },
    write: mocks.write,
  },
  utils: {
    aoa_to_sheet: mocks.aoaToSheet,
    book_new: mocks.bookNew,
    book_append_sheet: mocks.bookAppendSheet,
  },
  write: mocks.write,
}));

describe("generarXlsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe generar la hoja de excel", () => {
    generarXlsx("Hola\nMundo", "archivo");

    expect(mocks.aoaToSheet).toHaveBeenCalledWith([["Hola"], ["Mundo"]]);
  });

  it("debe agregar la hoja al libro", () => {
    generarXlsx("Hola", "archivo");

    expect(mocks.bookAppendSheet).toHaveBeenCalled();
  });

  it("debe guardar con el nombre correcto", () => {
    generarXlsx("Hola", "archivo");

    expect(mocks.saveAs).toHaveBeenCalledWith(expect.any(Blob), "archivo.xlsx");
  });
});
