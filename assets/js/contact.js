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
  if (topic && F("topic").querySelector('option[value="' + topic + '"]')) F("topic").value = topic;
  if (!C.formEndpoint && !C.email) {
    msg.innerHTML = '<p class="msg err">The contact form is not connected yet <span class="placeholder-note">[add an e-mail address or form service in assets/js/config.js]</span>.</p>';
  }
  function show(type, text) { msg.innerHTML = '<p class="msg ' + type + '" role="' + (type === "err" ? "alert" : "status") + '">' + V.esc(text) + "</p>"; }

  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (F("website").value) return;                                   // spam trap (hidden field)
    if (Date.now() - started < 2500) { show("err", "Please take a moment and try again."); return; }
    var name = F("name").value.trim(), email = F("email").value.trim(), text = F("message").value.trim();
    if (!name || !email || !text) { show("err", "Please fill in your name, e-mail address and message."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { show("err", "Please enter a valid e-mail address."); F("email").focus(); return; }
    if (!F("consent").checked) { show("err", "Please agree that we use your details to answer your message."); return; }
    var topicLabel = F("topic").options[F("topic").selectedIndex].text;
    var subject = "[VAIGA] " + topicLabel + " – " + name;
    var body = "Name: " + name + "\nE-mail: " + email + (F("phone").value.trim() ? "\nPhone: " + F("phone").value.trim() : "") + (F("org").value.trim() ? "\nOrganisation: " + F("org").value.trim() : "") + "\nTopic: " + topicLabel + "\n\n" + text;

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
