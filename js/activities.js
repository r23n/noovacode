function tfGame(i) {
  var items = shuffle(X[i].tf), idx = 0, score = 0;
  function show() {
    hideDock();
    var it = items[idx];
    head(i, "✅ صح أو غلط", idx / items.length * 100, function () { folder(i); });
    put('<div class="note">الجملة ' + arNum(idx + 1) + " من " + arNum(items.length) + "</div>" +
      (it.code ? codeBlock(it.code) : "") +
      '<h2 class="qtext tfq">' + esc(it.s) + "</h2>" +
      '<div class="tfbtns"><button class="tfb" data-a="1">صح ✓</button><button class="tfb" data-a="0">غلط ✗</button></div>');
    app.querySelectorAll(".tfb").forEach(function (b) {
      b.onclick = function () {
        var said = b.dataset.a === "1", ok = said === it.a;
        app.querySelectorAll(".tfb").forEach(function (x) {
          x.disabled = true;
          if ((x.dataset.a === "1") === it.a) x.classList.add("right");
          else if (x === b) x.classList.add("wrong");
        });
        if (ok) { score++; addXp(5); }
        var last = idx === items.length - 1;
        dock.className = "dock " + (ok ? "good" : "bad");
        dock.innerHTML = '<div class="dock-in"><h3>' + (ok ? 'صح!<span class="gain">+5 ⚡</span>' : "مو هذي") + "</h3>" +
          "<p>الجملة " + (it.a ? "صحيحة" : "غلط") + ". " + esc(it.why) + "</p>" + (ok ? "" : explainHtml()) +
          '<button class="btn" id="nx">' + (last ? "شوف النتيجة" : "التالي") + "</button></div>";
        if (!ok) bindExplain(i, "هل هالجملة صحيحة أو غلط: " + it.s, it.code, said ? "صحيحة" : "غلط", it.a ? "صحيحة" : "غلط");
        document.getElementById("nx").onclick = function () { stopAi(); if (last) finish(); else { idx++; show(); } };
      };
    });
    toTop();
  }
  function finish() {
    var st = S.cs[i];
    if (score > st.acts.tf) st.acts.tf = score;
    save();
    var good = score >= 6;
    result(i, good ? "🎯" : "💪", "جبت " + arNum(score) + " من " + arNum(items.length),
      good ? (score === items.length ? "ولا غلطة! فاهم الدرس تمام." : "ممتاز! النشاط اكتمل.")
           : "تحتاج ٦ صح على الأقل عشان يكتمل النشاط. راجع الدرس وجرّب مرة ثانية، الجمل بتتلخبط بترتيب جديد.",
      function () { tfGame(i); });
  }
  show();
}

function matchGame(i) {
  var pairs = X[i].match.map(function (p, k) { return { code: p.code, out: p.out, k: k }; });
  var codes = shuffle(pairs), outs = shuffle(pairs);
  var sel = null, matched = [], miss = 0, pairMiss = {}, msg = "";
  function show() {
    head(i, "🔗 طابق الكود بالنتيجة", matched.length / pairs.length * 100, function () { folder(i); });
    put('<p class="muted" style="margin:0 0 12px">اختر كود من فوق، بعدين اختر من تحت اللي يطلع منه على الشاشة. (الأرقام المفصولة بمسافة يعني كل رقم في سطر)</p>' +
      '<div class="mlist">' + codes.map(function (p) {
        var done = matched.indexOf(p.k) !== -1;
        return '<button class="mcode' + (sel === p.k ? " sel" : "") + (done ? " done" : "") + '" data-c="' + p.k + '"' + (done ? " disabled" : "") + ">" +
          '<pre class="code">' + hl(p.code) + "</pre>" + (done ? '<span class="mout" dir="auto">✓ ' + esc(p.out) + "</span>" : "") + "</button>";
      }).join("") + "</div>");
    dock.className = "dock";
    dock.innerHTML = '<div class="dock-in"><div class="mmsg">' + (msg || (sel === null ? "اختر كود أول" : "الحين اختر النتيجة")) + '</div><div class="chips">' +
      outs.filter(function (p) { return matched.indexOf(p.k) === -1; }).map(function (p) {
        return '<button class="chip" data-o="' + p.k + '" dir="auto">' + esc(p.out) + "</button>";
      }).join("") + "</div></div>";
    app.querySelectorAll("[data-c]").forEach(function (b) {
      b.onclick = function () { sel = +b.dataset.c; msg = ""; show(); };
    });
    dock.querySelectorAll("[data-o]").forEach(function (b) {
      b.onclick = function () {
        if (sel === null) { msg = "اختر الكود أول من فوق 👆"; show(); return; }
        var k = +b.dataset.o;
        if (k === sel) {
          matched.push(k);
          if (!pairMiss[k]) addXp(5);
          sel = null; msg = "صح! " + (pairMiss[k] ? "" : "+5 ⚡");
          if (matched.length === pairs.length) { finish(); return; }
        } else {
          miss++; pairMiss[sel] = true;
          msg = "مو هذي. تتبّع الكود سطر سطر وجرّب نتيجة ثانية.";
        }
        show();
      };
    });
  }
  function finish() {
    S.cs[i].acts.match = true; save();
    result(i, "🔗", miss === 0 ? "طابقتها كلها بدون غلطة!" : "طابقتها كلها!",
      miss === 0 ? "قراءتك للكود صارت قوية." : "غلطت " + arNum(miss) + " مرة. العبها مرة ثانية وحاول تطابق كل شي من أول محاولة.",
      function () { matchGame(i); });
  }
  show();
  toTop();
}

