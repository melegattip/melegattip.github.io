// Genera dist/ a partir de content/. Sin dependencias: `node build.mjs`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import cv from "./content/cv.mjs";
import { LANGS, href } from "./src/lib.mjs";
import { home } from "./src/pages/home.mjs";
import { cvPage } from "./src/pages/cv.mjs";
import { project } from "./src/pages/project.mjs";
import { notFound } from "./src/pages/notfound.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
const write = (rel, content) => {
  const file = path.join(dist, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

// Las historias viven en content/projects/<story>.mjs; un proyecto sin `story` no tiene página.
const stories = {};
for (const p of cv.projects.filter((x) => x.story)) {
  const file = path.join(root, "content", "projects", p.story + ".mjs");
  stories[p.story] = (await import(pathToFileURL(file).href)).default;
}

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, "public"), dist, { recursive: true });
for (const f of fs.readdirSync(path.join(root, "src")).filter((x) => x.endsWith(".js"))) {
  fs.copyFileSync(path.join(root, "src", f), path.join(dist, f));
}
for (const f of fs.readdirSync(path.join(root, "src", "styles"))) {
  fs.copyFileSync(path.join(root, "src", "styles", f), path.join(dist, f));
}

const urls = [];
const emit = (route, html) => {
  write(path.join(route.replace(/^\//, ""), "index.html"), html);
  urls.push(cv.site + route);
};

for (const lang of Object.keys(LANGS)) {
  emit(href(lang, "home"), home(lang, cv));
  emit(href(lang, "cv"), cvPage(lang, cv));
  for (const p of cv.projects.filter((x) => x.story)) {
    emit(href(lang, "project", p.story), project(lang, cv, p, stories[p.story]));
  }
}
write("404.html", notFound(cv));

write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${cv.updated}-01</lastmod></url>`).join("\n")}
</urlset>
`,
);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${cv.site}/sitemap.xml\n`);

console.log(`dist/ listo: ${urls.length} páginas`);
