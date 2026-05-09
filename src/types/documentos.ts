export type TipoDocumento = "pdf" | "docx" | "txt" | "xlsx";

export type Documento = {
  id: number;
  titulo: string;
  fecha: string;
  contenido: string;
  tipo: TipoDocumento;
};
