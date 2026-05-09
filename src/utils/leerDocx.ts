import { renderAsync } from "docx-preview";
import { convert } from "html-to-text";
import { LIMITE_TEXTO } from "../config/limites";

export const leerDocx = async (archivo: File) : Promise<string> => {
    try {
        const container = document.createElement("div");
        await renderAsync(archivo, container);

        const textoPlano = convert(container.innerHTML, {
            wordwrap: false,
            selectors: [
                {selector: "a", format: "inline"}, // <a>link</a> => link
                {selector: "img", format: "skip"}, // Ignoramos las imagenes
                
            ]
        });

        return textoPlano.slice(0, LIMITE_TEXTO);
    } catch (error) {
        console.error("Error al leer DOCX: ", error);
        return "";
    }
}