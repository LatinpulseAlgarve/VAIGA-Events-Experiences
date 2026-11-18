/* VAIGA Community – front end. Same design and rules as the Latinpulse Community
   (WordPress plug-in latinpulse-community): a closed meeting place around VAIGA events.
   Talks to a community API (cookie + nonce) or, in the preview, to window.VAIGA_COMMUNITY_MOCK.
   Deliberately NOT here: likes, reactions, counters, popularity, private messages, member search,
   profiles, connections, matching, own groups, public participant lists, contact details. */
(function () {
  "use strict";
  var C = window.VAIGA_COMMUNITY_CFG;
  if (!C) return;

  /* ---------- texts (the site is in English) ---------- */
  var TX = {
    n_community: "Community",
    slogan: "Let's go. Let's celebrate. Together.",
    intro: "A closed meeting place for people who love VAIGA events: share experiences, photos and plans around our events, and meet up before an event to go together.",
    not_list: "Not a dating site, not a general social network and no private contact between members.",
    login: "Log in", join_h: "Become a member", join_btn: "Send request",
    f_email: "E-mail", f_pw: "Password (at least 10 characters)",
    f_accept: "I accept the community rules and the privacy policy.",
    f_all: "All fields with * are required. Your full details are only seen by the administrator who approves your request.",
    f_first: "First name", f_last: "Last name", f_birth: "Date of birth (18+)", f_town: "Town / place of residence",
    f_shown: "In the community other members only see your first name and the initial of your last name (for example: Marta S.).",
    private_h: "Private community", private_p: "The VAIGA Community is only visible to approved members. Membership is by invitation.",
    l_rules: "rules", l_privacy: "privacy", rules_full: "Read the full Community Rules",
    demo_banner: "PREVIEW – this is an example of the VAIGA Community with invented posts, people and events. Try it out: nothing is saved or sent, a reload starts again. The community opens later for approved members.",
    join_sent: "Thank you! Check your e-mail to confirm your address. After that an administrator reviews your request.",
    join_sent_in: "Thank you! An administrator reviews your request.",
    st_unverified: "Please confirm your e-mail address with the link we sent you.",
    st_pending: "Your request is waiting for approval by an administrator. You will get an e-mail.",
    st_blocked: "Your access to the community is blocked. You can object by replying to the e-mail you received.",
    tab_feed: "Feed", tab_mg: "Meet & Go", logout: "Log out", hello: "Hi {n}",
    ph_post: "Share something about our events, the music, a night out together…",
    photo: "Photo", post_btn: "Post", posting: "Posting…",
    reply: "Reply", comment_ph: "Write a reply…", send: "Send", cancel: "Cancel",
    del: "Delete", del_q: "Delete this?", yes_del: "Yes, delete", report: "Report",
    report_ph: "What is wrong? (required)", report_sent: "Thank you. A moderator will look at it.",
    mod_reason: "Reason for removal (sent to the author)",
    more: "Show older posts", empty: "No posts yet. Be the first to share something!",
    rules_h: "Community rules",
    rules: ["Only about VAIGA, our event concepts, music, going together and experiences.", "Respect everyone. No harassment, discrimination or hate.", "No dating, no requests for private contact, no advertising.", "Only share photos you may share; ask people before you post them.", "Meet & Go only at public places, linked to a VAIGA event."],
    mg_intro: "Meet before a VAIGA event for a drink or at a public meeting point, then go to the event together.",
    mg_new: "New Meet & Go", mg_event: "Event", mg_time: "Meet at", mg_point: "Public meeting point (café, square…)",
    mg_public: "This is a public place.", mg_max: "Maximum number of people", mg_create: "Create Meet & Go",
    mg_none: "No Meet & Go's yet for upcoming events.", mg_join: "Join", mg_leave: "Leave", mg_cancel: "Cancel this Meet & Go",
    mg_joined: "You are going", mg_full: "Full", mg_who: "Who is going (only visible to participants)",
    mg_meet_at: "Meet at", mg_noevents: "There are no upcoming events at the moment.",
    mg_rule_time: "At most {h} hours before the event starts.",
    e_login: "Please log in again.", e_no_access: "You have no access to the community.", e_rate: "Too many actions in a short time. Please wait a moment.",
    e_too_long: "The text is too long.", e_empty: "Please write something.", e_photo: "This photo cannot be used (JPEG, PNG or WebP, max. 3 MB).",
    e_preview: "This is only a preview.",
    e_no_event: "Please choose an upcoming VAIGA event.", e_time: "Choose a time on the event day, before the event starts (max. 4 hours before).",
    e_point: "Please describe the public meeting point (5–160 characters).", e_point_contact: "No phone numbers, e-mail addresses or links in the meeting point.",
    e_public: "Meet & Go is only possible at a public place.", e_max: "Choose 2–20 people.", e_dup: "You already created a Meet & Go for this event.",
    e_full: "This Meet & Go is full.", e_creator: "As the creator you can cancel the Meet & Go instead.", e_reason: "Please give a reason.",
    e_own: "You cannot report your own contribution.", e_not_found: "This no longer exists.", e_forbidden: "Not allowed.", e_bad_parent: "You can only reply to a comment.",
    e_generic: "Something went wrong. Please try again."
  };
  function tx(k, v) { var s = TX[k] !== undefined ? TX[k] : k; if (v) for (var x in v) s = s.split("{" + x + "}").join(v[x]); return s; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function multiline(s) { return esc(s).replace(/\n/g, "<br>"); }
  function when(iso) { try { return new Date(iso).toLocaleString(window.VAIGA_LOCALE || "en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } }
  function day(d) { try { return new Date(d + "T12:00:00Z").toLocaleDateString(window.VAIGA_LOCALE || "en-GB", { weekday: "short", day: "numeric", month: "short" }); } catch (e) { return d; } }

  /* ---------- API ---------- */
  function api(method, path, body) {
    if (C.demo && window.VAIGA_COMMUNITY_MOCK) return window.VAIGA_COMMUNITY_MOCK(method, path, body); // preview: example data in this tab only
    if (!window.fetch || !C.rest) { var e0 = new Error("generic"); e0.code = "generic"; return Promise.reject(e0); }
    var o = { method: method, credentials: "same-origin", headers: { "X-WP-Nonce": C.nonce || "" } };
    if (body instanceof FormData) o.body = body;
    else if (body) { o.headers["Content-Type"] = "application/json"; o.body = JSON.stringify(body); }
    return fetch(C.rest + path, o).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error((j && j.code) || "generic"); e.code = (j && j.code) || "generic"; throw e; }
        return j;
      });
    });
  }
  function errText(e) { var k = "e_" + ((e && e.code) || "generic"); return TX[k] ? tx(k) : tx("e_generic"); }

  var app = document.getElementById("vc-app");
  if (!app) return;
  var state = { me: null, view: "feed", posts: [], more: false, events: [], rules: null, mg: [] };
  var invited = /[?&]join=1(&|$)/.test(location.search);   // invitation link shared by the administrator

  function hero(extra) {
    return '<div class="vc-hero"><div class="vc-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><h2>VAIGA <span>Community</span></h2><p class="vc-slogan">' + esc(tx("slogan")) + "</p>" + (extra || "") + "</div>";
  }

  /* ---------- not (yet) a member ---------- */
  function joinForm(loggedIn) {
    var d = new Date(); d.setFullYear(d.getFullYear() - 18); var maxBd = d.toISOString().slice(0, 10);
    return '<form class="vc-card vc-join" id="vc-join" novalidate><h3>' + esc(tx("join_h")) + '</h3><p class="vc-hint">' + esc(tx("f_all")) + "</p>" +
      '<div class="vc-grid2"><label>' + esc(tx("f_first")) + ' *<input name="first_name" maxlength="40" autocomplete="given-name" required></label>' +
      '<label>' + esc(tx("f_last")) + ' *<input name="last_name" maxlength="40" autocomplete="family-name" required></label></div>' +
      '<div class="vc-grid2"><label>' + esc(tx("f_birth")) + ' *<input name="birthdate" type="date" max="' + maxBd + '" autocomplete="bday" required></label>' +
      '<label>' + esc(tx("f_town")) + ' *<input name="town" maxlength="60" autocomplete="address-level2" required></label></div>' +
      (loggedIn ? "" : '<label>' + esc(tx("f_email")) + ' *<input name="email" type="email" autocomplete="email" required></label><label>' + esc(tx("f_pw")) + ' *<input name="password" type="password" minlength="10" autocomplete="new-password" required></label>') +
      '<p class="vc-hint">' + esc(tx("f_shown")) + "</p>" +
      '<label class="vc-chk"><input type="checkbox" name="accept" value="1"> <span>' + esc(tx("f_accept")) + ' * (<a href="#rules">' + esc(tx("l_rules")) + '</a> · <a href="privacy.html">' + esc(tx("l_privacy")) + "</a>)</span></label>" +
      '<input name="website" class="vc-hp" tabindex="-1" autocomplete="off" aria-hidden="true"><input type="hidden" name="ts" value="' + esc(C.ts || "") + '">' +
      '<div class="vc-msg" role="status"></div><button class="btn" type="submit">' + esc(tx("join_btn")) + "</button></form>";
  }
  function bindJoin(loggedIn) {
    var f = document.getElementById("vc-join"); if (!f) return;
    f.onsubmit = function (ev) {
      ev.preventDefault();
      var fd = new FormData(f), msg = f.querySelector(".vc-msg"), b = f.querySelector("button");
      b.disabled = true;
      api("POST", "join", fd).then(function () { f.innerHTML = '<div class="vc-note vc-ok">' + esc(tx(loggedIn ? "join_sent_in" : "join_sent")) + "</div>"; })
        .catch(function (e) { msg.innerHTML = '<div class="vc-note vc-err">' + esc(errText(e)) + "</div>"; b.disabled = false; });
    };
  }
  function rulesBox() { return '<div class="vc-card vc-rules"><h3>' + esc(tx("rules_h")) + "</h3><ul>" + TX.rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + '</ul><p><a href="#rules">' + esc(tx("rules_full")) + " →</a></p></div>"; }

  function render() {
    var me = state.me;
    if (!me) { app.innerHTML = hero(); return; }
    var top = hero('<p class="vc-intro">' + esc(tx("intro")) + '</p><p class="vc-not">' + esc(tx("not_list")) + "</p>");
    var login = C.login ? '<p class="vc-center"><a class="btn" href="' + esc(C.login) + '">' + esc(tx("login")) + "</a></p>" : "";
    if (me.state === "guest" || me.state === "outsider") {
      if (invited) { app.innerHTML = top + (me.state === "guest" ? login : "") + joinForm(me.state === "outsider") + rulesBox(); bindJoin(me.state === "outsider"); return; }
      app.innerHTML = hero() + '<div class="vc-card vc-center"><h3>' + esc(tx("private_h")) + "</h3><p>" + esc(tx("private_p")) + "</p></div>" + (me.state === "guest" ? login : "");
      return;
    }
    if (me.state !== "member") {
      app.innerHTML = top + '<div class="vc-card vc-center"><p>' + esc(tx("st_" + me.state)) + "</p>" + (C.logout ? '<p><a class="btn ghost" href="' + esc(C.logout) + '">' + esc(tx("logout")) + "</a></p>" : "") + "</div>";
      return;
    }
    app.innerHTML = (C.demo ? '<div class="vc-demo" role="note">' + esc(tx("demo_banner")) + "</div>" : "") +
      hero('<p class="vc-hello">' + esc(tx("hello", { n: me.name })) + (C.logout ? ' · <a href="' + esc(C.logout) + '">' + esc(tx("logout")) + "</a>" : "") + "</p>") +
      '<div class="vc-tabs" role="tablist"><button type="button" role="tab" data-v="feed" aria-selected="' + (state.view === "feed") + '">' + esc(tx("tab_feed")) + '</button><button type="button" role="tab" data-v="mg" aria-selected="' + (state.view === "mg") + '">' + esc(tx("tab_mg")) + "</button></div>" +
      '<div id="vc-view"></div>';
    app.querySelectorAll(".vc-tabs button").forEach(function (b) { b.onclick = function () { state.view = b.dataset.v; render(); load(); }; });
    if (state.view === "feed") renderFeed(); else renderMg();
  }

  /* ---------- feed ---------- */
  function actions(kind, item, canReply) {
    var h = '<div class="vc-acts">';
    if (canReply) h += '<button type="button" class="vc-a" data-act="reply">' + esc(tx("reply")) + "</button>";
    if (item.can_delete) h += '<button type="button" class="vc-a" data-act="del">' + esc(tx("del")) + "</button>";
    if (!item.mine) h += '<button type="button" class="vc-a" data-act="report">' + esc(tx("report")) + "</button>";
    return h + '</div><div class="vc-inline"></div>';
  }
  function commentHtml(c, replies) {
    return '<div class="vc-c" data-kind="comment" data-id="' + c.id + '"><div class="vc-meta"><b>' + esc(c.author) + "</b> · " + esc(when(c.created)) + '</div><div class="vc-body">' + multiline(c.body) + "</div>" + actions("comment", c, !c.parent_id) +
      (replies && replies.length ? '<div class="vc-replies">' + replies.map(function (r) { return commentHtml(r, null); }).join("") + "</div>" : "") + "</div>";
  }
  function postHtml(p) {
    var top = p.comments.filter(function (c) { return !c.parent_id; });
    return '<article class="vc-card vc-post" data-kind="post" data-id="' + p.id + '"><div class="vc-meta"><b>' + esc(p.author) + "</b> · " + esc(when(p.created)) + "</div>" +
      (p.body ? '<div class="vc-body">' + multiline(p.body) + "</div>" : "") +
      (p.photo ? '<img class="vc-photo" src="' + esc(p.photo) + '" alt="" loading="lazy" decoding="async">' : "") +
      actions("post", p, true) +
      '<div class="vc-comments">' + top.map(function (c) { return commentHtml(c, p.comments.filter(function (r) { return r.parent_id === c.id; })); }).join("") + "</div></article>";
  }
  function renderFeed() {
    var v = document.getElementById("vc-view"); if (!v) return;
    v.innerHTML = '<form class="vc-card vc-compose" id="vc-compose"><textarea name="body" maxlength="2000" rows="3" placeholder="' + esc(tx("ph_post")) + '" aria-label="' + esc(tx("ph_post")) + '"></textarea>' +
      '<div class="vc-row"><label class="btn ghost small vc-file">📷 ' + esc(tx("photo")) + '<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" hidden></label><span class="vc-fname"></span><button class="btn small" type="submit">' + esc(tx("post_btn")) + '</button></div><div class="vc-msg" role="status"></div></form>' +
      '<div id="vc-posts">' + (state.posts.length ? state.posts.map(postHtml).join("") : '<p class="vc-empty">' + esc(tx("empty")) + "</p>") + "</div>" +
      (state.more ? '<p class="vc-center"><button type="button" class="btn ghost" id="vc-more">' + esc(tx("more")) + "</button></p>" : "") + rulesBox();
    var f = document.getElementById("vc-compose");
    var fi = f.querySelector('input[type="file"]');
    fi.onchange = function () { f.querySelector(".vc-fname").textContent = fi.files[0] ? fi.files[0].name : ""; };
    f.onsubmit = function (ev) {
      ev.preventDefault();
      var b = f.querySelector('button[type="submit"]'), msg = f.querySelector(".vc-msg");
      b.disabled = true; b.textContent = tx("posting");
      var fd = new FormData(); fd.append("body", f.body.value); if (fi.files[0]) fd.append("photo", fi.files[0]);
      api("POST", "posts", fd).then(function () { loadFeed(true); }).catch(function (e) { msg.innerHTML = '<div class="vc-note vc-err">' + esc(errText(e)) + "</div>"; b.disabled = false; b.textContent = tx("post_btn"); });
    };
    var m = document.getElementById("vc-more");
    if (m) m.onclick = function () { var last = state.posts[state.posts.length - 1]; api("GET", "feed?before=" + (last ? last.id : 0)).then(function (j) { state.posts = state.posts.concat(j.posts); state.more = j.more; renderFeed(); }); };
    bindItems(v);
  }

  /* inline forms (no browser dialogs): reply, delete confirmation, report, moderator reason */
  function bindItems(root) {
    root.querySelectorAll(".vc-acts").forEach(function (acts) {
      var item = acts.parentNode, box = acts.nextElementSibling, kind = item.dataset.kind, id = +item.dataset.id;
      acts.querySelectorAll("button").forEach(function (b) {
        b.onclick = function () {
          var act = b.dataset.act;
          if (act === "reply") {
            box.innerHTML = '<form class="vc-mini"><textarea maxlength="1000" rows="2" placeholder="' + esc(tx("comment_ph")) + '" aria-label="' + esc(tx("comment_ph")) + '"></textarea><div class="vc-row"><button class="btn small" type="submit">' + esc(tx("send")) + '</button><button class="btn ghost small" type="button" data-x>' + esc(tx("cancel")) + '</button></div><div class="vc-msg"></div></form>';
            var fm = box.querySelector("form"), ta = fm.querySelector("textarea"); ta.focus();
            fm.onsubmit = function (ev) {
              ev.preventDefault();
              var postId = kind === "post" ? id : +item.closest(".vc-post").dataset.id;
              api("POST", "posts/" + postId + "/comments", { body: ta.value, parent_id: kind === "comment" ? id : 0 }).then(function () { loadFeed(true); })
                .catch(function (e) { fm.querySelector(".vc-msg").innerHTML = '<div class="vc-note vc-err">' + esc(errText(e)) + "</div>"; });
            };
          } else if (act === "del") {
            var mine = !acts.querySelector('[data-act="report"]');
            box.innerHTML = '<form class="vc-mini"><p>' + esc(tx("del_q")) + "</p>" + (mine ? "" : '<input maxlength="200" placeholder="' + esc(tx("mod_reason")) + '" required>') + '<div class="vc-row"><button class="btn small vc-danger" type="submit">' + esc(tx("yes_del")) + '</button><button class="btn ghost small" type="button" data-x>' + esc(tx("cancel")) + '</button></div><div class="vc-msg"></div></form>';
            var fd = box.querySelector("form");
            fd.onsubmit = function (ev) {
              ev.preventDefault();
              var r = fd.querySelector("input"), path = (kind === "post" ? "posts/" : kind === "comment" ? "comments/" : "meetgo/") + id + (r ? "?reason=" + encodeURIComponent(r.value) : "");
              api("DELETE", path).then(function () { kind === "meetgo" ? loadMg() : loadFeed(true); })
                .catch(function (e) { fd.querySelector(".vc-msg").innerHTML = '<div class="vc-note vc-err">' + esc(errText(e)) + "</div>"; });
            };
          } else if (act === "report") {
            box.innerHTML = '<form class="vc-mini"><textarea maxlength="500" rows="2" placeholder="' + esc(tx("report_ph")) + '" aria-label="' + esc(tx("report_ph")) + '" required></textarea><div class="vc-row"><button class="btn small" type="submit">' + esc(tx("report")) + '</button><button class="btn ghost small" type="button" data-x>' + esc(tx("cancel")) + '</button></div><div class="vc-msg"></div></form>';
            var fr = box.querySelector("form");
            fr.onsubmit = function (ev) {
              ev.preventDefault();
              api("POST", "reports", { type: kind, id: id, reason: fr.querySelector("textarea").value }).then(function () { box.innerHTML = '<div class="vc-note vc-ok">' + esc(tx("report_sent")) + "</div>"; })
                .catch(function (e) { fr.querySelector(".vc-msg").innerHTML = '<div class="vc-note vc-err">' + esc(errText(e)) + "</div>"; });
            };
          }
          var x = box.querySelector("[data-x]"); if (x) x.onclick = function () { box.innerHTML = ""; };
        };
      });
    });
  }

  /* ---------- Meet & Go ---------- */
  function evLabel(e) { return day(e.date) + " · " + e.title + " · " + e.city; }
  function who(m) { return m.participants ? '<div class="vc-who"><b>' + esc(tx("mg_who")) + "</b><ul>" + m.participants.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></div>" : ""; }
  function mgHtml(m) {
    var e = m.event, h = '<article class="vc-card vc-mg" data-kind="meetgo" data-id="' + m.id + '"><div class="vc-mg-ev"><b>' + esc(e.title) + "</b><span>" + esc(day(e.date)) + " · " + esc(e.start) + " · " + esc(e.venue) + ", " + esc(e.city) + "</span></div>" +
      '<p class="vc-mg-meet">🕒 <span>' + esc(tx("mg_meet_at")) + '</span> <b>' + esc(m.meet_time) + '</b> · ' + esc(m.meeting_point) + "</p>";
    if (m.joined) {
      h += '<p class="vc-badge">✓ ' + esc(tx("mg_joined")) + "</p>" + who(m);
      h += '<div class="vc-row">' + (m.mine ? "" : '<button type="button" class="btn ghost small" data-mg="leave">' + esc(tx("mg_leave")) + "</button>") + "</div>";
    } else if (m.full) {
      h += '<p class="vc-badge vc-full">' + esc(tx("mg_full")) + "</p>" + who(m);
    } else {
      h += '<div class="vc-row"><button type="button" class="btn small" data-mg="join">' + esc(tx("mg_join")) + "</button></div>" + who(m);
    }
    h += '<div class="vc-acts">' + (m.can_delete ? '<button type="button" class="vc-a" data-act="del">' + esc(m.mine ? tx("mg_cancel") : tx("del")) + "</button>" : "") + (m.mine ? "" : '<button type="button" class="vc-a" data-act="report">' + esc(tx("report")) + "</button>") + '</div><div class="vc-inline"></div><div class="vc-msg"></div></article>';
    return h;
  }
  function renderMg() {
    var v = document.getElementById("vc-view"); if (!v) return;
    var r = state.rules || { min_people: 2, max_people: 20, max_hours_before: 4 };
    var opts = state.events.map(function (e, i) { return '<option value="' + i + '">' + esc(evLabel(e)) + "</option>"; }).join("");
    v.innerHTML = '<p class="vc-intro2">' + esc(tx("mg_intro")) + "</p>" +
      (state.events.length ? '<form class="vc-card vc-mgform" id="vc-mgform"><h3>' + esc(tx("mg_new")) + "</h3>" +
        '<label>' + esc(tx("mg_event")) + '<select name="ev">' + opts + "</select></label>" +
        '<div class="vc-grid2"><label>' + esc(tx("mg_time")) + '<input type="time" name="meet_time" required><small class="vc-hint"></small></label>' +
        '<label>' + esc(tx("mg_max")) + '<input type="number" name="max_people" min="' + r.min_people + '" max="' + r.max_people + '" value="6" required></label></div>' +
        '<label>' + esc(tx("mg_point")) + '<input name="meeting_point" maxlength="160" required></label>' +
        '<label class="vc-chk"><input type="checkbox" name="public_place" value="1"> <span>' + esc(tx("mg_public")) + "</span></label>" +
        '<div class="vc-msg" role="status"></div><button class="btn" type="submit">' + esc(tx("mg_create")) + "</button></form>"
        : '<p class="vc-empty">' + esc(tx("mg_noevents")) + "</p>") +
      '<div id="vc-mglist">' + (state.mg.length ? state.mg.map(mgHtml).join("") : '<p class="vc-empty">' + esc(tx("mg_none")) + "</p>") + "</div>";
    var f = document.getElementById("vc-mgform");
    if (f) {
      var setTime = function () {
        var e = state.events[+f.ev.value]; if (!e) return;
        f.querySelector(".vc-hint").textContent = tx("mg_rule_time", { h: r.max_hours_before });
        if (e.start && /^\d\d:\d\d$/.test(e.start)) { var p = e.start.split(":"), mins = Math.max(0, +p[0] * 60 + +p[1] - 60); f.meet_time.value = ("0" + Math.floor(mins / 60)).slice(-2) + ":" + ("0" + (mins % 60)).slice(-2); f.meet_time.max = e.start; }
      };
      f.ev.onchange = setTime; setTime();
      f.onsubmit = function (ev) {
        ev.preventDefault();
        var e = state.events[+f.ev.value], msg = f.querySelector(".vc-msg");
        api("POST", "meetgo", { event: e.id, date: e.date, meet_time: f.meet_time.value, meeting_point: f.meeting_point.value, max_people: f.max_people.value, public_place: f.public_place.checked ? "1" : "0" })
          .then(loadMg)
          .catch(function (er) { msg.innerHTML = '<div class="vc-note vc-err">' + esc(errText(er)) + "</div>"; });
      };
    }
    v.querySelectorAll("[data-mg]").forEach(function (b) {
      b.onclick = function () {
        var card = b.closest(".vc-mg");
        api("POST", "meetgo/" + card.dataset.id + "/" + b.dataset.mg).then(loadMg).catch(function (e) { card.querySelector(".vc-msg").innerHTML = '<div class="vc-note vc-err">' + esc(errText(e)) + "</div>"; });
      };
    });
    bindItems(v);
  }

  /* ---------- loading ---------- */
  function loadFeed(redraw) { return api("GET", "feed").then(function (j) { state.posts = j.posts; state.more = j.more; if (redraw !== false) renderFeed(); }); }
  function loadMg() {
    return Promise.all([api("GET", "events"), api("GET", "meetgo")]).then(function (r) { state.events = r[0].events; state.rules = r[0].rules; state.mg = r[1].items; renderMg(); });
  }
  function load() {
    if (!state.me || state.me.state !== "member") return;
    (state.view === "feed" ? loadFeed() : loadMg()).catch(function (e) { var v = document.getElementById("vc-view"); if (v) v.innerHTML = '<div class="vc-note vc-err">' + esc(errText(e)) + "</div>"; });
  }
  api("GET", "me").then(function (j) { state.me = j; render(); load(); }).catch(function () { state.me = { state: "guest" }; render(); });
})();
