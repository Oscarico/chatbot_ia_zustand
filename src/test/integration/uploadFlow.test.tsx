import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { AdjuntarArchivo } from "../../components/AdjuntarArchivo";

// 1. MOCK de las librerías conflictivas ANTES de importar nada más
vi.mock("../../utils/leerPdf", () => ({
  leerPdf: vi.fn().mockResolvedValue("Texto de PDF mockeado"),
}));

vi.mock("../../utils/leerDocx", () => ({
  leerDocx: vi.fn().mockResolvedValue("Texto de DOCX mockeado"),
}));

vi.mock("../../utils/leerXlsx", () => ({
  leerXlsx: vi.fn().mockResolvedValue("Texto de Excel mockeado"),
}));

describe("Upload flow integration", () => {
  it("debe procesar archivo txt y enviarlo al confirmar", async () => {
    const user = userEvent.setup();
    const mockEnvio = vi.fn();

    render(<AdjuntarArchivo envioTextoExtraido={mockEnvio} />);

    // archivo fake
    const archivo = new File(["Hola desde archivo txt"], "prueba.txt", {
      type: "text/plain",
    });

    // Buscamos el input por su label
    const input = screen.getByLabelText(/elegir archivo/i);

    // Subimos el archivo
    await user.upload(input, archivo);

    // aparece confirmación
    await waitFor(() => {
      expect(
        screen.getByText(/quieres analizar este archivo/i),
      ).toBeInTheDocument();
    });

    // confirmar haciendo click en el botón "SI"
    // Usamos una regex para que no falle por mayúsculas/minúsculas
    const botonSi = screen.getByRole("button", { name: /^si$/i });
    await user.click(botonSi);

    // Validamos que el callback se llamó con la data correcta
    expect(mockEnvio).toHaveBeenCalledWith({
      texto: "Hola desde archivo txt",
      esArchivo: true,
    });
  });

  // Test para PDF
  it("debe procesar archivo PDF y usar el texto extraído", async () => {
    const user = userEvent.setup();
    const mockEnvio = vi.fn();
    render(<AdjuntarArchivo envioTextoExtraido={mockEnvio} />);

    const archivoPdf = new File(["pdf content"], "documento.pdf", {
      type: "application/pdf",
    });

    const input = screen.getByLabelText(/elegir archivo/i);
    await user.upload(input, archivoPdf);

    // Al confirmar
    const botonSi = await screen.findByRole("button", { name: /^si$/i });
    await user.click(botonSi);

    expect(mockEnvio).toHaveBeenCalledWith({
      texto: "Texto de PDF mockeado", // El valor que pusimos en el vi.mock
      esArchivo: true,
    });
  });

  // Test para Word (DOCX)
  it("debe procesar archivo Word (.docx)", async () => {
    const user = userEvent.setup();
    const mockEnvio = vi.fn();
    render(<AdjuntarArchivo envioTextoExtraido={mockEnvio} />);

    const archivoDocx = new File(["word content"], "nota.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const input = screen.getByLabelText(/elegir archivo/i);
    await user.upload(input, archivoDocx);

    const botonSi = await screen.findByRole("button", { name: /^si$/i });
    await user.click(botonSi);

    expect(mockEnvio).toHaveBeenCalledWith({
      texto: "Texto de DOCX mockeado",
      esArchivo: true,
    });
  });

  // Test para Excel (XLSX)
  it("debe procesar archivo Excel (.xlsx)", async () => {
    const user = userEvent.setup();
    const mockEnvio = vi.fn();
    render(<AdjuntarArchivo envioTextoExtraido={mockEnvio} />);

    const archivoXlsx = new File(["excel content"], "data.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const input = screen.getByLabelText(/elegir archivo/i);
    await user.upload(input, archivoXlsx);

    const botonSi = await screen.findByRole("button", { name: /^si$/i });
    await user.click(botonSi);

    expect(mockEnvio).toHaveBeenCalledWith({
      texto: "Texto de Excel mockeado",
      esArchivo: true,
    });
  });
});
