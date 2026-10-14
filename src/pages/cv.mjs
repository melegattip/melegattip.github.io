// CV clásico: una "hoja" A4 que en pantalla se ve igual que impresa.
// El botón Descargar PDF llama a window.print(); cv.css define el @page.
import { ICON, esc, forLang, head, host, href, otherLang, page } from "../lib.mjs";

export function cvPage(lang, cv) {
  const { ui, t, e, range, tags, bullets } = forLang(lang);
  const other = otherLang(lang);
  const path = href(lang, "cv");
  const altPath = href(other, "cv");

  const block = (title, body) => `    <section class="cv-section">
      <h2>${esc(title)}</h2>
${body}
    </section>`;

  const header = `    <header class="cv-head">
      <div class="cv-id">
        <img class="cv-photo" src="${cv.photo}" width="120" height="120" alt="${esc(ui.photoAlt)}">
        <div>
          <h1>${esc(cv.name)}</h1>
          <p class="cv-role">${esc(cv.role)}</p>
          <p class="cv-focus">${e(cv.focus)}</p>
        </div>
      </div>
      <ul class="cv-contact">
        <li><span class="k">Email</span><a href="mailto:${cv.contact.email}">${cv.contact.email}</a></li>
        <li><span class="k">LinkedIn</span><a href="${cv.contact.linkedin}">${host(cv.contact.linkedin)}</a></li>
        <li><span class="k">GitHub</span><a href="${cv.contact.github}">${host(cv.contact.github)}</a></li>
        <li><span class="k">Web</span><a href="${cv.site}">${host(cv.site)}</a></li>
      </ul>
    </header>`;

  const profile = block(ui.cvProfile, cv.about.map((p) => `      <p>${e(p)}</p>`).join("\n"));

  const experience = block(
    ui.cvExperience,
    cv.experience
      .map(
        (job) => `      <article class="cv-job">
        <h3>${esc(job.company)}${job.note ? ` <span class="note">${e(job.note)}</span>` : ""}</h3>
        <div class="cv-roles">
${job.roles
  .map(
    (r) => `          <div class="cv-role-block">
            <div class="cv-row"><h4>${esc(r.title)}</h4><p class="dates">${range(r.from, r.to)}</p></div>
            ${bullets(r.bullets)}
          </div>`,
  )
  .join("\n")}
        </div>
      </article>`,
      )
      .join("\n"),
  );

  const projects = block(
    ui.cvProjects,
    cv.projects
      .map(
        (p) => `      <article class="cv-project">
        <p class="kind">${e(p.kind)} · ${e(p.role)}</p>
        <div class="cv-row"><h3>${e(p.name)}</h3>${p.url ? `<a class="plink" href="${p.url}">${host(p.url)}</a>` : ""}</div>
        <p>${e(p.summary)}</p>
        ${bullets(p.bullets)}
        ${tags(p.tags)}
      </article>`,
      )
      .join("\n"),
  );

  const skills = block(
    ui.cvSkills,
    `      <dl class="cv-skills">
${cv.skills.map((g) => `        <div><dt>${e(g.label)}</dt><dd>${tags(g.items)}</dd></div>`).join("\n")}
      </dl>`,
  );

  const education = block(
    ui.cvEducation,
    `${cv.education
      .map(
        (ed) => `      <div class="cv-edu">
        <div class="cv-row"><h3>${e(ed.title)}</h3><p class="dates">${range(ed.from, ed.to)}</p></div>
        <p class="place">${esc(ed.place)}</p>
      </div>`,
      )
      .join("\n")}${
      cv.certifications.length
        ? `
      <h3 class="sub">${esc(ui.certifications)}</h3>
      <ul class="cv-langs">
${cv.certifications.map((c) => `        <li><strong>${e(c.title)}</strong> — ${e(c.issuer)}, ${esc(c.year)}</li>`).join("\n")}
      </ul>`
        : ""
    }
      <h3 class="sub">${esc(ui.languages)}</h3>
      <ul class="cv-langs">
${cv.languages.map((l) => `        <li><strong>${e(l.name)}</strong> — ${e(l.level)}</li>`).join("\n")}
      </ul>`,
  );

  const body = `<div class="cv-bar">
  <a class="cv-btn" href="${href(lang, "home")}">${ICON.back}<span>${esc(ui.backHome)}</span></a>
  <span class="cv-bar-title">${esc(ui.cvTitle)}</span>
  <span class="cv-bar-tools">
    <a class="cv-btn" href="${altPath}" hreflang="${other}" lang="${other}">${esc(ui.otherLangLabel)}</a>
    <button class="cv-btn cv-btn-primary" type="button" data-print>${ICON.download}<span>${esc(ui.downloadPdf)}</span></button>
  </span>
</div>
<main class="sheet">
${header}
${profile}
${experience}
${projects}
${skills}
${education}
</main>`;

  return page({
    lang,
    cls: "cv-doc",
    headHtml: head({
      lang,
      cv,
      title: `${ui.cvTitle} — ${cv.name}`,
      description: t(cv.meta.description),
      path,
      altPath,
      styles: ["cv.css"],
      ogType: "profile",
    }),
    body,
  });
}
