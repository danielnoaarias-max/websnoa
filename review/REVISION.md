# Revisión visual y funcional — ALEXIS EL 40

Se inspeccionó y mejoró el proyecto existente, conservando portada, fotografía principal, paleta, tipografía y estructura. Capturas de Chromium tomadas en Codex Cloud en esta revisión; ninguna captura corresponde al sitio público de Netlify.

| Paso | Estado inicial observado | Resultado |
| --- | --- | --- |
| 1. Portada y navegación | Dirección artística coherente; textos secundarios pequeños | Portada conservada, textos y acciones más legibles; menú con cierre por Escape y clic exterior |
| 2. Servicios | Texto móvil de 11 px, acciones de 8 px y demasiado aire superior | Tarjetas originales refinadas, cuerpos de 14 px en móvil estándar, detalles de cada propuesta en diálogo; carta claramente referencial |
| 3. Galería | Tres imágenes y repetición de la portada | Seis imágenes distintas, varias referencias de cabello y barba, miniaturas responsive, ampliación, teclado y gesto horizontal |
| 4. Esencia y reservas | Separaciones amplias y avisos repetidos | Recorrido más compacto y avisos concentrados; enlaces útiles hacia servicios/galería mientras el contacto no esté validado |
| 5. Ubicación y contacto | Retícula de mapa vacía y varios pendientes separados | Panel editorial «Nos vemos en Colina», información centralizada, Google Maps preparado con carga voluntaria |
| 6. Revisión móvil y teclado | Tipografía pequeña en pies, detalles y tarjetas | Tamaños revisados en 320, 390, 768 y 1440 px; sin desbordamiento; foco de diálogos, Escape y movimiento reducido verificados |

Evidencia inicial: `before/desktop.png` y `before/mobile.png`. Evidencia final: `after/desktop.png`, `after/tablet.png`, `after/mobile.png`, `after/small-mobile.png` y sus portadas `*-hero.png`.

Las capturas sustentan las observaciones de composición y legibilidad, no una declaración de accesibilidad completa. Las pruebas Playwright verifican comportamiento y carga, con **24 resultados aprobados**. Las pruebas de configuración interceptan el módulo solo en el navegador de prueba y simulan Google Maps; no se usaron contactos reales ni se cargó una ubicación no confirmada. No se han probado teléfonos físicos, lector de pantalla, entrega real de mensajes ni rendimiento con redes móviles reales.

Datos pendientes del propietario: WhatsApp validado, dirección exacta y enlace de mapa, horarios, teléfono visible, Instagram oficial y carta definitiva de servicios; autorización de identidad y contenido antes de una publicación oficial.
