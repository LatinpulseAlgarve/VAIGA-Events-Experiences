/* VAIGA – events: lists (home / upcoming), filters, event detail page, sharing, add-to-calendar, structured data (SEO). */
(function () {
  "use strict";
  var V = window.VAIGA, C = window.VAIGA_CONFIG || {};
  if (!V) return;
  var esc = V.esc, $ = V.$, $$ = V.$$;
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var STATUS = { "on-sale": "Tickets on sale", "coming-soon": "Tickets soon", "sold-out": "Sold out", "cancelled": "Cancelled" };

  function parseDate(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ""); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function longDate(d) { return d ? d.toLocaleDateString(window.VAIGA_LOCALE || "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : '<span class="placeholder-note">[Date]</span>'; }
  function all() { return (window.VAIGA_EVENTS || []).concat(V.preview ? (window.VAIGA_PREVIEW_EVENTS || []) : []); }
  function upcoming() {
    return all().filter(function (e) { var d = parseDate(e.date); return e.placeholder || (d && d >= today); })
      .sort(function (a, b) { return (a.date || "9999") .localeCompare(b.date || "9999") || (a.start || "").localeCompare(b.start || ""); });
  }
  function link(e) { return "event.html?e=" + encodeURIComponent(e.id) + (V.preview ? "&preview=1" : ""); }
  function media(e, cat) {
    if (e.image) return '<img src="' + esc(e.image) + '" alt="' + esc(e.title) + '" loading="lazy" decoding="async" width="800" height="600">';
    return '<div class="ph" style="--ph-bg:' + (cat ? cat.bg : "var(--celebrate)") + '"><span>' + (e.placeholder ? "[Event photo]" : "Photo coming soon") + "</span></div>";
  }
  function card(e) {
    var d = parseDate(e.date), cat = V.cat(e.category);
    var badge = d ? "<b>" + d.getDate() + "</b><small>" + d.toLocaleDateString(window.VAIGA_LOCALE || "en-GB", { month: "short" }).replace(".", "") + "</small>" : "<b>–</b><small>[Date]</small>";
    var where = [e.venue, e.city].filter(Boolean).join(" · ");
    return '<a class="card event reveal" href="' + link(e) + '"><div class="media">' + media(e, cat) + '<div class="date">' + badge + '</div></div><div class="body">' +
      (cat ? '<span class="tag">' + esc(cat.name) + "</span>" : "") + "<h3>" + esc(e.title) + "</h3>" +
      (where ? '<div class="where">' + esc(where) + "</div>" : "") +
      (e.status ? '<div class="where"><b>' + esc(STATUS[e.status] || "") + "</b></div>" : "") + '<span class="go arrow" style="margin-top:auto;font-weight:800;font-size:.8rem;letter-spacing:.14em;text-transform:uppercase">Details </span></div></a>';
  }
  /* "new dates are coming soon" (decision 2026-11-18): no e-mail and no "Get in touch" button; social media row under
     the text; on the homepage (list with data-limit) the "See upcoming events" button under the social row; the separate
     "Stay in the loop" block at the bottom of the homepage was removed (2026-11-18) */
  function empty(catName, home) {
    return '<div class="empty reveal"><span class="eyebrow">Stay tuned</span><h3>' + (catName ? "New " + esc(catName) + " dates coming soon" : "New dates are coming soon") +
      '</h3><p class="lead" style="margin-inline:auto">We are preparing the next VAIGA events. Follow us on social media to be the first to know.</p>' +
      '<div data-social="social-only" class="social" style="justify-content:center;margin:18px 0"></div>' +
      (home ? '<div class="btn-row" style="justify-content:center"><a class="btn gold arrow" href="events.html">See upcoming events </a></div>' : "") + "</div>";
  }

  /* ---------- lists ---------- */
  var params = new URLSearchParams(location.search);
  $$("[data-events]").forEach(function (box) {
    var limit = +box.getAttribute("data-limit") || 0;
    var holder = $("[data-filters]");
    // selected concepts (multiple choice), from ?cat=latin,retro
    var sel = (params.get("cat") || "").split(",").filter(function (id) { return id && V.cat(id); });
    function draw() {
      var list = upcoming().filter(function (e) { return !sel.length || sel.indexOf(e.category) >= 0; });
      if (limit) list = list.slice(0, limit);
      box.innerHTML = list.length ? '<div class="grid g3">' + list.map(card).join("") + "</div>" : empty(sel.length === 1 ? V.cat(sel[0]).name : "", !!limit);
      if (!list.length) fillSocial(box);
      V.reveal();
    }
    if (holder) {
      var cats = window.VAIGA_CATEGORIES || [];
      holder.innerHTML = '<div class="dd">' +
        '<button type="button" class="dd-btn" aria-expanded="false" aria-controls="dd-panel"><span class="dd-label"></span><span class="dd-caret" aria-hidden="true">▾</span></button>' +
        '<div class="dd-panel" id="dd-panel" role="group" aria-label="Choose event concepts" hidden>' +
        cats.map(function (c) { return '<label class="dd-opt"><input type="checkbox" value="' + c.id + '"><span class="dd-dot" style="background:' + c.bg + '"></span>' + esc(c.name) + "</label>"; }).join("") +
        '<div class="dd-actions"><button type="button" class="chip" data-clear>Clear</button><button type="button" class="btn small" data-done>Show events</button></div></div></div>';
      var btn = $(".dd-btn", holder), panel = $(".dd-panel", holder), label = $(".dd-label", holder);
      var boxes = $$('input[type="checkbox"]', panel);
      var open = function (on) { panel.hidden = !on; btn.setAttribute("aria-expanded", String(on)); if (on && boxes[0]) boxes[0].focus(); };
      var sync = function () {
        boxes.forEach(function (b) { b.checked = sel.indexOf(b.value) >= 0; });
        var names = sel.map(function (id) { return V.cat(id).name; });
        label.textContent = "Event concepts: " + (!names.length ? "All" : names.length <= 2 ? names.join(", ") : names.length + " selected");
        btn.classList.toggle("active", names.length > 0);
        var u = new URL(location.href); if (sel.length) u.searchParams.set("cat", sel.join(",")); else u.searchParams.delete("cat"); history.replaceState(null, "", u);
      };
      btn.addEventListener("click", function () { open(panel.hidden); });
      boxes.forEach(function (b) {
        b.addEventListener("change", function () {
          sel = boxes.filter(function (x) { return x.checked; }).map(function (x) { return x.value; });
          sync(); draw();
        });
      });
      $("[data-clear]", panel).addEventListener("click", function () { sel = []; sync(); draw(); });
      $("[data-done]", panel).addEventListener("click", function () { open(false); btn.focus(); });
      document.addEventListener("click", function (e) { if (!panel.hidden && !holder.contains(e.target)) open(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); } });
      sync();
    }
    draw();
  });
  function fillSocial(root) {
    // the empty state contains a social box: render it with the same buttons as everywhere else (main.js)
    $$("[data-social]", root).forEach(function (b) { b.innerHTML = V.socialHtml ? V.socialHtml(b) : ""; });
  }

  /* ---------- event detail page ---------- */
  var detail = $("[data-event-detail]");
  if (!detail) return;
  var id = params.get("e");
  var ev = all().filter(function (e) { return e.id === id; })[0];
  var titleEl = $("[data-event-title]"), metaEl = $("[data-event-meta]");
  if (!ev) {
    titleEl.textContent = "Event not found";
    metaEl.textContent = "This event does not exist (anymore) or the link is incomplete.";
    detail.innerHTML = '<div class="empty"><h3>Event not found</h3><p class="lead" style="margin-inline:auto">Have a look at all upcoming VAIGA events.</p><a class="btn arrow" href="events.html">Upcoming events </a></div>';
    var rm = document.createElement("meta"); rm.name = "robots"; rm.content = "noindex"; document.head.appendChild(rm);
    return;
  }
  var d = parseDate(ev.date), cat = V.cat(ev.category), past = d && d < today;
  var url = (C.siteUrl || location.origin) + "/event.html?e=" + encodeURIComponent(ev.id);
  var time = ev.start ? esc(ev.start) + (ev.end ? " – " + esc(ev.end) : "") : "";
  var place = [ev.venue, ev.address, ev.city, ev.country].filter(Boolean).join(", ");

  document.title = ev.title + " – VAIGA Events & Experiences";
  setMeta("description", (ev.description || "").slice(0, 155) || ev.title + " – an event by VAIGA.");
  setMeta("og:title", ev.title, true); setMeta("og:description", (ev.description || "").slice(0, 200), true); setMeta("og:url", url, true);
  if (ev.image) setMeta("og:image", (C.siteUrl || location.origin) + "/" + ev.image.replace(/^\//, ""), true);
  var can = $('link[rel="canonical"]'); if (can) can.href = url;

  titleEl.textContent = ev.title;
  metaEl.innerHTML = (cat ? '<span class="tag">' + esc(cat.name) + "</span> " : "") + (d ? esc(longDate(d)) : '<span class="placeholder-note">[Date]</span>') + (ev.city ? " · " + esc(ev.city) : "");
  var crumb = $("[data-event-crumb]"); if (crumb) crumb.textContent = ev.title;

  var ticket;
  if (past) ticket = '<p class="msg err">This event has taken place.</p>';
  else if (ev.status === "cancelled") ticket = '<p class="msg err">This event has been cancelled.</p>';
  else if (ev.status === "sold-out") ticket = '<a class="btn" aria-disabled="true">Sold out</a>';
  else if (ev.ticketUrl) ticket = '<a class="btn gold arrow" href="' + esc(ev.ticketUrl) + '" target="_blank" rel="noopener">Get tickets </a>';
  else ticket = '<a class="btn" aria-disabled="true">Tickets coming soon</a>';

  detail.innerHTML =
    '<div><div class="frame wide" style="margin-bottom:28px">' + media(ev, cat) + "</div>" +
    '<h2 style="font-size:var(--fs-h3)">About this event</h2><p class="desc lead">' + esc(ev.description || "") + "</p>" +
    (ev.lineup && ev.lineup.length ? '<h2 style="font-size:var(--fs-h3);margin-top:28px">Line-up</h2><div class="stat-line">' + ev.lineup.map(function (l) { return '<span class="tag">' + esc(l) + "</span>"; }).join("") + "</div>" : "") +
    (ev.gallery && ev.gallery.length ? '<div class="gallery">' + ev.gallery.map(function (g) { return '<img src="' + esc(g) + '" alt="' + esc(ev.title) + '" loading="lazy">'; }).join("") + "</div>" : "") + "</div>" +
    '<aside class="sticky-box"><div class="card"><ul class="facts">' +
    '<li><span class="i" aria-hidden="true">📅</span><div><b>Date</b>' + longDate(d) + "</div></li>" +
    (time ? '<li><span class="i" aria-hidden="true">🕘</span><div><b>Time</b>' + time + "</div></li>" : "") +
    '<li><span class="i" aria-hidden="true">📍</span><div><b>Location</b>' + (place ? esc(place) : '<span class="placeholder-note">[Venue]</span>') + "</div></li>" +
    (ev.price ? '<li><span class="i" aria-hidden="true">🎟️</span><div><b>Price</b>' + esc(ev.price) + "</div></li>" : "") +
    (ev.status ? '<li><span class="i" aria-hidden="true">✦</span><div><b>Status</b>' + esc(STATUS[ev.status] || ev.status) + "</div></li>" : "") +
    '</ul><div class="btn-row">' + ticket + "</div>" +
    (d && !past ? '<p style="margin:14px 0 0"><button type="button" class="chip" data-ics>+ Add to calendar</button></p>' : "") +
    (place ? '<p style="margin:10px 0 0"><a class="chip" style="display:inline-block;text-decoration:none" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place) + '">Open in maps</a></p>' : "") +
    '<h3 style="margin:24px 0 6px;font-size:.9rem;letter-spacing:.16em">Share this event</h3><div class="share" data-share></div></div></aside>';

  /* sharing */
  var text = ev.title + (d ? " – " + longDate(d) : "") + (ev.city ? ", " + ev.city : "");
  var enc = encodeURIComponent;
  var share = $("[data-share]");
  share.innerHTML = (navigator.share ? '<button type="button" data-native>Share…</button>' : "") +
    '<a target="_blank" rel="noopener" href="https://wa.me/?text=' + enc(text + " " + url) + '">WhatsApp</a>' +
    '<a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + enc(url) + '">Facebook</a>' +
    '<a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=' + enc(text) + "&url=" + enc(url) + '">X</a>' +
    '<a href="mailto:?subject=' + enc(ev.title) + "&body=" + enc(text + "\n" + url) + '">E-mail</a>' +
    '<button type="button" data-copy>Copy link</button>';
  var nb = $("[data-native]", share); if (nb) nb.addEventListener("click", function () { navigator.share({ title: ev.title, text: text, url: url }).catch(function () {}); });
  $("[data-copy]", share).addEventListener("click", function () {
    var b = this; (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { b.textContent = "Link copied ✓"; }, function () { b.textContent = url; });
  });

  /* add to calendar (.ics, local time) */
  var icsBtn = $("[data-ics]");
  if (icsBtn) icsBtn.addEventListener("click", function () {
    var p = function (n) { return ("0" + n).slice(-2); };
    var ds = ev.date.replace(/-/g, "");
    var st = (ev.start && /^\d\d:\d\d$/.test(ev.start)) ? ev.start.replace(":", "") + "00" : null;
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//VAIGA//Events//EN", "BEGIN:VEVENT", "UID:" + ev.id + "@vaiga.eu",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"];
    if (st) {
      lines.push("DTSTART:" + ds + "T" + st);
      if (ev.end && /^\d\d:\d\d$/.test(ev.end)) {
        var e2 = new Date(d); if (ev.end <= ev.start) e2.setDate(e2.getDate() + 1);
        lines.push("DTEND:" + e2.getFullYear() + p(e2.getMonth() + 1) + p(e2.getDate()) + "T" + ev.end.replace(":", "") + "00");
      }
    } else { var n = new Date(d); n.setDate(n.getDate() + 1); lines.push("DTSTART;VALUE=DATE:" + ds, "DTEND;VALUE=DATE:" + n.getFullYear() + p(n.getMonth() + 1) + p(n.getDate())); }
    var clean = function (s) { return String(s || "").replace(/[\\;,]/g, "\\$&").replace(/\n/g, "\\n"); };
    lines.push("SUMMARY:" + clean(ev.title), "LOCATION:" + clean(place), "DESCRIPTION:" + clean((ev.description || "") + "\n" + url), "URL:" + url, "END:VEVENT", "END:VCALENDAR");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar" }));
    a.download = ev.id + ".ics"; document.body.appendChild(a); a.click(); a.remove();
  });

  /* structured data for search engines (schema.org Event) – only for real events */
  if (!ev.placeholder && d) {
    var ld = {
      "@context": "https://schema.org", "@type": "Event", name: ev.title, url: url,
      startDate: ev.date + (ev.start && /^\d\d:\d\d$/.test(ev.start) ? "T" + ev.start : ""),
      eventStatus: ev.status === "cancelled" ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: ev.venue || ev.city || "", address: { "@type": "PostalAddress", streetAddress: ev.address || "", addressLocality: ev.city || "", addressCountry: ev.country || "" } },
      description: ev.description || "", organizer: { "@type": "Organization", name: "VAIGA – Events & Experiences", url: C.siteUrl || "" }
    };
    if (ev.image) ld.image = [(C.siteUrl || location.origin) + "/" + ev.image.replace(/^\//, "")];
    if (ev.ticketUrl) ld.offers = { "@type": "Offer", url: ev.ticketUrl, availability: ev.status === "sold-out" ? "https://schema.org/SoldOut" : "https://schema.org/InStock" };
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
  }
  V.reveal();

  function setMeta(name, value, og) {
    var sel = og ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]', m = $(sel);
    if (!m) { m = document.createElement("meta"); m.setAttribute(og ? "property" : "name", name); document.head.appendChild(m); }
    m.setAttribute("content", value || "");
  }
})();
