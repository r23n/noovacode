function renderQuestion(o) {
  var q = o.q, chosen = null, placed = [], pool = [];
  var shown = q.type === "order" ? null : shuffle(q.options.map(function (t, k) { return { text: t, k: k }; }));
  if (q.type === "order") {
    pool = q.lines.map(function (l, k) { return { text: l, k: k }; });
    do { pool = shuffle(pool); } while (pool.length > 1 && pool.every(function (x, n) { return x.k === n; }));
  }

  function body() {
    head(o.i, o.label, o.pct(), o.back);
    var h = (o.note ? '<div class="note">🤖 ' + esc(o.note) + "</div>" : "") + '<h2 class="qtext">' + esc(q.q) + "</h2>";
    if (q.type === "choice") {
      h += (q.code ? codeBlock(q.code) : "") + '<div class="opts">' + shown.map(function (x) {
        return '<button class="opt' + (q.mono ? " mono" : "") + (chosen === x.k ? " sel" : "") + '" data-k="' + x.k + '" dir="' + (q.mono ? "ltr" : "auto") + '">' + esc(x.text) + "</button>";
      }).join("") + "</div>";
    } else if (q.type === "blank") {
      h += codeBlock(q.code, chosen == null ? null : q.options[chosen]) +
        '<div class="chips">' + shown.map(function (x) {
          return '<button class="chip' + (chosen === x.k ? " sel" : "") + '" data-k="' + x.k + '">' + esc(x.text) + "</button>";
        }).join("") + "</div>";
    } else {
      h += '<div class="muted" style="font-size:.95rem">اضغط على السطر عشان تنقله. واضغط عليه مرة ثانية عشان ترجعه.</div>' +
        '<div class="zone">' + (placed.length ? placed.map(function (x, n) {
          return '<button class="line" data-z="' + n + '">' + hl(x.text) + "</button>";
        }).join("") : '<div class="empty">حط الأسطر هنا بالترتيب</div>') + "</div>" +
        '<div class="pool">' + pool.map(function (x, n) {
          return '<button class="line" data-p="' + n + '">' + hl(x.text) + "</button>";
        }).join("") + "</div>";
    }
    if (q.hint) h += '<div class="hint"><button class="link" id="hint">أحتاج تلميح</button><div id="hintbox"></div></div>';
    if (o.report) h += '<div class="foot"><button class="link" id="report">🚩 السؤال فيه مشكلة؟ تخطاه</button></div>';
    put(h);

    app.querySelectorAll("[data-k]").forEach(function (b) { b.onclick = function () { chosen = +b.dataset.k; body(); }; });
    app.querySelectorAll("[data-p]").forEach(function (b) { b.onclick = function () { placed.push(pool.splice(+b.dataset.p, 1)[0]); body(); }; });
    app.querySelectorAll("[data-z]").forEach(function (b) { b.onclick = function () { pool.push(placed.splice(+b.dataset.z, 1)[0]); body(); }; });
    var hb = document.getElementById("hint");
    if (hb) hb.onclick = function () {
      document.getElementById("hintbox").innerHTML = '<div class="hint-box">💡 ' + esc(q.hint) + "</div>";
      hb.remove();
    };
    var rp = document.getElementById("report");
    if (rp) rp.onclick = o.report;
    var ready = q.type === "order" ? pool.length === 0 : chosen !== null;
    dock.className = "dock";
    dock.innerHTML = '<div class="dock-in"><button class="btn" id="check"' + (ready ? "" : " disabled") + ">تحقّق</button></div>";
    document.getElementById("check").onclick = check;
  }

  function check() {
    var ok = q.type === "order"
      ? placed.every(function (x, n) { return x.text === q.lines[n]; })
      : chosen === q.answer;
    if (q.type === "choice") {
      app.querySelectorAll(".opt").forEach(function (b) {
        var k = +b.dataset.k;
        if (k === q.answer) b.classList.add("right");
        else if (k === chosen) b.classList.add("wrong");
        b.disabled = true;
      });
    } else {
      app.querySelectorAll("[data-k],[data-p],[data-z]").forEach(function (b) { b.disabled = true; });
    }
    ["hint", "report"].forEach(function (id) { var el = document.getElementById(id); if (el) el.remove(); });

    var r = o.onCheck(ok);
    var rightAns = q.type === "order" ? q.lines.join("\n") : q.options[q.answer];
    var playerAns = q.type === "order" ? placed.map(function (x) { return x.text; }).join("\n") : q.options[chosen];
    var correct = q.type === "order"
      ? '<pre class="code" style="margin-bottom:12px">' + hl(rightAns) + "</pre>"
      : '<p>الإجابة الصحيحة: <span class="ans" dir="auto">' + esc(rightAns) + "</span></p>";
    var title = ok
      ? "صح!" + (r.gain ? '<span class="gain">+' + r.gain + " ⚡</span>" : "") + (r.bonus ? ' <span class="gain">🔥 مكافأة سلسلة</span>' : "")
      : "مو هذي";
    playSound(ok ? "good" : "bad");
    dock.className = "dock " + (ok ? "good" : "bad");
    dock.innerHTML = '<div class="dock-in"><h3>' + title + "</h3>" + (ok ? "" : correct) + "<p>" + esc(q.why) + "</p>" +
      (ok ? "" : explainHtml()) + '<button class="btn" id="cont">' + (r.nextLabel || "كمّل") + "</button></div>";
    if (!ok) bindExplain(o.i, q.q, q.type === "blank" ? q.code : q.code || "", playerAns, rightAns);
    document.getElementById("cont").onclick = function () { stopAi(); r.next(); };
  }

  body();
  toTop();
}
