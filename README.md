# ALEXIS EL 40 — Barber Shop

Demostración comercial no oficial para Colina, Chile. Esta versión perfecciona el proyecto original: conserva la portada, la identidad negra y dorada, la tipografía Anton y los componentes existentes. HTML, CSS y JavaScript modular con Vite; sin backend, cuentas ni claves.

## Desarrollo en Codex Cloud

Node.js 22.12+ o 24 y npm. Usar el checkout existente; no se necesita otro worktree.

```sh
cd /workspace/websnoa
npm ci --cache /tmp/npm-cache
npm run dev -- --port 5173
```

## Producción y actualización de Netlify

```sh
npm run build
npm run preview -- --port 4173
```

`dist/` es la carpeta de producción. No subir `src/`, `node_modules/` ni el proyecto completo a Netlify Drop.

La entrega de esta revisión es `/workspace/alexis-el-40-actualizada-netlify.zip`. Descomprimir y subir **la carpeta `dist` que contiene `index.html`** al área de despliegue manual de **Deploys del sitio de Netlify existente**. Usar ese sitio para conservar su dirección pública. Empezar desde Netlify Drop como sitio nuevo puede crear otra dirección.

Esta revisión no se ha desplegado ni ha modificado Netlify. El ZIP incluye solo producción y ningún dato de prueba. El build utiliza rutas desde la raíz del dominio, adecuado para un sitio Netlify independiente; un hosting en subdirectorio requiere ajustar las rutas y la opción `base`.

## Configuración comercial centralizada

Editar exclusivamente `src/site.config.js` para estos datos:

| Bloque | Contenido | Activación |
| --- | --- | --- |
| `location` | Ciudad, país, dirección, enlace de Google Maps y URL de inserción | `verified: true` y dirección no vacía para el mapa |
| `contact` | Horarios y teléfono visible | `verified: true` |
| `whatsapp` | Número internacional sin signos y mensaje | `verified: true` y formato internacional válido |
| `instagram` | Perfil oficial y nombre visible | `verified: true` y URL HTTPS de Instagram |
| `services` | Cuatro propuestas de servicios y sus detalles | Se muestran como referencias por confirmar |
| `gallery` | Seis escenas, títulos y categorías | Galería ampliable, teclado y deslizamiento táctil |

No activar `verified` hasta que el dueño confirme el dato. No introducir secretos en este archivo público. Mientras WhatsApp no esté validado, los botones principales llevan a servicios o galería y el flotante explica el estado de las reservas. No se envían mensajes ni se simulan reservas.

Para Google Maps, copiar la URL HTTPS de `src` de la opción «Insertar un mapa», con formato `https://www.google.com/maps/embed?...`; no pegar el HTML completo. El mapa permanece sin cargar hasta que el visitante pulse «Cargar Google Maps». El enlace «Cómo llegar» se activa con `mapsUrl` confirmado. Los dominios y protocolos permitidos se validan antes de crear enlaces. Las pruebas usan datos ficticios únicamente por interceptación del navegador y no alteran la configuración entregada.

Los textos editoriales siguen en `index.html`; los diálogos y las interacciones en `src/main.js`; los estilos en `src/style.css`.

## Imágenes e identidad

Siete escenas conceptuales creadas para esta propuesta mediante Image Gen: una portada y seis imágenes distintas en la galería. No muestran instalaciones, clientes ni trabajos reales de ALEXIS EL 40. Se sirven localmente en WebP; la galería tiene miniaturas responsive de 480 px y originales para ampliar. No necesita servicios de imágenes ni fuentes remotos. Anton se distribuye bajo SIL Open Font License, incluida en `public/fonts/OFL-Anton.txt`.

La identidad tipográfica es provisional. No se han inventado precios, reseñas, antigüedad, horarios, dirección exacta, teléfonos ni redes oficiales. Los avisos se concentran en servicios, galería, pie de página y diálogos de información para mantener transparencia sin repetir mensajes en cada bloque.

## Pruebas y revisión visual

```sh
npx playwright test
```

Playwright inicia automáticamente Vite si no está activo y usa Chromium del entorno (`/usr/bin/chromium`). En otro entorno ajustar `executablePath` o usar el navegador de Playwright instalado. Se ejecutan **24 pruebas**: seis flujos en escritorio 1440×1000, tablet 768×1024, móvil 390×844 y móvil pequeño 320×740.

Se comprueban carga de imágenes, ausencia de errores JavaScript/consola y desbordamiento horizontal, navegación y menú, movimiento reducido, propuestas de servicios, estado de reservas, galería completa, retorno del foco y Escape, y configuración de contacto y mapa. Los enlaces configurados y el mapa se prueban con datos simulados y respuestas locales; no confirman que exista un número o una dirección reales.

`review/before/` y `review/after/` contienen capturas de la revisión. Ver `review/REVISION.md` para hallazgos y límites. Las capturas finales se regeneran con las pruebas.

Se respetan movimiento reducido, foco visible, diálogos nativos, navegación semántica y botones de tamaño táctil. Esto no sustituye una auditoría completa con tecnologías de asistencia ni una prueba en teléfonos físicos.
