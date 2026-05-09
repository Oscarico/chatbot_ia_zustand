import * as XLSX from "xlsx";
import { LIMITE_TEXTO } from "../config/limites";

export const leerXlsx = async (archivo: File): Promise<string> => {
  // 1- Leemos el contenido binario del archivo
  const contenidoLeido = await archivo.arrayBuffer();

  // 2- Interpretamos el contenido
  const libro = XLSX.read(contenidoLeido, { type: "array" });

  // 3- Procesamos cada hoja del libro para convertirla en un texto plano
  const textoHojas = libro.SheetNames.map((nombreHoja) => {
    const hoja = XLSX.utils.sheet_to_json(libro.Sheets[nombreHoja], {
      header: 1, // 4- Obtener filas como arrays
    }) as string[][]; // 5- Le decimos que va a recibir un array de array de textos

    // 6- Unimos cada fila y cada hoja
    const textoPlano = hoja.map((fila) => fila.join(" ")).join("\n");

    // 7- Agregamos el nombre de la hoja como titulo antes de su contenido
    return `Hoja ${nombreHoja}: \n ${textoPlano}`;
  }).join("\n");

  // 8- Limitamos el texto para que no sea excesivo
  return textoHojas.slice(0, LIMITE_TEXTO);
};
