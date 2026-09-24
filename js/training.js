var lastId = null;
function pick(i) {
  var st = S.cs[i], t = st.lastD, note = "";
  if (st.sw > 0) { t = Math.max(1, st.lastD - 1); note = "هذي أسهل شوي عشان نثبّت الفكرة."; }
  else if (st.sr >= 2 && st.lastD < 3) { t = st.lastD + 1; note = "واضح إنك فاهم. هذي أصعب شوي 💪"; }
  if (st.m >= 0.9 && !st.hard) t = Math.max(t, 2);
  var pool = Q.filter(function (q) { return q.c === i; });
  var cands = pool.filter(function (q) { return st.seen.indexOf(q.id) === -1; });
  if (!cands.length) cands = pool.filter(function (q) { return st.wrong.indexOf(q.id) !== -1 && q.id !== lastId; });
  if (!cands.length) cands = pool.filter(function (q) { return q.id !== lastId; });
  cands = shuffle(cands).sort(function (a, b) { return Math.abs(a.d - t) - Math.abs(b.d - t); });
  return { q: cands[0], note: note };
}

function ask(i, extra) {
  hideDock();
  var p = pick(i);
  lastId = p.q.id;
  renderQuestion({
    i: i, q: p.q, note: extra || p.note, label: C[i].icon + " " + C[i].name,
    pct: function () { return Math.min(S.cs[i].m, 1) * 100; },
    back: function () { folder(i); },
    onCheck: function (ok) {
      var r = update(i, p.q, ok);
      return { gain: r.gain, bonus: r.bonus, next: function () {
        if (r.finished) win(i, r.newStars);
        else if (r.review) lesson(i, "review");
        else ask(i, "");
      } };
    }
  });
}

function update(i, q, ok) {
  var st = S.cs[i], review = false, gain = 0, bonus = false;
  if (st.seen.indexOf(q.id) === -1) st.seen.push(q.id);
  st.lastD = q.d;
  if (ok) {
    st.m = Math.min(1, st.m + GAIN[q.d]);
    st.sr++; st.sw = 0;
    if (q.d >= 2) st.hard = true;
    st.wrong = st.wrong.filter(function (x) { return x !== q.id; });
    gain = q.d * 10;
    if (st.sr >= 3) { gain += 5; bonus = true; }
    S.xp += gain;
  } else {
    st.m = Math.max(0, st.m - 0.1);
    st.sw++; st.sr = 0; st.miss++;
    if (st.wrong.indexOf(q.id) === -1) st.wrong.push(q.id);
    if (S.nb.indexOf(q.id) === -1) S.nb.push(q.id); 
    if (st.sw >= 2) { st.sw = 1; review = true; }
  }

  if (st.m >= 1 && !st.hard) st.m = 0.9;
  var finished = st.m >= 1 && st.hard, newStars = 0;
  if (finished) {
    newStars = st.miss === 0 ? 3 : st.miss <= 2 ? 2 : 1;
    if (newStars > st.stars) st.stars = newStars;
    st.done = true;
  }
  save();
  return { finished: finished, review: review, gain: gain, bonus: bonus, newStars: newStars };
}

function win(i, stars) {
  var tip = stars < 3 ? '<p class="muted">تبي ٣ نجوم؟ العب «أصلح النظام» مرة ثانية من مراحل الدرس وحاول بدون أخطاء.</p>' : "";
  result(i, C[i].icon, C[i].name + " يشتغل!", "صلحت النظام، والحين المراحل الجاية تثبّت الفكرة أكثر." + tip,
    function () { replay(i); }, "العب «أصلح النظام» مرة ثانية", starText(stars));
}
