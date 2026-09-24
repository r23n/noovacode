var app = document.getElementById("app");
var dock = document.getElementById("dock");
var AR = "٠١٢٣٤٥٦٧٨٩";
function arNum(n) { return String(n).replace(/\d/g, function (d) { return AR[+d]; }); }
function esc(t) {
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function qById(id) { for (var n = 0; n < Q.length; n++) if (Q[n].id === id) return Q[n]; return null; }

function hl(code, fill) {
  var re = /("(?:[^"\\]|\\.)*")|\b(int|String|if|else|for|while|static|void|return)\b|\b(System|out|println)\b|\b(\d+)\b|(___)/g;
  var html = "", last = 0, m;
  while ((m = re.exec(code)) !== null) {
    html += esc(code.slice(last, m.index));
    if (m[1]) html += '<span class="s">' + esc(m[1]) + "</span>";
    else if (m[2]) html += '<span class="k">' + m[2] + "</span>";
    else if (m[3]) html += '<span class="y">' + m[3] + "</span>";
    else if (m[4]) html += '<span class="n">' + m[4] + "</span>";
    else if (m[5]) html += fill != null
      ? '<span class="slot filled">' + esc(fill) + "</span>"
      : '<span class="slot">؟</span>';
    last = re.lastIndex;
  }
  return html + esc(code.slice(last));
}
function codeBlock(code, fill) { return '<pre class="code">' + hl(code, fill) + "</pre>"; }
function starText(n) {
  var s = "";
  for (var k = 1; k <= 3; k++) s += k <= n ? "★" : "☆";
  return '<span class="stars" aria-label="' + n + ' من 3 نجوم">' + s + "</span>";
}
function isOpen(i) {
  for (var p = 0; p < i; p++) if (!lessonDoneRaw(p)) return false;
  return true;
}

function lessonDoneRaw(i) { return ACTS.every(function (a) { return rawDone(i, a.k); }); }
function lessonDone(i) { return actCount(i) === ACTS.length; }
function lessonsDone() { return C.filter(function (c, i) { return lessonDone(i); }).length; }
function actIndex(k) { for (var n = 0; n < ACTS.length; n++) if (ACTS[n].k === k) return n; return -1; }

function stageOpen(i, k) { var n = actIndex(k); return isOpen(i) && (n === 0 || actDone(i, ACTS[n - 1].k)); }
function nextStage(i) { for (var n = 0; n < ACTS.length; n++) if (!actDone(i, ACTS[n].k)) return ACTS[n]; return null; }
function doneCount() { return S.cs.filter(function (c) { return c.done; }).length; }
function starCount() { return S.cs.reduce(function (a, c, i) { return a + (actDone(i, "fix") ? c.stars || 0 : 0); }, 0); }
function stagesDone() { return C.reduce(function (a, c, i) { return a + actCount(i); }, 0); }
function hideDock() { dock.className = ""; dock.innerHTML = ""; refresh = null; }
function toTop() { window.scrollTo(0, 0); }
function addXp(n) { S.xp += n; save(); }

function actDone(i, k) {
  if (!isOpen(i)) return false;
  var n = actIndex(k);
  for (var p = 0; p < n; p++) if (!rawDone(i, ACTS[p].k)) return false;
  return rawDone(i, k);
}
function rawDone(i, k) {
  var st = S.cs[i];
  if (k === "lesson") return st.lesson;
  if (k === "fix") return st.done;
  if (k === "tf") return st.acts.tf >= 6;
  return !!st.acts[k];
}
function actCount(i) { return ACTS.filter(function (a) { return actDone(i, a.k); }).length; }
function masteredCount() { return lessonsDone(); }

function head(i, label, pct, backFn) {
  stopAi();
  var streak = i != null && S.cs[i].sr >= 2 ? '<span class="chipx">🔥 ' + S.cs[i].sr + "</span>" : "";
  app.innerHTML = '<div class="top"><button class="back" id="back" aria-label="رجوع">→</button>' +
    '<div class="grow"><b>' + label + '</b><div class="bar"><span style="width:' + Math.round(pct) + '%"></span></div></div>' +
    streak + '<span class="chipx">⚡ ' + S.xp + "</span></div>";
  document.getElementById("back").onclick = backFn;
}
function put(html) { app.insertAdjacentHTML("beforeend", html); }
