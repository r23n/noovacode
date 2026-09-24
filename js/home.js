function home() {
  hideDock();
  refresh = home;
  var pct = Math.round(stagesDone() / (C.length * ACTS.length) * 100);
  var next = -1;
  for (var x = 0; x < C.length; x++) if (!lessonDone(x)) { next = x; break; }
  var started = S.xp > 0 || S.cs[0].lesson;
  var mods = C.map(function (c, i) {
    var st = S.cs[i], cls, label, n = actCount(i), sub;
    if (lessonDone(i)) { cls = "fixed"; label = "مكتمل ✓"; sub = "الدرس " + arNum(i + 1) + ": " + c.topic; }
    else if (isOpen(i)) { cls = "broken"; label = arNum(n) + " من ٦"; sub = "الدرس " + arNum(i + 1) + ": " + c.topic + (n ? "، المرحلة الجاية: " + nextStage(i).name : "، ابدأ بقراءة الدرس"); }
    else { cls = "locked"; label = "🔒"; sub = "الدرس " + arNum(i + 1) + ": " + c.topic + "، يفتح بعد ما تكمل الدرس " + arNum(i); }
    return '<button class="mod ' + cls + '" data-i="' + i + '"' + (cls === "locked" ? " disabled" : "") + ">" +
      '<span class="ico">' + c.icon + "</span>" +
      '<span class="t"><b>' + c.name + (lessonDone(i) ? " " + starText(st.stars) : "") + "</b><small>" + sub + "</small></span>" +
      '<span class="st">' + label + "</span></button>";
  }).join("");

  var cta = next === -1 ? "" : '<button class="btn" id="go">' + (started ? "كمّل الإصلاح" : "ابدأ الإصلاح") + "</button>";
  var soundLabel = S.sound === false ? "🔇 الصوت متوقف" : "🔊 الصوت يعمل";
  var nb = S.nb.length
    ? '<button class="act nb-row" id="nb"><span class="ico">📓</span><span class="t"><b>دفتر أخطائي</b><small>الأسئلة اللي غلطت فيها، راجعها لين تتقنها</small></span><span class="st">' + arNum(S.nb.length) + "</span></button>"
    : "";

  var notice = resetNotice
    ? '<div class="bubble alert" style="margin-bottom:14px">🔄 حدّثنا اللعبة بنظام مراحل جديد يفتح كل شي بالترتيب، فبدأ تقدمك من جديد عشان تكون كل الأرقام دقيقة. <button class="link" id="ok-notice">تمام</button></div>'
    : "";
  app.innerHTML = notice +
    '<header class="hero"><h1>Java Quest</h1>' +
    '<p class="muted">المحطة الفضائية تعطلت، وكل نظام فيها يشتغل بكود جافا. كل نظام درس، وداخله أنشطة وألعاب، ومعك نوفا 🤖 تساعدك. حتى لو عمرك ما برمجت.</p></header>' +
    '<section class="power" aria-label="طاقة المحطة"><div class="power-top"><span>طاقة المحطة</span><span class="power-num">' + pct + '%</span></div>' +
    '<div class="bar"><span style="width:' + pct + '%"></span></div>' +
    '<div class="muted" style="font-size:.9rem;margin-top:6px">خلصت ' + arNum(stagesDone()) + " من " + arNum(C.length * ACTS.length) + " مرحلة. كل مرحلة ترفع الطاقة.</div>" +
    '<div class="stats"><span>⚡ النقاط <b>' + S.xp + '</b></span><span>⭐ النجوم <b>' + starCount() + "/" + (C.length * 3) +
    '</b></span><span>✓ دروس مكتملة <b>' + masteredCount() + "/" + C.length + "</b></span></div></section>" +
    cta + nb + '<button class="link sound-toggle" id="sound" aria-pressed="' + (S.sound !== false) + '">' + soundLabel + '</button><nav class="station">' + mods + "</nav>" +
    (started ? '<div class="foot"><button class="link" id="reset">ابدأ من الصفر</button></div>' : "");

  var go = document.getElementById("go");
  if (go) go.onclick = function () { resetNotice = false; folder(next); };
  var okn = document.getElementById("ok-notice");
  if (okn) okn.onclick = function () { resetNotice = false; home(); };
  var nbb = document.getElementById("nb");
  if (nbb) nbb.onclick = notebook;
  var sound = document.getElementById("sound");
  if (sound) sound.onclick = function () {
    S.sound = S.sound === false;
    save();
    home();
  };
  app.querySelectorAll(".mod").forEach(function (b) {
    b.onclick = function () { var i = +b.dataset.i; if (isOpen(i)) folder(i); };
  });
  var r = document.getElementById("reset");
  if (r) r.onclick = function () {
    if (confirm("متأكد؟ بيرجع كل التقدم والنقاط للبداية.")) { S = fresh(); save(); home(); }
  };
  toTop();
}
