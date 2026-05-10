import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { AdjuntarArchivo } from "../../components/AdjuntarArchivo";

// Mock de utilidades
vi.mock("../../utils/leerPdf", () => ({
  leerPdf: vi.fn(),
}));

vi.mock("../../utils/leerDocx", () => ({
  leerDocx: vi.fn(),
}));

vi.mock("../../utils/leerXlsx", () => ({
  leerXlsx: vi.fn(),
}));

describe("AdjuntarArchivo", () => {
  it("debe renderizar el selector de archivo", () => {
    render(<AdjuntarArchivo envioTextoExtraido={vi.fn()} />);

    expect(screen.getByText(/elegir archivo/i)).toBeInTheDocument();
  });

  it("debe mostrar alerta si el archivo no es válido", () => {
    const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<AdjuntarArchivo envioTextoExtraido={vi.fn()} />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const archivoInvalido = new File(["contenido falso"], "virus.exe", {
      type: "application/octet-stream",
    });

    fireEvent.change(input, {
      target: {
        files: [archivoInvalido],
      },
    });

    expect(mockAlert).toHaveBeenCalledWith("Formato de archivo no permitido.");
  });

  it("debe mostrar confirmación al cargar un archivo txt válido", async () => {
    const mockReadAsText = vi.fn();

    vi.stubGlobal(
      "FileReader",
      class {
        result = "Contenido del archivo";

        onload: null | (() => void) = null;

        readAsText = mockReadAsText.mockImplementation(() => {
          if (this.onload) {
            this.onload();
          }
        });
      },
    );

    render(<AdjuntarArchivo envioTextoExtraido={vi.fn()} />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const archivoTxt = new File(["Hola desde txt"], "archivo.txt", {
      type: "text/plain",
    });

    fireEvent.change(input, {
      target: {
        files: [archivoTxt],
      },
    });

    expect(
      await screen.findByText(/quieres analizar este archivo/i),
    ).toBeInTheDocument();
  });

  it("debe enviar el texto al confirmar", async () => {
    const mockEnvio = vi.fn();

    vi.stubGlobal(
      "FileReader",
      class {
        result = "Contenido del archivo";

        onload: null | (() => void) = null;

        readAsText = () => {
          if (this.onload) {
            this.onload();
          }
        };
      },
    );

    render(<AdjuntarArchivo envioTextoExtraido={mockEnvio} />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const archivoTxt = new File(["Hola"], "archivo.txt", {
      type: "text/plain",
    });

    fireEvent.change(input, {
      target: {
        files: [archivoTxt],
      },
    });

    const botonSi = await screen.findByRole("button", {
      name: /si/i,
    });

    fireEvent.click(botonSi);

    expect(mockEnvio).toHaveBeenCalledWith({
      texto: "Contenido del archivo",
      esArchivo: true,
    });
  });

  it("debe limpiar la vista previa al cancelar", async () => {
    vi.stubGlobal(
      "FileReader",
      class {
        result = "Contenido del archivo";

        onload: null | (() => void) = null;

        readAsText = () => {
          if (this.onload) {
            this.onload();
          }
        };
      },
    );

    render(<AdjuntarArchivo envioTextoExtraido={vi.fn()} />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const archivoTxt = new File(["Hola"], "archivo.txt", {
      type: "text/plain",
    });

    fireEvent.change(input, {
      target: {
        files: [archivoTxt],
      },
    });

    // Primero aparece la confirmación
    expect(
      await screen.findByText(/quieres analizar este archivo/i),
    ).toBeInTheDocument();

    // Click en NO
    const botonNo = screen.getByRole("button", {
      name: /no/i,
    });

    fireEvent.click(botonNo);

    // Ya no debe existir
    expect(
      screen.queryByText(/quieres analizar este archivo/i),
    ).not.toBeInTheDocument();
  });
});
