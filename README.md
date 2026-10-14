# pablomelegatti.com

Portfolio y CV de Pablo Melegatti. Sitio estático bilingüe, sin framework y sin
dependencias: sólo Node ≥ 20.

## Páginas

| Español | Inglés | Qué es |
|---|---|---|
| `/` | `/en` | Portfolio: hero animado + Perfil, Experiencia, Proyectos, Stack, Educación y Contacto |
| `/cv` | `/en/cv` | CV clásico en una hoja A4, con botón Descargar PDF |
| `/proyectos/<slug>` | `/en/projects/<slug>` | Historia de un proyecto |

## Editar el contenido

Todo el texto vive en **`content/`**. Cada campo traducible es `{ es, en }`.

- `content/cv.mjs` — datos personales, hero, experiencia, proyectos, skills, educación.
- `content/projects/<slug>.mjs` — la historia larga de un proyecto. Un proyecto la muestra
  si en `cv.mjs` tiene `story: "<slug>"`; sin `story` sale sólo como tarjeta.

Al terminar, actualizá `updated` en `cv.mjs` (se muestra en el pie).

```bash
node serve-dev.mjs
```

Levanta `http://localhost:8125` y rebuildea solo al guardar. Emula a Vercel (URLs limpias y
los headers de `vercel.json`), así un CSP que rompa algo se ve en local.

```bash
node build.mjs
```

Genera `dist/` (lo que se publica). No se commitea.

## Estructura

| Archivo | Qué es |
|---|---|
| `content/` | Única fuente de verdad del contenido |
| `src/lib.mjs` | Lo compartido: idiomas y rutas, textos de interfaz, iconos, `<head>`, nav |
| `src/tech.mjs` | Cómo se dibuja cada tecnología en los chips: logo de marca o icono propio con color. Una tecnología nueva sin entrada acá sale con un punto de color |
| `src/logos.mjs` | Logos de [simple-icons](https://simpleicons.org) (CC0), sólo los que se usan. Los que en simple-icons son texto (MySQL, Scrum) van con icono propio porque a 16px no se leen |
| `src/pages/` | Una función por tipo de página: `home`, `cv`, `project`, `notfound` |
| `src/styles/site.css` | Diseño del portfolio: títulos en serif; cada sección tiene icono, color propio (`data-tone`) y tarjetas que se deslizan en horizontal. Oscuro por defecto, claro con el toggle |
| `src/styles/cv.css` | La hoja del CV y su `@media print` |
| `src/site.js` | Tema, menú mobile, cambio de idioma, índice activo, carruseles (flechas y scroll lateral automático) y envío del formulario |
| `src/fish.js` | Los peces (canvas): el cardumen del hero, que rodea la foto y huye del cursor, y unos pocos que acompañan al scrollear. Sólo se carga en la home |
| `public/` | Se copia tal cual a la raíz: foto, fuentes, favicon, `og.png` |
| `vercel.json` | Build, URLs limpias, redirects y headers de seguridad |

## Scroll lateral

En Experiencia, Proyectos y Stack las tarjetas van en fila. Al bajar, el carrusel queda fijo,
centrado en la pantalla, y las tarjetas pasan de costado; una barra marca el avance. Cuando
se terminan hay una pausa corta y la página sigue bajando.

Si el carrusel no entra entero en la ventana (pantallas bajas, o Experiencia en teléfonos) o
hay "movimiento reducido", queda como carrusel común: se desliza con el dedo o con las flechas.

El movimiento lo hace CSS (`animation-timeline`, atado al scroll) donde el navegador lo
soporta, y `site.js` donde no.

## Rendimiento

Cosas que ya hicieron tironear la página y no conviene reintroducir:

- **Un canvas a pantalla completa** redibujándose siempre. Los peces que acompañan son `<svg>`
  sueltos a los que sólo se les cambia el `transform`, y dejan de trabajar cuando llegan.
- **`backdrop-filter`** (desenfoque) sobre contenido que scrollea o se anima: se recalcula en
  cada cuadro. La barra superior usa un fondo casi opaco.
- **Máscaras CSS sobre un canvas animado.** El cardumen se desvanece hacia los bordes desde el
  propio dibujo.
- **Mover cosas en cada evento de scroll** con JavaScript: va desfasado del scroll real.

## Experiencia

En `cv.mjs` cada empresa tiene una lista `roles`, del más nuevo al más viejo. Si hay más de
uno, la tarjeta muestra el recorrido (Puesto A → Puesto B) y los puestos uno al lado del otro,
unidos por una línea de tiempo.

## Formulario de contacto

Usa [Web3Forms](https://web3forms.com). Pegá la access key en `contact.web3formsKey` de
`cv.mjs` (es pública por diseño). **Sin key el formulario no se muestra**: Contacto queda con el mail en grande y los canales.

Para probarlo sin tocar el contenido: `WEB3FORMS_KEY=xxx node build.mjs`.

## PDF del CV

No hay un PDF aparte que se desactualice: `/cv` es una hoja A4 que se ve igual en pantalla
que impresa, y **Descargar PDF** abre el diálogo de impresión ("Guardar como PDF"). Sale en
2 páginas, en el idioma de la página.

## Foto y tarjeta para compartir

- `public/img/pablo.jpg` — cuadrada, se muestra en círculo. La actual salió del PDF del CV y
  mide 240×240: conviene reemplazarla por una de 800 px o más.
- `public/og.png` — la tarjeta de 1200×630 que aparece al compartir el link. Lleva la foto y
  el nombre incrustados; si cambia alguno hay que regenerarla (es una captura de una página
  armada a mano, no forma parte del build).

## Reglas

- **No hay estilos ni scripts inline.** El CSP de `vercel.json` sólo permite `'self'`.
- **Sin nombres ni datos de clientes.** Los trabajos para terceros se describen de forma genérica.
- **Los dos idiomas se editan juntos.** Un campo sin su `en` sale vacío en la versión en inglés.

## Deploy

**Hoy: GitHub Pages**, en <https://melegattip.github.io>. `main` tiene el código y
`gh-pages`, el sitio armado. Para publicar, con los cambios ya commiteados:

```bash
node publish.mjs
```

Arma `dist/` y lo sube a `gh-pages`; Pages tarda un minuto en actualizar. Pages no lee
`vercel.json`: ahí no aplican los headers de seguridad (CSP) ni los redirects
(`/resume`, `/curriculum`, `/es`). Las URLs limpias sí andan, porque cada página es una
carpeta con su `index.html`.

**Destino: Vercel**, sin framework: build `node build.mjs`, salida `dist/` (ya está en
`vercel.json`). El dominio `pablomelegatti.com` se apunta al proyecto, con `www`
redirigiendo al apex.

Las fuentes de `public/fonts/` (Inter para el texto, Instrument Serif para los títulos) son
de uso libre bajo licencia OFL; cada licencia va al lado.
