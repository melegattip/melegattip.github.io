// Portfolio. Hero centrado sobre un cardumen animado (src/fish.js) y, debajo, secciones en
// dos columnas: a la izquierda icono + título, a la derecha el contenido en tarjetas que,
// en las secciones con `rail`, se deslizan en horizontal.
import { ICON, esc, forLang, head, host, href, nav, otherLang, page } from "../lib.mjs";
import { techKit } from "../tech.mjs";

// Un color distinto para cada principio de "cómo trabajo".
const HOW_TONES = ["amber", "violet", "teal", "sky"];

// Icono y color de cada sección. Los tonos son los [data-tone] de site.css.
const SECTIONS = {
  about: { icon: "user", tone: "amber" },
  experience: { icon: "briefcase", tone: "sky" },
  projects: { icon: "layers", tone: "violet" },
  stack: { icon: "code", tone: "teal" },
  education: { icon: "cap", tone: "rose" },
  contact: { icon: "mail", tone: "amber" },
};

export function home(lang, cv) {
  const { ui, t, e, range, bullets } = forLang(lang);
  const kit = techKit(t, esc);
  const path = href(lang, "home");
  const altPath = href(otherLang(lang), "home");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: cv.name,
    url: cv.site,
    image: cv.site + cv.photo,
    jobTitle: cv.role,
    description: t(cv.meta.description),
    worksFor: { "@type": "Organization", name: cv.experience[0].company },
    alumniOf: cv.education.map((ed) => ({ "@type": "CollegeOrUniversity", name: ed.place })),
    knowsLanguage: cv.languages.map((l) => t(l.name)),
    sameAs: [cv.contact.linkedin, cv.contact.github],
  };

  // `rail` = el contenido de la sección se desliza en horizontal; suma las flechas.
  const section = (id, title, sub, body, rail = false) => `<section id="${id}" class="sec" data-tone="${SECTIONS[id].tone}" aria-labelledby="h-${id}">
  <div class="wrap sec-in">
    <header class="sec-head">
      <span class="sec-icon">${ICON[SECTIONS[id].icon]}</span>
      <h2 id="h-${id}">${esc(title)}</h2>
      <p>${esc(sub)}</p>${
        rail
          ? `
      <p class="rail-nav" data-rail-nav hidden>
        <button class="rail-btn" type="button" data-rail-prev aria-label="${esc(ui.prev)}">${ICON.back}</button>
        <button class="rail-btn" type="button" data-rail-next aria-label="${esc(ui.next)}">${ICON.arrow}</button>
      </p>`
          : ""
      }
    </header>
    <div class="sec-body">
${body}
    </div>
  </div>
</section>`;

  const when = (html) => `<p class="when">${ICON.calendar}<span>${html}</span></p>`;
  // Envuelve un carrusel para que site.js pueda fijarlo en pantalla; la barra marca el avance.
  const pin = (railHtml) => `      <div class="rail-pin" data-rail-pin>
${railHtml}
        <p class="rail-bar" aria-hidden="true"><span></span></p>
      </div>`;
  // Chips de tecnologías, cada una con su logo o icono (src/tech.mjs).
  const chips = (items) => kit.chips(items);

  const hero = `<section class="hero">
  <canvas class="fx" data-fx aria-hidden="true"></canvas>
  <div class="wrap hero-in">
    <img class="portrait" src="${cv.photo}" width="240" height="240" alt="${esc(ui.photoAlt)}" data-fx-core>
    <h1>${esc(cv.name)}</h1>
    <p class="lead">${e(cv.hero.headline)}</p>
    <dl class="facts">
${cv.hero.facts.map((f) => `      <div><dt>${e(f.label)}</dt><dd>${e(f.value)}</dd></div>`).join("\n")}
    </dl>
    <p class="hero-links">
      <a class="btn" href="${href(lang, "cv")}"><span>${esc(ui.viewCv)}</span>${ICON.arrow}</a>
      <a class="tlink" href="mailto:${cv.contact.email}">${cv.contact.email}</a>
    </p>
  </div>
</section>`;

  const about = section(
    "about",
    ui.aboutTitle,
    ui.aboutSub,
    `${cv.about.map((p, i) => `      <p${i === 0 ? ' class="lead"' : ""}>${e(p)}</p>`).join("\n")}
      <h3 class="kicker">${esc(ui.howIWork)}</h3>
      <ul class="principles">
${cv.howIWork.map((h, i) => `        <li class="card" data-tone="${HOW_TONES[i % HOW_TONES.length]}"><span class="mini-icon">${ICON[h.icon]}</span><h4>${e(h.title)}</h4><p>${e(h.text)}</p></li>`).join("\n")}
      </ul>
      <h3 class="kicker">${esc(ui.languages)}</h3>
      <ul class="langs">
${cv.languages.map((l) => `        <li class="card">${ICON.globe}<strong>${e(l.name)}</strong><span>${e(l.level)}</span></li>`).join("\n")}
      </ul>${
        cv.offTopic && cv.offTopic.length
          ? `
      <h3 class="kicker">${esc(ui.offTopic)}</h3>
      <ul class="offtopic">
${cv.offTopic.map((o) => `        <li class="card" data-tone="${o.tone}"><span class="mini-icon">${ICON[o.icon]}</span><span>${e(o.text)}</span></li>`).join("\n")}
      </ul>`
          : ""
      }`,
  );

  // Una tarjeta por empresa. Si hubo más de un puesto, van adentro uno al lado del otro,
  // unidos por una línea de tiempo, y el encabezado muestra el recorrido: Puesto A → Puesto B.
  const company = (job) => {
    const roles = job.roles; // en cv.mjs ya vienen del más nuevo al más viejo
    const first = roles[roles.length - 1];
    const open = roles.find((r) => !r.to);
    const span = range(first.from, open ? null : roles[0].to);
    const many = roles.length > 1;
    return `        <li class="card entry${many ? " entry-wide" : ""}">
          <header class="entry-head">
            <div>
              <h3>${esc(job.company)}${job.note ? ` <span class="note">${e(job.note)}</span>` : ""}</h3>
              ${
                many
                  ? `<p class="path">${[...roles].reverse().map((r) => `<span>${esc(r.title)}</span>`).join(ICON.arrow)}</p>`
                  : `<p class="org">${esc(roles[0].title)}</p>`
              }
            </div>
            ${when(span)}
          </header>
          <ol class="roles${many ? "" : " roles-solo"}">
${[...roles]
  .reverse() // del más viejo al más nuevo: el crecimiento se lee de izquierda a derecha
  .map(
    (r) => `            <li class="role">${
      many
        ? `
              <div class="role-head"><h4>${esc(r.title)}</h4><p class="role-when">${range(r.from, r.to)}</p></div>`
        : ""
    }
              ${bullets(r.bullets)}
              ${chips(r.stack)}
            </li>`,
  )
  .join("\n")}
          </ol>
        </li>`;
  };

  const experience = section(
    "experience",
    ui.experienceTitle,
    ui.experienceSub,
    pin(`      <ol class="entries rail" data-rail tabindex="0">
${cv.experience.map(company).join("\n")}
      </ol>`),
    true,
  );

  const projects = section(
    "projects",
    ui.projectsTitle,
    ui.projectsSub,
    pin(`      <div class="entries rail" data-rail tabindex="0">
${cv.projects
  .map(
    (p) => `        <article class="card work">
          <header class="work-top">
            <p class="kicker">${e(p.kind)}</p>
            <p class="status"><span class="dot" aria-hidden="true"></span>${e(p.status)}</p>
          </header>
          <h3>${e(p.name)}</h3>
          <p class="work-role">${e(p.role)}</p>
          <p class="work-summary">${e(p.summary)}</p>
          ${chips(p.tags)}${
            p.story || p.url
              ? `
          <p class="work-links">${
            p.story ? `<a class="more" href="${href(lang, "project", p.story)}"><span>${esc(ui.readStory)}</span>${ICON.arrow}</a>` : ""
          }${p.url ? `<a class="tlink" href="${p.url}" rel="noopener"><span>${host(p.url)}</span>${ICON.external}</a>` : ""}</p>`
              : ""
          }
        </article>`,
  )
  .join("\n")}
      </div>`),
    true,
  );

  const stack = section(
    "stack",
    ui.stack,
    ui.stackSub,
    // Compacto, como pidió Pablo: categorías en dos columnas, sin tarjetas ni carrusel.
    `      <dl class="stack">
${cv.skills.map((g) => `        <div><dt>${e(g.label)}</dt><dd>${chips(g.items)}</dd></div>`).join("\n")}
      </dl>`,
  );

  const education = section(
    "education",
    ui.educationTitle,
    ui.educationSub,
    pin(`      <ol class="entries rail" data-rail tabindex="0">
${cv.education
  .map(
    (ed) => `        <li class="card entry">
          <header class="entry-head">
            <div>
              <h3>${e(ed.title)}</h3>
              <p class="org">${esc(ed.place)}</p>
            </div>
            ${when(range(ed.from, ed.to))}
          </header>
        </li>`,
  )
  .join("\n")}
      </ol>`) + `${
        cv.certifications.length
          ? `
      <h3 class="kicker">${esc(ui.certifications)}</h3>
      <ol class="entries rail" data-rail tabindex="0">
${cv.certifications
  .map((c) => {
    const title = c.url ? `<a href="${c.url}" rel="noopener">${e(c.title)}</a>` : e(c.title);
    return `        <li class="card entry">
          <header class="entry-head">
            <div>
              <h3>${title}</h3>
              <p class="org">${e(c.issuer)}</p>
            </div>
            ${when(esc(c.year))}
          </header>
        </li>`;
  })
  .join("\n")}
      </ol>`
          : ""
      }`,
  );

  // La variable de entorno gana sobre cv.mjs: permite probar el form sin tocar el contenido.
  const key = process.env.WEB3FORMS_KEY || cv.contact.web3formsKey;
  const form = key
    ? `
      <form class="card form" action="https://api.web3forms.com/submit" method="post" data-contact-form data-sending="${esc(ui.formSending)}" data-ok="${esc(ui.formOk)}" data-error="${esc(ui.formError)}">
        <h3>${esc(ui.formTitle)}</h3>
        <input type="hidden" name="access_key" value="${esc(key)}">
        <input type="hidden" name="from_name" value="pablomelegatti.com">
        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="field-row">
          <label class="field"><span>${esc(ui.formName)}</span><input type="text" name="name" autocomplete="name" required maxlength="100"></label>
          <label class="field"><span>${esc(ui.formEmail)}</span><input type="email" name="email" autocomplete="email" required maxlength="150"></label>
        </div>
        <label class="field"><span>${esc(ui.formSubject)}</span><input type="text" name="subject" required maxlength="150"></label>
        <label class="field"><span>${esc(ui.formMessage)}</span><textarea name="message" rows="5" required maxlength="4000"></textarea></label>
        <button class="btn" type="submit"><span>${esc(ui.formSend)}</span>${ICON.arrow}</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>`
    : "";

  const channel = (icon, label, value) => `        <li class="card">${ICON[icon]}<div><span class="k">${esc(label)}</span>${value}</div></li>`;

  const contact = section(
    "contact",
    ui.contactTitle,
    ui.contactSub,
    `      <p class="lead">${esc(ui.contactLead)}</p>
      <p><a class="bigmail" href="mailto:${cv.contact.email}">${cv.contact.email}</a></p>
      <ul class="channels">
${channel("linkedin", "LinkedIn", `<a href="${cv.contact.linkedin}" rel="me noopener">${host(cv.contact.linkedin)}</a>`)}
${channel("github", "GitHub", `<a href="${cv.contact.github}" rel="me noopener">${host(cv.contact.github)}</a>`)}
      </ul>${form}`,
  );

  const headHtml =
    head({
      lang,
      cv,
      title: t(cv.meta.title),
      description: t(cv.meta.description),
      path,
      altPath,
      styles: ["site.css"],
      ogType: "profile",
    }) + `\n<script src="/fish.js" defer></script>\n<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`;

  return page({
    lang,
    headHtml,
    body: `${kit.sprite()}<a class="skip" href="#main">${esc(ui.skip)}</a>
${nav({ lang, cv, altPath, onHome: true })}
<main id="main">
${hero}
${about}
${experience}
${projects}
${stack}
${education}
${contact}
</main>`,
  });
}
