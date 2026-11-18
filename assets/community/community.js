/* VAIGA Community – front end. Same design, flow and rules as the Latinpulse Community (WordPress
   plug-in latinpulse-community, demo on Cloudflare): public information page → sign-up form with the
   DOOR underneath ("Knock here – Welcome") → members' KEY (log in on the page itself, with "Forgot your
   password?") → the community (Feed + Meet & Go). Open sign-up: first + last name (only for the
   administrator), unique community name, face photo, town, country, e-mail, password, 18+, rules.
   Talks to a community API (cookie + nonce) or, in the preview, to window.VAIGA_COMMUNITY_MOCK.
   The site is written in English; assets/js/i18n.js translates the texts (assets/i18n/translations.js).
   Deliberately NOT here: likes, reactions, counters, popularity, private messages, member search,
   profiles, connections, matching, own groups, public participant lists, contact details. */
(function () {
  "use strict";
  var C = window.VAIGA_COMMUNITY_CFG;
  if (!C) return;

  /* ---------- texts (English; translated by i18n.js) ---------- */
  var TX = {
    slogan: "Let's go. Let's celebrate. Together.",
    join_h: "Become a member",
    f_all: "All fields with * are required. Fill in the form and knock on the door.",
    f_first: "First name", f_last: "Last name", f_town: "Town / place of residence",
    f_nick: "Your community name", f_nick_hint: "This is the name other members see. 3–20 letters or digits, for example PartyAna.",
    nick_ok: "✓ This name is available.", e_name_taken: "This name is no longer available. Please choose another name.",
    e_nick: "This name is not allowed: use 3–20 letters or digits, starting with a letter (no e-mail, phone number or link).",
    f_country: "Country", f_country_ph: "Choose your country",
    f_face: "Photo of your face", f_face_hint: "A clear, recent photo of your own face, without other people. It is shown next to your name.",
    f_face_btn: "Take or choose a photo", f_face_change: "Choose another photo",
    f_email: "E-mail", f_pw: "Password (at least 10 characters)",
    f_shown: "Other members see your community name, face photo, town and country flag. Your first and last name and e-mail address are only seen by the administrator.",
    f_adult: "I am 18 years or older.", f_accept: "I accept the community rules and the privacy policy.",
    l_rules: "Community rules", l_privacy: "Privacy policy",
    door_knock: "Knock here", door_welcome: "Welcome", door_label: "Knock here – Welcome: send my sign-up",
    key_h: "Members' key", key_new: "Already a member? Use your key.", key_back: "Welcome back! Use your key to enter.",
    key_enter: "Enter", f_login_id: "Community name or e-mail", f_pw_login: "Password",
    lost_q: "Forgot your password?", lost_p: "Enter your community name or e-mail address. We will send you an e-mail with a link to choose a new password.",
    lost_btn: "Send link", lost_back: "Back to log in",
    lost_sent: "If this account exists, we have sent an e-mail with a link to choose a new password. Also check your spam folder.",
    lost_demo: "Preview: no e-mail is sent. In the preview you can enter with any password.",
    demo_mail: "Preview: no e-mail is sent. You can use your key right away (any e-mail address and password).",
    join_sent: "Welcome! We sent you an e-mail. Click the link in it to confirm your address – then use your key to enter the community.",
    invited: "You have been invited to the VAIGA Community! Fill in the form and knock on the door.",
    demo_banner: "PREVIEW – this is an example of the VAIGA Community with invented posts, people and events. Try it out: nothing is saved or sent, a new tab starts again.",
    st_unverified: "Please confirm your e-mail address with the link we sent you.",
    st_blocked: "Your access to the community is blocked. You can object by replying to the e-mail you received.",
    tab_feed: "Feed", tab_mg: "Meet & Go", logout: "Log out", hello: "Welcome back, {n}",
    inv_h: "Invite a friend", inv_p: "Share your personal invitation link. Everyone signs up the same way (face photo, e-mail confirmation) and follows the community rules.",
    inv_share: "Share", inv_copy: "Copy link", inv_copied: "Link copied ✓", inv_msg: "Join me in the VAIGA Community! Let's go. Let's celebrate.",
    ph_post: "Share something about our events, the music, a night out together…",
    photo: "Photo", post_btn: "Post", posting: "Posting…",
    reply: "Reply", comment_ph: "Write a reply…", send: "Send", cancel: "Cancel",
    del: "Delete", del_q: "Delete this?", yes_del: "Yes, delete", report: "Report",
    report_ph: "What is wrong? (required)", report_sent: "Thank you. A moderator will look at it.",
    mod_reason: "Reason for removal (sent to the author)",
    more: "Show older posts", empty: "No posts yet. Be the first to share something!",
    rules_h: "Community rules", rules_full: "Read the full Community Rules",
    rules: ["Only about VAIGA, our event concepts, music, going together and experiences.", "Respect everyone. No harassment, discrimination or hate.", "No dating, no requests for private contact, no advertising.", "Only share photos you may share; ask people before you post them.", "Meet & Go only at public places, linked to a VAIGA event."],
    mg_intro: "Meet before a VAIGA event for a drink or at a public meeting point, then go to the event together.", mg_rules: "Meet & Go rules",
    mg_new: "New Meet & Go", mg_event: "Event", mg_time: "Meet at", mg_point: "Public meeting point (café, square…)",
    mg_public: "This is a public place.", mg_max: "Maximum number of people", mg_create: "Create Meet & Go",
    mg_none: "No Meet & Go's yet for upcoming events.", mg_join: "Join", mg_leave: "Leave", mg_cancel: "Cancel this Meet & Go",
    mg_joined: "You are going", mg_full: "Full", mg_who: "Who is going (only visible to participants)",
    mg_meet_at: "Meet at", mg_noevents: "There are no upcoming events at the moment.",
    mg_rule_time: "At most {h} hours before the event starts.",
    mg_next: "Coming up: Meet & Go", mg_all: "All Meet & Go's", mg_add: "+ New Meet & Go",
    mg_order: "Always in date order: the first meeting is at the top. Past meetings disappear automatically.",
    mg_write: "Write a message", mg_msgs: "Messages about this Meet & Go", ph_mg: "A question or message about this Meet & Go…",
    d_today: "Today", d_tomorrow: "Tomorrow", d_in: "In {n} days",
    e_login_failed: "E-mail address or password is not correct.", e_unverified: "Please confirm your e-mail address first with the link in your mailbox.",
    e_face: "Please add a photo of your face.", e_country: "Please choose your country.", e_town: "Please enter your town (2–60 characters).",
    e_adult: "You must be 18 or older to join.",
    e_login: "Please log in again.", e_no_access: "You have no access to the community.", e_rate: "Too many actions in a short time. Please wait a moment.",
    e_too_long: "The text is too long.", e_empty: "Please write something.", e_photo: "This photo cannot be used (JPEG, PNG or WebP, max. 3 MB).",
    e_name: "Please enter your first and last name (letters only).", e_email: "Please enter a valid e-mail address.",
    e_password: "The password needs at least 10 characters.", e_accept: "Please accept the community rules and the privacy policy.",
    e_required: "Please fill in all fields.", e_spam: "Please wait a few seconds and try again.", e_state: "You already sent a request.",
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
  var LOC = window.VAIGA_LOCALE || "en-GB";
  function when(iso) { try { return new Date(iso).toLocaleString(LOC, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } }
  function day(d) { try { return new Date(d + "T12:00:00Z").toLocaleDateString(LOC, { weekday: "short", day: "numeric", month: "short" }); } catch (e) { return d; } }
  /* Meet & Go in date order (agenda principle): never sorted by when it was posted, so nothing sinks away */
  function todayIso() { var t = new Date(); return t.getFullYear() + "-" + ("0" + (t.getMonth() + 1)).slice(-2) + "-" + ("0" + t.getDate()).slice(-2); }
  function relDay(d) {
    var n = Math.round((Date.parse(d + "T12:00:00Z") - Date.parse(todayIso() + "T12:00:00Z")) / 864e5);
    return n <= 0 ? tx("d_today") : n === 1 ? tx("d_tomorrow") : tx("d_in", { n: n });
  }
  function upcomingMg() {
    var t = todayIso();
    return (state.mg || []).filter(function (m) { return m.event && m.event.date >= t; })
      .sort(function (a, b) { return (a.event.date + " " + a.meet_time).localeCompare(b.event.date + " " + b.meet_time) || a.id - b.id; });
  }
  var COUNTRIES = "AD AE AF AG AI AL AM AO AR AT AU AW AZ BA BB BD BE BF BG BH BI BJ BM BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CW CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FR GA GB GD GE GH GI GM GN GQ GR GT GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KM KN KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MK ML MM MN MO MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NZ OM PA PE PG PH PK PL PR PS PT PY QA RO RS RU RW SA SC SD SE SG SI SK SL SM SN SO SR ST SV SY SZ TD TG TH TJ TL TM TN TR TT TW TZ UA UG US UY UZ VA VC VE VN YE ZA ZM ZW".split(" ");
  function flag(cc) { return /^[A-Z]{2}$/.test(cc || "") ? String.fromCodePoint(127397 + cc.charCodeAt(0), 127397 + cc.charCodeAt(1)) : ""; }
  function cname(cc) { try { return new Intl.DisplayNames([LOC], { type: "region" }).of(cc) || cc; } catch (e) { return cc; } }
  /* how a member appears in the community: face photo, community name, town + country flag */
  function whoHtml(o) {
    if (typeof o === "string") o = { name: o };
    o = o || {};
    var place = (o.town ? esc(o.town) : "") + (o.country ? ' <span class="vc-flag" title="' + esc(cname(o.country)) + '">' + flag(o.country) + "</span>" : "");
    return '<span class="vc-whoi" data-no-i18n>' + (o.avatar ? '<img class="vc-av" src="' + esc(o.avatar) + '" alt="" loading="lazy" decoding="async">' : '<span class="vc-av vc-av0" aria-hidden="true">' + esc((o.name || "?").charAt(0).toUpperCase()) + "</span>") +
      '<span class="vc-whot"><b>' + esc(o.name || "") + "</b>" + (place ? "<small>" + place + "</small>" : "") + "</span></span>";
  }

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
  function note(cls, text) { return '<div class="vc-note vc-' + cls + '">' + esc(text) + "</div>"; }

  var app = document.getElementById("vc-app");
  if (!app) return;
  var info = document.getElementById("vc-info");        // public information block (visitors only)
  var keyTopEl = document.getElementById("vc-keytop");  // returning visitors: the key at the top of the page
  var state = { me: null, view: "feed", posts: [], more: false, events: [], rules: null, mg: [] };

  function hero(extra) {
    return '<div class="vc-hero"><div class="vc-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><h2>VAIGA <span>Community</span></h2><p class="vc-slogan">' + esc(tx("slogan")) + "</p>" + (extra || "") + "</div>";
  }

  /* ---------- visitor: sign-up form with the door underneath ---------- */
  var REF = (function () {
    var m = /[?&]ref=([a-z0-9]{10})(&|$)/i.exec(location.search);
    try { if (m) sessionStorage.setItem("vc_ref", m[1].toLowerCase()); return (sessionStorage.getItem("vc_ref") || "").toLowerCase(); } catch (e) { return m ? m[1].toLowerCase() : ""; }
  })();
  function countryOptions() {
    var list = COUNTRIES.filter(function (c) { return c !== "PT"; }).sort(function (a, b) { return cname(a).localeCompare(cname(b), LOC); });
    return ["PT"].concat(list).map(function (c) { return '<option value="' + c + '">' + flag(c) + " " + esc(cname(c)) + "</option>"; }).join("");
  }
  function joinForm() {
    return '<form class="vc-card vc-join" id="vc-join" novalidate><h3>' + esc(tx("join_h")) + '</h3><p class="vc-hint">' + esc(tx("f_all")) + "</p>" +
      '<div class="vc-grid2"><label>' + '<span>' + esc(tx("f_first")) + '</span> *<input name="first_name" maxlength="40" autocomplete="given-name" required></label>' +
      '<label>' + '<span>' + esc(tx("f_last")) + '</span> *<input name="last_name" maxlength="40" autocomplete="family-name" required></label></div>' +
      '<label>' + '<span>' + esc(tx("f_nick")) + '</span> *<input name="name" maxlength="20" autocomplete="nickname" required aria-describedby="vc-nick-msg"></label>' +
      '<p class="vc-hint vc-nick" id="vc-nick-msg" aria-live="polite">' + esc(tx("f_nick_hint")) + "</p>" +
      '<div class="vc-grid2"><label>' + '<span>' + esc(tx("f_town")) + '</span> *<input name="town" maxlength="60" autocomplete="address-level2" required></label>' +
      '<label>' + '<span>' + esc(tx("f_country")) + '</span> *<select name="country" required><option value="">' + esc(tx("f_country_ph")) + "</option>" + countryOptions() + "</select></label></div>" +
      '<div class="vc-face"><span class="vc-face-pv" aria-hidden="true"><svg viewBox="0 0 24 24" width="44" height="44"><circle cx="12" cy="9" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 21c1.4-4 4.4-6 8-6s6.6 2 8 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>' +
      '<div><b>' + '<span>' + esc(tx("f_face")) + '</span> *</b><p class="vc-hint">' + esc(tx("f_face_hint")) + '</p><label class="vc-face-btn"><span>' + esc(tx("f_face_btn")) + '</span><input name="photo" type="file" accept="image/jpeg,image/png,image/webp" capture="user" hidden></label></div></div>' +
      '<label>' + '<span>' + esc(tx("f_email")) + '</span> *<input name="email" type="email" autocomplete="email" required></label>' +
      '<label>' + '<span>' + esc(tx("f_pw")) + '</span> *<input name="password" type="password" minlength="10" autocomplete="new-password" required></label>' +
      '<p class="vc-hint">' + esc(tx("f_shown")) + "</p>" +
      '<label class="vc-chk"><input type="checkbox" name="adult" value="1"> <span><span>' + esc(tx("f_adult")) + "</span> *</span></label>" +
      '<label class="vc-chk"><input type="checkbox" name="accept" value="1"> <span><span>' + esc(tx("f_accept")) + '</span> *</span></label>' +
      '<p class="vc-links"><a href="community-rules.html" target="_blank" rel="noopener">' + esc(tx("l_rules")) + '</a> · <a href="privacy.html" target="_blank" rel="noopener">' + esc(tx("l_privacy")) + "</a></p>" +
      '<input name="website" class="vc-hp" tabindex="-1" autocomplete="off" aria-hidden="true"><input type="hidden" name="ref" value="' + esc(REF) + '">' +
      '<div class="vc-msg" role="status"></div>' +
      /* the DOOR is the send button, directly under the sign-up form: the animated VAIGA door ("Welkom bij VAIGA – Knock here", GIF of the user) */
      '<button class="vc-door vc-gifdoor" type="submit" aria-label="' + esc(tx("door_label")) + '"><img src="assets/community/img/vaiga-door.gif" alt="" width="414" height="414" decoding="async"></button></form>';
  }
  function remember() { try { localStorage.setItem("vc_key", "1"); } catch (e) {} }
  function remembered() { try { return localStorage.getItem("vc_key") === "1"; } catch (e) { return false; } }
  function bindJoin() {
    var f = document.getElementById("vc-join"); if (!f) return;
    var nk = f.querySelector('input[name="name"]'), nm = f.querySelector(".vc-nick"), timer = null;
    function nickMsg(cls, text) { nm.className = "vc-hint vc-nick" + (cls ? " " + cls : ""); nm.textContent = text; }
    nk.oninput = function () {
      clearTimeout(timer); var v = nk.value.trim();
      if (v.length < 3) { nickMsg("", tx("f_nick_hint")); return; }
      timer = setTimeout(function () {
        api("GET", "name?n=" + encodeURIComponent(v)).then(function (j) {
          if (nk.value.trim() !== v) return;
          if (!j.valid) nickMsg("vc-bad", tx("e_nick")); else if (!j.available) nickMsg("vc-bad", tx("e_name_taken")); else nickMsg("vc-good", tx("nick_ok"));
        }).catch(function () {});
      }, 400);
    };
    var face = null, fin = f.querySelector('input[name="photo"]'), pv = f.querySelector(".vc-face-pv"), fbtn = f.querySelector(".vc-face-btn span");
    fin.onchange = function () {
      var file = fin.files && fin.files[0]; if (!file) return;
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {   // square crop to 600 px JPEG in the browser (the server re-encodes without EXIF/GPS)
        var sz = Math.min(im.naturalWidth, im.naturalHeight), cv = document.createElement("canvas"); cv.width = cv.height = 600;
        cv.getContext("2d").drawImage(im, (im.naturalWidth - sz) / 2, (im.naturalHeight - sz) / 2, sz, sz, 0, 0, 600, 600);
        URL.revokeObjectURL(url);
        cv.toBlob(function (bl) { face = bl; pv.innerHTML = '<img src="' + cv.toDataURL("image/jpeg", 0.7) + '" alt="">'; fbtn.textContent = tx("f_face_change"); }, "image/jpeg", 0.85);
      };
      im.onerror = function () { URL.revokeObjectURL(url); face = null; f.querySelector(".vc-msg").innerHTML = note("err", tx("e_photo")); };
      im.src = url;
    };
    f.onsubmit = function (ev) {
      ev.preventDefault();
      var fd = new FormData(f), msg = f.querySelector(".vc-msg"), b = f.querySelector(".vc-door");
      fd.delete("photo");
      if (!face) { msg.innerHTML = note("err", tx("e_face")); fbtn.parentNode.focus(); return; }
      fd.set("photo", face, "face.jpg");
      if (b.disabled) return;
      b.disabled = true; b.classList.remove("vc-knock"); void b.offsetWidth; b.classList.add("vc-knock");
      api("POST", "join", fd).then(function () {
        remember(); b.classList.add("vc-open");
        setTimeout(function () {
          f.innerHTML = note("ok", tx("join_sent")) + (C.demo ? '<p class="vc-hint">' + esc(tx("demo_mail")) + "</p>" : "");
          var k = document.getElementById("vc-key"); if (k) { k.querySelector("#vc-login").hidden = false; k.querySelector(".vc-key").setAttribute("aria-expanded", "true"); k.scrollIntoView({ behavior: "smooth", block: "center" }); }
        }, 800);
      }).catch(function (e) {
        msg.innerHTML = note("err", errText(e)); b.disabled = false;
        if (e && (e.code === "name_taken" || e.code === "nick")) { nickMsg("vc-bad", errText(e)); nk.focus(); nk.select(); }
      });
    };
  }

  /* ---------- the members' key: log in on the page itself ---------- */
  var KEY_SVG = '<svg viewBox="0 0 64 32" width="56" height="28" aria-hidden="true"><circle cx="14" cy="16" r="10" fill="none" stroke="currentColor" stroke-width="5"/><path d="M24 16h36M50 16v9M58 16v7" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>';
  function keyBox(open) {
    return '<div class="vc-card vc-keybox" id="vc-key"><button type="button" class="vc-key" aria-expanded="' + open + '">' + KEY_SVG + "<span><b>" + esc(tx("key_h")) + "</b><small>" + esc(tx(remembered() ? "key_back" : "key_new")) + "</small></span></button>" +
      '<form id="vc-login" novalidate' + (open ? "" : " hidden") + '><label>' + esc(tx("f_login_id")) + '<input name="email" autocomplete="username" autocapitalize="off" spellcheck="false" required></label>' +
      '<label>' + esc(tx("f_pw_login")) + '<input name="password" type="password" autocomplete="current-password" required></label>' +
      '<div class="vc-msg" role="status"></div><button class="btn" type="submit">' + esc(tx("key_enter")) + '</button><p class="vc-forgot"><button type="button" class="vc-lnk" data-lost="1">' + esc(tx("lost_q")) + "</button></p></form>" +
      '<form id="vc-lost" novalidate hidden><p class="vc-hint">' + esc(tx("lost_p")) + '</p><label>' + esc(tx("f_login_id")) + '<input name="email" autocomplete="username" autocapitalize="off" spellcheck="false" required></label>' +
      '<div class="vc-msg" role="status"></div><button class="btn" type="submit">' + esc(tx("lost_btn")) + '</button><p class="vc-forgot"><button type="button" class="vc-lnk" data-lost="0">' + esc(tx("lost_back")) + "</button></p></form></div>";
  }
  function bindKey() {
    var k = document.getElementById("vc-key"); if (!k) return;
    var f = k.querySelector("#vc-login"), lf = k.querySelector("#vc-lost"), t = k.querySelector(".vc-key");
    t.onclick = function () { var open = f.hidden && lf.hidden; f.hidden = !open; lf.hidden = true; t.setAttribute("aria-expanded", open); if (open) f.querySelector("input").focus(); };
    Array.prototype.forEach.call(k.querySelectorAll("[data-lost]"), function (b) {
      b.onclick = function () {
        var lost = b.getAttribute("data-lost") === "1";
        if (lost && f.email.value.trim()) lf.email.value = f.email.value.trim();
        f.hidden = lost; lf.hidden = !lost; (lost ? lf : f).querySelector("input").focus();
      };
    });
    /* forgot password: a reset link by e-mail (the answer never says whether the account exists) */
    lf.onsubmit = function (ev) {
      ev.preventDefault();
      var msg = lf.querySelector(".vc-msg"), b = lf.querySelector("button[type=submit]"), id = lf.email.value.trim();
      if (!id) { msg.innerHTML = note("err", tx("e_required")); return; }
      b.disabled = true;
      api("POST", "lostpw", { email: id }).then(function () {
        // the preview has no mail server: say so plainly instead of claiming that an e-mail was sent
        msg.innerHTML = C.demo ? note("ok", tx("lost_demo")) : note("ok", tx("lost_sent"));
        b.hidden = true;
      }).catch(function (e) { msg.innerHTML = note("err", errText(e)); b.disabled = false; });
    };
    f.onsubmit = function (ev) {
      ev.preventDefault();
      var msg = f.querySelector(".vc-msg"), b = f.querySelector("button[type=submit]");
      b.disabled = true;
      api("POST", "login", { email: f.email.value.trim(), password: f.password.value }).then(function () {
        remember();
        if (C.demo) { start(true); } else { location.hash = "#join"; location.reload(); }   // fresh session + nonce
      }).catch(function (e) { msg.innerHTML = note("err", errText(e)); b.disabled = false; });
    };
  }
  function rulesBox() {
    return '<div class="vc-card vc-rules"><h3>' + esc(tx("rules_h")) + "</h3><ul>" + TX.rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") +
      '</ul><p><a href="community-rules.html">' + esc(tx("rules_full")) + " →</a></p></div>";
  }
  function inviteBox(url) {
    if (!url) return "";
    var msg = tx("inv_msg") + " " + url;
    return '<details class="vc-card vc-invite"><summary><b>✉️ ' + esc(tx("inv_h")) + '</b></summary><p class="vc-hint">' + esc(tx("inv_p")) + "</p>" +
      '<input class="vc-invurl" readonly value="' + esc(url) + '" aria-label="' + esc(tx("inv_h")) + '" data-no-i18n>' +
      '<div class="vc-invbtns">' + (navigator.share ? '<button type="button" class="btn small" data-inv="share">' + esc(tx("inv_share")) + "</button>" : "") +
      '<a class="btn ghost small" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(msg) + '">WhatsApp</a>' +
      '<button type="button" class="btn ghost small" data-inv="copy">' + esc(tx("inv_copy")) + "</button></div></details>";
  }
  function bindInvite(url) {
    var box = app.querySelector(".vc-invite"); if (!box) return;
    box.onclick = function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-inv]"); if (!b) return;
      if (b.dataset.inv === "share") { navigator.share({ title: "VAIGA Community", text: tx("inv_msg"), url: url }).catch(function () {}); return; }
      var done = function () { b.textContent = tx("inv_copied"); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () {});
      else { var i = box.querySelector(".vc-invurl"); i.select(); try { document.execCommand("copy"); done(); } catch (e) {} }
    };
  }

  function render() {
    var me = state.me;
    var visitor = !me || me.state === "guest";
    if (info) info.hidden = !visitor;   // public information only for visitors
    if (keyTopEl) keyTopEl.innerHTML = "";
    if (!me) { app.innerHTML = ""; return; }
    if (visitor) {
      // open sign-up: the form with the door; returning visitors get the key first (at the top of the page)
      var back = remembered();
      var invNote = REF && !back ? note("ok vc-invited", tx("invited")) : "";
      if (back && keyTopEl) { keyTopEl.innerHTML = keyBox(true); app.innerHTML = joinForm(); }
      else app.innerHTML = invNote + joinForm() + keyBox(false);
      bindJoin(); bindKey();
      return;
    }
    if (me.state !== "member") {
      app.innerHTML = hero() + '<div class="vc-card vc-center"><p>' + esc(tx("st_" + me.state)) + "</p></div>";
      return;
    }
    var p = me.profile || {};
    app.innerHTML = (C.demo ? '<div class="vc-demo" role="note">' + esc(tx("demo_banner")) + "</div>" : "") +
      hero('<p class="vc-hello">' + (p.avatar ? '<img class="vc-av vc-av-me" src="' + esc(p.avatar) + '" alt=""> ' : "") + '<span>' + esc(tx("hello", { n: me.name })) + "</span>" + (p.country ? ' <span data-no-i18n>' + flag(p.country) + "</span>" : "") +
        ' · <button type="button" class="vc-lnk vc-out">' + esc(tx("logout")) + "</button></p>") +
      inviteBox(me.invite) +
      '<div class="vc-tabs" role="tablist"><button type="button" role="tab" data-v="feed" aria-selected="' + (state.view === "feed") + '">' + esc(tx("tab_feed")) + '</button><button type="button" role="tab" data-v="mg" aria-selected="' + (state.view === "mg") + '">' + esc(tx("tab_mg")) + "</button></div>" +
      '<div id="vc-view"></div>';
    bindInvite(me.invite);
    app.querySelector(".vc-out").onclick = function () {
      if (C.logout && !C.demo) { location.href = C.logout; return; }
      api("POST", "logout").then(function () { state.view = "feed"; start(); });
    };
    app.querySelectorAll(".vc-tabs button").forEach(function (b) { b.onclick = function () { state.view = b.dataset.v; render(); load(); }; });
    if (state.view === "feed") renderFeed(); else renderMg();
  }

  /* ---------- feed ---------- */
  function actions(item, canReply) {
    var h = '<div class="vc-acts">';
    if (canReply) h += '<button type="button" class="vc-a" data-act="reply">' + esc(tx("reply")) + "</button>";
    if (item.can_delete) h += '<button type="button" class="vc-a" data-act="del">' + esc(tx("del")) + "</button>";
    if (!item.mine) h += '<button type="button" class="vc-a" data-act="report">' + esc(tx("report")) + "</button>";
    return h + '</div><div class="vc-inline"></div>';
  }
  function commentHtml(c, replies) {
    return '<div class="vc-c" data-kind="comment" data-id="' + c.id + '"><div class="vc-meta">' + whoHtml(c.who || c.author) + '<span class="vc-when">' + esc(when(c.created)) + '</span></div><div class="vc-body">' + multiline(c.body) + "</div>" + actions(c, !c.parent_id) +
      (replies && replies.length ? '<div class="vc-replies">' + replies.map(function (r) { return commentHtml(r, null); }).join("") + "</div>" : "") + "</div>";
  }
  function postHtml(p) {
    var top = p.comments.filter(function (c) { return !c.parent_id; });
    return '<article class="vc-card vc-post" data-kind="post" data-id="' + p.id + '"><div class="vc-meta">' + whoHtml(p.who || p.author) + '<span class="vc-when">' + esc(when(p.created)) + "</span></div>" +
      (p.body ? '<div class="vc-body">' + multiline(p.body) + "</div>" : "") +
      (p.photo ? '<img class="vc-photo" src="' + esc(p.photo) + '" alt="" loading="lazy" decoding="async">' : "") +
      actions(p, true) +
      '<div class="vc-comments">' + top.map(function (c) { return commentHtml(c, p.comments.filter(function (r) { return r.parent_id === c.id; })); }).join("") + "</div></article>";
  }
  /* "Coming up" block at the top of the feed: the next Meet & Go's stay visible, whatever is posted after them */
  function nextBox() {
    var list = upcomingMg().slice(0, 3);
    if (!list.length) return "";
    return '<section class="vc-card vc-next"><h3><span aria-hidden="true">📅</span> <span>' + esc(tx("mg_next")) + '</span></h3><ul>' + list.map(function (m) {
      return '<li><button type="button" class="vc-next-i" data-goto="' + m.id + '"><span class="vc-next-d"><b>' + esc(relDay(m.event.date)) + "</b> · " + esc(day(m.event.date)) + "</span>" +
        '<span class="vc-next-t">' + esc(m.meet_time) + " · <span>" + esc(m.event.title) + "</span>" + (m.joined ? ' <span class="vc-next-ok">✓</span>' : "") + "</span></button></li>";
    }).join("") + '</ul><p class="vc-next-all"><button type="button" class="vc-lnk" data-goto="all"><span>' + esc(tx("mg_all")) + "</span> →</button></p></section>";
  }
  function bindNext(v) {
    v.querySelectorAll("[data-goto]").forEach(function (b) {
      b.onclick = function () {
        var id = b.dataset.goto;
        state.view = "mg"; render();
        loadMg().then(function () {
          var c = id !== "all" && document.querySelector('.vc-mg[data-id="' + id + '"]');
          var t = c || document.getElementById("vc-view");
          if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
          if (c) { c.classList.add("vc-hl"); setTimeout(function () { c.classList.remove("vc-hl"); }, 2200); }
        });
      };
    });
  }
  function renderFeed() {
    var v = document.getElementById("vc-view"); if (!v) return;
    v.innerHTML = nextBox() + '<form class="vc-card vc-compose" id="vc-compose"><textarea name="body" maxlength="2000" rows="3" placeholder="' + esc(tx("ph_post")) + '"></textarea>' +
      '<div class="vc-row"><label class="btn ghost small vc-file">📷 ' + esc(tx("photo")) + '<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" hidden></label><span class="vc-fname" data-no-i18n></span><button class="btn small" type="submit">' + esc(tx("post_btn")) + '</button></div><div class="vc-msg" role="status"></div></form>' +
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
      api("POST", "posts", fd).then(function () { loadFeed(true); }).catch(function (e) { msg.innerHTML = note("err", errText(e)); b.disabled = false; b.textContent = tx("post_btn"); });
    };
    var m = document.getElementById("vc-more");
    bindNext(v);
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
            var host = kind === "comment" ? item.closest(".vc-post, .vc-mg") : item, onMg = host.dataset.kind === "meetgo";
            box.innerHTML = '<form class="vc-mini"><textarea maxlength="1000" rows="2" placeholder="' + esc(tx(onMg && kind === "meetgo" ? "ph_mg" : "comment_ph")) + '"></textarea><div class="vc-row"><button class="btn small" type="submit">' + esc(tx("send")) + '</button><button class="btn ghost small" type="button" data-x>' + esc(tx("cancel")) + '</button></div><div class="vc-msg"></div></form>';
            var fm = box.querySelector("form"), ta = fm.querySelector("textarea"); ta.focus();
            fm.onsubmit = function (ev) {
              ev.preventDefault();
              api("POST", (onMg ? "meetgo/" : "posts/") + host.dataset.id + "/comments", { body: ta.value, parent_id: kind === "comment" ? id : 0 }).then(function () { if (onMg) reloadMgAt(host.dataset.id); else loadFeed(true); })
                .catch(function (e) { fm.querySelector(".vc-msg").innerHTML = note("err", errText(e)); });
            };
          } else if (act === "del") {
            var mine = !acts.querySelector('[data-act="report"]');
            box.innerHTML = '<form class="vc-mini"><p>' + esc(tx("del_q")) + "</p>" + (mine ? "" : '<input maxlength="200" placeholder="' + esc(tx("mod_reason")) + '" required>') + '<div class="vc-row"><button class="btn small vc-danger" type="submit">' + esc(tx("yes_del")) + '</button><button class="btn ghost small" type="button" data-x>' + esc(tx("cancel")) + '</button></div><div class="vc-msg"></div></form>';
            var fd = box.querySelector("form");
            fd.onsubmit = function (ev) {
              ev.preventDefault();
              var r = fd.querySelector("input"), path = (kind === "post" ? "posts/" : kind === "comment" ? "comments/" : "meetgo/") + id + (r ? "?reason=" + encodeURIComponent(r.value) : "");
              var inMg = kind === "meetgo" || !!item.closest(".vc-mg");
              api("DELETE", path).then(function () { if (inMg) { if (kind === "meetgo") loadMg(); else reloadMgAt(item.closest(".vc-mg").dataset.id); } else loadFeed(true); })
                .catch(function (e) { fd.querySelector(".vc-msg").innerHTML = note("err", errText(e)); });
            };
          } else if (act === "report") {
            box.innerHTML = '<form class="vc-mini"><textarea maxlength="500" rows="2" placeholder="' + esc(tx("report_ph")) + '" required></textarea><div class="vc-row"><button class="btn small" type="submit">' + esc(tx("report")) + '</button><button class="btn ghost small" type="button" data-x>' + esc(tx("cancel")) + '</button></div><div class="vc-msg"></div></form>';
            var fr = box.querySelector("form");
            fr.onsubmit = function (ev) {
              ev.preventDefault();
              api("POST", "reports", { type: kind, id: id, reason: fr.querySelector("textarea").value }).then(function () { box.innerHTML = note("ok", tx("report_sent")); })
                .catch(function (e) { fr.querySelector(".vc-msg").innerHTML = note("err", errText(e)); });
            };
          }
          var x = box.querySelector("[data-x]"); if (x) x.onclick = function () { box.innerHTML = ""; };
        };
      });
    });
  }

  /* ---------- Meet & Go ---------- */
  function evLabel(e) { return day(e.date) + " · " + e.title + " · " + e.city; }
  function whoList(m) { return m.participants ? '<div class="vc-who"><b>' + esc(tx("mg_who")) + "</b><ul>" + m.participants.map(function (n) { return "<li>" + whoHtml(n) + "</li>"; }).join("") + "</ul></div>" : ""; }
  function mgHtml(m) {
    var e = m.event, h = '<article class="vc-card vc-mg" data-kind="meetgo" data-id="' + m.id + '"><div class="vc-mg-ev"><b>' + esc(e.title) + "</b><span>" + esc(day(e.date)) + " · " + esc(e.start) + " · " + esc(e.venue) + ", " + esc(e.city) + "</span></div>" +
      '<p class="vc-mg-meet">🕒 <span>' + esc(tx("mg_meet_at")) + "</span> " + esc(m.meet_time) + ' · <span>' + esc(m.meeting_point) + "</span></p>";
    if (m.joined) {
      h += '<p class="vc-badge">✓ ' + esc(tx("mg_joined")) + "</p>" + whoList(m);
      h += '<div class="vc-row">' + (m.mine ? "" : '<button type="button" class="btn ghost small" data-mg="leave">' + esc(tx("mg_leave")) + "</button>") + "</div>";
    } else if (m.full) {
      h += '<p class="vc-badge vc-full">' + esc(tx("mg_full")) + "</p>" + whoList(m);
    } else {
      h += '<div class="vc-row"><button type="button" class="btn small" data-mg="join">' + esc(tx("mg_join")) + "</button></div>" + whoList(m);
    }
    var mc = m.comments || [], mtop = mc.filter(function (c) { return !c.parent_id; });
    h += '<div class="vc-acts"><button type="button" class="vc-a" data-act="reply"><span aria-hidden="true">💬</span> <span>' + esc(tx("mg_write")) + "</span></button>" + (m.can_delete ? '<button type="button" class="vc-a" data-act="del">' + esc(m.mine ? tx("mg_cancel") : tx("del")) + "</button>" : "") + (m.mine ? "" : '<button type="button" class="vc-a" data-act="report">' + esc(tx("report")) + "</button>") + '</div><div class="vc-inline"></div><div class="vc-msg"></div>' +
      (mtop.length ? '<div class="vc-comments vc-mgmsgs"><p class="vc-mgmsgs-h">' + esc(tx("mg_msgs")) + "</p>" + mtop.map(function (c) { return commentHtml(c, mc.filter(function (r) { return r.parent_id === c.id; })); }).join("") + "</div>" : "") + "</article>";
    return h;
  }
  function renderMg() {
    var v = document.getElementById("vc-view"); if (!v) return;
    var r = state.rules || { min_people: 2, max_people: 20, max_hours_before: 4 };
    var opts = state.events.map(function (e, i) { return '<option value="' + i + '">' + esc(evLabel(e)) + "</option>"; }).join("");
    var up = upcomingMg(), last = "", list = up.map(function (m) {
      var head = m.event.date !== last ? '<h3 class="vc-day"><b>' + esc(relDay(m.event.date)) + "</b> · " + esc(day(m.event.date)) + "</h3>" : "";
      last = m.event.date; return head + mgHtml(m);
    }).join("");
    v.innerHTML = '<p class="vc-intro2">' + esc(tx("mg_intro")) + ' <a href="community-rules.html#meet-go">' + esc(tx("mg_rules")) + " →</a></p>" +
      (state.events.length ? '<details class="vc-card vc-mgnew"><summary>' + esc(tx("mg_add")) + '</summary><form class="vc-mgform" id="vc-mgform">' +
        '<label>' + esc(tx("mg_event")) + '<select name="ev">' + opts + "</select></label>" +
        '<div class="vc-grid2"><label>' + esc(tx("mg_time")) + '<input type="time" name="meet_time" required><small class="vc-hint"></small></label>' +
        '<label>' + esc(tx("mg_max")) + '<input type="number" name="max_people" min="' + r.min_people + '" max="' + r.max_people + '" value="6" required></label></div>' +
        '<label>' + esc(tx("mg_point")) + '<input name="meeting_point" maxlength="160" required></label>' +
        '<label class="vc-chk"><input type="checkbox" name="public_place" value="1"> <span>' + esc(tx("mg_public")) + "</span></label>" +
        '<div class="vc-msg" role="status"></div><button class="btn" type="submit">' + esc(tx("mg_create")) + "</button></form></details>"
        : '<p class="vc-empty">' + esc(tx("mg_noevents")) + "</p>") +
      (up.length ? '<p class="vc-order">' + esc(tx("mg_order")) + "</p>" : "") +
      '<div id="vc-mglist">' + (up.length ? list : '<p class="vc-empty">' + esc(tx("mg_none")) + "</p>") + "</div>";
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
          .then(function () { loadMg(); })
          .catch(function (er) { msg.innerHTML = note("err", errText(er)); });
      };
    }
    v.querySelectorAll("[data-mg]").forEach(function (b) {
      b.onclick = function () {
        var card = b.closest(".vc-mg");
        api("POST", "meetgo/" + card.dataset.id + "/" + b.dataset.mg).then(loadMg).catch(function (e) { card.querySelector(".vc-msg").innerHTML = note("err", errText(e)); });
      };
    });
    bindItems(v);
  }

  /* ---------- loading ---------- */
  function loadFeed(redraw) {
    return Promise.all([api("GET", "feed"), api("GET", "meetgo").catch(function () { return { items: state.mg }; })]).then(function (r) {
      state.posts = r[0].posts; state.more = r[0].more; state.mg = r[1].items || []; if (redraw !== false) renderFeed();
    });
  }
  function loadMg() {
    return Promise.all([api("GET", "events"), api("GET", "meetgo")]).then(function (r) { state.events = r[0].events; state.rules = r[0].rules; state.mg = r[1].items; renderMg(); });
  }
  function reloadMgAt(id) {
    return loadMg().then(function () { var c = document.querySelector('.vc-mg[data-id="' + id + '"]'); if (c) c.scrollIntoView({ block: "nearest" }); });
  }
  function load() {
    if (!state.me || state.me.state !== "member") return;
    (state.view === "feed" ? loadFeed() : loadMg()).catch(function (e) { var v = document.getElementById("vc-view"); if (v) v.innerHTML = note("err", errText(e)); });
  }
  function start(scroll) {
    api("GET", "me").then(function (j) { state.me = j; if (j && j.state === "member") remember(); render(); load(); if (scroll) app.scrollIntoView({ behavior: "smooth", block: "start" }); })
      .catch(function () { state.me = { state: "guest" }; render(); });
  }
  start();
})();
