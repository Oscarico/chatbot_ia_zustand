import React, { useState } from "react";
import { LIMITE_TEXTO } from "../config/limites";
import { leerDocx } from "../utils/leerDocx";
import { leerPdf } from "../utils/leerPdf";
import { leerXlsx } from "../utils/leerXlsx";

/**
 * usuario selecciona un archivo
 *     => valida + extrae el texto del documento
 *         => vista previa del contenido
 *             =>
 *             No => Borra el texto
 *             Si => Se envia la información al chat
 */

const EXTENSIONES_VALIDAS = ["txt", "docx", "pdf", "xlsx"];

const EXTENSIONES_MIME_VALIDAS = [
  "text/plain" /** TXT */,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" /** DOCX */,
  "application/pdf" /** PDF */,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" /** XLSX */,
];

const MAX_SIZE_BYTES = 5 * 1024 * 1024; /** 5MB */

type PropAdjuntarArchivo = {
  envioTextoExtraido: (entrada: { texto: string; esArchivo: boolean }) => void;
};

export const AdjuntarArchivo = ({
  envioTextoExtraido,
}: PropAdjuntarArchivo) => {
  const [texto, setTexto] = useState("");

  const manejarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    const extension = archivo.name.split(".").pop()?.toLowerCase();

    /** Validaciones Generales */

    // Extensiones permitidas
    if (!extension || !EXTENSIONES_VALIDAS.includes(extension)) {
      alert("Formato de archivo no permitido.");
      return;
    }

    // Extensiones MIME validas para archivos
    if (!EXTENSIONES_MIME_VALIDAS.includes(archivo.type)) {
      alert("Tipo MIME no permitido");
      return;
    }

    // Validamos Tamaño Máxico
    if (archivo.size > MAX_SIZE_BYTES) {
      alert("El archivo ecede el tamaño máximo permitido de 5 mb");
      return;
    }

    /** Procesamos archivo por su tipo */

    // TXT
    if (extension === "txt") {
      // 1. Usamos FileReader para leer el contenido del archivo
      const lector = new FileReader();

      // 2. Una vez que el archivo esta listo para ser leído, lo leemos
      lector.onload = () => {
        const contenido = (lector.result as string).slice(0, LIMITE_TEXTO);
        setTexto(contenido);
      };

      // 3. Leemos el archivo de acuerdo a las especificaciones que nos indica lector.onload usando readAsText
      lector.readAsText(archivo);
      return;
    }

    // DOCX
    if (extension === "docx") {
      const lector = new FileReader(); // 1. Nuevo archivo

      // 2. Como vamos a procesar el archivo y por ende, cómo se tiene que leer el archivo
      // 4. ReadAsArrayBuffer nos devuelve el contenido crudo y ya estamos listos para procesar el contenidoy enviarlo a IndexVentanaChat, a traves de setTexto
      lector.onload = async () => {
        const contenido = await leerDocx(archivo);
        setTexto(contenido);
      };

      // 3. Leemos el archivo de acuerdo a las especificaciones que nos indica lector.onload
      lector.readAsArrayBuffer(archivo);
      return;
    }

    // PDF
    if (extension === "pdf") {
      // 1- leerPdf devuelve un string con todo el texto
      const resultado = await leerPdf(archivo);
      setTexto(resultado);
      return;
    }

    // XLSX
    if (extension === "xlsx") {
      const lector = new FileReader();

      lector.onload = async () => {
        const resultado = await leerXlsx(archivo);
        setTexto(resultado);
      };

      lector.readAsArrayBuffer(archivo);
      return;
    }
  };

  // Función para confirmar
  const confirmar = () => {
    envioTextoExtraido({
      texto,
      esArchivo: true,
    });
    setTexto("");
  };

  // Función para cancelar
  const cancelar = () => {
    setTexto("");
  };

  return (
    <div className="mt-4 space-y-2">
      <label className="inline-block cursor-pointer text-sm bg-zinc-700 text-white px-3 py-1 rounded hover:bg-zinc-500">
        Elegir archivo
        <input
          type="file"
          accept=".txt, .docx, .pdf, .xlsx"
          className="hidden"
          onChange={manejarArchivo}
        />
      </label>

      {texto && (
        <div className="text-sm bg-zinc-800 p-3 rounded text-center">
          <p className="mb-2">¿Quieres analizar este archivo?</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={confirmar}
              className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
            >
              Si
            </button>
            <button
              onClick={cancelar}
              className="bg-amber-500 px-3 py-1 rounded hover:bg-amber-600"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
