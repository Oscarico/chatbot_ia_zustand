import { describe, it, expect, vi, beforeEach } from "vitest";
import { consultarIA } from "../../lib/consultarIA";

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
  getState: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    post: mocks.post,
  },
}));

vi.mock("../../store/useChatStore", () => ({
  useChatStore: {
    getState: mocks.getState,
  },
}));

describe("consultarIA", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(console, "error").mockImplementation(() => {});

    mocks.getState.mockReturnValue({
      mensajes: [
        {
          rol: "usuario",
          texto: "Hola",
        },
        {
          rol: "bot",
          texto: "Hola humano",
        },
      ],
    });
  });

  it("debe devolver la respuesta de la IA", async () => {
    mocks.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: "Respuesta IA",
            },
          },
        ],
      },
    });

    const respuesta = await consultarIA({
      soloUsuario: "Hola",
      incluirHistorial: false,
    });

    expect(respuesta).toBe("Respuesta IA");
  });

  it("debe incluir historial cuando se indique", async () => {
    mocks.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: "Respuesta IA",
            },
          },
        ],
      },
    });

    await consultarIA({
      soloUsuario: "Nueva pregunta",
      incluirHistorial: true,
    });

    expect(mocks.getState).toHaveBeenCalled();
    expect(mocks.post).toHaveBeenCalled();
  });

  it("debe lanzar error cuando falla la API", async () => {
    mocks.post.mockRejectedValue(new Error("falló la api"));

    await expect(
      consultarIA({
        soloUsuario: "Hola",
        incluirHistorial: false,
      }),
    ).rejects.toThrow("Error desconocido al consultar Groq");
  });
});
