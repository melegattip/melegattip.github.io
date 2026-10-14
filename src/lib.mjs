// Lo que comparten todas las páginas: idiomas y rutas, escape, fechas, iconos,
// <head> y nav. Nada inline: el CSP de vercel.json sólo permite 'self'.

export const LANGS = {
  es: { prefix: "", locale: "es_AR", cv: "cv", projects: "proyectos" },
  en: { prefix: "/en", locale: "en_US", cv: "cv", projects: "projects" },
};

export const otherLang = (lang) => (lang === "es" ? "en" : "es");

// Ruta pública de una página. page: "home" | "cv" | "project" (con slug).
export function href(lang, page, slug) {
  const L = LANGS[lang];
  if (page === "cv") return `${L.prefix}/${L.cv}`;
  if (page === "project") return `${L.prefix}/${L.projects}/${slug}`;
  return L.prefix || "/";
}

// Secciones que aparecen en la barra. La home tiene más (stack, educación) que no se listan.
export const NAV_IDS = ["about", "experience", "projects", "contact"];

export const UI = {
  es: {
    skip: "Saltar al contenido",
    sections: "Secciones",
    menu: "Menú",
    prev: "Anterior",
    next: "Siguiente",
    nav: { about: "Perfil", experience: "Experiencia", projects: "Proyectos", contact: "Contacto" },
    present: "hoy",
    months: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
    monthsLong: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    photoAlt: "Foto de Pablo Melegatti",
    otherLangLabel: "English",
    otherLangShort: "EN",
    theme: "Cambiar entre tema oscuro y claro",
    cv: "CV",
    viewCv: "Ver CV",
    aboutTitle: "Perfil",
    aboutSub: "Qué hago y cómo trabajo",
    howIWork: "Cómo trabajo",
    offTopic: "Fuera del código",
    languages: "Idiomas",
    experienceTitle: "Experiencia",
    experienceSub: "Dónde trabajé y en qué",
    projectsTitle: "Proyectos",
    projectsSub: "Productos propios y trabajo para clientes",
    readStory: "Leer el caso",
    visit: "Ver sitio",
    site: "Sitio",
    stack: "Stack",
    stackSub: "Las herramientas que uso",
    educationTitle: "Educación",
    educationSub: "Formación académica",
    certifications: "Cursos y certificaciones",
    contactTitle: "Hablemos",
    contactSub: "Propuestas, proyectos o una charla",
    contactLead: "Estoy abierto a nuevas oportunidades, proyectos y colaboraciones. Lo más directo es el mail o un MD de LinkedIn.",
    formTitle: "O dejame un mensaje acá",
    formName: "Tu nombre",
    formEmail: "Tu email",
    formSubject: "Asunto",
    formMessage: "Mensaje",
    formSend: "Enviar mensaje",
    formSending: "Enviando…",
    formOk: "¡Gracias! Recibí tu mensaje y te respondo a la brevedad.",
    formError: "No se pudo enviar. Probá de nuevo o escribime directo por mail.",
    backHome: "Volver al inicio",
    backProjects: "Proyectos",
    role: "Rol",
    status: "Estado",
    otherProject: "Otro proyecto",
    talk: "¿Charlamos?",
    cvTitle: "Currículum",
    downloadPdf: "Descargar PDF",
    cvProfile: "Perfil",
    cvExperience: "Experiencia",
    cvProjects: "Proyectos",
    cvSkills: "Skills",
    cvEducation: "Educación e idiomas",
    notFoundTitle: "Página no encontrada",
  },
  en: {
    skip: "Skip to content",
    sections: "Sections",
    menu: "Menu",
    prev: "Previous",
    next: "Next",
    nav: { about: "About", experience: "Experience", projects: "Projects", contact: "Contact" },
    present: "Present",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    monthsLong: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    photoAlt: "Photo of Pablo Melegatti",
    otherLangLabel: "Español",
    otherLangShort: "ES",
    theme: "Switch between dark and light theme",
    cv: "Resume",
    viewCv: "View resume",
    aboutTitle: "About",
    aboutSub: "What I do and how I work",
    howIWork: "How I work",
    offTopic: "Away from the keyboard",
    languages: "Languages",
    experienceTitle: "Experience",
    experienceSub: "Where I have worked, and on what",
    projectsTitle: "Projects",
    projectsSub: "My own products and client work",
    readStory: "Read the case study",
    visit: "Live site",
    site: "Site",
    stack: "Stack",
    stackSub: "The tools I use",
    educationTitle: "Education",
    educationSub: "Academic background",
    certifications: "Courses & certifications",
    contactTitle: "Let's talk",
    contactSub: "Roles, projects or just a chat",
    contactLead: "I'm open to new opportunities, projects and collaborations. Email or a LinkedIn DM is the most direct way.",
    formTitle: "Or leave me a message here",
    formName: "Your name",
    formEmail: "Your email",
    formSubject: "Subject",
    formMessage: "Message",
    formSend: "Send message",
    formSending: "Sending…",
    formOk: "Thanks! I got your message and will reply shortly.",
    formError: "It couldn't be sent. Please try again or email me directly.",
    backHome: "Back to home",
    backProjects: "Projects",
    role: "Role",
    status: "Status",
    otherProject: "Another project",
    talk: "Shall we talk?",
    cvTitle: "Resume",
    downloadPdf: "Download PDF",
    cvProfile: "Profile",
    cvExperience: "Experience",
    cvProjects: "Projects",
    cvSkills: "Skills",
    cvEducation: "Education & languages",
    notFoundTitle: "Page not found",
  },
};

