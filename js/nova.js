function validAiQs(data, i) {
  if (!Array.isArray(data)) return [];
  var out = [];
  data.forEach(function (x) {
    if (!x || typeof x.q !== "string" || !x.q.trim() || !Array.isArray(x.options) || x.options.length !== 3) return;
    var opts = x.options.map(function (o) { return typeof o === "string" ? o.trim() : ""; });
    if (opts.some(function (o) { return !o; })) return;
    if (opts[0] === opts[1] || opts[0] === opts[2] || opts[1] === opts[2]) return;
    var ans = Number(x.answer);
    if ([0, 1, 2].indexOf(ans) === -1 || typeof x.why !== "string") return;
    var mono = opts.every(function (o) { return !/[\u0600-\u06FF]/.test(o); });
    out.push({ id: "ai" + out.length, c: i, d: 2, type: "choice", mono: mono, q: x.q.trim(),
      code: typeof x.code === "string" ? x.code.trim() : "", options: opts, answer: ans, why: x.why });
  });
  return out.slice(0, 5);
}
function aiQuiz(i) {
  hideDock();
  if (!aiOn()) { folder(i); return; }
  head(i, "✨ أسئلة جديدة من نوفا", 0, function () { folder(i); });
  put('<div class="bot"><span class="face" aria-hidden="true">🤖</span><div class="bubble">أجهّز لك ٥ أسئلة جديدة على «' + C[i].topic + '»، وأركز على النقاط اللي غلطت فيها قبل.</div></div>' +
    '<div class="ai-box" id="gen"><div class="thinking">نوفا تكتب الأسئلة<span>.</span><span>.</span><span>.</span></div></div>' +
    '<p class="muted" style="font-size:.9rem">ياخذ عادة من ١٥ إلى ٦٠ ثانية.</p>');
  var weak = [];
  S.cs[i].wrong.concat(S.nb).forEach(function (id) {
    var q = qById(id);
    if (q && q.c === i && weak.indexOf(q) === -1) weak.push(q);
  });
  var weakTxt = weak.length
    ? "\n\nهذي أسئلة غلط فيها اللاعب قبل، ركز على نفس الأفكار بأمثلة جديدة:\n" + weak.slice(0, 5).map(function (q) { return "- " + q.q + (q.code ? " | " + q.code.replace(/\n/g, " ") : ""); }).join("\n")
    : "";
  var prompt = "أنت تصمم أسئلة للعبة تعليمية.\n" + lessonCtx(i) + weakTxt +
    "\n\nولّد 5 أسئلة اختيار من متعدد جديدة (مو نفس أمثلة الدرس) عن «" + C[i].topic + "»، وممكن تستخدم المواضيع السابقة بس، ولا تستخدم أي شي ما درسه. تدرّج من سهل إلى أصعب، ونوّع: توقّع اللي يطلع على الشاشة، اكتشف الغلط، اختر الكلمة الناقصة. الكود قصير (1 إلى 6 أسطر)، بدون class أو main، وجافا صحيح إلا إذا السؤال عن اكتشاف غلط. تتبّع كل كود بنفسك خطوة خطوة وتأكد إن الإجابة الصحيحة صح 100% والخيارين الثانيين غلط أكيد. الأسئلة والشرح بالعامية الخليجية البسيطة لمبتدئ." +
    '\n\nرد بمصفوفة JSON فقط، كل عنصر بهالشكل:\n{"q":"نص السؤال بالعربي","code":"كود جافا أو نص فاضي","options":["خيار","خيار","خيار"],"answer":0,"why":"شرح قصير ليش الإجابة صحيحة"}\n' +
    "answer رقم الخيار الصحيح (0 أو 1 أو 2)، ونوّع مكانه بين الأسئلة. إذا الخيارات مخرجات أو كود، اكتبها بالإنجليزي بالضبط كما تطلع، وإذا المخرجات أكثر من سطر افصل بينها بمسافة واذكر في السؤال إن كل واحد في سطر.";
  stopAi();
  var ctl = new AbortController();
  aiCtl = ctl;
  AI.json(prompt, { signal: ctl.signal, cache: false }).then(function (data) {
    if (aiCtl === ctl) aiCtl = null;
    var qs = validAiQs(data, i);
    if (qs.length < 3) throw { code: "invalid_json" };
    play(qs, 0, 0, 0);
  }).catch(function (e) {
    if (aiCtl === ctl) aiCtl = null;
    if (e && e.code === "cancelled") return;
    var el = document.getElementById("gen");
    if (!el) return;
    el.innerHTML = '<div class="ai-err">' + esc(aiErr(e)) + "</div>" + (aiOn() ? '<button class="btn" id="retry" style="margin-top:12px">جرّب مرة ثانية</button>' : "");
    var r = document.getElementById("retry"); if (r) r.onclick = function () { aiQuiz(i); };
  });

  function play(qs, idx, score, skipped) {
    hideDock();
    var q = qs[idx], last = idx === qs.length - 1;
    function next(sc, sk) {
      if (last) done(qs.length - sk, sc); else play(qs, idx + 1, sc, sk);
    }
    renderQuestion({
      i: i, q: q, note: "سؤال " + arNum(idx + 1) + " من " + arNum(qs.length) + "، كتبته نوفا لك ✨",
      label: "✨ أسئلة جديدة من نوفا", pct: function () { return idx / qs.length * 100; }, back: function () { folder(i); },
      report: function () { next(score, skipped + 1); },
      onCheck: function (ok) {
        if (ok) { score++; S.cs[i].acts.aiq++; addXp(10); }
        return { gain: ok ? 10 : 0, nextLabel: last ? "شوف النتيجة" : "التالي", next: function () { next(score, skipped); } };
      }
    });
  }
  function done(total, score) {
    result(i, "✨", "جبت " + arNum(score) + " من " + arNum(total),
      score === total ? "ولا غلطة! أنت جاهز لتحديات أصعب." : "كل سؤال جديد يقوّي الفكرة. نوفا تقدر تكتب لك أسئلة جديدة كل مرة.",
      function () { aiQuiz(i); }, "✨ أسئلة جديدة ثانية");
  }
}

