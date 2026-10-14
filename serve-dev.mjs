// Servidor de desarrollo local (no se deploya). Sirve dist/ emulando a Vercel:
//   · cleanUrls → /en sirve en/index.html
//   · los headers salen de vercel.json, así un CSP que rompa algo se nota acá
//     y no recién en producción.
// Rebuildea solo cuando cambia content/, src/ o public/.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
const port = Number(process.env.PORT) || 8125;
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".json": "application/json",
};

function build() {
  try {
    execFileSync(process.execPath, [path.join(root, "build.mjs")], { stdio: "inherit" });
  } catch {
    console.error("build falló — se sigue sirviendo el dist/ anterior");
  }
}

build();
let timer;
for (const dir of ["content", "src", "public"]) {
  fs.watch(path.join(root, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(build, 150);
  });
}

const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));

function headersFor(pathname) {
  const out = {};
  for (const rule of vercelConfig.headers || []) {
    const re = new RegExp("^" + rule.source.replace(/\/\(\.\*\)/g, "(?:/.*)?") + "$");
    if (re.test(pathname)) for (const h of rule.headers) out[h.key] = h.value;
  }
  return out;
}

function resolve(pathname) {
  const rel = path.normalize(pathname).replace(/^([.][.][\\/])+/, "");
  const candidates = [path.join(dist, rel), path.join(dist, rel + ".html"), path.join(dist, rel, "index.html")];
  for (const f of candidates) {
    if (f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(req.url.split("?")[0]);
    const file = resolve(pathname);
    const target = file || path.join(dist, "404.html");
    res.writeHead(file ? 200 : 404, {
      "Content-Type":
        (types[path.extname(target)] || "application/octet-stream") +
        (/\.(png|jpg|woff2)$/.test(target) ? "" : "; charset=utf-8"),
      "Cache-Control": "no-store",
      ...headersFor(pathname),
    });
    res.end(fs.readFileSync(target));
  })
  .listen(port, () => console.log(`pablomelegatti.com en http://localhost:${port}`));
