import { config } from "./site.config.js";

const arrowSvg =
  '<svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const starSvg =
  '<svg class="star-icon" viewBox="0 0 100 100" aria-hidden="true"><g stroke="currentColor" stroke-width="9"><path d="M50 2v96M2 50h96M16 16l68 68M16 84l68-68"/></g></svg>';
const icons = {
  scissors:
    '<svg class="scissors-icon" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="24" r="4"/><circle cx="24" cy="24" r="4"/><path d="m11 21 14-17M21 21 7 4"/></g></svg>',
  fade: '<svg class="scissors-icon" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 7h22M5 13h18M5 19h14M5 25h10"/></g></svg>',
  beard:
    '<svg class="scissors-icon" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 7v10c0 6 11 11 11 11s11-5 11-11V7M10 16l6 3 6-3M13 12h6"/></g></svg>',
  star: starSvg,
};
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const services = config.services;
const photos = config.gallery;

document.querySelector("#services").innerHTML = services
  .map(
    (s, i) => `
  <button class="service reveal" data-service="${i}" aria-label="Ver propuesta: ${escapeHtml(s.title)}">
    <span class="service-top"><span>${escapeHtml(s.id)} /</span><span class="service-icon" aria-hidden="true">${icons[s.icon] || starSvg}</span></span>
    <h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p>
    <span class="service-bottom">VER PROPUESTA <span>${arrowSvg}</span></span>
  </button>`,
  )
  .join("");

document.querySelector("#gallery").innerHTML = photos
  .map(
    (p, i) => `
  <button class="gallery-photo reveal" data-photo="${i}" aria-label="Ampliar: ${escapeHtml(p.title)}">
    <img width="1024" height="1536" loading="lazy" decoding="async" src="${escapeHtml(p.src)}" srcset="${escapeHtml(p.src.replace(".webp", "-thumb.webp"))} 480w, ${escapeHtml(p.src)} 1024w" sizes="(max-width: 650px) 88vw, (max-width: 1000px) 43vw, 28vw" alt="${escapeHtml(p.title)}. Imagen conceptual." style="object-position:${escapeHtml(p.position)}">
    <span><span><small>${escapeHtml(p.category)}</small>${escapeHtml(p.title)}</span><b>${arrowSvg}</b></span>
  </button>`,
  )
  .join("");

const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");
function closeMenu(returnFocus = false) {
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Abrir menú");
  nav.classList.remove("open");
  if (returnFocus) menu.focus();
}
menu.onclick = () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  nav.classList.toggle("open", open);
};
nav.querySelectorAll("a").forEach((a) => (a.onclick = () => closeMenu()));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true")
    closeMenu(true);
});
document.addEventListener("click", (e) => {
  if (!e.target.closest("header")) closeMenu();
});
matchMedia("(min-width: 651px)").addEventListener("change", () => closeMenu());

const dialog = document.querySelector("#info-dialog");
const dialogGallery = document.querySelector("#dialog-gallery");
function info(title, copy, withGallery = false) {
  document.querySelector("#dialog-title").textContent = title;
  document.querySelector("#dialog-copy").textContent = copy;
  dialogGallery.hidden = !withGallery;
  dialog.showModal();
}
dialogGallery.onclick = () => dialog.close();

const whatsappNumber = String(config.whatsapp.number).trim();
const whatsappReady =
  config.whatsapp.verified === true && /^[1-9]\d{7,14}$/.test(whatsappNumber);
