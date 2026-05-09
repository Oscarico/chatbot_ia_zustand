import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { minLength, object, pipe, string } from "valibot";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState, useRef } from "react";
import { consultarIA } from "../lib/consultarIA";
import { AdjuntarArchivo } from "./AdjuntarArchivo";
import { LIMITE_TEXTO } from "../config/limites";
import { Link, useLocation } from "react-router-dom";
import { MenuDescargarMensajes } from "./MenuDescargarMensajes";

// Esquema de validación con Valibot
const schema = object({
  texto: pipe(string(), minLength(1, "El texto no puede ser vacío")),
});

// Para obtener los datos del input
type Formulario = {
  texto: string;
};

// const generarId = () => Date.now();

export const IndexVentanaChat = () => {
  const mensajes = useChatStore((state) => state.mensajes);
  const agregarMensaje = useChatStore((state) => state.agregarMensaje);

  // Obtener la ruta actual para determinar si estamos en documentos o no
  const location = useLocation();
  const enDocumentos = location.pathname === "/documentos";

  // React-Hook-Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Formulario>({
    resolver: valibotResolver(schema),
  });

  const [cargando, setCargando] = useState(false);

  // Para bajar al final de los mensajes
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /** useEffect(() => {
    consultarIA().then((respuesta) => {
      console.log("Respuesta de IA: ", respuesta);
    });
  }, []); */

  /** const simularRespuestaIA = async (texto: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`(Respuesta simulada) Entendi tu mensaje: ${texto}`);
      }, 800);
    });
  }; */

  const manejarEnvio = async (
    entrada: string | { texto: string; esArchivo: boolean },
  ) => {
    // Ternario para verificar si el texto que pasa al modelo IA es del usuario o de un archivo
    const texto = typeof entrada === "string" ? entrada : entrada.texto;
    // Comprobamos si la entrada es un objeto y si viene marcada como archivo
    const esArchivo = typeof entrada === "object" && entrada.esArchivo;

    agregarMensaje({
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      rol: "usuario",
      texto,
    });

    setCargando(true);

    try {
      // const respuesta = await simularRespuestaIA(entrada);
      const respuesta = await consultarIA({
        soloUsuario: texto.slice(0, LIMITE_TEXTO),
        incluirHistorial: !esArchivo,
      });
      agregarMensaje({
        // eslint-disable-next-line react-hooks/purity
        id: Date.now() + 1,
        rol: "bot",
        texto: respuesta,
      });
    } catch (error) {
      console.log("Error al consultar la IA", error);
      agregarMensaje({
        // eslint-disable-next-line react-hooks/purity
        id: Date.now() + 2,
        rol: "bot",
        texto: "No pude procesar tu solicitud en este momento.",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      <header className="bg-zinc-800 px-4 py-3 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">Este es el CHAT - IA</h1>

        <Link
          className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded"
          to={enDocumentos ? "/" : "/documentos"}
        >
          {enDocumentos ? "Volver al Chat" : "Ir a Documentos"}
        </Link>
      </header>

      <main className="flex-1 flex justify-center overflow-y-auto py-6 px-4">
        {/* Este div es el que controla el ancho y el centrado */}
        <div className="w-full max-w-3xl flex flex-col space-y-4">
          {mensajes.map((mensaje) => (
            <div
              key={mensaje.id}
              className={`flex ${mensaje.rol === "usuario" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`w-fit max-w-[85%] px-4 py-2 rounded-xl shadow whitespace-pre-wrap ${
                  mensaje.rol === "usuario"
                    ? "bg-zinc-500 text-white" // Un color que resalte para el usuario
                    : "bg-zinc-700 text-white"
                }`}
              >
                {mensaje.texto}
                {mensaje.rol === "bot" && (
                  <div className="mt-2">
                    <MenuDescargarMensajes contenido={mensaje.texto} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {cargando && (
            <div className="italic text-gray-400 animate-pulse">
              El bot está escribiendo...
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </main>

      <footer className="px-4 py-3 border-t border-zinc-700 space-y-4">
        <form
          onSubmit={handleSubmit((data) => {
            manejarEnvio(data.texto);
            reset();
          })}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Escribe tu consulta..."
            className="flex-1 px-4 rounded-lg bg-zinc-800 text-white placeholder-gray-400"
            {...register("texto")}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer"
          >
            Enviar
          </button>
        </form>
        {errors.texto && (
          <p className="text-white bg-red-500 text-sm text-center">
            {errors.texto.message}
          </p>
        )}

        <AdjuntarArchivo envioTextoExtraido={manejarEnvio} />
      </footer>
    </div>
  );
};
