// Cómo se dibuja cada tecnología en los chips: con su logo (src/logos.mjs) o, si no tiene
// marca o no está en simple-icons, con un icono propio (ICON en src/lib.mjs) en un tono
// del sitio. La clave es el nombre tal como aparece en content/ (en inglés si es { es, en }).
// Lo que no esté acá sale con un punto de color.
import { ICON } from "./lib.mjs";
import { LOGOS } from "./logos.mjs";

// Logos de marca. `fill` pisa el color oficial cuando sobre el fondo oscuro no se vería
// (negros o muy oscuros); `ink` usa el color del texto, para los que son negros por diseño.
const BRAND = {
  Go: { logo: "go" },
  Java: { logo: "openjdk", fill: "#ED8B00" },
  ".NET Framework": { logo: "dotnet", fill: "#8A6CFF" },
  "Spring Boot": { logo: "springboot" },
  React: { logo: "react" },
  PostgreSQL: { logo: "postgresql", fill: "#5B8DEF" },
  Git: { logo: "git" },
  Docker: { logo: "docker" },
  Datadog: { logo: "datadog", fill: "#A57BEB" },
  Kibana: { logo: "kibana", fill: "#F04E98" },
  "New Relic": { logo: "newrelic" },
  TypeScript: { logo: "typescript" },
  Python: { logo: "python", fill: "#5A9FD4" },
  "Next.js": { logo: "nextdotjs", ink: true },
  "Tailwind CSS": { logo: "tailwindcss" },
  FastAPI: { logo: "fastapi" },
  Gin: { logo: "gin" },
};

// Conceptos y marcas sin logo disponible (o cuyo logo es texto, ilegible a 16px): icono
// propio + tono.
const GENERIC = {
  MySQL: ["database", "teal"],
  Scrum: ["cycle", "violet"],
  "C#": ["hash", "violet"],
  SQL: ["database", "sky"],
  "SQL Server": ["database", "rose"],
  "Key-value stores": ["key", "amber"],
  NHibernate: ["boxes", "rose"],
  "REST APIs": ["braces", "sky"],
  "Microservices architecture": ["boxes", "violet"],
  Microservices: ["boxes", "violet"],
  "Distributed systems": ["network", "teal"],
  Backend: ["server", "sky"],
  "Web services": ["globe", "sky"],
  Unit: ["check", "teal"],
  Integration: ["link", "sky"],
  Functional: ["play", "violet"],
  Testing: ["check", "teal"],
  "CI/CD": ["cycle", "rose"],
  Observability: ["activity", "teal"],
  Kanban: ["columns", "sky"],
  "Spec-Driven Development": ["file", "amber"],
  SDD: ["file", "amber"],
  "AI-assisted development workflows": ["sparkles", "violet"],
  "AI workflows": ["sparkles", "violet"],
  AI: ["sparkles", "violet"],
  "Automation pipelines": ["workflow", "teal"],
  Automation: ["workflow", "teal"],
  "Feature ownership": ["flag", "amber"],
  DDMRP: ["chart", "amber"],
  sqlc: ["database", "sky"],
  Chi: ["network", "teal"],
  GORM: ["boxes", "sky"],
  Teamwork: ["users", "sky"],
  Leadership: ["flag", "amber"],
  "Creative problem-solving": ["bulb", "amber"],
  Research: ["search", "teal"],
  Proactivity: ["zap", "rose"],
};

// Juego de chips para una página. Los logos se definen una sola vez por página, en un
// sprite (`sprite()`), y cada chip los referencia con <use>: así un logo repetido no
// repite su dibujo en el HTML.
export function techKit(t, esc) {
  const used = new Set();

  function icon(key) {
    const brand = BRAND[key];
    if (brand) {
      used.add(brand.logo);
      const cls = "tech-logo" + (brand.ink ? " tech-ink" : "");
      const fill = brand.ink ? "currentColor" : brand.fill || LOGOS[brand.logo].hex;
      return `<svg class="${cls}" viewBox="0 0 24 24" width="16" height="16" fill="${fill}" aria-hidden="true"><use href="#logo-${brand.logo}"/></svg>`;
    }
    const generic = GENERIC[key];
    if (generic) return `<span class="tech-icon" data-tone="${generic[1]}">${ICON[generic[0]]}</span>`;
    return `<span class="tech-dot" aria-hidden="true"></span>`;
  }

  // items: strings o { es, en }. La clave para buscar el icono es el texto en inglés.
  function chips(items, cls = "tech") {
    return `<ul class="${cls}">${items
      .map((item) => {
        const key = item && typeof item === "object" ? item.en : item;
        return `<li>${icon(key)}<span>${esc(t(item))}</span></li>`;
      })
      .join("")}</ul>`;
  }

  function sprite() {
    if (!used.size) return "";
    const symbols = [...used]
      .map((slug) => `<symbol id="logo-${slug}" viewBox="0 0 24 24"><path d="${LOGOS[slug].d}"/></symbol>`)
      .join("");
    return `<svg class="sprite" aria-hidden="true" focusable="false">${symbols}</svg>`;
  }

  return { chips, sprite };
}
