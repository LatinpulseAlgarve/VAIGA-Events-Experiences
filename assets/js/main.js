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

  /* ---------- mobile menu ---------- */
  var btn = $(".menu-btn"), nav = $("#nav");
  if (btn && nav) {
    var setOpen = function (open) {
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
    };
    btn.addEventListener("click", function () { setOpen(btn.getAttribute("aria-expanded") !== "true"); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- current page in the menu ---------- */
  var page = document.body.getAttribute("data-page");
  $$("#nav a[data-page]").forEach(function (a) { if (a.getAttribute("data-page") === page) a.setAttribute("aria-current", "page"); });

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
  function socialHtml() {
    var h = "", soon = 0;
    Object.keys(ICONS).forEach(function (k) {
      var svg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[k] + '"/></svg>';
      if (soc[k]) h += '<a href="' + esc(soc[k]) + '" target="_blank" rel="noopener" aria-label="VAIGA on ' + LABEL[k] + '">' + svg + "</a>";
      else { soon++; h += '<button type="button" class="soon" data-soon="' + LABEL[k] + '" aria-label="VAIGA on ' + LABEL[k] + ' – coming soon">' + svg + "</button>"; }
    });
    // e-mail: same round button as the social icons, an envelope without text, right after WhatsApp
    if (C.email) h += '<a class="mail-ico" href="mailto:' + esc(C.email) + '" aria-label="E-mail VAIGA: ' + esc(C.email) + '" title="E-mail VAIGA: ' + esc(C.email) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1.4 2L12 12.2 19.6 7H4.4ZM20 8.6l-7.4 5.1a1 1 0 0 1-1.2 0L4 8.6V17h16V8.6Z"/></svg></a>';
    return h + (soon ? '<p class="social-soon" aria-live="polite">Our social media channels will be activated soon.</p>' : "");
  }
  window.VAIGA.socialHtml = socialHtml;
  $$("[data-social]").forEach(function (box) { box.innerHTML = socialHtml(); });
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-soon]");
    if (!b) return;
    var note = b.parentNode.querySelector(".social-soon");
    if (note) note.textContent = b.getAttribute("data-soon") + " – coming soon. Our social media channels will be activated soon.";
  });

  /* ---------- contact details (only when filled in) ---------- */
  $$("[data-contact-email]").forEach(function (el) { el.innerHTML = C.email ? '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>" : '<span class="placeholder-note">[E-mail address]</span>'; });
  $$("[data-contact-phone]").forEach(function (el) { el.innerHTML = C.phone ? '<a href="tel:' + esc(C.phone.replace(/\s+/g, "")) + '">' + esc(C.phone) + "</a>" : '<span class="placeholder-note">[Phone number]</span>'; });
  var mapUrl = C.city ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.city) : "";
  $$("[data-contact-city]").forEach(function (el) { el.innerHTML = C.city ? '<a href="' + esc(mapUrl) + '" target="_blank" rel="noopener">' + esc(C.city) + " ↗</a>" : '<span class="placeholder-note">[Location]</span>'; });
  $$("[data-map-link]").forEach(function (a) { if (mapUrl) a.setAttribute("href", mapUrl); });

  /* ---------- event concepts ---------- */
  var CATS = window.VAIGA_CATEGORIES || [];
  window.VAIGA.cat = function (id) { return CATS.filter(function (c) { return c.id === id; })[0] || null; };
  window.VAIGA.icon = function (c) { return '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="currentColor"><path d="' + c.icon + '"/></svg>'; };
  $$("[data-categories]").forEach(function (box) {
    var full = box.getAttribute("data-categories") === "full";
    box.innerHTML = CATS.map(function (c, i) {
      var n = ("0" + (i + 1)).slice(-2);
      if (!full) {
        return '<a class="card cat reveal' + (c.image ? ' has-photo' : '') + '" style="--cat-bg:' + c.bg + '" href="categories.html#' + c.id + '">' + (c.image ? '<img class="cat-photo" src="' + esc(c.image) + '" alt="" loading="lazy" decoding="async" width="1000" height="1000">' : '') + '<span class="num">' + n + '</span><span class="ico">' + window.VAIGA.icon(c) + "</span><h3>" + esc(c.name) + "</h3><p>" + esc(c.short) + '</p><span class="go arrow">Discover </span></a>';
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
      return '<article class="split concept reveal" id="' + c.id + '">' + photo + '<div><span class="eyebrow">' + n + " · Concept</span><h2>" + esc(c.name) + '</h2><p class="lead">' + long + '</p>' + lp + '<div class="btn-row"><a class="btn arrow" href="events.html?cat=' + c.id + '">' + esc(c.name) + " events </a></div></div></article>";
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
})();
