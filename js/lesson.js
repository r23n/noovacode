function lesson(i, mode) {
  hideDock();
  var c = C[i], L = c.lesson, st = S.cs[i];
  head(i, c.icon + " " + c.name, st.m * 100, function () { folder(i); });
  refresh = function () { lesson(i, mode); };
  var talk = mode === "review"
    ? '<div class="bubble alert">ولا يهمك، هذي الفكرة تحتاج شوية تركيز. خلنا نراجعها مع بعض بهدوء.</div>'
    : '<div class="bubble">نظام «' + c.name + '» يحتاجك. عشان نصلحه، لازم نفهم فكرة وحدة: <b>' + c.topic + "</b>.</div>";
  var cq = checkQ(i);
  var buttons = mode === "review"
    ? '<button class="btn" id="try">جرّب بنفسك</button>'
    : st.lesson
      ? '<div class="check done-check"><p class="ok-txt" style="margin-top:0">✓ الدرس مكتمل</p>' + progressBlock(i) + "</div>"
      : '<section class="check" id="check-sec"><h3>✋ تأكد إنك فهمت</h3><p class="muted" style="margin:4px 0 10px">جاوب صح عشان يكتمل الدرس وتفتح المرحلة الجاية.</p>' +
        '<div class="qtext" style="font-size:1.15rem">' + esc(cq.q) + "</div>" + (cq.code ? codeBlock(cq.code) : "") +
        '<div class="opts">' + shuffle(cq.options.map(function (t, k) { return { t: t, k: k }; })).map(function (x) {
          return '<button class="opt' + (cq.mono ? " mono" : "") + '" data-ck="' + x.k + '" dir="' + (cq.mono ? "ltr" : "auto") + '">' + esc(x.t) + "</button>";
        }).join("") + '</div><div id="check-msg"></div></section>';
  put('<div class="bot"><span class="face" aria-hidden="true">🤖</span>' + talk + "</div>" +
    '<article class="lesson"><h2>' + c.topic + "</h2><p>" + L.text + "</p>" + codeBlock(L.code) +
    '<div class="out-label">اللي يطلع على الشاشة:</div><div class="out">' + esc(L.output) + "</div>" +
    '<ul class="notes">' + L.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></article>" +
    (aiOn() ? '<button class="btn ai-btn" id="again-ai">✨ نوفا، اشرحها لي بطريقة ثانية</button><div class="ai-box" id="again-box" hidden></div><div style="height:14px"></div>' : "") +
    buttons);
  if (mode !== "review" && st.lesson) bindProgress(i);
  var tr = document.getElementById("try");
  if (tr) tr.onclick = function () { ask(i, ""); };
  app.querySelectorAll("[data-ck]").forEach(function (b) {
    b.onclick = function () {
      var msg = document.getElementById("check-msg");
      if (+b.dataset.ck === cq.answer) {
        playSound("good");
        b.classList.add("right");
        app.querySelectorAll("[data-ck]").forEach(function (x) { x.disabled = true; });
        st.lesson = true; addXp(5);
        msg.innerHTML = '<p class="ok-txt">صح! ' + esc(cq.why) + " الدرس اكتمل ✓</p>" + progressBlock(i);
        bindProgress(i);
      } else {
        playSound("bad");
        b.classList.add("wrong"); b.disabled = true;
        msg.innerHTML = '<p class="bad-txt">مو هذي. ارجع للمثال فوق واقرأ الملاحظات، بعدين جرّب مرة ثانية.</p>';
      }
    };
  });
  var f = document.getElementById("fold");
  if (f) f.onclick = function () { folder(i); };
  var ab = document.getElementById("again-ai");
  if (ab) ab.onclick = function () {
    var box = document.getElementById("again-box");
    box.hidden = false;
    ab.disabled = true;
    aiStream(box, STYLE + "\n\n" + lessonCtx(i) +
      "\n\nاللاعب قرأ الشرح وما استوعبه تماماً. اشرح نفس الفكرة بطريقة جديدة: ابدأ بتشبيه من الحياة اليومية في الخليج، بعدين مثال كود جديد صغير ووضح وش يطلع منه على الشاشة. لا تزيد عن 150 كلمة.")
      .then(function () { ab.disabled = false; ab.textContent = "✨ اشرحها بطريقة ثالثة"; })
      .catch(function () { ab.disabled = false; });
  };
  toTop();
}

function checkQ(i) {
  for (var n = 0; n < Q.length; n++) if (Q[n].c === i && Q[n].d === 1 && Q[n].type === "choice") return Q[n];
  return Q.filter(function (q) { return q.c === i; })[0];
}

function replay(i) {
  var st = S.cs[i];
  st.m = 0; st.seen = []; st.wrong = []; st.sr = 0; st.sw = 0; st.lastD = 1; st.hard = false; st.miss = 0;
  save();
  ask(i, "نفس النظام من جديد. هالمرة حاول بدون أخطاء عشان تاخذ ٣ نجوم ⭐");
}
