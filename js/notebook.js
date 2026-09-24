function notebook() {
  hideDock();
  head(null, "📓 دفتر أخطائي", 0, home);
  if (!S.nb.length) {
    put('<section class="win"><div class="big">📓</div><h2>الدفتر فاضي!</h2><p>ما عندك أسئلة غلط محفوظة. كل ما تغلط في «أصلح النظام»، السؤال ينحفظ هنا عشان تراجعه.</p><button class="btn" id="h">رجوع للمحطة</button></section>');
    document.getElementById("h").onclick = home;
    return;
  }
  var by = {};
  S.nb.forEach(function (id) { var q = qById(id); if (q) by[q.c] = (by[q.c] || 0) + 1; });
  var rows = Object.keys(by).map(function (c) {
    return "<li>" + C[c].icon + " " + C[c].topic + ": " + arNum(by[c]) + (by[c] > 2 ? " أسئلة" : by[c] === 2 ? " سؤالين" : " سؤال") + "</li>";
  }).join("");
  put('<div class="bot"><span class="face" aria-hidden="true">🤖</span><div class="bubble">هنا كل سؤال غلطت فيه. لما تجاوبه صح، يطلع من الدفتر.</div></div>' +
    '<ul class="notes">' + rows + "</ul>" +
    '<button class="btn" id="play">راجع ' + arNum(S.nb.length) + " من أخطائي</button>" +
    (aiOn() ? '<div style="height:10px"></div><button class="btn ai-btn" id="ana">✨ نوفا، حللي أخطائي</button><div class="ai-box" id="ana-box" hidden></div>' : ""));
  document.getElementById("play").onclick = function () { nbPlay(shuffle(S.nb), 0, 0); };
  var an = document.getElementById("ana");
  if (an) an.onclick = function () {
    an.disabled = true;
    var box = document.getElementById("ana-box");
    box.hidden = false;
    var list = S.nb.map(function (id) { var q = qById(id); return q ? "- (" + C[q.c].topic + ") " + q.q + (q.code ? "\n" + q.code : "") + "\n  الإجابة الصحيحة: " + (q.type === "order" ? q.lines.join(" / ") : q.options[q.answer]) : ""; }).join("\n");
    aiStream(box, STYLE + "\n\nالسياق: لعبة تعلّم جافا للمبتدئين. هذي الأسئلة اللي غلط فيها اللاعب:\n" + list +
      "\n\nحلل أخطاءه: وش الأفكار اللي تلخبطه (فكرتين أو ثلاث بالكثير)، وليش غالباً تصير هالغلطة، ونصيحة عملية قصيرة لكل وحدة. لا تزيد عن 170 كلمة.")
      .catch(function () {}).then(function () { an.disabled = false; });
  };
  toTop();
}
function nbPlay(queue, idx, score) {
  hideDock();
  var q = qById(queue[idx]);
  if (!q) { if (idx + 1 < queue.length) nbPlay(queue, idx + 1, score); else nbDone(queue.length, score); return; }
  renderQuestion({
    i: q.c, q: q, note: "من دفتر أخطائي، سؤال " + arNum(idx + 1) + " من " + arNum(queue.length) + ". الدرس: " + C[q.c].topic,
    label: "📓 دفتر أخطائي", pct: function () { return idx / queue.length * 100; }, back: notebook,
    onCheck: function (ok) {
      if (ok) { score++; S.nb = S.nb.filter(function (x) { return x !== q.id; }); addXp(5); }
      var last = idx === queue.length - 1;
      return { gain: ok ? 5 : 0, nextLabel: last ? "شوف النتيجة" : "التالي",
        next: function () { if (last) nbDone(queue.length, score); else nbPlay(queue, idx + 1, score); } };
    }
  });
}
function nbDone(total, score) {
  hideDock();
  app.innerHTML = '<section class="win"><div class="big">📓</div><h2>صححت ' + arNum(score) + " من " + arNum(total) + "</h2>" +
    "<p>" + (S.nb.length ? "باقي في الدفتر " + arNum(S.nb.length) + ". راجعها مرة ثانية بعد ما ترتاح شوي." : "الدفتر صار فاضي! كل أخطائك صارت نقاط قوة.") + "</p>" +
    '<button class="btn" id="h">رجوع للمحطة</button>' + (S.nb.length ? '<button class="btn ghost" id="nb2">راجع الباقي</button>' : "") + "</section>";
  document.getElementById("h").onclick = home;
  var b = document.getElementById("nb2"); if (b) b.onclick = notebook;
  toTop();
}
