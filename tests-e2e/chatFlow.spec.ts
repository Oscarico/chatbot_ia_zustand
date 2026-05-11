import { test, expect } from "@playwright/test";

test("debe permitir enviar un mensaje y ver la respuesta del bot", async ({
  page,
}) => {
  // 1. Interceptar la llamada a la IA para que el test sea rápido y no falle
  // Nota: Ajusta la URL '**/consultarIA' si tu función hace una petición fetch/axios
  // Si consultarIA es solo una función local, este paso se ignora, pero es buena práctica.

  // 2. Ir a la app
  await page.goto("http://localhost:5173/");

  // 3. Localizar el input. Usamos una cadena exacta para evitar confusiones.
  const input = page.getByPlaceholder("Escribe tu consulta...");

  // Esperar a que sea visible antes de escribir
  await expect(input).toBeVisible();

  // 4. Escribir y enviar
  await input.fill("Hola, genera un reporte de prueba");

  // En lugar de keyboard.press("Enviar") (que no existe), usamos Enter o clic al botón
  await page.click('button:has-text("Enviar")');

  // 5. Verificar que nuestro mensaje aparece en el chat
  await expect(
    page.getByText("Hola, genera un reporte de prueba"),
  ).toBeVisible();

  // 6. Verificar que aparece el indicador de carga
  await expect(page.getByText(/el bot está escribiendo/i)).toBeVisible();

  // 7. Esperar a que el bot responda (ajustamos el timeout por si la IA es lenta)
  // Como tu componente muestra MenuDescargarMensajes cuando el bot responde:
  await expect(
    page.getByRole("button", { name: /descargar/i }).first(),
  ).toBeVisible({
    timeout: 15000,
  });
});

test("navegación entre chat y documentos", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Clic en el link del header
  await page.click("text=Ir a Documentos");

  // Verificar que la URL cambió
  await expect(page).toHaveURL(/\/documentos/);

  // Verificar que el título de la página de documentos es visible
  await expect(page.getByText("Documentos Generados")).toBeVisible();

  // Volver al chat
  await page.click("text=Volver al Chat");
  await expect(page.getByText("Este es el CHAT - IA")).toBeVisible();
});
