// Se carga bloqueante en el <head> para fijar el tema antes del primer paint
// (inline no se puede: el CSP sólo permite scripts de 'self').
// Todo es mejora progresiva: sin este archivo el sitio se lee igual.
(function () {
  var root = document.documentElement;
  var KEY = "theme";
  root.classList.add("js");

  // Oscuro es el default; sólo se guarda la elección explícita.
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === "light") root.setAttribute("data-theme", "light");

  window.addEventListener("load", function () {
    window.setTimeout(function () { root.classList.add("smooth"); }, 100);
  });

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        if (next === "light") root.setAttribute("data-theme", "light");
        else root.removeAttribute("data-theme");
        try { localStorage.setItem(KEY, next); } catch (e) {}
      });
    }

    var print = document.querySelector("[data-print]");
    if (print) print.addEventListener("click", function () { window.print(); });

    // Al cambiar de idioma, caer en la misma sección.
    var lang = document.querySelector("[data-lang-switch]");
    if (lang) {
      lang.addEventListener("click", function () {
        lang.href = lang.getAttribute("href").split("#")[0] + window.location.hash;
      });
    }

    // Menú mobile: es un <details>; se cierra al elegir, con Escape o al tocar afuera.
    var menu = document.querySelector(".menu");
    if (menu) {
      menu.addEventListener("click", function (ev) {
        if (ev.target.closest("a")) menu.removeAttribute("open");
      });
      document.addEventListener("click", function (ev) {
        if (menu.open && !menu.contains(ev.target)) menu.removeAttribute("open");
      });
      document.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape") menu.removeAttribute("open");
      });
    }

    spy();
    rails();
    contactForm();
  });

  // Carruseles. Sin esto las tarjetas igual se deslizan con scroll horizontal nativo.
  // Cuando el carrusel entra entero en la ventana se "fija": al bajar queda quieto, centrado,
  // y las tarjetas pasan de costado; cuando se terminan, espera un momento y la página sigue.
  // No se intercepta la rueda: el cuerpo de la sección se alarga (lo que hay para recorrer
  // de costado más la pausa) y el carrusel va con position: sticky.
  function rails() {
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Con animaciones atadas al scroll (CSS), el movimiento lateral lo hace el compositor,
    // en sincronía exacta con el scroll. Donde no existen, lo hace este archivo.
    var native = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline: view()"));
    var topbar = document.querySelector(".nav");
    var pins = [];
    var queued = 0;

    Array.prototype.forEach.call(document.querySelectorAll("[data-rail-pin]"), function (wrap) {
      var rail = wrap.querySelector("[data-rail]");
      var section = wrap.closest("section");
      var body = wrap.parentElement;
      if (!rail || !section) return;
      var pin = {
        section: section, body: body, wrap: wrap, rail: rail,
        head: section.querySelector(".sec-head"),
        inner: section.querySelector(".sec-in"),
        nav: section.querySelector("[data-rail-nav]"),
        on: false, top: 0, travel: 0,
      };
      pins.push(pin);
      if (!pin.nav) return;
      pin.prev = pin.nav.querySelector("[data-rail-prev]");
      pin.next = pin.nav.querySelector("[data-rail-next]");
      function go(dir) {
        var card = rail.firstElementChild;
        var stepBy = card ? Math.min(card.getBoundingClientRect().width + 16, rail.clientWidth * 0.9) : rail.clientWidth * 0.8;
        // Fijada, avanzar de costado es scrollear la página esa misma distancia.
        if (pin.on) window.scrollBy({ top: dir * stepBy, behavior: "smooth" });
        else rail.scrollBy({ left: dir * stepBy, behavior: "smooth" });
      }
      pin.prev.addEventListener("click", function () { go(-1); });
      pin.next.addEventListener("click", function () { go(1); });
      rail.addEventListener("scroll", function () {
        // Fijada, el carrusel no scrollea por dentro (lo mueve un transform). Si el
        // navegador lo corre igual, p. ej. al enfocar un link con Tab, se vuelve a cero.
        if (pin.on) { if (rail.scrollLeft) rail.scrollLeft = 0; }
        else arrows(pin, rail.scrollLeft, rail.scrollWidth - rail.clientWidth);
      }, { passive: true });
    });
    if (!pins.length) return;

    function arrows(p, at, max) {
      if (!p.nav) return;
      p.nav.hidden = max < 8;
      p.prev.disabled = at < 8;
      p.next.disabled = at > max - 8;
    }

    // Avance (0 a 1) de cada carrusel fijado según el scroll vertical. Con soporte nativo
    // sólo actualiza las flechas; sin él, también mueve las tarjetas y la barra.
    function follow() {
      queued = 0;
      pins.forEach(function (p) {
        if (!p.on) return;
        var done = Math.max(0, Math.min(1, (p.top - p.body.getBoundingClientRect().top) / p.travel));
        arrows(p, done * p.travel, p.travel);
        if (native) return;
        p.wrap.style.setProperty("--rail-x", (-done * p.travel).toFixed(1) + "px");
        p.wrap.style.setProperty("--rail-p", done.toFixed(4));
      });
    }
    function onScroll() {
      if (!queued) queued = window.requestAnimationFrame(follow);
    }

    function layout() {
      var bar = topbar ? topbar.offsetHeight : 0;
      var vh = window.innerHeight;
      pins.forEach(function (p) {
        p.on = false;
        p.section.classList.remove("is-pinned", "is-native");
        p.body.style.height = "";
        p.body.style.marginBottom = "";
        if (p.inner) p.inner.style.marginBottom = "";
        p.wrap.style.top = "";
        p.wrap.style.removeProperty("--rail-x");
        p.wrap.style.removeProperty("--rail-p");
        if (p.head) p.head.style.top = "";
        p.rail.scrollLeft = 0;

        var travel = p.rail.scrollWidth - p.rail.clientWidth;
        if (calm.matches || travel <= 40) {
          arrows(p, 0, travel);
          return;
        }
        // Se mide ya con la clase puesta: fijado, el carrusel suma la barra de avance y
        // pierde el lugar del scrollbar, así que su alto cambia.
        p.section.classList.add("is-pinned");
        var tall = p.wrap.offsetHeight;
        // Sólo se fija si el carrusel entra entero en la ventana; si no entra, quedaría
        // cortado mientras está fijo: mejor el carrusel común.
        if (tall > vh - bar - 16) {
          p.section.classList.remove("is-pinned");
          arrows(p, 0, travel);
          return;
        }
        // Se fija centrado en el espacio que queda debajo de la barra superior…
        var top = Math.round(bar + (vh - bar - tall) / 2);
        // …y, cuando terminan las tarjetas, se queda un momento más antes de soltar:
        // esa pausa avisa que lo que sigue es la próxima sección.
        var dwell = Math.round(Math.min(vh * 0.4, 300));
        p.on = true;
        p.top = top;
        p.travel = travel;
        if (native) p.section.classList.add("is-native");
        p.body.style.height = p.body.offsetHeight + travel + dwell + "px";
        p.wrap.style.top = top + "px";
        p.body.style.setProperty("--pin-start", top + "px");
        p.body.style.setProperty("--pin-end", Math.max(0, vh - top - tall) + "px");
        p.body.style.setProperty("--rail-travel", travel + "px");
        p.body.style.setProperty("--rail-dwell", dwell + "px");
        // El título acompaña: al lado del carrusel en desktop; arriba, si entra, en angosto.
        if (p.head) {
          var side = p.head.getBoundingClientRect().left + 8 < p.wrap.getBoundingClientRect().left;
          var above = top - p.head.offsetHeight - 20;
          if (side) p.head.style.top = top + "px";
          else if (above >= bar + 8) {
            p.head.style.top = above + "px";
            // Apilado, el título se soltaría más tarde que el carrusel y las tarjetas le
            // pasarían por encima. Se acorta su contenedor (margen negativo en el cuerpo,
            // compensado afuera) para que los dos se suelten a la vez.
            var gap = tall + 20;
            p.body.style.marginBottom = -gap + "px";
            if (p.inner) p.inner.style.marginBottom = gap + "px";
          } else p.head.style.top = "-999px"; // no entra: que se vaya con el scroll
        }
      });
      follow();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    layout();
  }

  // Marca en la barra la sección que se está leyendo (sólo en la home).
  function spy() {
    var nav = document.querySelector("[data-spy]");
    if (!nav) return;
    var links = {};
    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    // Sólo las secciones que tienen link: stack y educación quedan bajo "Proyectos".
    var sections = Array.prototype.filter.call(document.querySelectorAll("main section[id]"), function (s) {
      return !!links[s.id];
    });
    function update() {
      var line = window.innerHeight * 0.35;
      var active = null;
      sections.forEach(function (s) {
        if (s.getBoundingClientRect().top <= line) active = s;
      });
      // La última sección es corta y nunca llega a la línea: al tocar fondo, gana.
      if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) active = sections[sections.length - 1];
      Object.keys(links).forEach(function (id) {
        if (active && id === active.id) links[id].setAttribute("aria-current", "true");
        else links[id].removeAttribute("aria-current");
      });
    }
    // Son 4 mediciones por evento: no hace falta throttle.
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("load", update);
    update();
  }

  function contactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form || !window.fetch) return; // sin fetch, el form postea normal
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type=submit]");
    function say(state, text) {
      status.setAttribute("data-state", state);
      status.textContent = text;
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      button.disabled = true;
      say("sending", form.getAttribute("data-sending"));
      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json().then(function (json) {
            if (!res.ok || !json.success) throw new Error("rejected");
          });
        })
        .then(function () {
          form.reset();
          say("ok", form.getAttribute("data-ok"));
        })
        .catch(function () {
          say("error", form.getAttribute("data-error"));
        })
        .then(function () { button.disabled = false; });
    });
  }
})();
