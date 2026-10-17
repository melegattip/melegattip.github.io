// Peces de la home, sin dependencias. Son dos grupos:
//
//  · El cardumen del hero (canvas 2D): cruza de izquierda a derecha siguiendo una corriente suave,
//    rodea la foto y huye del cursor. Unos pocos, en ámbar, nadan contra la corriente.
//  · Los que acompañan: un puñado de <svg> sueltos que viven en la ventana. Al scrollear
//    quedan atrás un instante y nadan para alcanzarte.
//
// Es decoración pura: sin este archivo la página se ve igual, sólo que sin animación.
// Con "movimiento reducido" el cardumen se dibuja quieto y los que acompañan no aparecen.
(function () {
  var root = document.documentElement;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Colores por tema: el cardumen, apagado; los que van a contramano, en el acento.
  var PALETTE = {
    dark: { school: "196,212,240", rebel: "245,183,64", gain: 1 },
    light: { school: "20,33,61", rebel: "168,80,10", gain: 0.75 },
  };
  function palette() { return PALETTE[root.getAttribute("data-theme") === "light" ? "light" : "dark"]; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  // Gira `from` hacia `to` por el camino corto.
  function steer(from, to, amount) {
    return from + Math.atan2(Math.sin(to - from), Math.cos(to - from)) * amount;
  }

  // Silueta mirando a +x, con la cola que aletea. Deja el trazado listo para fill().
  function shape(ctx, len, wag) {
    var s = Math.sin(wag) * len * 0.11;
    ctx.beginPath();
    ctx.moveTo(len * 0.5, 0);
    ctx.quadraticCurveTo(len * 0.12, -len * 0.21, -len * 0.3, s * 0.25);
    ctx.lineTo(-len * 0.56, -len * 0.17 + s);
    ctx.lineTo(-len * 0.46, s * 0.8);
    ctx.lineTo(-len * 0.56, len * 0.17 + s);
    ctx.lineTo(-len * 0.3, s * 0.25);
    ctx.quadraticCurveTo(len * 0.12, len * 0.21, len * 0.5, 0);
    ctx.closePath();
  }
  function paint(ctx, dpr, f, pal, alpha) {
    var c = Math.cos(f.heading) * dpr, s = Math.sin(f.heading) * dpr;
    ctx.setTransform(c, s, -s, c, f.x * dpr, f.y * dpr);
    shape(ctx, f.len, f.wag);
    ctx.globalAlpha = alpha * pal.gain;
    ctx.fillStyle = "rgb(" + (f.rebel ? pal.rebel : pal.school) + ")";
    ctx.fill();
  }

  // ------------------------------------------------------------------ cardumen del hero

  function school() {
    var canvas = document.querySelector("[data-fx]");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var hero = canvas.parentElement;
    var coreEl = hero.querySelector("[data-fx-core]");

    var AGAINST = 0.1; // proporción de peces que nadan contra la corriente
    var SCARE = 140; // radio (px) en el que el cursor los espanta

    var W = 0, H = 0, dpr = 1, cx = 0, cy = 0, coreR = 0;
    var fish = [];
    var pointer = { x: 0, y: 0, tx: 0, ty: 0, px: -1e4, py: -1e4, on: false };
    var clock = 0, last = 0, raf = 0, onScreen = true;
    var vel = { x: 0, y: 0 };

    function countFor(width) { return width < 640 ? 54 : width < 1100 ? 96 : 150; }

    // `anywhere`: al cargar se reparten por todo el hero; después entran por el borde.
    function place(f, anywhere) {
      f.x = anywhere ? Math.random() * W : f.dir > 0 ? -40 - Math.random() * 80 : W + 40 + Math.random() * 80;
      f.y = Math.random() * H;
      f.heading = f.dir > 0 ? 0 : Math.PI;
      f.age = anywhere ? -Math.random() * 1.4 : 0; // negativo = todavía no aparece (entrada escalonada)
    }

    function build(n) {
      fish = [];
      for (var i = 0; i < n; i++) {
        var rebel = i < Math.round(n * AGAINST);
        var depth = Math.pow(Math.random(), 1.7); // 0 = lejos (chico, tenue, lento) · 1 = cerca
        var f = {
          dir: rebel ? -1 : 1,
          rebel: rebel,
          len: rebel ? 15 + Math.random() * 9 : 9 + depth * 17,
          speed: rebel ? 44 + Math.random() * 22 : 26 + depth * 36 + Math.random() * 10,
          alpha: rebel ? 0.95 : 0.2 + depth * 0.5,
          wag: Math.random() * 6.283,
          x: 0, y: 0, heading: 0, age: 0, fear: 0,
        };
        place(f, true);
        fish.push(f);
      }
      // De lejos a cerca, y los de contramano arriba de todo.
      fish.sort(function (a, b) { return (a.rebel ? 99 : a.len) - (b.rebel ? 99 : b.len); });
    }

    function resize() {
      var rect = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5); // son siluetas chicas: más resolución no se nota y cuesta
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      if (coreEl) {
        var c = coreEl.getBoundingClientRect();
        cx = c.left - rect.left + c.width / 2;
        cy = c.top - rect.top + c.height / 2;
        coreR = c.width / 2 + 22;
      } else {
        cx = cy = -1e4;
        coreR = 0;
      }
      var n = countFor(W);
      if (fish.length !== n) build(n);
    }

    // Lo que un obstáculo circular le suma a una corriente que viene por el eje x
    // (flujo potencial alrededor de un cilindro): la corriente se abre y lo rodea.
    // `u` negativo sirve para los que nadan al revés.
    function around(x, y, ox, oy, r, u, out) {
      var dx = x - ox, dy = y - oy;
      var d2 = dx * dx + dy * dy;
      var r2 = r * r;
      if (d2 < r2 * 0.36) d2 = r2 * 0.36; // adentro la fórmula se dispara
      var k = (u * r2) / (d2 * d2);
      out.x -= k * (dx * dx - dy * dy);
      out.y -= k * 2 * dx * dy;
    }

    function advance(dt) {
      clock += dt;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      // El mouse inclina la corriente (arriba/abajo) y la acelera o la frena (derecha/izquierda).
      var lean = pointer.y * 0.3;
      var pace = 1 + pointer.x * 0.35;
      var t = clock;

      for (var i = 0; i < fish.length; i++) {
        var f = fish[i];
        f.age += dt;
        if (f.age < 0) continue;

        // Ondulación suave de la corriente: dos senos, sin librería de ruido.
        var drift =
          0.3 * Math.sin(f.y * 0.006 + t * 0.22 + f.x * 0.0015) +
          0.18 * Math.sin(f.x * 0.004 - t * 0.16 + f.y * 0.003);
        var u = f.speed * (f.rebel ? 1 : pace) * f.dir;
        var angle = (drift + lean) * f.dir;
        vel.x = u * Math.cos(angle);
        vel.y = u * Math.sin(angle);
        if (coreR) around(f.x, f.y, cx, cy, coreR, u, vel);

        // Susto: cerca del cursor se abren y aceleran; después se calman solos.
        var scared = 0;
        if (pointer.on) {
          var dx = f.x - pointer.px, dy = f.y - pointer.py;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < SCARE && d > 0.5) {
            scared = 1 - d / SCARE;
            var push = scared * scared * 210;
            vel.x += (dx / d) * push;
            vel.y += (dy / d) * push;
          }
        }
        f.fear += (scared - f.fear) * Math.min(1, dt * 5);

        f.x += vel.x * dt;
        f.y += vel.y * dt;
        f.heading = steer(f.heading, Math.atan2(vel.y, vel.x), Math.min(1, dt * 7));
        f.wag += dt * (7 + f.speed * 0.09 + f.fear * 16);

        var gone = f.dir > 0 ? f.x > W + 50 : f.x < -50;
        if (gone || f.y < -60 || f.y > H + 60) place(f, false);
      }
    }

    function draw() {
      var pal = palette();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < fish.length; i++) {
        var f = fish[i];
        if (f.age < 0) continue;
        // Se apagan hacia los costados. Se hace acá y no con una máscara CSS, que sobre un
        // canvas animado se recalcula en cada cuadro.
        var edge = clamp(Math.min(f.x, W - f.x) / (W * 0.14), 0, 1);
        if (edge > 0.02) paint(ctx, dpr, f, pal, f.alpha * edge * Math.min(1, f.age / 0.9));
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      raf = 0;
      if (!last) last = now;
      var dt = Math.min(0.05, (now - last) / 1000); // tope: al volver de una pestaña oculta no pega un salto
      last = now;
      advance(dt);
      draw();
      play();
    }
    function play() {
      if (!raf && onScreen && !document.hidden && !still) raf = window.requestAnimationFrame(frame);
    }

    function onMove(ev) {
      var rect = hero.getBoundingClientRect();
      pointer.px = ev.clientX - rect.left;
      pointer.py = ev.clientY - rect.top;
      pointer.on = pointer.py > -SCARE && pointer.py < rect.height + SCARE;
      pointer.tx = clamp((pointer.px / rect.width - 0.5) * 2, -1, 1);
      pointer.ty = clamp((pointer.py / rect.height - 0.5) * 2, -1, 1);
    }
    function onLeave() {
      pointer.on = false;
      pointer.tx = pointer.ty = 0;
    }

    resize();
    if (still) {
      // Imagen quieta: se simulan unos segundos de corrido y se dibuja el resultado.
      for (var i = 0; i < 240; i++) advance(1 / 60);
      draw();
      window.addEventListener("resize", function () { resize(); draw(); });
      new MutationObserver(draw).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
      return;
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", play);
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(hero);
    else window.addEventListener("resize", resize);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        play();
      }).observe(hero);
    }
    play();
  }

  // ------------------------------------------------------------------ los que acompañan

  // Son elementos sueltos (un <svg> por pez) y no un lienzo: moverlos es sólo cambiarles el
  // transform, que lo resuelve la GPU sin repintar nada. Un lienzo a pantalla completa
  // redibujándose en cada cuadro hacía tironear el scroll.
  function followers() {
    if (still) return;
    var NS = "http://www.w3.org/2000/svg";
    var layer = document.createElement("div");
    layer.className = "fx-follow";
    layer.setAttribute("aria-hidden", "true");

    var W = window.innerWidth, H = window.innerHeight;
    var fish = [];
    var lastY = window.scrollY;
    var last = 0, raf = 0;

    var n = W < 640 ? 4 : 7;
    for (var i = 0; i < n; i++) {
      var left = i % 2 === 0;
      var len = 14 + Math.random() * 9;
      var svg = document.createElementNS(NS, "svg");
      // El dibujo mira a +x y está centrado en el origen; el viewBox le deja aire a la cola.
      svg.setAttribute("viewBox", "-0.62 -0.3 1.24 0.6");
      svg.setAttribute("class", "follower" + (i % 3 === 2 ? " follower-plain" : ""));
      svg.style.width = (len * 1.24).toFixed(1) + "px";
      svg.style.height = (len * 0.6).toFixed(1) + "px";
      // Márgenes negativos: el centro del pez queda en el origen, así el transform lo ubica y lo gira sobre su centro.
      svg.style.marginLeft = (-len * 0.62).toFixed(1) + "px";
      svg.style.marginTop = (-len * 0.3).toFixed(1) + "px";
      var body = document.createElementNS(NS, "path");
      body.setAttribute("d", "M0.5 0Q0.12 -0.21 -0.3 0Q0.12 0.21 0.5 0Z");
      var tail = document.createElementNS(NS, "path");
      tail.setAttribute("class", "follower-tail");
      tail.setAttribute("d", "M-0.26 0L-0.56 -0.17L-0.46 0L-0.56 0.17Z");
      svg.appendChild(body);
      svg.appendChild(tail);
      layer.appendChild(svg);
      var f = {
        el: svg,
        // Su lugar en la ventana (fracciones): repartidos entre los dos costados.
        hx: left ? 0.03 + Math.random() * 0.1 : 0.87 + Math.random() * 0.1,
        hy: 0.22 + (i / Math.max(1, n - 1)) * 0.56 + (Math.random() - 0.5) * 0.08,
        lag: 0.7 + Math.random() * 0.3, // cuánto se queda atrás al scrollear
        face: left ? 0 : Math.PI, // hacia dónde mira cuando está tranquilo
        x: 0, y: 0, vx: 0, vy: 0, heading: 0,
      };
      f.x = f.hx * W;
      f.y = f.hy * H;
      f.heading = f.face;
      fish.push(f);
    }
    document.body.insertBefore(layer, document.body.firstChild);

    function put(f) {
      f.el.style.transform = "translate3d(" + f.x.toFixed(1) + "px," + f.y.toFixed(1) + "px,0) rotate(" + f.heading.toFixed(3) + "rad)";
    }
    fish.forEach(put);

    // Sólo corre mientras alguno está nadando; quietos, no gasta nada.
    function frame(now) {
      raf = 0;
      if (!last) last = now;
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      var damp = Math.exp(-4.4 * dt);
      var moving = false;
      for (var i = 0; i < fish.length; i++) {
        var f = fish[i];
        var tx = f.hx * W, ty = f.hy * H;
        f.vx = (f.vx + (tx - f.x) * 6.5 * dt) * damp;
        f.vy = (f.vy + (ty - f.y) * 6.5 * dt) * damp;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        var speed = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
        // Apurado, apunta hacia donde nada; tranquilo, vuelve a mirar para su lado.
        var want = speed > 14 ? Math.atan2(f.vy, f.vx) : f.face;
        f.heading = steer(f.heading, want, Math.min(1, dt * (speed > 14 ? 6 : 3)));
        var off = Math.abs(Math.atan2(Math.sin(f.face - f.heading), Math.cos(f.face - f.heading)));
        if (speed < 1.5 && Math.abs(tx - f.x) + Math.abs(ty - f.y) < 1.5 && off < 0.03) {
          // Llegó: se lo deja exacto en su lugar para que el bucle pueda frenar.
          f.x = tx; f.y = ty; f.vx = f.vy = 0; f.heading = f.face;
        } else moving = true;
        put(f);
      }
      if (moving) play();
      else last = 0;
    }
    function play() {
      if (!raf && !document.hidden) raf = window.requestAnimationFrame(frame);
    }

    // El scroll los deja atrás: se corren con la página y después nadan a su lugar.
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      var dy = y - lastY;
      lastY = y;
      for (var i = 0; i < fish.length; i++) {
        fish[i].y = clamp(fish[i].y - dy * fish[i].lag, -H * 0.6, H * 1.6);
      }
      play();
    }, { passive: true });
    window.addEventListener("resize", function () {
      W = window.innerWidth;
      H = window.innerHeight;
      play();
    });
    document.addEventListener("visibilitychange", function () { last = 0; play(); });
  }

  school();
  followers();
})();
