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
    var topicLabel = F("topic").options[F("topic").selectedIndex].text;
    var subject = "[VAIGA] " + topicLabel + " – " + name;
    // extra fields of a form (e.g. Plan your party: date, guests, place); label from data-extra (English, for VAIGA)
    var extra = Array.prototype.map.call(f.querySelectorAll("[data-extra]"), function (el) { var v = String(el.value || "").trim(); return v ? "\n" + el.getAttribute("data-extra") + ": " + v : ""; }).join("");
    var org = F("org") ? F("org").value.trim() : "";
    var body = "Name: " + name + "\nE-mail: " + email + "\nPhone: " + phone + (org ? "\nOrganisation: " + org : "") + "\nTopic: " + topicLabel + extra + "\n\n" + text;

    if (C.formEndpoint) {
      var btn = f.querySelector('button[type="submit"]'); btn.disabled = true;
      fetch(C.formEndpoint, { method: "POST", headers: { "Accept": "application/json" }, body: new FormData(f) })
        .then(function (r) { if (!r.ok) throw new Error(); f.reset(); show("ok", "Thank you! Your message has been sent. We will get back to you as soon as possible."); })
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