var SYMS = ['System.out.println();', '"', "(", ")", ";", "{", "}", "=", "+", "<", ">", "[", "]"];
function writeCode(i, t) {
  hideDock();
  if (!aiOn()) { folder(i); return; }
  var tasks = TASKS[i], st = S.cs[i];
  if (t < 0) { t = 0; for (var n = 0; n < tasks.length; n++) if (st.acts.write.indexOf(n) === -1) { t = n; break; } }
  var task = tasks[t], tries = 0;
  head(i, "✍️ اكتب الكود بنفسك", st.acts.write.length / tasks.length * 100, function () { folder(i); });
  put('<div class="note">التحدي ' + arNum(t + 1) + " من " + arNum(tasks.length) + (st.acts.write.indexOf(t) !== -1 ? " ✓ حليته قبل" : "") + "</div>" +
    '<h2 class="qtext">' + esc(task.t) + "</h2>" +
    '<p class="muted" style="font-size:.95rem;margin-top:0">اكتب الأسطر مباشرة، ما تحتاج class أو main. الأزرار تحت تساعدك تكتب الرموز بسرعة.</p>' +
    '<textarea class="codein" id="code" dir="ltr" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" rows="7" placeholder="// اكتب كودك هنا"></textarea>' +
    '<div class="symbar">' + SYMS.map(function (s, k) { return '<button class="sym" data-s="' + k + '">' + esc(s) + "</button>"; }).join("") + "</div>" +
    '<div id="res"></div><div id="sol"></div>' +
    '<div class="tasknav">' + tasks.map(function (x, k) {
      return '<button class="chip' + (k === t ? " sel" : "") + '" data-t="' + k + '">' + (st.acts.write.indexOf(k) !== -1 ? "✓ " : "") + "التحدي " + arNum(k + 1) + "</button>";
    }).join("") + "</div>");
  var ta = document.getElementById("code");
  app.querySelectorAll(".sym").forEach(function (b) {
    b.onclick = function () {
      var s = SYMS[+b.dataset.s], a = ta.selectionStart, z = ta.selectionEnd;
      ta.value = ta.value.slice(0, a) + s + ta.value.slice(z);
      var pos = a + (s === "System.out.println();" ? s.length - 2 : s.length);
      ta.focus(); ta.setSelectionRange(pos, pos);
    };
  });
  app.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { writeCode(i, +b.dataset.t); }; });
  dock.className = "dock";
  dock.innerHTML = '<div class="dock-in"><button class="btn" id="grade">✨ نوفا، صححي كودي</button></div>';
  document.getElementById("grade").onclick = grade;

  function grade() {
    var code = ta.value.trim(), res = document.getElementById("res"), gb = document.getElementById("grade");
    if (!code) { res.innerHTML = '<div class="ai-err">اكتب كودك أول 🙂</div>'; return; }
    if (code.length > 3000) { res.innerHTML = '<div class="ai-err">الكود طويل مرة. اكتب الحل بأقصر شكل.</div>'; return; }
    gb.disabled = true;
    res.innerHTML = '<div class="ai-box"><div class="thinking">نوفا تقرأ كودك وتتبّعه<span>.</span><span>.</span><span>.</span></div></div>';
    stopAi();
    var ctl = new AbortController();
    aiCtl = ctl;
    AI.json("أنت تصحح كود لاعب مبتدئ في لعبة تعلّم جافا.\n" + lessonCtx(i) +
      "\n\nالمهمة: " + task.t + "\n\nكود اللاعب:\n" + code +
      "\n\nاعتبر الكود أسطر داخل main (ما يحتاج class أو main، والدوال static مسموحة قبل المناداة). تتبّعه بدقة خطوة خطوة. إذا فيه خطأ يمنعه يشتغل فهو غلط. اقبل أي حل صحيح يحقق المهمة حتى لو مختلف عن المتوقع، ولا تدقق في أسماء المتغيرات إلا إذا المهمة حددتها، ولا في المسافات الزايدة." +
      '\n\nرد بـ JSON فقط: {"correct": true أو false, "output": "اللي يطلع على الشاشة بالضبط، أو وصف قصير للخطأ بالعربي إذا ما يشتغل", "feedback": "جملتين إلى ثلاث بالعامية الخليجية، مشجعة، توضح وش الزين في الكود ووش الناقص، بدون ما تعطي الحل كامل"}',
      { signal: ctl.signal, cache: false, modelTier: "default" }
    ).then(function (r) {
      if (aiCtl === ctl) aiCtl = null;
      gb.disabled = false;
      if (!r || typeof r.correct !== "boolean") throw { code: "invalid_json" };
      tries++;
      var fb = typeof r.feedback === "string" ? r.feedback : "";
      var out = typeof r.output === "string" ? r.output : "";
      var gainTxt = "";
      if (r.correct) {
        var first = st.acts.write.indexOf(t) === -1;
        if (first) { st.acts.write.push(t); addXp(30); gainTxt = '<span class="gain">+30 ⚡</span>'; } else save();
      }
      res.innerHTML = '<div class="verdict ' + (r.correct ? "good" : "bad") + '"><h3>' + (r.correct ? "✅ كودك صح!" + gainTxt : "❌ قربت، بس فيه شي ناقص") + "</h3>" +
        (out ? '<div class="out-label">اللي يطلع من كودك:</div><div class="out">' + esc(out) + "</div>" : "") +
        '<p style="margin:10px 0 0">' + esc(fb) + "</p></div>";
      var sol = document.getElementById("sol");
      if (r.correct) {
        sol.innerHTML = '<div class="out-label">حل نموذجي للمقارنة:</div>' + codeBlock(task.sol);
        var nx = tasks.findIndex(function (x, k) { return st.acts.write.indexOf(k) === -1; });
        dock.innerHTML = '<div class="dock-in">' + (nx !== -1 ? '<button class="btn" id="nxt">التحدي الجاي</button>' : '<button class="btn" id="nxt">رجوع لأنشطة الدرس</button>') + "</div>";
        document.getElementById("nxt").onclick = function () { if (nx !== -1) writeCode(i, nx); else folder(i); };
      } else if (tries >= 2 && !sol.innerHTML) {
        sol.innerHTML = '<button class="link" id="show-sol">شوف الحل</button>';
        document.getElementById("show-sol").onclick = function () {
          sol.innerHTML = '<div class="out-label">الحل:</div>' + codeBlock(task.sol) + '<p class="muted" style="font-size:.95rem">قارنه بكودك، بعدين امسح كودك واكتبه من ذاكرتك.</p>';
        };
      }
    }).catch(function (e) {
      if (aiCtl === ctl) aiCtl = null;
      gb.disabled = false;
      if (e && e.code === "cancelled") return;
      res.innerHTML = '<div class="ai-err">' + esc(aiErr(e)) + "</div>";
    });
  }
  toTop();
}

