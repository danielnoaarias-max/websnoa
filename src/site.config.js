/** Datos comerciales: editar aquí únicamente después de confirmarlos con el dueño.
 * Los indicadores `verified` evitan activar enlaces con datos todavía no validados.
 * No incluir claves ni credenciales: este archivo forma parte del sitio público.
 */
export const config = {
  location: {
    city: "Colina",
    country: "Chile",
    address: "",
    verified: false,
    // Enlace oficial de compartir ubicación y URL de insertar mapa de Google Maps.
    mapsUrl: "",
    mapsEmbedUrl: "",
  },
  contact: {
    phoneDisplay: "",
    hours: [], // Ejemplo de formato: ['Día confirmado: horario confirmado'].
    verified: false,
  },
  whatsapp: {
    number: "", // Número completo, con código de país, sin espacios ni signos.
    verified: false,
    message: "Hola, quisiera consultar por una reserva en ALEXIS EL 40.",
  },
  instagram: {
    url: "",
    label: "Instagram",
    verified: false,
  },
  services: [
    {
      id: "01",
      title: "Corte clásico",
      description: "Líneas limpias. Estilo que permanece.",
      detail:
        "Una inspiración atemporal: proporciones equilibradas, contornos definidos y un acabado natural.",
      icon: "scissors",
    },
    {
      id: "02",
      title: "Degradado / Fade",
      description: "Transiciones suaves, acabado preciso.",
      detail:
        "Una referencia de degradado con transiciones progresivas, desde los laterales hasta la textura superior.",
      icon: "fade",
    },
    {
      id: "03",
      title: "Perfilado de barba",
      description: "Definición y carácter en cada ángulo.",
      detail:
        "Una propuesta de contornos cuidados y forma equilibrada, como inspiración para conversar sobre tu look.",
      icon: "beard",
    },
    {
      id: "04",
      title: "Corte + barba",
      description: "Una propuesta completa para tu look.",
      detail:
        "Cabello y barba en una misma dirección visual: un estilo coherente que puedes usar como referencia.",
      icon: "star",
    },
  ],
  gallery: [
    {
      src: "/images/crop.webp",
      title: "Textura & precisión",
      category: "CROP / FADE",
      position: "center",
    },
    {
      src: "/images/classic.webp",
      title: "El clásico, renovado",
      category: "CORTE CLÁSICO",
      position: "center",
    },
    {
      src: "/images/beard.webp",
      title: "Carácter en el perfil",
      category: "BARBA / DETALLE",
      position: "center",
    },
    {
      src: "/images/taper.webp",
      title: "Movimiento natural",
      category: "RIZOS / TAPER",
      position: "center",
    },
    {
      src: "/images/detail.webp",
      title: "El ritual del cuidado",
      category: "HERRAMIENTAS",
      position: "center",
    },
    {
      src: "/images/space.webp",
      title: "Una atmósfera propia",
      category: "BARBER CULTURE",
      position: "center",
    },
  ],
};