function bugGame(i) {
  var items = X[i].bugs, idx = 0, miss = 0;
  function show() {
    hideDock();
    var it = items[idx], itemMiss = false;
    head(i, "🐞 صيّاد الأخطاء", idx / items.length * 100, function () { folder(i); });
    var goal = it.goal
      ? '<p>المفروض الكود يطبع: <span class="ans goal" dir="auto">' + esc(it.goal) + "</span>، بس فيه سطر غلط.</p>"
      : "<p>هالكود فيه غلطة تمنعه يشتغل.</p>";
    put('<div class="note">الكود ' + arNum(idx + 1) + " من " + arNum(items.length) + "</div>" +
      '<h2 class="qtext">وين الغلطة؟ اضغط على السطر</h2>' + goal +
      '<div class="bugbox">' + it.lines.map(function (l, n) {
        return '<button class="bugline" data-l="' + n + '">' + (hl(l) || "&nbsp;") + "</button>";
      }).join("") + "</div>");
    app.querySelectorAll(".bugline").forEach(function (b) {
      b.onclick = function () {
        var n = +b.dataset.l;
        if (n === it.bad) {
          b.classList.add("right");
          app.querySelectorAll(".bugline").forEach(function (x) { x.disabled = true; });
          if (!itemMiss) addXp(10);
          var last = idx === items.length - 1;
          dock.className = "dock good";
          dock.innerHTML = '<div class="dock-in"><h3>لقيتها!' + (itemMiss ? "" : '<span class="gain">+10 ⚡</span>') + "</h3>" +
            "<p>" + esc(it.why) + '</p><div class="out-label">التصحيح:</div>' +
            '<pre class="code" style="margin-bottom:12px">' + hl(it.fix) + "</pre>" +
            '<button class="btn" id="nx">' + (last ? "شوف النتيجة" : "الكود الجاي") + "</button></div>";
          document.getElementById("nx").onclick = function () { if (last) finish(); else { idx++; show(); } };
        } else {
          b.classList.add("wrong"); b.disabled = true;
          miss++; itemMiss = true;
          dock.className = "dock bad";
          dock.innerHTML = '<div class="dock-in"><h3>مو هذا السطر</h3><p>هالسطر سليم. اقرأ باقي الأسطر بتركيز، وانتبه للأقواس والفواصل والأسماء.</p></div>';
        }
      };
    });
    toTop();
  }
  function finish() {
    S.cs[i].acts.bug = true; save();
    result(i, "🐞", miss === 0 ? "صدت كل الأخطاء من أول محاولة!" : "صدت كل الأخطاء!",
      "لقيت " + arNum(items.length) + " أخطاء" + (miss ? " وغلطت " + arNum(miss) + " مرة في الطريق" : "") + ". هذي نفس الأخطاء اللي يطيح فيها المبتدئين، والحين صرت تعرفها.",
      function () { bugGame(i); });
  }
  show();
}

function cardGame(i) {
  var deck = shuffle(X[i].cards), total = deck.length, flipped = false;
  function show() {
    var cd = deck[0];
    head(i, "🃏 بطاقات المراجعة", (total - deck.length) / total * 100, function () { folder(i); });
    put('<div class="note">باقي ' + arNum(deck.length) + " من " + arNum(total) + " بطاقات</div>" +
      '<button class="flash' + (flipped ? " flipped" : "") + '" id="card" aria-live="polite">' +
      '<span class="front" dir="auto">' + esc(cd.f) + "</span>" +
      (flipped ? '<span class="back">' + esc(cd.b) + "</span>" : '<span class="tap">اضغط عشان تقلب البطاقة</span>') + "</button>" +
      '<p class="muted" style="text-align:center;font-size:.95rem">حاول تتذكر المعنى قبل ما تقلبها.</p>');
    document.getElementById("card").onclick = function () { flipped = !flipped; show(); };
    dock.className = "dock";
    dock.innerHTML = flipped
      ? '<div class="dock-in tfbtns"><button class="btn ghost" id="later">راجعها بعدين</button><button class="btn" id="know">عرفتها ✓</button></div>'
      : '<div class="dock-in"><button class="btn" id="flip">اقلب البطاقة</button></div>';
    if (flipped) {
      document.getElementById("know").onclick = function () {
        deck.shift(); addXp(2); flipped = false;
        if (!deck.length) finish(); else show();
      };
      document.getElementById("later").onclick = function () { deck.push(deck.shift()); flipped = false; show(); };
    } else {
      document.getElementById("flip").onclick = function () { flipped = true; show(); };
    }
  }
  function finish() {
    S.cs[i].acts.cards = true; save();
    result(i, "🃏", "راجعت كل البطاقات!", "المصطلحات هذي بتشوفها في كل كود جافا. ارجع لها أي وقت تحتاج تنعش ذاكرتك.", function () { cardGame(i); });
  }
  show();
  toTop();
}