export const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const host = (url) => new URL(url).host.replace(/^www\./, "") + new URL(url).pathname.replace(/\/$/, "");

// Helpers atados a un idioma: t() elige la traducción, e() además escapa.
export function forLang(lang) {
  const ui = UI[lang];
  const t = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] : v);
  const e = (v) => esc(t(v));
  const ym = (v) => {
    const [y, m] = v.split("-");
    return `<time datetime="${v}">${m ? `${ui.months[+m - 1]} ${y}` : y}</time>`;
  };
  const range = (from, to) => `${ym(from)} – ${to ? ym(to) : ui.present}`;
  const tags = (items, cls = "tags") => `<ul class="${cls}">${items.map((i) => `<li>${e(i)}</li>`).join("")}</ul>`;
  const bullets = (items) => `<ul class="bullets">${items.map((b) => `<li>${e(b)}</li>`).join("")}</ul>`;
  return { ui, t, e, ym, range, tags, bullets };
}

const svg = (body, extra = "") =>
  `<svg class="icon${extra ? " " + extra : ""}" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const svgFill = (body) =>
  `<svg class="icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">${body}</svg>`;

export const ICON = {
  // secciones
  user: svg(`<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>`),
  briefcase: svg(`<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>`),
  layers: svg(`<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>`),
  code: svg(`<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>`),
  cap: svg(`<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9v6"/>`),
  mail: svg(`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>`),
  // "cómo trabajo" (la clave `icon` de cada ítem en cv.mjs)
  flag: svg(`<path d="M5 21V4M5 4h12l-2.5 4 2.5 4H5"/>`),
  sparkles: svg(`<path d="m11 3 1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>`),
  check: svg(`<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>`),
  activity: svg(`<path d="M3 12h4l3-8 4 16 3-8h4"/>`),
  // historias de proyecto
  target: svg(`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>`),
  compass: svg(`<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>`),
  bulb: svg(`<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>`),
  // conceptos del stack (lo que no tiene logo de marca; ver src/tech.mjs)
  server: svg(`<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>`),
  braces: svg(`<path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1"/>`),
  boxes: svg(`<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>`),
  network: svg(`<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5 6.5 17M12 11.5l5.5 5.5"/>`),
  key: svg(`<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8.7-8.7M16 7l2.5 2.5M14 9l2 2"/>`),
  database: svg(`<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>`),
  hash: svg(`<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>`),
  cycle: svg(`<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M3 21v-5h5"/>`),
  columns: svg(`<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>`),
  file: svg(`<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>`),
  workflow: svg(`<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h5a3 3 0 0 1 3 3v6"/>`),
  users: svg(`<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>`),
  search: svg(`<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>`),
  zap: svg(`<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>`),
  play: svg(`<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5z"/>`),
  link: svg(`<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.5-1.5"/>`),
  chart: svg(`<path d="M3 21h18M7 17v-6M12 17V6M17 17v-4"/>`),
  // fuera del código
  music: svg(`<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>`),
  cross: svg(`<path d="M12 2v20M6 8h12"/>`),
  heart: svg(`<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>`),
  ball: svg(`<circle cx="12" cy="12" r="9"/><path d="m12 7 3.8 2.8-1.5 4.4H9.7L8.2 9.8z"/><path d="M12 3v4M20.6 9.2l-4.8.6M17.3 19.3l-3-5.1M6.7 19.3l3-5.1M3.4 9.2l4.8.6"/>`),
  dumbbell: svg(`<path d="M6 7v10M18 7v10M3 9.5v5M21 9.5v5M6 12h12"/>`),
  // sueltos
  calendar: svg(`<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>`),
  globe: svg(`<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>`),
  github: svgFill(`<path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3"/>`),
  linkedin: svgFill(`<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.04c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0"/>`),
  moon: svg(`<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>`, "icon-moon"),
  sun: svg(`<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`, "icon-sun"),
  download: svg(`<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>`),
  arrow: svg(`<path d="M5 12h14M13 6l6 6-6 6"/>`),
  back: svg(`<path d="M19 12H5M11 6l-6 6 6 6"/>`),
  external: svg(`<path d="M7 17 17 7M8 7h9v9"/>`),
  menu: svg(`<path d="M4 7h16M4 12h16M4 17h16"/>`),
};

