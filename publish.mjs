// Publica el sitio en GitHub Pages: arma dist/ y lo sube, como único commit, a la rama
// gh-pages del remoto origin (Pages sirve esa rama). main guarda el código; gh-pages, el
// sitio armado. Uso: node publish.mjs   (--dirty para publicar con cambios sin commitear)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const git = (args, cwd = root) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();

if (git(["status", "--porcelain"]) && !process.argv.includes("--dirty")) {
  console.error("Hay cambios sin commitear: el sitio no coincidiría con main. Commitealos o usá --dirty.");
  process.exit(1);
}

execFileSync(process.execPath, ["build.mjs"], { cwd: root, stdio: "inherit" });

const remote = git(["remote", "get-url", "origin"]);
const sha = git(["rev-parse", "--short", "HEAD"]);
const out = fs.mkdtempSync(path.join(os.tmpdir(), "gh-pages-"));
fs.cpSync(path.join(root, "dist"), out, { recursive: true });
// Sin esto Pages pasa el sitio por Jekyll, que es lento y descarta archivos con "_".
fs.writeFileSync(path.join(out, ".nojekyll"), "");

git(["init", "-q", "-b", "gh-pages"], out);
git(["add", "-A"], out);
git(["commit", "-q", "-m", `Publicar build de ${sha}`], out);
git(["push", "-q", "-f", remote, "gh-pages"], out);
fs.rmSync(out, { recursive: true, force: true });

console.log(`Publicado ${sha} en gh-pages. GitHub Pages tarda un minuto en actualizar.`);
