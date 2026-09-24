var AI = null, aiOff = false, aiCtl = null, refresh = null;
if (window.claude && typeof window.claude.use === "function") {
  window.claude.use("sample").then(function (s) {
    AI = s;
    if (s && refresh) refresh();
  }).catch(function () {});
}
function aiOn() { return !!AI && !aiOff; }
function stopAi() { if (aiCtl) { aiCtl.abort(); aiCtl = null; } }
function aiErr(e) {
  var c = e && e.code;
  if (c === "cancelled") return "";
  if (c === "not_granted" || c === "sampling_disabled" || c === "not_declared" || c === "capability_disabled" || c === "capability_removed") {
    aiOff = true;
    return "مزايا نوفا مو متاحة حالياً، فأخفيناها. باقي اللعبة تشتغل عادي.";
  }
  if (c === "rate_limited" || c === "queue_overflow") return "فيه طلبات كثيرة الحين. انتظر دقيقة وجرّب مرة ثانية.";
  if (c === "session_expired") return "انتهت الجلسة. حدّث الصفحة وجرّب مرة ثانية.";
  if (c === "invalid_json") return "نوفا ما رتبت الرد صح هالمرة. جرّب مرة ثانية.";
  if (c === "refused") return "نوفا ما تقدر تجاوب على هذا. جرّب تسأل بطريقة ثانية.";
  return "صار خطأ وقت التواصل مع نوفا. جرّب مرة ثانية.";
}

function aiFormat(text) {
  var parts = String(text).replace(/\*\*/g, "").split("```");
  return parts.map(function (p, n) {
    if (n % 2 === 1) return codeBlock(p.replace(/^[a-zA-Z]*\n/, "").replace(/\s+$/, ""));
    p = p.trim();
    return p ? '<div class="ai-p">' + esc(p).replace(/`([^`]+)`/g, '<code dir="ltr">$1</code>') + "</div>" : "";
  }).join("");
}
var STYLE = "اكتب بالعامية الخليجية البسيطة، لشخص مبتدئ تماماً ما عنده أي خلفية في البرمجة. جمل قصيرة وواضحة، بدون عناوين وبدون تنسيق Markdown ما عدا كتل الكود. أي كود جافا حطه بين ``` و ```، والكود نفسه بالإنجليزي. الكود القصير اكتبه أسطر مباشرة بدون class أو main.";
function lessonCtx(i) {
  var c = C[i];
  var topics = C.slice(0, i + 1).map(function (x) { return x.topic; }).join("، ");
  return "السياق: لعبة تعلّم جافا للمبتدئين. الدرس الحالي: «" + c.topic + "». المواضيع اللي درسها اللاعب لين الحين: " + topics +
    ".\nمثال الدرس:\n" + c.lesson.code + "\nملاحظات الدرس: " + c.lesson.notes.join(" | ");
}

function aiStream(box, prompt) {
  stopAi();
  var ctl = new AbortController();
  aiCtl = ctl;
  box.innerHTML = '<div class="thinking">نوفا تفكر<span>.</span><span>.</span><span>.</span></div>';
  return AI(prompt, { signal: ctl.signal, cache: false, onText: function (d) { box.innerHTML = aiFormat(d.text); } })
    .then(function (r) { if (aiCtl === ctl) aiCtl = null; box.innerHTML = aiFormat(r.text); return r.text; })
    .catch(function (e) {
      if (aiCtl === ctl) aiCtl = null;
      var msg = aiErr(e);
      box.innerHTML = (e && e.text ? aiFormat(e.text) : "") + (msg ? '<div class="ai-err">' + esc(msg) + "</div>" : "");
      throw e;
    });
}
function explainHtml() {
  return aiOn() ? '<button class="btn ai-btn" id="why-ai">✨ ما فهمت، نوفا تشرح لي</button><div id="why-box" class="ai-box" hidden></div>' : "";
}

function bindExplain(i, qText, code, playerAns, rightAns) {
  var b = document.getElementById("why-ai");
  if (!b) return;
  b.onclick = function () {
    b.remove();
    var box = document.getElementById("why-box");
    box.hidden = false;
    aiStream(box, STYLE + "\n\n" + lessonCtx(i) +
      "\n\nاللاعب جاوب على هالسؤال غلط.\nالسؤال: " + qText + (code ? "\nالكود:\n" + code : "") +
      "\nإجابة اللاعب: " + playerAns + "\nالإجابة الصحيحة: " + rightAns +
      "\n\nاشرح له ليش إجابته بالذات غلط، وليش الصحيحة صح، في 3 إلى 5 جمل. إذا فيه كود تتبّعه خطوة خطوة. خلك مشجع.").catch(function () {});
  };
}
