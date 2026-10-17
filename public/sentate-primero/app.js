(function () {
  var HABITS = [
    'Sabemos cuánta plata entra por mes.',
    'Decidimos en qué gastar antes de que llegue la plata.',
    'Anotamos los gastos y sabemos en qué se va la plata.',
    'Hablamos de plata en familia, con tranquilidad.',
    'Apartamos primero el diezmo y la ofrenda.',
    'Tenemos algo ahorrado para imprevistos.',
    'Juntamos plata de antes para gastos grandes (vacaciones, fiestas).',
    'Antes de comprar, pensamos si es necesidad o deseo.',
    'Comparamos precios antes de una compra grande.',
    'Pagamos las cuotas y deudas sin que aprieten el mes.'
  ];
  var OPTIONS = [
    { v: 'si', label: 'Sí, funciona', pdf: 'Sí, funciona', rgb: [0, 117, 58] },
    { v: 'no', label: 'No, hay que mejorarlo', pdf: 'No, hay que mejorarlo', rgb: [179, 74, 0] },
    { v: 'ns', label: 'No sé cómo es en mi casa', pdf: 'No sé cómo es en mi casa', rgb: [75, 85, 99] }
  ];
  var KEY = 'sentate-primero-e1-v1';

  var qWrap = document.getElementById('questions');
  HABITS.forEach(function (text, i) {
    var n = i + 1;
    var fs = document.createElement('fieldset');
    fs.className = 'q card';
    fs.id = 'q' + n;
    var html = '<legend><span class="num">HÁBITO ' + n + ' DE 10</span><span class="stmt">' + text + '</span></legend><div class="opts">';
    OPTIONS.forEach(function (o) {
      var id = 'h' + n + '-' + o.v;
      html += '<div class="opt ' + o.v + '"><input type="radio" name="h' + n + '" id="' + id + '" value="' + o.v + '">' +
              '<label for="' + id + '">' + o.label + '</label></div>';
    });
    fs.innerHTML = html + '</div>';
    qWrap.appendChild(fs);
  });

  var form = document.getElementById('form');
  var msg = document.getElementById('msg');

  function collect() {
    var data = { nombre: form.nombre.value.trim(), conservo: form.conservo.value.trim(), cambio: form.cambio.value.trim(), answers: [] };
    for (var i = 1; i <= HABITS.length; i++) {
      var c = form.querySelector('input[name="h' + i + '"]:checked');
      data.answers.push(c ? c.value : null);
    }
    return data;
  }
  function updateProgress() {
    var d = collect();
    var count = d.answers.filter(Boolean).length;
    document.getElementById('ptxt').textContent = count + ' de ' + HABITS.length + ' hábitos';
    document.getElementById('pfill').style.width = (count / HABITS.length * 100) + '%';
    for (var i = 0; i < HABITS.length; i++) if (d.answers[i]) document.getElementById('q' + (i + 1)).classList.remove('missing');
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(collect())); } catch (e) {}
  }
  function restore() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!d) return;
    form.nombre.value = d.nombre || '';
    form.conservo.value = d.conservo || '';
    form.cambio.value = d.cambio || '';
    (d.answers || []).forEach(function (v, i) {
      if (!v) return;
      var el = document.getElementById('h' + (i + 1) + '-' + v);
      if (el) el.checked = true;
    });
  }
  form.addEventListener('change', function () { updateProgress(); save(); });
  form.addEventListener('input', save);
  restore();
  updateProgress();

  function optionOf(v) { for (var i = 0; i < OPTIONS.length; i++) if (OPTIONS[i].v === v) return OPTIONS[i]; return null; }

  function buildPdf(d) {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: 'mm', format: 'a4' });
    var W = 210, H = 297, M = 16, CW = W - 2 * M;
    var y = 0;
    var today = new Date();
    var fecha = today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

    function ensure(h) {
      if (y + h > H - 14) { footer(); doc.addPage(); y = M + 4; }
    }
    function footer() {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(107, 114, 128);
      doc.text('Taller Sentate primero · Encuentro 1 · Lucas 14:28', M, H - 9);
      doc.text(String(doc.internal.getNumberOfPages()), W - M, H - 9, { align: 'right' });
    }

    // Encabezado oscuro
    doc.setFillColor(17, 24, 39); doc.rect(0, 0, W, 44, 'F');
    doc.setFillColor(0, 158, 227); doc.rect(M, 37, 12, 1.2, 'F');
    doc.setFillColor(0, 166, 80); doc.rect(M + 12, 37, 12, 1.2, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(0, 158, 227);
    doc.text('TALLER SENTATE PRIMERO · ENCUENTRO 1', M, 13, { charSpace: 0.4 });
    doc.setFontSize(19); doc.setTextColor(243, 244, 246);
    doc.text('¿Cómo se maneja la plata en mi casa?', M, 23);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(156, 163, 175);
    doc.text((d.nombre ? d.nombre + ' · ' : '') + fecha, M, 30.5);
    y = 53;

    // Resumen
    var counts = { si: 0, no: 0, ns: 0 };
    d.answers.forEach(function (v) { if (v) counts[v]++; });
    var boxW = (CW - 8) / 3;
    OPTIONS.forEach(function (o, i) {
      var x = M + i * (boxW + 4);
      doc.setDrawColor(229, 231, 235); doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, boxW, 15, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(o.rgb[0], o.rgb[1], o.rgb[2]);
      doc.text(String(counts[o.v]), x + 5, y + 7.5);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(75, 85, 99);
      doc.text(doc.splitTextToSize(o.pdf, boxW - 10), x + 5, y + 12);
    });
    y += 21;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 117, 58);
    doc.text('EN MI CASA...', M, y, { charSpace: 0.4 });
    y += 6;

    var ansW = 52, stmtW = CW - ansW - 14;
    HABITS.forEach(function (text, i) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5);
      var lines = doc.splitTextToSize(text, stmtW);
      var o = optionOf(d.answers[i]);
      doc.setFontSize(9.5);
      var aLines = doc.splitTextToSize(o ? o.pdf : 'Sin responder', ansW - 6);
      var rowH = Math.max(lines.length * 4.8, aLines.length * 4.4) + 4.0;
      ensure(rowH);
      if (i % 2 === 0) { doc.setFillColor(249, 250, 251); doc.rect(M, y - 1, CW, rowH, 'F'); }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(29, 78, 216);
      doc.text(String(i + 1), M + 3, y + 3.6);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(17, 24, 39);
      doc.text(lines, M + 11, y + 3.6);
      var rgb = o ? o.rgb : [156, 163, 175];
      doc.setFillColor(rgb[0], rgb[1], rgb[2]); doc.circle(M + CW - ansW + 1.5, y + 2.4, 1.3, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(rgb[0], rgb[1], rgb[2]);
      doc.text(aLines, M + CW - ansW + 5, y + 3.6);
      y += rowH;
      doc.setDrawColor(229, 231, 235); doc.line(M, y - 1, M + CW, y - 1);
    });
    y += 5;

    function commitBox(title, hint, body, rgb) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5);
      var lines = body ? doc.splitTextToSize(body, CW - 12) : [];
      var bodyH = body ? lines.length * 5 : 7;
      var h = 15.5 + bodyH + 3;
      ensure(h + 4);
      doc.setDrawColor(229, 231, 235); doc.setFillColor(255, 255, 255);
      doc.roundedRect(M, y, CW, h, 2.5, 2.5, 'FD');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(rgb[0], rgb[1], rgb[2]);
      doc.text(title, M + 6, y + 7);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(107, 114, 128);
      doc.text(hint, M + 6, y + 11.5);
      if (body) {
        doc.setFontSize(10.5); doc.setTextColor(17, 24, 39);
        doc.text(lines, M + 6, y + 17.5);
      } else {
        doc.setDrawColor(209, 213, 219);
        doc.line(M + 6, y + 21, M + CW - 6, y + 21);
      }
      y += h + 5;
    }
    commitBox('Conservo', 'Algo que marqué como "Sí, funciona" y quiero llevar a mi vida.', d.conservo, [0, 117, 58]);
    commitBox('Cambio', 'Algo que marqué como "No, hay que mejorarlo" y quiero hacer distinto.', d.cambio, [29, 78, 216]);

    // Para la semana
    var week = [
      'Releé tus respuestas y elegí un solo hábito para empezar a cambiar esta semana.',
      'Anotá cada gasto durante 7 días, en papel o en el celular, y traelo al Encuentro 2.',
      'Si marcaste "No sé", animate a preguntar en casa cómo se maneja ese tema.'
    ];
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    var wl = week.map(function (t) { return doc.splitTextToSize(t, CW - 18); });
    var wh = 14 + wl.reduce(function (a, l) { return a + l.length * 4.8 + 2; }, 0) + 9;
    ensure(wh);
    doc.setFillColor(17, 24, 39); doc.roundedRect(M, y, CW, wh, 2.5, 2.5, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 158, 227);
    doc.text('PARA TRABAJAR ESTA SEMANA', M + 6, y + 8, { charSpace: 0.4 });
    var yy = y + 14;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(243, 244, 246);
    wl.forEach(function (l) {
      doc.setFillColor(0, 166, 80); doc.circle(M + 7.5, yy - 1.3, 0.9, 'F');
      doc.text(l, M + 11, yy);
      yy += l.length * 4.8 + 2;
    });
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9.5); doc.setTextColor(156, 163, 175);
    doc.text('Lo que aprendiste en casa no es tu destino: es tu punto de partida.', M + 6, y + wh - 4);
    y += wh;

    footer();
    return doc;
  }

  var pdfUrl = null;
  function showError(text) {
    msg.textContent = text;
    msg.classList.add('show');
    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.getElementById('finish').addEventListener('click', function () {
    var d = collect();
    var missing = [];
    d.answers.forEach(function (v, i) { if (!v) missing.push(i + 1); });
    msg.classList.remove('show');
    if (missing.length) {
      missing.forEach(function (n) { document.getElementById('q' + n).classList.add('missing'); });
      msg.textContent = missing.length === 1
        ? 'Te falta responder el hábito ' + missing[0] + '.'
        : 'Te faltan responder ' + missing.length + ' hábitos: ' + missing.join(', ') + '.';
      msg.classList.add('show');
      document.getElementById('q' + missing[0]).scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF) {
      showError('No se pudo preparar el PDF en este navegador. Abrí el link en Chrome o Safari e intentá de nuevo.');
      return;
    }
    try {
      var blob = buildPdf(d).output('blob');
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      pdfUrl = URL.createObjectURL(blob);
      document.getElementById('dl').href = pdfUrl;
      document.getElementById('open').href = pdfUrl;
    } catch (e) {
      showError('No se pudo generar el PDF (' + (e && e.message ? e.message : 'error desconocido') + '). Abrí el link en Chrome o Safari e intentá de nuevo.');
      return;
    }
    try { document.getElementById('dl').click(); } catch (e) {}
    form.style.display = 'none';
    document.getElementById('footer').style.display = 'none';
    document.getElementById('done').classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.getElementById('edit').addEventListener('click', function () {
    document.getElementById('done').classList.remove('show');
    form.style.display = '';
    document.getElementById('footer').style.display = '';
  });
})();
