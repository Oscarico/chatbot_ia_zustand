import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Flujos principales de la aplicación", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      "https://api.groq.com/openai/v1/chat/completions",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            choices: [
              {
                message: {
                  content:
                    "Soy Amanda. La paz interior es el reflejo de tu alma.",
                },
              },
            ],
          }),
        });
      },
    );
    await page.goto("http://localhost:5173/");
  });

  test("Flujo de Chat y Guardado en Documentos", async ({ page }) => {
    // 1. Enviar mensaje
    const input = page.getByPlaceholder("Escribe tu consulta...");
    await input.fill("Háblame de la paz");
    await page.keyboard.press("Enter");

    // 2. Esperar a que aparezca la respuesta de Amanda (el último mensaje del bot)
    const ultimoMensajeBot = page.locator('div:has-text("Soy Amanda.")').last();
    await expect(ultimoMensajeBot).toBeVisible();

    // 3. Hacer clic en el botón "Descargar" PERO solo el que está dentro del último mensaje
    const botonDescargar = ultimoMensajeBot.getByRole("button", {
      name: "Descargar",
    });
    await botonDescargar.click();

    // 4. Capturar la descarga del PDF
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click('button:has-text("PDF")'),
    ]);

    // 5. Navegar a Documentos
    await page.click("text=Ir a Documentos");

    // 6. Usamos una expresión regular para que coincida aunque el título esté truncado
    // Buscamos el texto que empieza con "Soy_Amanda" en la página de documentos
    await expect(page.getByText(/Soy_Amanda/i).first()).toBeVisible({
      timeout: 7000,
    });
  });

  test("Flujo de Adjuntar Archivo TXT", async ({ page }) => {
    const tempFilePath = path.join(process.cwd(), "test-ai.txt");
    fs.writeFileSync(tempFilePath, "Contenido de prueba para Amanda");

    // Subir archivo usando el input oculto
    await page.setInputFiles('input[type="file"]', tempFilePath);

    // Confirmar
    await page.click('button:has-text("Si")');

    // Verificar que el contenido del archivo subió al chat
    await expect(
      page.getByText("Contenido de prueba para Amanda"),
    ).toBeVisible();

    // Verificar que Amanda respondió a ese archivo
    await expect(page.getByText("Soy Amanda.").last()).toBeVisible();

    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
  });
});
