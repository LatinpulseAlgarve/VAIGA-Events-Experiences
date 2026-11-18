/* VAIGA – legal texts (privacy.html, community-rules.html): the full text is written per language in
   <div class="legal-doc" data-doc-lang="en|pt|es|nl"> blocks (data-no-i18n, so i18n.js leaves them alone).
   This shows the block of the chosen language (window.VAIGA_LANG from i18n.js), otherwise English. */
(function () {
  "use strict";
  var lang = window.VAIGA_LANG || "en";
  var docs = document.querySelectorAll(".legal-doc[data-doc-lang]");
  var has = Array.prototype.some.call(docs, function (d) { return d.getAttribute("data-doc-lang") === lang; });
  if (!has) lang = "en";
  Array.prototype.forEach.call(docs, function (d) { d.hidden = d.getAttribute("data-doc-lang") !== lang; });
})();
