import { useState } from "react";
import { saveAs } from "file-saver";
import type { TipoDocumento } from "../types/documentos";
import { generarPdf } from "../utils/generarPdf";
import { generarDocx } from "../utils/generarDocx";
import { generarXlsx } from "../utils/generarXlsx.ts";
import { guardarDocumento } from "../utils/guardarDocumento.ts";

type PropMenuDescarga = {
  contenido: string;
};

export const MenuDescargarMensajes = ({ contenido }: PropMenuDescarga) => {
  const [abierto, setAbierto] = useState(false);

  const titulo = contenido.slice(0, 40).replace(/\s+/g, "_");

  const descargar = (tipo: TipoDocumento) => {
    if (tipo === "txt") {
      const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });

      saveAs(blob, `${titulo}.txt`);
    }

    if (tipo === "pdf") {
      generarPdf(contenido, titulo);
    }

    if (tipo === "docx") {
      generarDocx(contenido, titulo);
    }

    if (tipo === "xlsx") {
      generarXlsx(contenido, titulo);
    }

    guardarDocumento(tipo, contenido);

    setAbierto(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setAbierto(!abierto)}
        className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded mt-1 cursor-pointer"
      >
        Descargar
      </button>

      {abierto && (
        <div className="absolute mt-1 bg-zinc-800 rounded shadow p-2 flex gap-2 z-50 min-w-[250px]">
          <button
            onClick={() => descargar("pdf")}
            className="bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600 text-sm cursor-pointer"
          >
            PDF
          </button>
          <button
            onClick={() => descargar("docx")}
            className="bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600 text-sm cursor-pointer"
          >
            DOCX
          </button>
          <button
            onClick={() => descargar("txt")}
            className="bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600 text-sm cursor-pointer"
          >
            TXT
          </button>
          <button
            onClick={() => descargar("xlsx")}
            className="bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600 text-sm cursor-pointer"
          >
            XLSX
          </button>
        </div>
      )}
    </div>
  );
};
