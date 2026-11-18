/* VAIGA Community – PREVIEW for the static site (no server, no database). Same flow as the Latinpulse
   Community demo: visitor → sign-up form with the door (no account is made, no e-mail is sent) →
   the members' key works with any e-mail address / community name + password → example community.
   Everything lives only in this browser tab (sessionStorage); a new tab starts again from the examples.
   Events here are EXAMPLES (marked "example event"), not real VAIGA events. Names are invented.
   Same hard rules as the real community: no likes, no messages, no member search, participants of a
   Meet & Go only visible to its participants. */
window.VAIGA_COMMUNITY_CFG = { demo: true };   // preview: no server
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
  /* invented example content */
  var posts = [
    { id: 3, author: "Marta", mine: false, can_delete: false, created: iso(35), photo: "", body: "Who is going to the next Latin party? It is my first VAIGA night and I would love to go with a few people from the community 💃", comments: [
      { id: 31, parent_id: 0, author: "João", mine: false, can_delete: false, created: iso(25), body: "I am going! I created a Meet & Go for a drink before – have a look under Meet & Go." },
      { id: 32, parent_id: 31, author: "Marta", mine: false, can_delete: false, created: iso(20), body: "Great, I will join 🙂" } ] },
    { id: 2, author: "Sofia", mine: false, can_delete: false, created: iso(180), photo: "", body: "Tip for the Disco & Retro night: dress in your favourite decade. Last time the 80s outfits were amazing!", comments: [
      { id: 21, parent_id: 0, author: "Pieter", mine: false, can_delete: false, created: iso(150), body: "Agree! I am going full 70s this time." } ] },
    { id: 1, author: "João", mine: false, can_delete: false, created: iso(60 * 26), photo: "", body: "What a beautiful evening last weekend. Thank you to the organisers and the DJ – see you at the next one!", comments: [] }
  ];
  function mt(e, before) {
    var p = e.start.split(":"), m = Math.max(0, +p[0] * 60 + +p[1] - before);
    return ("0" + Math.floor(m / 60)).slice(-2) + ":" + ("0" + (m % 60)).slice(-2);
  }
  var mg = [
    { id: 11, ev: EV[0], meet_time: mt(EV[0], 60), meeting_point: "Café on the main square (example)", max: 6, people: ["João", "Marta"], mineCreator: false, comments: [
      { id: 111, parent_id: 0, author: "Ana", mine: false, can_delete: false, created: iso(90), body: "Is the café easy to find? I do not know Tavira very well." },
      { id: 112, parent_id: 111, author: "João", mine: false, can_delete: false, created: iso(70), body: "Yes, it is right on the square with the big fountain. I will wait at the terrace 🙂" } ] },
    { id: 12, ev: EV[1], meet_time: mt(EV[1], 45), meeting_point: "Terrace at the marina (example)", max: 4, people: ["Sofia", "Pieter", "Ana", "Rui"], mineCreator: false, comments: [] },
    { id: 13, ev: EV[2], meet_time: mt(EV[2], 60), meeting_point: "Bar near the beach (example)", max: 8, people: ["Ana"], mineCreator: false, comments: [] },
    { id: 14, ev: EV[0], meet_time: mt(EV[0], 120), meeting_point: "Ice-cream shop by the bridge (example)", max: 5, people: ["Rui", "Pieter"], mineCreator: false, comments: [] }
  ];
  var ME = (function () { try { return sessionStorage.getItem("vc_demo_name") || "You"; } catch (e) { return "You"; } })();
  /* example members: illustrated avatars (no real people), town and country */
  function pic(bg, fg) { return "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="' + bg + '"/><circle cx="32" cy="25" r="12" fill="' + fg + '"/><path d="M10 64c3-14 12-21 22-21s19 7 22 21z" fill="' + fg + '"/></svg>'); }
  var PROFILES = {
    "Marta": { avatar: pic("#FFD1C4", "#C8401F"), town: "Faro", country: "PT" },
    "João": { avatar: pic("#D9CCFF", "#5B33D6"), town: "Lagos", country: "PT" },
    "Sofia": { avatar: pic("#FFE3A3", "#B26B00"), town: "Tavira", country: "BR" },
    "Pieter": { avatar: pic("#CFE0F7", "#1F4F9C"), town: "Albufeira", country: "NL" },
    "Ana": { avatar: pic("#F8C8E0", "#B0216A"), town: "Portimão", country: "ES" },
    "Rui": { avatar: pic("#C9F0EC", "#0E8C82"), town: "Loulé", country: "PT" }
  };
  function myProfile() { try { var j = JSON.parse(sessionStorage.getItem("vc_demo_me") || "null"); if (j) return j; } catch (e) {} return { avatar: "", town: "", country: "" }; }
  function prof(n) { var p = n === ME ? myProfile() : (PROFILES[n] || {}); return { name: n, avatar: p.avatar || "", town: p.town || "", country: p.country || "" }; }
  function withWho(list) { return list.map(function (p) { var o = JSON.parse(JSON.stringify(p)); o.who = prof(o.author); (o.comments || []).forEach(function (c) { c.who = prof(c.author); }); return o; }); }
  var TAKEN = ["Marta", "João", "Sofia", "Pieter", "Ana", "Rui", "PartyAna"];   // names of the example members (+ one example)
  function nkey(n) { return String(n).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s._-]+/g, ""); }
  function nickOk(n) { n = String(n || "").trim(); return n.length >= 3 && n.length <= 20 && /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9 ._-]*$/.test(n) && !/\d{5,}/.test(n) && !/admin|moderat|vaiga|support|staff|oficial|official/i.test(nkey(n)); }
  function taken(n) { return TAKEN.some(function (t) { return nkey(t) === nkey(n); }); }
  var INSIDE = false;
  function inside() { if (INSIDE) return true; try { return sessionStorage.getItem("vc_demo_in") === "1"; } catch (e) { return false; } }
  function view(m) {
    var joined = m.people.indexOf(ME) >= 0, o = { id: m.id, event: m.ev, meet_time: m.meet_time, meeting_point: m.meeting_point, joined: joined, full: m.people.length >= m.max, mine: m.mineCreator, can_delete: m.mineCreator };
    if (joined) { o.max_people = m.max; o.participants = m.people.map(prof); }   // participants only for participants
    o.comments = (m.comments || []).map(function (c) { var x = JSON.parse(JSON.stringify(c)); x.who = prof(x.author); return x; });   // messages: every member can write
    return o;
  }
  function fail(code) { var e = new Error(code); e.code = code; return Promise.reject(e); }
  function ok(v) { return new Promise(function (r) { setTimeout(function () { r(JSON.parse(JSON.stringify(v))); }, 120); }); }
  function get(b, k) { return b instanceof FormData ? b.get(k) : b ? b[k] : null; }
  function findPost(id) { return posts.filter(function (p) { return p.id === id; })[0]; }
  function findComment(id) { var r = null; posts.concat(mg).forEach(function (p) { p.comments = p.comments || []; p.comments.forEach(function (c) { if (c.id === id) r = { p: p, c: c }; }); }); return r; }

  window.VAIGA_COMMUNITY_MOCK = function (method, path, body) {
    var m, q = path.split("?")[0];
    // visitor until the key is used in this tab (nothing leaves the browser)
    if (q === "me") return ok(inside() ? { state: "member", name: ME, mod: false, profile: prof(ME), invite: location.origin + location.pathname + "?ref=demo123abc#join" } : { state: "guest" });
    if (q === "name") { var nn = decodeURIComponent((path.split("n=")[1] || "").split("&")[0]); return ok({ valid: nickOk(nn), available: nickOk(nn) && !taken(nn) }); }
    if (q === "lostpw") return String(get(body, "email") || "").trim() ? ok({ ok: true }) : fail("required");
    if (q === "login") {
      var lid = String(get(body, "email") || "").trim();
      if (!lid || !String(get(body, "password") || "")) return fail("login_failed");
      if (lid.indexOf("@") < 0 && nickOk(lid) && !taken(lid)) { ME = lid; try { sessionStorage.setItem("vc_demo_name", ME); } catch (e) {} }
      try { sessionStorage.setItem("vc_demo_in", "1"); } catch (e) {} INSIDE = true; return ok({ ok: true });
    }
    if (q === "logout") { INSIDE = false; try { sessionStorage.removeItem("vc_demo_in"); } catch (e) {} return ok({ ok: true }); }
    if (q === "feed") return ok({ posts: withWho(posts), more: false });
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
    if ((m = /^meetgo\/(\d+)\/comments$/.exec(q))) {
      var g0 = mg.filter(function (x) { return x.id === +m[1]; })[0], t0 = String(get(body, "body") || "").trim(), p0 = +(get(body, "parent_id") || 0);
      if (!g0) return fail("not_found"); if (!t0) return fail("empty"); if (t0.length > 1000) return fail("too_long");
      g0.comments = g0.comments || [];
      if (p0) { var pc0 = findComment(p0); if (!pc0 || pc0.p !== g0 || pc0.c.parent_id) return fail("bad_parent"); }
      g0.comments.push({ id: ++seq, parent_id: p0, author: ME, mine: true, can_delete: true, created: new Date().toISOString(), body: t0 });
      return ok({ id: seq });
    }
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
      if (mg.some(function (x) { return x.mineCreator && x.ev.id === e.id && x.ev.date === e.date; })) return fail("dup");
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
    if (q === "join") {   // same checks as the real sign-up; no account is created, no e-mail is sent
      var g2 = function (k) { return String(get(body, k) || "").trim(); };
      if (!g2("first_name") || !g2("last_name") || !g2("name") || !g2("email") || !String(get(body, "password") || "")) return fail("required");
      if (!nickOk(g2("name"))) return fail("nick");
      if (taken(g2("name"))) return fail("name_taken");
      if (!/^\S+@\S+\.\S+$/.test(g2("email"))) return fail("email");
      if (String(get(body, "password")).length < 10) return fail("password");
      if (get(body, "adult") !== "1") return fail("adult");
      if (get(body, "accept") !== "1") return fail("accept");
      if (!g2("town")) return fail("town");
      if (!g2("country")) return fail("country");
      var face = get(body, "photo");
      if (!face || !face.size) return fail("face");
      ME = g2("name"); try { sessionStorage.setItem("vc_demo_name", ME); } catch (e) {}
      var town = g2("town"), cc = g2("country");
      return new Promise(function (res) {   // keep the (already small) face photo in this tab only
        var fr = new FileReader();
        fr.onload = function () { try { sessionStorage.setItem("vc_demo_me", JSON.stringify({ avatar: fr.result, town: town, country: cc })); } catch (e) {} res({ ok: true }); };
        fr.onerror = function () { res({ ok: true }); };
        fr.readAsDataURL(face);
      });
    }
    return fail("generic");
  };
})();
