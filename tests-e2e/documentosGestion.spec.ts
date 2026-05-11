import { test, expect } from "@playwright/test";

test.describe("Gestión de la lista de Documentos", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Mock de la IA para tener algo que descargar
    await page.route(
      "https://api.groq.com/openai/v1/chat/completions",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            choices: [{ message: { content: "Respuesta para guardar" } }],
          }),
        });
      },
    );

    // 2. Crear al menos un documento para tener qué probar
    await page.goto("http://localhost:5173/");
    await page
      .getByPlaceholder("Escribe tu consulta...")
      .fill("Mensaje de prueba");
    await page.click('button:has-text("Enviar")');
    await page.click('button:has-text("Descargar")');
    await page.click('button:has-text("TXT")'); // Esto dispara guardarDocumento()

    // 3. Ir a la página de documentos
    await page.click("text=Ir a Documentos");
  });

  test("debe permitir editar el nombre de un documento", async ({ page }) => {
    // 1. Localizar el primer ítem de la lista
    const item = page.locator("ul > li").first();

    // 2. Asegurarnos de que el botón "Editar" es visible y hacer clic
    // Usamos force: true para evitar que problemas de scroll detengan el test
    const botonEditar = item.getByText("Editar");
    await botonEditar.waitFor({ state: "visible" });
    await botonEditar.click();

    // 3. Localizar el input.
    // Usamos un selector de tipo para ser más directos si el label falla.
    const inputNombre = item.locator('input[type="text"]');

    // 4. Esperar explícitamente a que el input aparezca en el DOM
    await inputNombre.waitFor({ state: "visible", timeout: 5000 });

    // 5. Limpiar y llenar el nuevo nombre
    await inputNombre.fill("Documento_Editado_E2E");

    // 6. Clic en Aceptar
    await item.getByRole("button", { name: /aceptar/i }).click();

    // 7. Verificar el cambio en el párrafo del título
    await expect(item.locator("p.font-semibold")).toHaveText(
      "Documento_Editado_E2E",
    );
  });

  test("debe permitir eliminar un documento individualmente", async ({
    page,
  }) => {
    const nombreDoc = await page
      .locator("li p.font-semibold")
      .first()
      .textContent();

    // Clic en el botón eliminar del primer item
    await page.locator('button:has-text("Eliminar")').first().click();

    // Verificar que ya no existe ese texto en la lista
    await expect(page.getByText(nombreDoc || "")).not.toBeVisible();
    await expect(
      page.getByText("No hay documentos guardados todavía."),
    ).toBeVisible();
  });

  test("debe permitir borrar todos los documentos de una vez", async ({
    page,
  }) => {
    // Verificamos que el botón "Borrar todo" es visible porque hay elementos
    const botonBorrarTodo = page.getByRole("button", { name: /borrar todo/i });
    await expect(botonBorrarTodo).toBeVisible();

    // Ejecutar borrado masivo
    await botonBorrarTodo.click();

    // Verificar lista vacía
    await expect(
      page.getByText("No hay documentos guardados todavía."),
    ).toBeVisible();
    await expect(botonBorrarTodo).not.toBeVisible();
  });

  test("debe descargar el archivo desde la lista de documentos", async ({
    page,
  }) => {
    // Capturar el evento de descarga
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator('button:has-text("Descargar")').first().click(),
    ]);

    // Verificar que el nombre sugerido termina en .txt (ya que creamos un TXT en el beforeEach)
    expect(download.suggestedFilename()).toMatch(/\.txt$/);
  });
});
