function blankSys() {
  return { m: 0, seen: [], wrong: [], sr: 0, sw: 0, lastD: 1, hard: false, lesson: false, done: false, miss: 0, stars: 0,
           acts: { tf: 0, match: false, bug: false, cards: false, aiq: 0, write: [] } };
}
var SAVE_V = 3;
var resetNotice = false; 
function fresh() { return { v: SAVE_V, xp: 0, nb: [], cs: C.map(blankSys) }; }
function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return null;
    var data = JSON.parse(raw);
    if (!data.cs) return null;
    if (data.v !== SAVE_V) { resetNotice = true; return null; }
    while (data.cs.length < C.length) data.cs.push(blankSys());
    data.cs = data.cs.slice(0, C.length).map(function (st) {
      var b = blankSys();
      for (var k in b) if (st[k] === undefined) st[k] = b[k];
      for (var a in b.acts) if (st.acts[a] === undefined) st.acts[a] = b.acts[a];
      if (st.done && !st.stars) st.stars = 1;
      return st;
    });
    if (typeof data.xp !== "number") data.xp = 0;
    if (!Array.isArray(data.nb)) data.nb = [];
    return data;
  } catch (e) { return null; }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
var S = load() || fresh();
if (resetNotice) save();
