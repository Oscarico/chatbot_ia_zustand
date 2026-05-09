import { create } from "zustand";
import type { Documento } from "../types/documentos";
import { persist } from "zustand/middleware";

type EstadoDocumentos = {
  documentos: Documento[];
  agregarDocumento: (doc: Documento) => void;
  eliminarDocumento: (id: number) => void;
  borrarTodo: () => void;
  renombrarDocumento: (id: number, nuevoTitulo: string) => void;
};

export const useDocumentosStore = create(
  persist<EstadoDocumentos>(
    (set) => ({
      documentos: [],

      agregarDocumento: (doc) =>
        set((state) => ({
          documentos: [...state.documentos, doc],
        })),

      eliminarDocumento: (id) =>
        set((state) => ({
          documentos: state.documentos.filter(
            (documento) => documento.id !== id,
          ),
        })),

      borrarTodo: () => set({ documentos: [] }),

      renombrarDocumento: (id, nuevoTitulo: string) =>
        set((state) => ({
          documentos: state.documentos.map((doc) =>
            doc.id === id ? { ...doc, titulo: nuevoTitulo } : doc,
          ),
        })),
    }),
    {
      name: "documentos-generados",
    },
  ),
);