// <head> común. `styles` = hojas a cargar; `altPath` = misma página en el otro idioma.
export function head({ lang, cv, title, description, path, altPath, styles, ogType = "website" }) {
  const other = otherLang(lang);
  const abs = (p) => cv.site + (p === "/" ? "/" : p);
  const alternates = { [lang]: path, [other]: altPath };
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(cv.name)}">
<meta name="color-scheme" content="dark light">
<link rel="canonical" href="${abs(path)}">
<link rel="alternate" hreflang="es" href="${abs(alternates.es)}">
<link rel="alternate" hreflang="en" href="${abs(alternates.en)}">
<link rel="alternate" hreflang="x-default" href="${abs(alternates.es)}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(cv.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:image" content="${cv.site + cv.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(cv.name)} — ${esc(cv.role)}">
<meta property="og:locale" content="${LANGS[lang].locale}">
<meta property="og:locale:alternate" content="${LANGS[other].locale}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
${styles.includes("site.css") ? '<link rel="preload" href="/fonts/instrument-serif-latin.woff2" as="font" type="font/woff2" crossorigin>\n' : ""}${styles.map((s) => `<link rel="stylesheet" href="/${s}">`).join("\n")}
<script src="/site.js"></script>`;
}

// Barra superior. `onHome` = los links son anclas de la misma página (y se marca la activa).
export function nav({ lang, cv, altPath, onHome }) {
  const { ui } = forLang(lang);
  const other = otherLang(lang);
  const home = href(lang, "home");
  const base = onHome ? "" : home;
  const links = NAV_IDS.map((id) => `<a href="${base}#${id}">${esc(ui.nav[id])}</a>`).join("");
  return `<header class="nav">
  <div class="wrap nav-in">
    <a class="wordmark" href="${home}">${esc(cv.name)}</a>
    <nav class="nav-links" aria-label="${esc(ui.sections)}"${onHome ? " data-spy" : ""}>${links}</nav>
    <div class="nav-tools">
      <a class="nav-cv" href="${href(lang, "cv")}">${esc(ui.cv)}</a>
      <a class="nav-lang" href="${altPath}" hreflang="${other}" lang="${other}" data-lang-switch title="${esc(ui.otherLangLabel)}">${esc(ui.otherLangShort)}</a>
      <button class="nav-icon" type="button" data-theme-toggle aria-label="${esc(ui.theme)}" title="${esc(ui.theme)}">${ICON.sun}${ICON.moon}</button>
      <details class="menu">
        <summary class="nav-icon" aria-label="${esc(ui.menu)}">${ICON.menu}</summary>
        <nav class="menu-panel" aria-label="${esc(ui.sections)}">${links}</nav>
      </details>
    </div>
  </div>
</header>`;
}

export const page = ({ lang, headHtml, body, cls = "" }) => `<!doctype html>
<html lang="${lang}"${cls ? ` class="${cls}"` : ""}>
<head>
${headHtml}
</head>
<body>
${body}
</body>
</html>
`;
