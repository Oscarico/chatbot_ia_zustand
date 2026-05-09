import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export function generarDocx(contenido: string, titulo: string) {
  // 1- Creamos el documento
  const docx = new Document({
    // 2- Definimos las distintas secciones del documento
    sections: [
      {
        // 3- Dentro de cada sección dividimos el contenido del mensaje en líneas usando split
        children: contenido.split("\n").map(
          // 4- Para cada línea, creamos un nuevo párrafo
          (linea) =>
            new Paragraph({
              children: [
                // 5- Vemos si cada fragmento del texto tiene algún estilo propio (cursiva, negrita, etc...).
                // Utilizamos un arreglo porque podriamos tener varios TextRuns
                new TextRun(linea),
              ],
              // 6- Configuramos el espacio después de cada párrafo. 100 es aprox 7px
              spacing: {
                after: 100,
              },
            }),
        ),
      },
    ],
  });

  // 7- Usamos Packer para convertir el doc en un blob
  Packer.toBlob(docx).then((blob) => {
    saveAs(blob, `${titulo}.docx`);
  });
}
