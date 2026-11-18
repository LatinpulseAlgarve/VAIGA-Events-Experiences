/* VAIGA – languages (EN / PT / ES / NL). Vanilla JS, no framework.
   The site is written in English. For another language this file loads assets/i18n/translations.js
   and replaces every English text (and placeholder, aria-label, title, alt) by its translation,
   also for content that scripts add later. Choice: ?lang=xx in a link (read once, then removed from
   the address bar), otherwise the last choice of this visitor (localStorage), otherwise English.
   Only if the browser cannot remember it, the language is passed on in the links (?lang=xx).
   Load in <head>, before the stylesheet-dependent content is shown. */
(function () {
  "use strict";
  var LANGS = {
    en: { name: "English", locale: "en-GB" },
    pt: { name: "Português", locale: "pt-PT" },
    es: { name: "Español", locale: "es-ES" },
    nl: { name: "Nederlands", locale: "nl-NL" }
  };
  var ORDER = ["en", "pt", "es", "nl"];
  var KEY = "vaiga-lang";
  var m = /[?&]lang=([a-z]{2})(&|$)/.exec(location.search);
  var fromUrl = m && LANGS[m[1]] ? m[1] : "";
  /* the choice is remembered in the browser (localStorage, no cookie), so the address stays clean:
     ?lang=xx is only read (e.g. from a shared link) and then removed from the address bar */
  function saveLang(l) {
    var ok = false;
    try { localStorage.setItem(KEY, l); ok = localStorage.getItem(KEY) === l; } catch (e) {}
    return ok;
  }
  var stored = "";
  try { stored = localStorage.getItem(KEY) || ""; } catch (e) {}
  var lang = fromUrl || (LANGS[stored] ? stored : "en");
  var remembered = saveLang(lang);
  var stripLang = function (q) { return q.replace(/([?&])lang=[a-z]{2}(&|$)/, function (x, p, n) { return n ? p : ""; }).replace(/[?&]$/, ""); };
  if (fromUrl && remembered && window.history && history.replaceState) {
    try { history.replaceState(history.state, "", location.pathname + stripLang(location.search) + location.hash); } catch (e) {}
  }

  var root = document.documentElement;
  root.lang = lang;
  window.VAIGA_LANG = lang;
  window.VAIGA_LOCALE = LANGS[lang].locale;

  /* ---------- language menu in the header ---------- */
  function go(to) {
    var q = stripLang(location.search);
    if (!saveLang(to) && to !== "en") q += (q ? "&" : "?") + "lang=" + to;   // only when the browser cannot remember it
    location.href = location.pathname + q + location.hash;
  }
  /* flags (English = United Kingdom flag) */
  var FLAG = { en: "gb", pt: "pt", es: "es", nl: "nl" };
  var base = (document.currentScript && document.currentScript.src || "assets/js/i18n.js").replace(/js\/i18n\.js(\?.*)?$/, "");
  var flag = function (k) { return '<img src="' + base + "img/flags/" + FLAG[k] + '.svg" alt="" width="30" height="20">'; };
  function addMenu() {
    var bar = document.querySelector(".site-header .bar");
    if (!bar || bar.querySelector(".lang")) return;
    var wrap = document.createElement("div");
    wrap.className = "lang";
    wrap.setAttribute("data-no-i18n", "");
    wrap.innerHTML =
      '<button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false" aria-controls="lang-list" aria-label="Language / Idioma / Taal: ' + LANGS[lang].name + '" title="' + LANGS[lang].name + '">' + flag(lang) + '<span class="lang-caret" aria-hidden="true"></span></button>' +
      '<ul class="lang-list" id="lang-list" hidden>' + ORDER.map(function (k) {
        return '<li><a href="#" data-lang="' + k + '" lang="' + k + '" title="' + LANGS[k].name + '"' + (k === lang ? ' aria-current="true"' : "") + ">" + flag(k) + '<span class="sr-only">' + LANGS[k].name + "</span></a></li>";
      }).join("") + "</ul>";
    var btn = wrap.querySelector(".lang-btn"), list = wrap.querySelector(".lang-list");
    var open = function (on) { list.hidden = !on; btn.setAttribute("aria-expanded", String(on)); };
    btn.addEventListener("click", function () { open(list.hidden); if (!list.hidden) list.querySelector("a").focus(); });
    list.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-lang]"); if (!a) return;
      e.preventDefault(); e.stopPropagation();
      var to = a.getAttribute("data-lang");
      if (to === lang) { open(false); btn.focus(); } else go(to);
    });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) open(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !list.hidden) { open(false); btn.focus(); } });
    bar.insertBefore(wrap, bar.querySelector(".menu-btn") || null);
  }

  /* only when the browser cannot remember the choice: keep the language via the link */
  document.addEventListener("click", function (e) {
    if (lang === "en" || remembered) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var h = a.getAttribute("href");
    if (!/^([a-z0-9-]+\.html|\.\/|\/)?([?#].*)?$/i.test(h) || /[?&]lang=/.test(h) || h.charAt(0) === "#") return;
    a.setAttribute("href", h.replace(/^([^?#]*)(\?[^#]*)?(#.*)?$/, function (s, p, q, hash) { return p + (q ? q + "&" : "?") + "lang=" + lang + (hash || ""); }));
  }, true);

  if (lang === "en") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addMenu); else addMenu();
    return;
  }

  /* ---------- translating ---------- */
  root.classList.add("i18n-wait");
  var reveal = function () { root.classList.remove("i18n-wait"); };
  setTimeout(reveal, 2500);   // never keep the page hidden

  var DICT = null, TPL = [];
  var norm = function (t) { return t.replace(/[\s ]+/g, " ").trim(); };
  var page = "";
  function look(t) {
    if (!t) return null;
    var row = (page && DICT[page + "|" + t]) || DICT[t];
    if (row) return row;
    for (var i = 0; i < TPL.length; i++) {
      var r = TPL[i].re.exec(t);
      if (r) {
        var x = r[1].split(", ").map(function (p) { var v = DICT[p]; return v ? v : p; }).join(", ");
        return TPL[i].out.replace("{x}", x);
      }
    }
    return null;
  }
  function trText(n) {
    var raw = n.nodeValue, t = norm(raw);
    if (!t || !/[A-Za-z]/.test(t)) return;
    var v = look(t);
    if (v != null && v !== t) {
      var lead = /^\s*/.exec(raw)[0], tail = /\s*$/.exec(raw)[0];
      n.nodeValue = lead + v + tail;
    }
  }
  var ATTRS = ["placeholder", "aria-label", "title", "alt"];
  function trEl(el) {
    if (el.nodeType !== 1 || el.closest("[data-no-i18n]")) return;
    ATTRS.forEach(function (a) { var v = el.getAttribute(a); if (v) { var t = look(norm(v)); if (t != null && t !== v) el.setAttribute(a, t); } });
  }
  function trTree(node) {
    if (node.nodeType === 3) { if (!node.parentNode || !node.parentNode.closest || !node.parentNode.closest("script,style,[data-no-i18n]")) trText(node); return; }
    if (node.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(node.nodeName) || node.closest("[data-no-i18n]")) return;
    trEl(node);
    node.querySelectorAll("*").forEach(trEl);
    var w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.parentNode.closest("script,style,[data-no-i18n]") ? 2 : 1; } });
    var list = [], n; while ((n = w.nextNode())) list.push(n);
    list.forEach(trText);
  }
  function trHead() {
    var t = look(norm(document.title)); if (t) document.title = t;
    ["description", "og:title", "og:description"].forEach(function (k) {
      var el = document.querySelector('meta[name="' + k + '"],meta[property="' + k + '"]');
      if (el) { var v = look(norm(el.content)); if (v) el.content = v; }
    });
  }
  function start() {
    page = document.body.getAttribute("data-page") || "";
    addMenu();
    trHead();
    trTree(document.body);
    reveal();
    new MutationObserver(function (muts) {
      muts.forEach(function (mu) {
        if (mu.type === "characterData") trText(mu.target);
        else if (mu.type === "attributes") trEl(mu.target);
        else mu.addedNodes.forEach(trTree);
      });
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function ready() {
    var all = window.VAIGA_TRANSLATIONS || {}, idx = ORDER.indexOf(lang) - 1;
    DICT = {};
    Object.keys(all).forEach(function (k) {
      var v = all[k][idx];
      if (v == null) return;
      if (k.indexOf("{x}") >= 0) {
        var p = k.split("|"), body = p.length > 1 ? p[1] : k;
        TPL.push({ re: new RegExp("^" + body.replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace("\\{x\\}", "{x}").replace("{x}", "(.+)") + "$"), out: v });
      } else DICT[k] = v;
    });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  }
  var s = document.createElement("script");
  s.src = (document.currentScript && document.currentScript.src || "assets/js/i18n.js").replace(/js\/i18n\.js(\?.*)?$/, function (m, q) { return "i18n/translations.js" + (q || ""); });   // same ?v= as i18n.js, so a new version is never stuck in a cache
  s.onload = ready;
  s.onerror = function () { reveal(); if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addMenu); else addMenu(); };
  document.head.appendChild(s);
})();
