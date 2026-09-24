function folder(i) {
  hideDock();
  var c = C[i], st = S.cs[i], n = actCount(i);
  head(i, "📁 الدرس " + arNum(i + 1), n / ACTS.length * 100, home);
  refresh = function () { folder(i); };
  var rows = ACTS.map(function (a, idx) {
    var done = actDone(i, a.k), open = stageOpen(i, a.k), status, desc = a.desc;
    if (!open) { status = "🔒"; desc = "تفتح بعد ما تكمل «" + ACTS[idx - 1].name + "»"; }
    else if (done) status = a.k === "fix" ? starText(st.stars) : a.k === "tf" ? "✓ " + arNum(st.acts.tf) + "/٨" : "مكتمل ✓";
    else if (a.k === "tf" && st.acts.tf) status = "أفضل نتيجة " + arNum(st.acts.tf) + "/٨";
    else status = "ابدأ";
    return '<button class="act' + (done ? " is-done" : open ? " is-next" : " is-locked") + '" data-k="' + a.k + '"' + (open ? "" : " disabled") + ">" +
      '<span class="ico">' + (open ? a.icon : "🔒") + '</span><span class="t"><b>' + arNum(idx + 1) + ". " + a.name + "</b><small>" + desc + "</small></span>" +
      '<span class="st">' + status + "</span></button>";
  }).join("");
  var badge = n === ACTS.length
    ? '<div class="bubble" style="margin-bottom:14px">🏅 الدرس مكتمل! خلصت مراحله الست' + (i < C.length - 1 ? "، وانفتح الدرس الجاي." : ".") + "</div>"
    : '<p class="muted" style="margin:0 0 14px">خلصت ' + arNum(n) + " من ٦ مراحل. كل مرحلة تفتح اللي بعدها، والدرس الجاي يفتح لما تخلصها كلها.</p>";

  var ai;
  if (!st.lesson) {
    ai = '<p class="muted" style="font-size:.95rem">🔒 تفتح بعد ما تكمل مرحلة «الدرس».</p>';
  } else if (aiOn()) {
    var w = st.acts.write.length;
    ai = '<div class="acts">' +
      '<button class="act ai" data-ai="quiz"><span class="ico">✨</span><span class="t"><b>أسئلة جديدة من نوفا</b><small>أسئلة ما شفتها قبل، وتركز على اللي غلطت فيه</small></span><span class="st">' + (st.acts.aiq ? arNum(st.acts.aiq) + " صح" : "") + "</span></button>" +
      '<button class="act ai" data-ai="write"><span class="ico">✍️</span><span class="t"><b>اكتب الكود بنفسك</b><small>تكتب كود حقيقي ونوفا تصححه</small></span><span class="st">' + (w ? arNum(w) + "/" + arNum(TASKS[i].length) : "") + "</span></button>" +
      '<button class="act ai" data-ai="chat"><span class="ico">💬</span><span class="t"><b>اسأل نوفا</b><small>أي سؤال عن الدرس، بكلامك</small></span><span class="st"></span></button></div>';
  } else {
    ai = '<p class="muted" style="font-size:.95rem">مزايا نوفا (أسئلة جديدة، وتصحيح الكود، والمحادثة) تشتغل لما تفتح اللعبة من داخل Claude.</p>';
  }
  var nextBtn = n === ACTS.length && i < C.length - 1 ? '<button class="btn" id="nextl" style="margin-bottom:14px">روح للدرس الجاي: ' + C[i + 1].topic + "</button>" : "";
  put('<h2 class="ftitle">' + c.icon + " " + c.topic + "</h2>" + badge + nextBtn + '<div class="acts">' + rows + "</div>" +
    '<h3 class="sec">✨ تدريب إضافي مع نوفا</h3><p class="muted" style="margin:-4px 0 10px;font-size:.92rem">اختياري، ما يأثر على فتح المراحل.</p>' + ai);
  var nl = document.getElementById("nextl"); if (nl) nl.onclick = function () { folder(i + 1); };
  app.querySelectorAll("[data-k]").forEach(function (b) { b.onclick = function () { runAct(i, b.dataset.k); }; });
  app.querySelectorAll("[data-ai]").forEach(function (b) {
    b.onclick = function () {
      var k = b.dataset.ai;
      if (k === "quiz") aiQuiz(i); else if (k === "write") writeCode(i, -1); else chat(i);
    };
  });
  toTop();
}
var curStage = null; 
function runAct(i, k) {
  var st = S.cs[i];
  curStage = k;
  if (!stageOpen(i, k)) { folder(i); return; }
  if (k === "lesson") lesson(i, "view");
  else if (k === "fix") {
    if (st.done) replay(i);
    else ask(i, "");
  }
  else if (k === "tf") tfGame(i);
  else if (k === "match") matchGame(i);
  else if (k === "bug") bugGame(i);
  else if (k === "cards") cardGame(i);
}

function result(i, icon, title, text, againFn, againLabel, top) {
  hideDock();
  playSound("win");
  app.innerHTML = '<section class="win"><div class="big">' + icon + "</div>" + (top || "") + "<h2>" + title + "</h2><p>" + text + "</p>" +
    progressBlock(i) + '<button class="btn ghost" id="again">' + (againLabel || "العب مرة ثانية") + "</button></section>";
  bindProgress(i);
  document.getElementById("again").onclick = againFn;
  toTop();
}

function progressBlock(i) {
  var ns = nextStage(i), h = "";
  if (!ns) {
    if (lessonsDone() === C.length) h = '<div class="bubble done-note">🌍 خلصت كل مراحل كل الدروس! المحطة كلها تشتغل، وتعلمت أساسيات جافا كاملة.</div><button class="btn" id="pb-home">شوف المحطة</button>';
    else if (i < C.length - 1) h = '<div class="bubble done-note">🎉 خلصت مراحل الدرس الست، وانفتح الدرس الجاي: ' + C[i + 1].icon + " " + C[i + 1].topic + '</div><button class="btn" id="pb-next">روح للدرس الجاي</button>';
  } else if (ns.k === curStage) {
    h = '<p class="muted">لازم تكمل هالمرحلة عشان تفتح المرحلة اللي بعدها.</p>';
  } else {
    var left = ACTS.length - actCount(i);
    h = '<p class="muted">باقي ' + arNum(left) + (left === 1 ? " مرحلة" : " مراحل") + " عشان يفتح الدرس الجاي.</p>" +
      '<button class="btn" id="pb-stage">المرحلة الجاية: ' + ns.icon + " " + ns.name + "</button>";
  }
  return h + '<button class="btn ghost" id="pb-fold">رجوع لمراحل الدرس</button>';
}
function bindProgress(i) {
  var ns = nextStage(i);
  var a = document.getElementById("pb-stage"); if (a) a.onclick = function () { runAct(i, ns.k); };
  var b = document.getElementById("pb-next"); if (b) b.onclick = function () { folder(i + 1); };
  var c = document.getElementById("pb-home"); if (c) c.onclick = home;
  document.getElementById("pb-fold").onclick = function () { folder(i); };
}
