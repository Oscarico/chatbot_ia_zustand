# Chatbot con AI

This is a project created with React 19 and Zustand

## Tech Stack

**Using:**

- React: 19.2.5
- zustand: 5.0.13
- Tailwindcss: 4.2.4
- axios:1.16.0
- react-hook-form: 7.75.0
- react-router-dom: 7.15.0
- valibot: 1.4.0
- xlsx: 0.18.5
- pdfjs-dist: 5.6.205
- jspdf: 4.2.1
- html-to-text: 10.0.0
- file-saver: 2.0.5
- docx: 9.6.1
- docx-preview: 0.3.7
- groq-api: v1

## Tests

- @playwright/test: 1.59.1
- @testing-library/jest-dom: 6.9.1
- @testing-library/react: 16.3.2
- @testing-library/user-event: 14.6.1
- jest-axe: 10.0.0
- vitest: 4.1.5

## Components

- AdjuntarArchivo.tsx
- IndexVentanaChat.tsx
- MenuDescargarMensajes.tsx

## Config

- limites.ts

## Lib

- consultarIA.ts

## Pages

- Documentos.tsx

## Store

- useChatStore.ts
- useDocumentosStore.ts

## Types

- documentos.ts
- mensaje.ts

## Utils

- generarDocx.ts
- generarPdf.ts
- generarXlsx.ts
- guardarDocumento.ts
- leerDocx.ts
- leerPdf.ts
- leerXlsx.ts

## Running Tests

To run tests, run the following command

```bash
  npm run test
  npm run test -- --run
```

## Running Tests E2E

```bash
  npx playwright test --ui
  npx playwright test show-report
```
