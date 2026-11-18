/* VAIGA – contact form. Static site (GitHub Pages): sends to a form service if config.formEndpoint is set,
   otherwise opens the visitor's e-mail program with the message (config.email). Nothing is stored by this site. */
(function () {
  "use strict";
  var C = window.VAIGA_CONFIG || {}, V = window.VAIGA;
  var f = document.getElementById("contact-form");
  if (!f || !V) return;
  var F = function (n) { return f.elements.namedItem(n); };   // form fields by name (form.name would be the form's own name attribute)
  var msg = f.querySelector(".msg-box"), started = Date.now();
  var topic = new URLSearchParams(location.search).get("topic");
  // only accept a topic that exists in the list (no URL text in a selector, so a crafted link cannot break the form)
  if (topic && Array.prototype.some.call(F("topic").options, function (o) { return o.value === topic; })) F("topic").value = topic;
  if (!C.formEndpoint && !C.email) {
    msg.innerHTML = '<p class="msg err">The contact form is not connected yet <span class="placeholder-note">[add an e-mail address or form service in assets/js/config.js]</span>.</p>';
  }
  function show(type, text) { msg.innerHTML = '<p class="msg ' + type + '" role="' + (type === "err" ? "alert" : "status") + '">' + V.esc(text) + "</p>"; }

  /* ---------- "I am not a robot" (same as the community sign-up): an EMPTY box the visitor ticks; only then
     Cloudflare Turnstile checks in the background (privacy-friendly, no Google, no tracking cookies).
     Note: this site is static, so the token cannot be verified on a server of our own; it stops automatic
     form-filling bots in the browser. The form service (FormSubmit) also filters spam itself. ---------- */
  var tsKey = C.turnstileSiteKey || "", tsId = null, tsTok = "", tsFailed = false;
  var RB = {
    robot: "I am not a robot", busy: "Checking…", ok: "Checked ✓", click: "Tick the box below to finish the check.",
    need: "Please confirm that you are not a robot.", wait: "One moment: the check is still running.",
    load: "The \"I am not a robot\" check could not load. Check your connection and reload the page."
  };
  var sendWrap = f.querySelector('button[type="submit"]') && f.querySelector('button[type="submit"]').parentNode;
  if (tsKey && sendWrap) {
    var rb = document.createElement("div");
    rb.className = "robot-box";
    rb.innerHTML = '<label class="check"><input type="checkbox" name="not_robot" value="1"> <span><span>' + V.esc(RB.robot) + '</span> *</span></label><p class="robot-st" aria-live="polite"></p><div class="robot-ts"></div>';
    f.insertBefore(rb, msg && msg.parentNode === f ? msg : sendWrap);
  }
  var cbRobot = f.querySelector('input[name="not_robot"]');
  function tsStatus(t) { var st = f.querySelector(".robot-st"); if (st) st.textContent = t || ""; }
  function tsLoad(done) {
    if (window.turnstile) { done(); return; }
    window.vaigaTsReady = done;
    if (document.getElementById("vaiga-ts-js")) return;
    var s = document.createElement("script"); s.id = "vaiga-ts-js"; s.async = true; s.defer = true;
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=vaigaTsReady";
    s.onerror = function () { tsFailed = true; tsStatus(RB.load); };
    document.head.appendChild(s);
  }
  function tsStart() {
    var el = f.querySelector(".robot-ts"); if (!el) return;
    tsTok = ""; tsStatus(RB.busy);
    tsLoad(function () {
      try {
        if (tsId !== null) { window.turnstile.reset(tsId); return; }
        tsId = window.turnstile.render(el, {
          sitekey: tsKey, theme: "dark", appearance: "interaction-only", language: (document.documentElement.lang || "en").slice(0, 2),
          callback: function (t) { if (!cbRobot || !cbRobot.checked) { tsTok = ""; return; } tsTok = t; tsStatus(RB.ok); },
          "before-interactive-callback": function () { tsStatus(RB.click); },
          "expired-callback": function () { tsStop(); },
          "error-callback": function () { tsTok = ""; tsStatus(RB.load); }
        });
      } catch (x) { tsStatus(RB.load); }
    });
  }
  function tsStop() {
    tsTok = ""; tsStatus("");
    if (cbRobot) cbRobot.checked = false;
    try { if (tsId !== null && window.turnstile) window.turnstile.reset(tsId); } catch (x) {}
  }
  if (cbRobot) cbRobot.addEventListener("change", function () { msg.innerHTML = ""; if (cbRobot.checked) tsStart(); else tsStop(); });
  function robotOk() {
    if (!cbRobot) return true;                       // no key configured: no check
    if (!cbRobot.checked) { show("err", RB.need); return false; }
    if (!tsTok) { show("err", tsFailed ? RB.load : RB.wait); return false; }
    return true;
  }

  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (F("website").value) return;                                   // spam trap (hidden field)
    if (Date.now() - started < 2500) { show("err", "Please take a moment and try again."); return; }
    var name = F("name").value.trim(), email = F("email").value.trim(), text = F("message").value.trim();
    var phone = F("phone").value.trim();
    if (!name || !email || !phone || !text) { show("err", "Please fill in your name, e-mail address, phone number and message."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { show("err", "Please enter a valid e-mail address."); F("email").focus(); return; }
    if (!/^\+?[0-9()\s.\-]{6,25}$/.test(phone) || phone.replace(/\D/g, "").length < 6) { show("err", "Please enter a valid phone number (with country code if outside Portugal, e.g. +351 ...)."); F("phone").focus(); return; }
    if (!F("consent").checked) { show("err", "Please agree that we use your details to answer your message."); return; }
    if (!robotOk()) return;
    var topicLabel = F("topic").options[F("topic").selectedIndex].text;
    var subject = "[VAIGA] " + topicLabel + " – " + name;
    // extra fields of a form (e.g. Plan your party: date, guests, place); label from data-extra (English, for VAIGA)
    var extra = Array.prototype.map.call(f.querySelectorAll("[data-extra]"), function (el) { var v = String(el.value || "").trim(); return v ? "\n" + el.getAttribute("data-extra") + ": " + v : ""; }).join("");
    var org = F("org") ? F("org").value.trim() : "";
    var body = "Name: " + name + "\nE-mail: " + email + "\nPhone: " + phone + (org ? "\nOrganisation: " + org : "") + "\nTopic: " + topicLabel + extra + "\n\n" + text;

    if (C.formEndpoint) {
      var btn = f.querySelector('button[type="submit"]'); btn.disabled = true;
      // what the form service forwards: the readable message + subject, reply-to the visitor; never the spam-trap field
      var fd = new FormData();
      fd.append("_subject", subject);
      fd.append("_replyto", email);
      fd.append("_template", "box");
      fd.append("_captcha", "false");
      fd.append("name", name); fd.append("email", email); fd.append("phone", phone);
      fd.append("message", body);
      fetch(C.formEndpoint, { method: "POST", headers: { "Accept": "application/json" }, body: fd })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || (j && (j.success === false || j.success === "false"))) throw new Error(); }); })
        .then(function () { f.reset(); tsStop(); show("ok", "Thank you! Your message has been sent. We will get back to you as soon as possible."); })
        .catch(function () { show("err", "Sending did not work. Please try again later" + (C.email ? " or e-mail " + C.email : "") + "."); })
        .then(function () { btn.disabled = false; });
      return;
    }
    if (C.email) {
      location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      show("ok", "Your e-mail program opens with your message. Please press send there.");
      return;
    }
    show("err", "The contact form is not connected yet. Please try again later.");
  });
})();
