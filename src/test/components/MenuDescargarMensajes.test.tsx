import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { saveAs } from "file-saver";
import { generarPdf } from "../../utils/generarPdf";
import { generarDocx } from "../../utils/generarDocx";
import { generarXlsx } from "../../utils/generarXlsx";
import { guardarDocumento } from "../../utils/guardarDocumento";

import { MenuDescargarMensajes } from "../../components/MenuDescargarMensajes";

vi.mock("../../utils/generarPdf", () => ({
  generarPdf: vi.fn(),
}));

vi.mock("../../utils/generarDocx", () => ({
  generarDocx: vi.fn(),
}));

vi.mock("../../utils/generarXlsx", () => ({
  generarXlsx: vi.fn(),
}));

vi.mock("../../utils/guardarDocumento", () => ({
  guardarDocumento: vi.fn(),
}));

vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

describe("MenuDescargarMensajes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar el botón descargar", () => {
    render(<MenuDescargarMensajes contenido="Hola desde la IA" />);

    expect(
      screen.getByRole("button", {
        name: /descargar/i,
      }),
    ).toBeInTheDocument();
  });

  it("debe mostrar las opciones al hacer click", () => {
    render(<MenuDescargarMensajes contenido="Hola desde la IA" />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /descargar/i,
      }),
    );

    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("DOCX")).toBeInTheDocument();
    expect(screen.getByText("TXT")).toBeInTheDocument();
    expect(screen.getByText("XLSX")).toBeInTheDocument();
  });

  it("debe descargar en PDF", () => {
    render(<MenuDescargarMensajes contenido="Hola desde la IA" />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /descargar/i,
      }),
    );

    fireEvent.click(screen.getByText("PDF"));

    expect(generarPdf).toHaveBeenCalled();
    expect(guardarDocumento).toHaveBeenCalled();
  });

  it("debe descargar en TXT", () => {
    render(<MenuDescargarMensajes contenido="Hola desde la IA" />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /descargar/i,
      }),
    );

    fireEvent.click(screen.getByText("TXT"));

    expect(saveAs).toHaveBeenCalled();
    expect(guardarDocumento).toHaveBeenCalled();
  });

  it("debe descargar en DOCX", () => {
    render(<MenuDescargarMensajes contenido="Hola desde la IA" />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /descargar/i,
      }),
    );

    fireEvent.click(screen.getByText("DOCX"));

    expect(generarDocx).toHaveBeenCalled();
    expect(guardarDocumento).toHaveBeenCalled();
  });

  it("debe descargar en XLSX", () => {
    render(<MenuDescargarMensajes contenido="Hola desde la IA" />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /descargar/i,
      }),
    );

    fireEvent.click(screen.getByText("XLSX"));

    expect(generarXlsx).toHaveBeenCalled();
    expect(guardarDocumento).toHaveBeenCalled();
  });
});
