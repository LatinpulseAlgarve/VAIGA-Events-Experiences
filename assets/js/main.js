/* VAIGA – site-wide behaviour: menu, scroll reveal, social links, concepts, preview mode. Vanilla JS, no framework. */
(function () {
  "use strict";
  var C = window.VAIGA_CONFIG || {};
  var doc = document.documentElement;
  doc.classList.add("js");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  window.VAIGA = { $: $, $$: $$, esc: esc, preview: /[?&]preview=1(&|$)/.test(location.search) };

  /* ---------- clean address (besluit gebruiker 2026-11-19): no ".html" in the address bar ----------
     GitHub Pages serves vaiga.eu/contact as contact.html, so the short address also works after a reload
     or when shared. Only the address bar changes; links in the pages stay as they are. Needed parts
     after the "?" (event ?id=, invite ?ref=, events filter ?cat=, ?preview=1) are kept. */
  try {
    var p0 = location.pathname, p1 = p0.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    if (p1 !== p0 && location.protocol !== "file:" && window.history && history.replaceState)
      history.replaceState(history.state, "", p1 + location.search + location.hash);
  } catch (e) {}

  /* ---------- mobile menu ---------- */
  var btn = $(".menu-btn"), nav = $("#nav");
  if (btn && nav) {
    var savedY = 0;
    var setOpen = function (open) {
      var was = document.body.classList.contains("menu-open");
      if (open && !was) savedY = window.pageYOffset;
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      if (!open && was) window.scrollTo({ top: savedY, left: 0, behavior: "instant" });
    };
    btn.addEventListener("click", function () { setOpen(btn.getAttribute("aria-expanded") !== "true"); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- current page in the menu ---------- */
  var page = document.body.getAttribute("data-page");
  $$("#nav a[data-page]").forEach(function (a) { if (a.getAttribute("data-page") === page) a.setAttribute("aria-current", "page"); });
  /* footer column "Jump to": all links of the main menu, in 2 columns (2026-11-18); built from the header menu so
     both always stay the same (the static list in the HTML is only a fallback) */
  (function () {
    var ul = document.querySelector("[data-foot-menu]"), links = $$("#nav > ul a[data-page]");
    if (!ul || !links.length) return;
    ul.innerHTML = "";
    links.forEach(function (a) { var li = document.createElement("li"), c = a.cloneNode(true); c.removeAttribute("id"); li.appendChild(c); ul.appendChild(li); });
  })();

  /* ---------- year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- social links (only the ones filled in config.js) ---------- */
  var ICONS = {
    instagram: "M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2Zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2Zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z",
    facebook: "M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z",
    tiktok: "M16.6 2h-3.4v13.3a2.9 2.9 0 1 1-2-2.8V9.1a6.3 6.3 0 1 0 5.4 6.2V8.6a8 8 0 0 0 4.6 1.5V6.7a4.7 4.7 0 0 1-4.6-4.7Z",
    youtube: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z",
    whatsapp: "M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.5a.5.5 0 0 0 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.6.9 3.6.7a3 3 0 0 0 2-1.4 2.4 2.4 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.4ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6ZM20.5 3.5A11.8 11.8 0 0 0 1.9 17.7L.2 24l6.4-1.7a11.8 11.8 0 0 0 5.4 1.4 11.8 11.8 0 0 0 8.5-20.2Z"
  };
  var LABEL = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", youtube: "YouTube", whatsapp: "WhatsApp" };
  // Filled in config.js = real link; empty = button marked "coming soon" (clicking shows a short note)
  var soc = C.social || {};
  /* contact channels as black buttons: WhatsApp (config or the phone number), e-mail, location */
  var CONTACT_ICONS = {
    mail: "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1.4 2L12 12.2 19.6 7H4.4ZM20 8.6l-7.4 5.1a1 1 0 0 1-1.2 0L4 8.6V17h16V8.6Z",
    pin: "M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7Zm0 4.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z"
  };
  var waUrl = soc.whatsapp || (C.phone ? "https://wa.me/" + C.phone.replace(/\D/g, "") : "");
  var mapUrl = C.city ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.city) : "";
  var ico = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>'; };
  function contactBtn(kind) {
    if (kind === "whatsapp" && waUrl) return '<a class="black-btn" href="' + esc(waUrl) + '" rel="noopener" aria-label="WhatsApp VAIGA" title="WhatsApp VAIGA">' + ico(ICONS.whatsapp) + "</a>";
    if (kind === "mail" && C.email) return '<a class="black-btn" href="mailto:' + esc(C.email) + '" aria-label="E-mail VAIGA: ' + esc(C.email) + '" title="E-mail VAIGA: ' + esc(C.email) + '">' + ico(CONTACT_ICONS.mail) + "</a>";
    if (kind === "location" && mapUrl) return '<a class="black-btn" href="' + esc(mapUrl) + '" rel="noopener" aria-label="' + esc(C.city) + ' – open in Google Maps" title="' + esc(C.city) + '">' + ico(CONTACT_ICONS.pin) + "</a>";
    return "";
  }
  /* social row: Instagram, Facebook, TikTok, YouTube; then the black WhatsApp and e-mail buttons.
     data-social="no-whatsapp" = without WhatsApp (contact page "Follow us");
     data-social="social-only" = only the social media, no WhatsApp and no e-mail (the "new dates" block, 2026-11-18) */
  function socialHtml(box) {
    var mode = box && box.getAttribute ? box.getAttribute("data-social") : "";
    var h = "", soon = 0;
    Object.keys(ICONS).forEach(function (k) {
      if (k === "whatsapp") return;
      var svg = ico(ICONS[k]);
      if (soc[k]) h += '<a href="' + esc(soc[k]) + '" target="_blank" rel="noopener" aria-label="VAIGA on ' + LABEL[k] + '">' + svg + "</a>";
      else { soon++; h += '<button type="button" class="soon" data-soon="' + LABEL[k] + '" aria-label="VAIGA on ' + LABEL[k] + ' – coming soon">' + svg + "</button>"; }
    });
    if (mode !== "no-whatsapp" && mode !== "social-only") h += contactBtn("whatsapp");
    if (mode !== "social-only") h += contactBtn("mail");
    return h + (soon ? '<p class="social-soon" aria-live="polite">Our social media channels will be activated soon.</p>' : "");
  }
  window.VAIGA.socialHtml = socialHtml;
  $$("[data-social]").forEach(function (box) { box.innerHTML = socialHtml(box); });
  $$("[data-contact-buttons]").forEach(function (box) { box.innerHTML = contactBtn("whatsapp") + contactBtn("mail") + contactBtn("location"); });

  /* ---------- e-mail button: a small menu, so it also works without a mail program ----------
     A plain mailto: link does nothing on many computers (no mail app set up, webmail users).
     So the envelope opens a choice: mail program, Gmail, Outlook, or copy the address. */
  if (C.email) {
    var mailPanel = null;
    var closeMail = function () { if (mailPanel) { mailPanel.parentNode.removeChild(mailPanel); mailPanel = null; } };
    var copyText = function (t, done) {
      var fallback = function () {
        var ta = document.createElement("textarea"); ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "absolute"; ta.style.left = "-9999px";
        document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); done();
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(done, fallback); else fallback();
    };
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a.black-btn[href^="mailto:"]');
      if (!a) { if (mailPanel && !mailPanel.contains(e.target)) closeMail(); return; }
      e.preventDefault();
      var again = mailPanel && mailPanel._for === a;
      closeMail();
      if (again) return;
      var to = encodeURIComponent(C.email);
      var p = document.createElement("div");
      p.className = "mail-panel"; p.setAttribute("role", "dialog"); p.setAttribute("aria-label", "E-mail VAIGA");
      p.innerHTML = '<b class="mp-addr">' + esc(C.email) + "</b>" +
        '<a href="mailto:' + esc(C.email) + '">Open your e-mail program</a>' +
        '<a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=' + to + '" target="_blank" rel="noopener">Gmail</a>' +
        '<a href="https://outlook.live.com/mail/0/deeplink/compose?to=' + to + '" target="_blank" rel="noopener">Outlook</a>' +
        '<button type="button" data-copy>Copy address</button>';
      p._for = a;
      document.body.appendChild(p);
      var r = a.getBoundingClientRect(), w = p.offsetWidth, h = p.offsetHeight;
      var left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
      var top = r.bottom + 10; if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 10);
      p.style.left = (left + window.scrollX) + "px"; p.style.top = (top + window.scrollY) + "px";
      mailPanel = p;
      p.querySelector("a").focus();
      p.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-copy]");
        if (b) { copyText(C.email, function () { b.textContent = "Address copied ✓"; }); return; }
        if (ev.target.closest("a")) setTimeout(closeMail, 150);
      });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && mailPanel) { var a = mailPanel._for; closeMail(); a.focus(); } });
    window.addEventListener("resize", closeMail);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-soon]");
    if (!b) return;
    var note = b.parentNode.querySelector(".social-soon");
    if (note) note.textContent = b.getAttribute("data-soon") + " – coming soon. Our social media channels will be activated soon.";
  });

  /* ---------- contact details (only when filled in) ---------- */
  $$("[data-contact-email]").forEach(function (el) { el.innerHTML = C.email ? '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>" : '<span class="placeholder-note">[E-mail address]</span>'; });
  $$("[data-contact-phone]").forEach(function (el) { el.innerHTML = C.phone ? '<a href="tel:' + esc(C.phone.replace(/\s+/g, "")) + '">' + esc(C.phone) + "</a>" : '<span class="placeholder-note">[Phone number]</span>'; });
  $$("[data-contact-city]").forEach(function (el) { el.innerHTML = C.city ? '<a href="' + esc(mapUrl) + '" rel="noopener">' + esc(C.city) + " ↗</a>" : '<span class="placeholder-note">[Location]</span>'; });
  $$("[data-map-link]").forEach(function (a) { if (mapUrl) a.setAttribute("href", mapUrl); });

  /* ---------- event concepts ---------- */
  var CATS = window.VAIGA_CATEGORIES || [];
  window.VAIGA.cat = function (id) { return CATS.filter(function (c) { return c.id === id; })[0] || null; };
  window.VAIGA.icon = function (c) { return '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="currentColor"><path d="' + c.icon + '"/></svg>'; };
  $$("[data-categories]").forEach(function (box) {
    var full = box.getAttribute("data-categories") === "full";
    box.innerHTML = CATS.map(function (c, i) {
      if (!full) {
        return '<a class="card cat reveal' + (c.image ? ' has-photo' : '') + '" style="--cat-bg:' + c.bg + '" href="categories.html#' + c.id + '">' + (c.image ? '<img class="cat-photo" src="' + esc(c.image) + '" alt="" loading="lazy" decoding="async" width="1000" height="1000">' : '') + '<span class="ico">' + window.VAIGA.icon(c) + "</span><h3>" + esc(c.name) + "</h3><p>" + esc(c.short) + '</p><span class="go arrow">Discover </span></a>';
      }
      var p = c.partner, purl = p && c.concept === "latinpulse" ? C.latinpulseUrl : "";
      var long = esc(c.long);
      (c.collab || []).forEach(function (x) {
        var u = C[x.urlKey], nm = esc(x.name);
        if (u && long.indexOf(nm) >= 0) long = long.replace(nm, '<a class="collab-link" href="' + esc(u) + '" target="_blank" rel="noopener" aria-label="' + nm + ' (opens in a new tab)">' + nm + '</a>');
      });
      var lp = c.collab ? ""
        : p
        ? '<p class="concept-note"><b>Concept:</b> ' + esc(p.name) + " – " + esc(p.tagline) + (purl ? ' · <a href="' + esc(purl) + '" target="_blank" rel="noopener">Visit ' + esc(p.name) + " ↗</a>" : "") + "</p>" : "";
      var photo = c.image
        ? '<div class="frame wide concept-photo"><img src="' + esc(c.image) + '" alt="' + esc(c.imageAlt || c.name) + '" loading="lazy" decoding="async" width="1000" height="1000"></div>'
        : c.banner
        ? '<div class="frame wide concept-banner" style="--ph-bg:' + c.bg + '"><div class="cb-in"><span class="cb-ico" aria-hidden="true">' + window.VAIGA.icon(c) + '</span><b>' + esc(c.banner.title) + "</b><span>" + esc(c.banner.sub) + "</span></div></div>"
        : p && p.image
        ? (purl ? '<a class="frame wide partner-frame" href="' + esc(purl) + '" target="_blank" rel="noopener" aria-label="Visit ' + esc(p.name) + ' (opens in a new tab)">' : '<div class="frame wide partner-frame">') +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + " – " + esc(p.tagline) + '" loading="lazy" decoding="async"><span class="frame-cap">' + esc(p.name) + (purl ? " ↗" : "") + "</span>" + (purl ? "</a>" : "</div>")
        : '<div class="frame wide"><div class="ph" style="--ph-bg:' + c.bg + '"><span>Photo: ' + esc(c.name) + "</span></div></div>";
      return '<article class="split concept reveal" id="' + c.id + '">' + photo + '<div><span class="eyebrow">Concept</span><h2>' + esc(c.name) + '</h2><p class="lead">' + long + '</p>' + lp + '<div class="btn-row"><a class="btn arrow" href="events.html?cat=' + c.id + '">' + esc(c.name) + (/events$/i.test(c.name) ? " " : " events ") + "</a></div></div></article>";
    }).join("");
  });

  /* ---------- Latinpulse Algarve links (one address in config.js) ---------- */
  $$("[data-latinpulse-link]").forEach(function (a) { if (C.latinpulseUrl) a.setAttribute("href", C.latinpulseUrl); });

  /* ---------- preview mode banner ---------- */
  if (window.VAIGA.preview) {
    var b = document.createElement("div");
    b.className = "preview-banner"; b.setAttribute("role", "note");
    b.textContent = "PREVIEW MODE – placeholder events are shown to demonstrate the layout. They are not real. Remove ?preview=1 from the address to see the real site.";
    document.body.insertBefore(b, document.body.firstChild);
    var hdr = $(".site-header"), place = function () { if (hdr) hdr.style.top = b.offsetHeight + "px"; };
    place(); window.addEventListener("resize", place);
    $$("a[href]").forEach(function (a) { var h = a.getAttribute("href"); if (/^[a-z-]+\.html/.test(h) && h.indexOf("preview=1") < 0) a.setAttribute("href", h.replace(/(\.html)(\?[^#]*)?/, function (m, p, q) { return p + (q ? q + "&" : "?") + "preview=1"; })); });
  }

  /* ---------- back to top ---------- */
  var toTop = document.createElement("button");
  toTop.type = "button"; toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Back to top"); toTop.title = "Back to top";
  toTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(toTop);
  var showTop = function () { toTop.classList.toggle("show", window.scrollY > 500); };
  window.addEventListener("scroll", showTop, { passive: true }); showTop();
  toTop.addEventListener("click", function () {
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
    var h = $("h1") || $("a"); if (h) { if (!h.hasAttribute("tabindex") && h.tagName === "H1") h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  });

  /* ---------- reveal on scroll ---------- */
  function reveal() {
    var els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }
  window.VAIGA.reveal = reveal;
  reveal();

  /* ---------- photos: click / Enter = large view (besluit gebruiker 2026-11-19) ----------
     Every photo in the page content, also the ones added later (events, community).
     Not: logos, flags, icons (svg/gif), the header banner, photos inside a link or button
     (those keep working as a link) and the face-photo preview in the sign-up form. */
  var LB_TXT = { en: ["Enlarge photo", "Close"], pt: ["Ampliar foto", "Fechar"], es: ["Ampliar foto", "Cerrar"], nl: ["Foto vergroten", "Sluiten"] };
  function lbTxt(i) { var l = (document.documentElement.lang || "en").slice(0, 2); return (LB_TXT[l] || LB_TXT.en)[i]; }
  function zoomable(img) {
    if (!img || img.tagName !== "IMG" || img.closest("a, button, header, nav, footer, .vc-door, .vc-face, .lb")) return false;
    var s = img.currentSrc || img.src || "";
    return !!s && !/\.(svg|gif)(\?|#|$)/i.test(s) && s.indexOf("data:image/svg") !== 0;
  }
  function bigSrc(img) {   // the largest file from srcset, otherwise the photo itself
    var best = img.currentSrc || img.src, bw = 0;
    (img.getAttribute("srcset") || "").split(",").forEach(function (part) {
      var m = part.trim().split(/\s+/), w = parseInt(m[1], 10) || 0;
      if (m[0] && w > bw) { bw = w; best = new URL(m[0], location.href).href; }
    });
    return best;
  }
  function markZoom(root) {
    (root.querySelectorAll ? root.querySelectorAll("img") : []).forEach(function (img) {
      if (img.classList.contains("zoomable") || !zoomable(img)) return;
      img.classList.add("zoomable"); img.setAttribute("tabindex", "0"); img.setAttribute("role", "button");
      if (!img.getAttribute("aria-label")) img.setAttribute("aria-label", lbTxt(0) + (img.alt ? ": " + img.alt : ""));
    });
  }
  var lb = null, lbBack = null;
  function openLb(img) {
    if (!lb) {
      lb = document.createElement("div"); lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.hidden = true;
      lb.innerHTML = '<button class="lb-close" type="button">×</button><img class="lb-img" alt="">';
      document.body.appendChild(lb);
      lb.addEventListener("click", function (e) { if (e.target !== lb.querySelector(".lb-img")) closeLb(); });
      lb.querySelector(".lb-img").addEventListener("click", closeLb);
    }
    var big = lb.querySelector(".lb-img");
    big.src = bigSrc(img); big.alt = img.alt || "";
    lb.querySelector(".lb-close").setAttribute("aria-label", lbTxt(1));
    lb.setAttribute("aria-label", img.alt || lbTxt(0));
    lbBack = img; lb.hidden = false; document.documentElement.classList.add("lb-open");
    lb.querySelector(".lb-close").focus();
  }
  function closeLb() {
    if (!lb || lb.hidden) return;
    lb.hidden = true; lb.querySelector(".lb-img").removeAttribute("src"); document.documentElement.classList.remove("lb-open");
    if (lbBack && document.contains(lbBack)) lbBack.focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    var img = e.target.closest && e.target.closest("img.zoomable");
    if (img && zoomable(img)) { e.preventDefault(); openLb(img); }
  });
  document.addEventListener("keydown", function (e) {
    if (lb && !lb.hidden) {
      if (e.key === "Escape") { e.preventDefault(); closeLb(); }
      else if (e.key === "Tab") { e.preventDefault(); lb.querySelector(".lb-close").focus(); }   // keep focus inside
      return;
    }
    var t = e.target;
    if ((e.key === "Enter" || e.key === " ") && t && t.classList && t.classList.contains("zoomable")) { e.preventDefault(); openLb(t); }
  });
  markZoom(document);
  if ("MutationObserver" in window) new MutationObserver(function (list) {
    list.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { if (n.tagName === "IMG") markZoom(n.parentNode || n); else markZoom(n); } }); });
  }).observe(document.body, { childList: true, subtree: true });
})();