var CHATS = {};
function chat(i) {
  hideDock();
  if (!aiOn()) { folder(i); return; }
  var turns = CHATS[i] || (CHATS[i] = []);
  head(i, "💬 اسأل نوفا", 0, function () { folder(i); });
  var rules = "أنت «نوفا»، روبوت مساعد لطيف في لعبة Java Quest. " + STYLE + "\n" + lessonCtx(i) +
    "\nجاوب على أسئلة اللاعب عن هالدرس أو عن جافا عموماً بإيجاز (غالباً أقل من 120 كلمة)، مع مثال كود صغير إذا يفيد. إذا سأل عن شي برا البرمجة، رده بلطف للدرس. إذا طلب حل جاهز، اشرح الفكرة أول بعدين عطه مثال.";
  put('<div class="bot"><span class="face" aria-hidden="true">🤖</span><div class="bubble">هلا! أنا نوفا. اسألني أي شي عن «' + C[i].topic + '»، حتى لو حسيت سؤالك بسيط.</div></div>' +
    '<div class="chat" id="chat"></div><div class="chips" id="sugg"></div>');
  var list = document.getElementById("chat");
  turns.forEach(function (t) { addMsg(t.role, t.content); });
  var sugg = ["اعطني مثال ثاني", "وش أشهر غلطة في هالدرس؟", "ليش أحتاج هالشي في البرمجة؟", "اسألني سؤال أختبر فيه نفسي"];
  if (!turns.length) {
    document.getElementById("sugg").innerHTML = sugg.map(function (s, k) { return '<button class="chip sug" data-g="' + k + '">' + s + "</button>"; }).join("");
    app.querySelectorAll(".sug").forEach(function (b) { b.onclick = function () { send(sugg[+b.dataset.g]); }; });
  }
  dock.className = "dock";
  dock.innerHTML = '<div class="dock-in chatbar"><textarea id="msg" rows="1" maxlength="500" placeholder="اكتب سؤالك..."></textarea><button class="btn" id="send">أرسل</button></div>';
  var box = document.getElementById("msg"), sendB = document.getElementById("send");
  sendB.onclick = function () { send(box.value); };
  box.onkeydown = function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(box.value); } };

  function addMsg(role, text) {
    var d = document.createElement("div");
    d.className = "msg " + (role === "user" ? "me" : "nova");
    if (role === "user") d.textContent = text; else d.innerHTML = aiFormat(text);
    list.appendChild(d);
    return d;
  }
  function send(text) {
    text = String(text || "").trim();
    if (!text || aiCtl || !aiOn()) return;
    document.getElementById("sugg").innerHTML = "";
    box.value = "";
    turns.push({ role: "user", content: text });
    addMsg("user", text);
    var d = addMsg("assistant", "");
    d.scrollIntoView({ block: "end" });
    sendB.disabled = true;
    var recent = turns.slice(-10);
    if (recent[0].role !== "user") recent = recent.slice(1);
    aiStream(d, [{ role: "user", content: rules }].concat(recent))
      .then(function (t) { turns.push({ role: "assistant", content: t }); })
      .catch(function () {})
      .then(function () { sendB.disabled = false; d.scrollIntoView({ block: "end" }); });
  }
  toTop();
}
