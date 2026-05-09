import { Link, useLocation } from "react-router-dom";
import { saveAs } from "file-saver";
import { useDocumentosStore } from "../store/useDocumentosStore";
import { useState } from "react";
import { generarPdf } from "../utils/generarPdf";
import { generarDocx } from "../utils/generarDocx";
import { generarXlsx } from "../utils/generarXlsx";

export default function Documentos() {
  const documentos = useDocumentosStore((state) => state.documentos);
  const eliminarDocumento = useDocumentosStore(
    (state) => state.eliminarDocumento,
  );
  const borrarTodo = useDocumentosStore((state) => state.borrarTodo);
  const renombrarDocumento = useDocumentosStore(
    (state) => state.renombrarDocumento,
  );

  const descargar = (doc: (typeof documentos)[number]) => {
    const { contenido, tipo, titulo } = doc;

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
  };

  // Guardamos el ID del documento que queremos editar
  const [editandoId, setEditandoId] = useState<number | null>(null);
  // Guardamos en nuevo titulo, mientras que el usuario escribe el input.
  const [nuevoTitulo, setNuevoTitulo] = useState("");

  const location = useLocation();
  const enDocumentos = location.pathname === "/";

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      <header className="bg-zinc-800 px-4 py-3 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">Documentos Generados</h1>

        <Link
          className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded"
          to={enDocumentos ? "/documentos" : "/"}
        >
          {enDocumentos ? "Ir a documentos" : "Volver al Chat"}
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto py-6 px-4 flex justify-center">
        {/* Contenedor principal */}
        <div className="w-full max-w-4xl space-y-6">
          {documentos.length === 0 ? (
            <p className="text-gray-400">
              No hay documentos guardados todavía.
            </p>
          ) : (
            <ul className="space-y-4">
              {documentos.map((doc) => (
                <li
                  key={doc.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex justify-between gap-4"
                >
                  {/* Información */}
                  <div className="flex-1 min-w-0">
                    {editandoId === doc.id ? (
                      <div>
                        <input
                          type="text"
                          value={nuevoTitulo}
                          onChange={(e) => setNuevoTitulo(e.target.value)}
                          className="text-sm bg-zinc-700 text-white px-2 py-1 rounded"
                        />
                        <button
                          onClick={() => {
                            renombrarDocumento(doc.id, nuevoTitulo);
                            setEditandoId(null);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-sm px-2 py-1 rounded"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => setEditandoId(null)}
                          className="bg-zinc-600 hover:bg-zinc-700 text-sm px-2 py-1 rounded"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-lg truncate">
                          {doc.titulo}
                        </p>

                        <button
                          onClick={() => {
                            setEditandoId(doc.id);
                            setNuevoTitulo(doc.titulo);
                          }}
                          className="text-xs text-blue-400 hover:underline cursor-pointer"
                        >
                          Editar
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-gray-400 mb-2">{doc.fecha}</p>

                    <p className="text-sm text-gray-300 line-clamp-3">
                      {doc.contenido}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => descargar(doc)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm cursor-pointer"
                    >
                      Descargar
                    </button>

                    <button
                      onClick={() => eliminarDocumento(doc.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Botón final */}
          <div className="flex justify-end">
            {documentos.length === 0 ? (
              ""
            ) : (
              <button
                onClick={borrarTodo}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm cursor-pointer"
              >
                Borrar todo
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
