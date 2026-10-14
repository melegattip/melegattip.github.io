// 404 bilingüe: Vercel sirve un único 404.html, así que va en los dos idiomas.
import { ICON, UI, esc, page } from "../lib.mjs";

export function notFound(cv) {
  return page({
    lang: "es",
    headHtml: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — ${esc(cv.name)}</title>
<meta name="robots" content="noindex">
<meta name="color-scheme" content="dark light">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/site.css">
<script src="/site.js"></script>`,
    body: `<main class="notfound">
  <p class="kicker">404</p>
  <h1>${esc(UI.es.notFoundTitle)}</h1>
  <p class="lead" lang="en">${esc(UI.en.notFoundTitle)}</p>
  <p class="actions">
    <a class="btn" href="/"><span>${esc(UI.es.backHome)}</span>${ICON.arrow}</a>
    <a class="tlink" href="/en" lang="en"><span>${esc(UI.en.backHome)}</span>${ICON.arrow}</a>
  </p>
</main>`,
  });
}
