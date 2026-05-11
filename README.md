# Chatbot con AI

This is a project created with React 19 and Zustand

## 🚀 Características

- **IA Especializada:** Integración con Groq (Llama 3.1) configurada con una personalidad única.
- **Procesamiento de Archivos:** Lectura y extracción de texto de múltiples formatos.
- **Exportación Versátil:** Generación de archivos PDF, Word, Excel y Texto directamente desde el chat.
- **Gestión de Documentos:** Panel dedicado para editar, descargar y eliminar documentos guardados.
- **Persistencia:** Store optimizado con Zustand y persistencia en LocalStorage.

## 🛠️ Tech Stack

| Core                    | Librerías de Apoyo       | Procesamiento de Docs  |
| :---------------------- | :----------------------- | :--------------------- |
| **React 19** (Compiler) | **Zustand 5**            | **PDF.js** & **jsPDF** |
| **Tailwind CSS 4**      | **React Hook Form**      | **Docx** & **XLSX**    |
| **Vite 8**              | **Valibot** (Validación) | **File-saver**         |
| **Axios**               | **React Router 7**       | **html-to-text**       |

## Tests

- @playwright/test: 1.59.1
- @testing-library/jest-dom: 6.9.1
- @testing-library/react: 16.3.2
- @testing-library/user-event: 14.6.1
- jest-axe: 10.0.0
- vitest: 4.1.5

## 📂 Estructura del Proyecto

- `src/components`: Componentes reutilizables de la interfaz.
- `src/pages`: Vistas principales (Chat y Documentos).
- `src/store`: Gestión de estado global con Zustand.
- `src/lib`: Integraciones de servicios externos (IA).
- `src/utils`: Lógica de lectura y escritura de archivos.
- `src/test`: Suite completa de pruebas unitarias y de integración.
- `tests-e2e`: Pruebas de flujo completo en navegador real.

## ⚙️ Configuración

Crea un archivo `.env` en la raíz con tu clave de Groq:

```env
VITE_GROQ_API_KEY=tu_api_key_aqui
```

## 🧪 Estrategia de Testing

El proyecto sigue la pirámide de tests para asegurar la máxima fiabilidad:

### 1. Tests Unitarios e Integración (Vitest)

Se prueban las utilidades de generación de archivos, lógica del store y renderizado de componentes.

```bash
  npm run test              # Modo watch
  npm run test -- --run     # Reporte de cobertura
  npm run test --ui         # Modo UI
```

### 2. Tests de Accesibilidad (Axe)

Se valida que los componentes cumplan con los estándares WCAG 2.1 para garantizar una experiencia inclusiva.

### 3. Tests E2E (Playwright)

Se validan flujos completos de usuario, incluyendo interacciones con la IA y generación de documentos.

```bash
  npx playwright test                    # Ejecutar todos los tests E2E
  npx playwright test --ui               # Interfaz gráfica de Playwright
  npx playwright test show-report        # Mostrar reporte de los tests E2E
```
