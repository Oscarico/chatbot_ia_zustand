import { describe, it, expect, vi, beforeEach } from "vitest";
import { generarPdf } from "../../utils/generarPdf";

const mockText = vi.fn();
const mockSave = vi.fn();
const mockGetWidth = vi.fn(() => 210);

vi.mock("jspdf", () => {
  return {
    default: vi.fn(function () {
      return {
        internal: {
          pageSize: {
            getWidth: mockGetWidth,
          },
        },
        text: mockText,
        save: mockSave,
      };
    }),
  };
});

describe("generarPdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe generar el PDF correctamente", () => {
    generarPdf("Hola mundo", "archivo");

    expect(mockText).toHaveBeenCalled();
  });

  it("debe guardar con el nombre correcto", () => {
    generarPdf("Hola mundo", "archivo");

    expect(mockSave).toHaveBeenCalledWith("archivo.pdf");
  });

  it("debe usar el ancho máximo calculado", () => {
    generarPdf("Hola mundo", "archivo");

    expect(mockText).toHaveBeenCalledWith("Hola mundo", 10, 20, {
      maxWidth: 190, // 210 - 20
    });
  });
});
