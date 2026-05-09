import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function generarXlsx(contenido: string, titulo: string) {
  // 1- Dividimos el contenido por saltos de línea
  const filas = contenido.split("\n").map((linea) => [linea]);

  // 2- Convertimos el array [linea] en una hoja de Excel.
  // Cada fila, es un array de celdas => [["hola"], ["mundo"]]
  // AOA - Array of Arrays => aoa to sheet(hoja) => El resultado será que cada valor va a estar en su celda correspondiente
  const hoja = XLSX.utils.aoa_to_sheet(filas);

  // 3- Creamos un libro de Excel vacío
  const libro = XLSX.utils.book_new();

  // 4- Agregamos la hoja creada al libro
  XLSX.utils.book_append_sheet(libro, hoja, "mensaje");

  // 5- Convertimos el libro en un array de bytes binarios para poder descargarlo y, así, transformamos el objeto "libro"
  // en un archivo descargable
  const buffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });

  // 6- Creamos un blob con los datos generados
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // 7- Usamos file-saver para forzar descarga
  saveAs(blob, `${titulo}.xlsx`);
}
