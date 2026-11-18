/* VAIGA Community – PREVIEW data for the static site (no server, no database).
   Replaces the community API with invented example content that lives only in this browser tab:
   nothing is saved or sent, a reload starts again from the examples. Events here are EXAMPLES
   (marked "example"), not real VAIGA events. Same hard rules as the real community: no likes,
   no messages, no member search, participants of a Meet & Go only visible to its participants. */
window.VAIGA_COMMUNITY_CFG = { demo: true };   // preview: no login, no server
(function () {
  "use strict";
  function iso(minAgo) { return new Date(Date.now() - minAgo * 60000).toISOString(); }
  function inDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
  var EV = [
    { id: "ex-latin", date: inDays(9), start: "21:00", end: "02:00", title: "Latin Parties (example event)", venue: "Example venue", city: "Tavira" },
    { id: "ex-retro", date: inDays(16), start: "22:00", end: "03:00", title: "Disco & Retro (example event)", venue: "Example venue", city: "Faro" },
    { id: "ex-40", date: inDays(23), start: "20:30", end: "01:00", title: "40+ Parties (example event)", venue: "Example venue", city: "Lagos" }
  ];
  var seq = 100;
  /* invented example content (names are invented) */
  var posts = [
    { id: 3, author: "Marta S.", mine: false, can_delete: false, created: iso(35), photo: "", body: "Who is going to the next Latin party? It is my first VAIGA night and I would love to go with a few people from the community 💃", comments: [
      { id: 31, parent_id: 0, author: "João P.", mine: false, can_delete: false, created: iso(25), body: "I am going! I created a Meet & Go for a drink before – have a look under Meet & Go." },
      { id: 32, parent_id: 31, author: "Marta S.", mine: false, can_delete: false, created: iso(20), body: "Great, I will join 🙂" } ] },
    { id: 2, author: "Sofia R.", mine: false, can_delete: false, created: iso(180), photo: "", body: "Tip for the Disco & Retro night: dress in your favourite decade. Last time the 80s outfits were amazing!", comments: [
      { id: 21, parent_id: 0, author: "Pieter V.", mine: false, can_delete: false, created: iso(150), body: "Agree! I am going full 70s this time." } ] },
    { id: 1, author: "João P.", mine: false, can_delete: false, created: iso(60 * 26), photo: "", body: "What a beautiful evening last weekend. Thank you to the organisers and the DJ – see you at the next one!", comments: [] }
  ];
  function mt(e, before) {
    var p = e.start.split(":"), m = Math.max(0, +p[0] * 60 + +p[1] - before);
    return ("0" + Math.floor(m / 60)).slice(-2) + ":" + ("0" + (m % 60)).slice(-2);
  }
  var mg = [
    { id: 11, ev: EV[0], meet_time: mt(EV[0], 60), meeting_point: "Café on the main square (example)", max: 6, people: ["João P.", "Marta S."], mineCreator: false },
    { id: 12, ev: EV[1], meet_time: mt(EV[1], 45), meeting_point: "Terrace at the marina (example)", max: 4, people: ["Sofia R.", "Pieter V.", "Ana C.", "Rui M."], mineCreator: false }
  ];
  var ME = "You";
  function view(m) {
    var joined = m.people.indexOf(ME) >= 0, o = { id: m.id, event: m.ev, meet_time: m.meet_time, meeting_point: m.meeting_point, joined: joined, full: m.people.length >= m.max, mine: m.mineCreator, can_delete: m.mineCreator };
    if (joined) { o.max_people = m.max; o.participants = m.people.slice(); }   // participants only for participants
    return o;
  }
  function fail(code) { var e = new Error(code); e.code = code; return Promise.reject(e); }
  function ok(v) { return new Promise(function (r) { setTimeout(function () { r(JSON.parse(JSON.stringify(v))); }, 120); }); }
  function get(b, k) { return b instanceof FormData ? b.get(k) : b ? b[k] : null; }
  function findPost(id) { return posts.filter(function (p) { return p.id === id; })[0]; }
  function findComment(id) { var r = null; posts.forEach(function (p) { p.comments.forEach(function (c) { if (c.id === id) r = { p: p, c: c }; }); }); return r; }

  window.VAIGA_COMMUNITY_MOCK = function (method, path, body) {
    var m, q = path.split("?")[0];
    if (q === "me") return ok({ state: "member", name: ME, mod: false });
    if (q === "feed") return ok({ posts: posts, more: false });
    if (q === "posts" && method === "POST") {
      var t = String(get(body, "body") || "").trim(), ph = get(body, "photo");
      if (!t && !(ph && ph.size)) return fail("empty");
      if (t.length > 2000) return fail("too_long");
      var photo = "";
      if (ph && ph.size) {
        if (!/^image\/(jpeg|png|webp)$/.test(ph.type) || ph.size > 3 * 1048576) return fail("photo");
        photo = URL.createObjectURL(ph); // stays in this browser tab only
      }
      posts.unshift({ id: ++seq, author: ME, mine: true, can_delete: true, created: new Date().toISOString(), photo: photo, body: t, comments: [] });
      return ok({ id: seq });
    }
    if ((m = /^posts\/(\d+)$/.exec(q)) && method === "DELETE") { var p = findPost(+m[1]); if (!p || !p.mine) return fail("forbidden"); posts.splice(posts.indexOf(p), 1); return ok(true); }
    if ((m = /^posts\/(\d+)\/comments$/.exec(q))) {
      var post = findPost(+m[1]), txt = String(get(body, "body") || "").trim(), par = +(get(body, "parent_id") || 0);
      if (!post) return fail("not_found"); if (!txt) return fail("empty"); if (txt.length > 1000) return fail("too_long");
      if (par) { var pc = findComment(par); if (!pc || pc.p !== post || pc.c.parent_id) return fail("bad_parent"); }
      post.comments.push({ id: ++seq, parent_id: par, author: ME, mine: true, can_delete: true, created: new Date().toISOString(), body: txt });
      return ok({ id: seq });
    }
    if ((m = /^comments\/(\d+)$/.exec(q)) && method === "DELETE") {
      var fc = findComment(+m[1]); if (!fc || !fc.c.mine) return fail("forbidden");
      fc.p.comments = fc.p.comments.filter(function (c) { return c.id !== fc.c.id && c.parent_id !== fc.c.id; }); return ok(true);
    }
    if (q === "reports") { var rs = String(get(body, "reason") || "").trim(); if (rs.length < 3) return fail("reason"); return ok({ ok: true }); }
    if (q === "events") return ok({ events: EV, rules: { min_people: 2, max_people: 20, max_hours_before: 4 } });
    if (q === "meetgo" && method === "GET") return ok({ items: mg.map(view) });
    if (q === "meetgo" && method === "POST") {
      var e = EV.filter(function (x) { return x.id === body.event && x.date === body.date; })[0];
      if (!e) return fail("no_event");
      var tm = String(body.meet_time || "");
      if (!/^\d\d:\d\d$/.test(tm)) return fail("time");
      var a = e.start.split(":"), b = tm.split(":"), gap = (+a[0] * 60 + +a[1]) - (+b[0] * 60 + +b[1]); if (gap < 0 || gap > 240) return fail("time");
      var pt = String(body.meeting_point || "").trim();
      if (pt.length < 5 || pt.length > 160) return fail("point");
      if (/@|https?:|www\.|\+?\d[\d\s\-]{7,}/i.test(pt)) return fail("point_contact");
      if (body.public_place !== "1") return fail("public");
      var mx = +body.max_people; if (!(mx >= 2 && mx <= 20)) return fail("max");
      if (mg.some(function (x) { return x.mineCreator && x.ev.id === e.id; })) return fail("dup");
      mg.push({ id: ++seq, ev: e, meet_time: tm, meeting_point: pt, max: mx, people: [ME], mineCreator: true });
      mg.sort(function (x, y) { return (x.ev.date + x.meet_time).localeCompare(y.ev.date + y.meet_time); });
      return ok({ id: seq });
    }
    if ((m = /^meetgo\/(\d+)\/(join|leave)$/.exec(q))) {
      var g = mg.filter(function (x) { return x.id === +m[1]; })[0]; if (!g) return fail("not_found");
      if (m[2] === "join") { if (g.people.indexOf(ME) < 0) { if (g.people.length >= g.max) return fail("full"); g.people.push(ME); } }
      else { if (g.mineCreator) return fail("creator"); g.people = g.people.filter(function (n) { return n !== ME; }); }
      return ok(true);
    }
    if ((m = /^meetgo\/(\d+)$/.exec(q)) && method === "DELETE") { var d = mg.filter(function (x) { return x.id === +m[1]; })[0]; if (!d || !d.mineCreator) return fail("forbidden"); mg.splice(mg.indexOf(d), 1); return ok(true); }
    if (q === "join") return fail("preview");
    return fail("generic");
  };
})();
