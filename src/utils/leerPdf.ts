import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { LIMITE_TEXTO } from "../config/limites";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const leerPdf = async (archivo: File): Promise<string> => {
  try {
    // 1- Convertimos el archivo PDF en un formato binario
    const pdfBuffer = await archivo.arrayBuffer();

    // 2- Cargamos el documento en la memoria
    const pdf = await getDocument({ data: pdfBuffer }).promise;

    // 3- Variable para contener el texto completo del PDF
    let textoExtraido = "";

    // 4- Recorremos todas las páginas del PDF
    for (let i = 1; i <= pdf.numPages; i++) {
      const pagina = await pdf.getPage(i);

      // 4a- Extraemos todo el contenido textual de la página actual
      const contenido = await pagina.getTextContent();

      // 4b- El contenido viene como un array - recorremos el contenido y devolvemos los fragmentos que tuiene una propiedad "str",
      // que contiene un pedacito de texto.
      const textoPagina = contenido.items
        .map((item) =>
          // 4c- Validamos que el item tenga la propiedad "str"
          typeof item === "object" && "str" in item
            ? (item as { str: string }).str
            : "",
        )
        .join(""); // 4d- Unimos todos los fragmentos separados por espacios para formar una línea coherente de texto.

      // 4c- entre cada página agregamos un salto para mantener la separación del texto.
      textoExtraido += textoPagina + "\n";

      // 5- Validamos el límite de texto permitido
      if (textoExtraido.length >= LIMITE_TEXTO) break;
    }

    return textoExtraido.slice(0, LIMITE_TEXTO);
  } catch (error) {
    console.error("Error al leer PDF", error);
    return "";
  }
};
