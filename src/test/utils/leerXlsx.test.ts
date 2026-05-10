import { describe, it, expect, vi, beforeEach } from "vitest";

import { leerXlsx } from "../../utils/leerXlsx";
import { LIMITE_TEXTO } from "../../config/limites";

vi.mock("xlsx", () => ({
  read: vi.fn(),
  utils: {
    sheet_to_json: vi.fn(),
  },
}));

describe("leerXlsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe extraer texto correctamente", async () => {
    const XLSX = await import("xlsx");

    vi.mocked(XLSX.read).mockReturnValue({
      SheetNames: ["Usuarios"],
      Sheets: {
        Usuarios: {},
      },
    } as any);

    vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue([
      ["Juan", "Pérez"],
      ["María", "López"],
    ] as any);

    const archivo = new File(["excel"], "archivo.xlsx");

    const resultado = await leerXlsx(archivo);

    expect(XLSX.read).toHaveBeenCalled();
    expect(XLSX.utils.sheet_to_json).toHaveBeenCalled();

    expect(resultado).toContain("Hoja Usuarios");
    expect(resultado).toContain("Juan Pérez");
    expect(resultado).toContain("María López");
  });

  it("debe respetar el límite de texto", async () => {
    const XLSX = await import("xlsx");

    const textoLargo = "a".repeat(LIMITE_TEXTO + 100);

    vi.mocked(XLSX.read).mockReturnValue({
      SheetNames: ["Datos"],
      Sheets: {
        Datos: {},
      },
    } as any);

    vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue([[textoLargo]] as any);

    const archivo = new File(["excel"], "archivo.xlsx");

    const resultado = await leerXlsx(archivo);

    expect(resultado.length).toBe(LIMITE_TEXTO);
  });
});
