// Página de un proyecto: encabezado, datos, cifras y la historia
// (content/projects/<slug>.mjs) con la misma grilla de dos columnas que la home.
import { ICON, esc, forLang, head, host, href, nav, otherLang, page } from "../lib.mjs";
import { techKit } from "../tech.mjs";

// Icono y color de las secciones de la historia, por orden. La de stack va aparte.
const STORY = [
  { icon: "target", tone: "rose" },
  { icon: "compass", tone: "sky" },
  { icon: "bulb", tone: "teal" },
];

export function project(lang, cv, p, story) {
  const { ui, t, e } = forLang(lang);
  const kit = techKit(t, esc);
  const path = href(lang, "project", story.slug);
  const altPath = href(otherLang(lang), "project", story.slug);
  const home = href(lang, "home");

  // El otro proyecto con historia, para no dejar la página sin salida.
  const next = cv.projects.find((x) => x.story && x.story !== story.slug);

  const section = (title, look, body) => `<section class="sec" data-tone="${look.tone}">
  <div class="wrap sec-in">
    <header class="sec-head">
      <span class="sec-icon">${ICON[look.icon]}</span>
      <h2>${esc(title)}</h2>
    </header>
    <div class="sec-body">
${body}
    </div>
  </div>
</section>`;

  const sections = story.sections
    .map((s, i) =>
      section(
        t(s.title),
        STORY[i % STORY.length],
        `${(s.body || []).map((b, j) => `      <p${j === 0 ? ' class="lead"' : ""}>${e(b)}</p>`).join("\n")}${
          s.points
            ? `
      <ul class="points">
${s.points.map((pt) => `        <li class="card"><h3>${e(pt.title)}</h3><p>${e(pt.body)}</p></li>`).join("\n")}
      </ul>`
            : ""
        }`,
      ),
    )
    .join("\n");

  // Antes del sprite: los chips son los que anotan qué logos hacen falta.
  const stack = section(ui.stack, { icon: "code", tone: "violet" }, `      ${kit.chips(story.stack)}`);

  const body = `${kit.sprite()}<a class="skip" href="#main">${esc(ui.skip)}</a>
${nav({ lang, cv, altPath, onHome: false })}
<main id="main" class="article" data-tone="violet">
  <header class="wrap art-head">
    <p class="crumb"><a href="${home}#projects">${ICON.back}<span>${esc(ui.backProjects)}</span></a></p>
    <p class="kicker">${e(p.kind)}</p>
    <h1>${e(p.name)}</h1>
    <p class="lead">${e(p.summary)}</p>
    <dl class="card art-facts">
      <div><dt>${esc(ui.role)}</dt><dd>${e(p.role)}</dd></div>
      <div><dt>${esc(ui.status)}</dt><dd class="status"><span class="dot" aria-hidden="true"></span>${e(p.status)}</dd></div>${
        p.url
          ? `
      <div><dt>${esc(ui.site)}</dt><dd><a class="tlink" href="${p.url}" rel="noopener"><span>${host(p.url)}</span>${ICON.external}</a></dd></div>`
          : ""
      }
    </dl>
    <ul class="figures">
${story.stats.map((s) => `      <li class="card"><strong>${esc(s.value)}</strong><span>${e(s.label)}</span></li>`).join("\n")}
    </ul>
  </header>
${sections}
${stack}
  <nav class="wrap art-next">
    ${
      next
        ? `<a class="card" href="${href(lang, "project", next.story)}"><span class="kicker">${esc(ui.otherProject)}</span><strong>${e(next.name)}</strong>${ICON.arrow}</a>`
        : ""
    }
    <a class="card" href="${home}#contact"><span class="kicker">${esc(ui.nav.contact)}</span><strong>${esc(ui.talk)}</strong>${ICON.arrow}</a>
  </nav>
</main>`;

  return page({
    lang,
    headHtml: head({
      lang,
      cv,
      title: `${t(p.name)} — ${t(p.kind)} | ${cv.name}`,
      description: t(p.summary),
      path,
      altPath,
      styles: ["site.css"],
      ogType: "article",
    }),
    body,
  });
}
