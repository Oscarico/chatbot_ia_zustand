import { useDocumentosStore } from "../store/useDocumentosStore";
import type { Documento, TipoDocumento } from "../types/documentos";

export function guardarDocumento(tipo: TipoDocumento, contenido: string) {
  const agregarDocumento = useDocumentosStore.getState().agregarDocumento;

  const documento: Documento = {
    id: Date.now(),
    titulo: contenido.slice(0, 40).replace(/\s+/g, "_"),
    fecha: new Date().toLocaleDateString(),
    contenido,
    tipo,
  };

  agregarDocumento(documento);
}