function whatsappUrl(service) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(service ? `Hola, quisiera consultar por ${service}.` : config.whatsapp.message)}`;
}
function contactInfo() {
  info(
    "Tu próximo corte, muy pronto.",
    "Estamos preparando el contacto directo con la barbería. El WhatsApp aún no está validado y esta demostración no recibe reservas. Mientras tanto, explora las propuestas y guarda la inspiración para tu próximo look.",
    true,
  );
}
// With an unverified number, primary links remain useful in-page navigation.
if (whatsappReady) {
  document.querySelectorAll("a.book").forEach((link) => {
    link.href = whatsappUrl();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = `Consultar por WhatsApp <span>${arrowSvg}</span>`;
  });
  document.querySelector("#booking-status").textContent =
    "Consulta disponibilidad directamente con la barbería.";
}
document.querySelector(".floating").onclick = () => {
  if (whatsappReady)
    window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
  else contactInfo();
};
document.querySelector(".floating").title = whatsappReady
  ? "Consultar por WhatsApp"
  : "Información de reservas";
document.querySelectorAll("[data-service]").forEach((button) => {
  button.onclick = () => {
    const service = services[Number(button.dataset.service)];
    info(
      service.title,
      `${service.detail} Esta es una propuesta referencial: disponibilidad, duración y valor por confirmar con la barbería.`,
      true,
    );
  };
});

function safeUrl(value, hostCheck, pathCheck = () => true) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      hostCheck(url.hostname) &&
      pathCheck(url.pathname)
      ? url.href
      : "";
  } catch {
    return "";
  }
}
const location = config.location;
const locationLabel = `${location.city}, ${location.country}`;
document.querySelectorAll("[data-location-label]").forEach((el) => {
  el.textContent = locationLabel;
});
document.querySelector("[data-city]").textContent =
  `${location.city.toLocaleUpperCase("es-CL")}.`;
const contactDetails = document.querySelector("#contact-details");
if (location.verified && location.address.trim()) {
  const block = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = "DIRECCIÓN";
  const value = document.createElement("p");
  value.textContent = location.address;
  block.append(title, value);
  contactDetails.append(block);
}
if (config.contact.verified) {
  const block = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = "HORARIOS Y CONTACTO";
  block.append(title);
  [...config.contact.hours, config.contact.phoneDisplay]
    .filter(Boolean)
    .forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      block.append(p);
    });
  if (block.children.length > 1) contactDetails.append(block);
}
const instagramUrl =
  config.instagram.verified &&
  safeUrl(config.instagram.url, (host) =>
    ["instagram.com", "www.instagram.com"].includes(host),
  );
if (instagramUrl) {
  const link = document.createElement("a");
  link.id = "social";
  link.className = "text-link";
  link.href = instagramUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = `${config.instagram.label} ↗`;
  contactDetails.append(link);
}
if (!contactDetails.children.length) {
  const note = document.createElement("p");
  note.className = "contact-note";
  note.textContent = "Dirección, horarios y contacto por confirmar.";
  contactDetails.append(note);
}
document.querySelector("#contact-info").onclick = () =>
  info(
    "Nos encontramos en Colina.",
    "La ubicación exacta, los horarios y los canales oficiales se incorporarán cuando el propietario los confirme. No hay una dirección ni una cuenta de contacto activas en esta demostración.",
    true,
  );
const isGoogle = (host) =>
  ["google.com", "www.google.com", "maps.google.com"].includes(host);
const embedUrl =
  location.verified &&
  location.address.trim() &&
  safeUrl(location.mapsEmbedUrl, isGoogle, (path) =>
    path.startsWith("/maps/embed"),
  );
const mapsUrl =
  location.verified &&
  location.address.trim() &&
  safeUrl(
    location.mapsUrl,
    (host) => isGoogle(host) || host === "maps.app.goo.gl",
    (path) =>
      path.startsWith("/maps") || location.mapsUrl.includes("maps.app.goo.gl/"),
  );
if (embedUrl) {
  const panel = document.querySelector("#location-panel");
  const button = document.createElement("button");
  button.className = "button map-load";
  button.textContent = "Cargar Google Maps";
  const explanation = document.createElement("small");
  explanation.className = "map-consent";
  explanation.textContent = "Al cargarlo, te conectarás con Google Maps.";
  const actions = document.createElement("div");
  actions.className = "map-actions";
  actions.append(button, explanation);
  panel.append(actions);
  button.onclick = () => {
    const frame = document.createElement("iframe");
    frame.title = `Ubicación de ALEXIS EL 40: ${location.address}`;
    frame.src = embedUrl;
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.allowFullscreen = true;
    panel.replaceChildren(frame);
  };
}
if (mapsUrl) {
  const link = document.createElement("a");
  link.className = "text-link";
  link.href = mapsUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Cómo llegar ↗";
  document.querySelector("#contact-info").replaceWith(link);
  document.querySelector("#location-description").textContent =
    "Tu próximo look tiene un punto de encuentro.";
}

document.querySelector("#credits").onclick = () =>
  info(
    "Una idea. Mucho carácter.",
    "Demostración no oficial realizada como propuesta comercial. Identidad tipográfica provisional. Todas las imágenes son escenas conceptuales generadas con IA; no muestran el local, clientes ni trabajos reales de ALEXIS EL 40. La carta de servicios y los datos comerciales deben confirmarse con el propietario.",
  );
document.querySelectorAll("dialog").forEach((d) => {
  d.querySelector(".close").onclick = () => d.close();
  d.addEventListener("click", (e) => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      d.close();
  });
});
document.querySelector(".close-action").onclick = () => dialog.close();

const lightbox = document.querySelector("#lightbox");
let current = 0;
function showPhoto(index) {
  current = (index + photos.length) % photos.length;
  lightbox.querySelector("img").src = photos[current].src;
  lightbox.querySelector("img").alt =
    `${photos[current].title} — imagen conceptual`;
  document.querySelector("#photo-caption").textContent =
    `${current + 1} / ${photos.length} — ${photos[current].title} · Conceptual`;
}
document.querySelectorAll("[data-photo]").forEach((button) => {
  button.onclick = () => {
    showPhoto(Number(button.dataset.photo));
    lightbox.showModal();
  };
});
document.querySelector("#prev").onclick = () => showPhoto(current - 1);
document.querySelector("#next").onclick = () => showPhoto(current + 1);
lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    showPhoto(current + (e.key === "ArrowRight" ? 1 : -1));
  }
});
let touchStart = null;
lightbox.querySelector("img").addEventListener(
  "touchstart",
  (e) => {
    touchStart =
      e.touches.length === 1
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : null;
  },
  { passive: true },
);
lightbox.querySelector("img").addEventListener(
  "touchend",
  (e) => {
    if (!touchStart || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5)
      showPhoto(current + (dx < 0 ? 1 : -1));
    touchStart = null;
  },
  { passive: true },
);

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.08 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
document.querySelector("#year").textContent = new Date().getFullYear();
// Consistent vector symbols rather than platform emoji or missing glyphs.
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const nodes = [];
while (walker.nextNode())
  if (/[↗✳]/.test(walker.currentNode.textContent))
    nodes.push(walker.currentNode);
nodes.forEach((node) => {
  const span = document.createElement("span");
  span.innerHTML = escapeHtml(node.textContent)
    .replaceAll("↗", arrowSvg)
    .replaceAll("✳", starSvg);
  node.replaceWith(...span.childNodes);
});
