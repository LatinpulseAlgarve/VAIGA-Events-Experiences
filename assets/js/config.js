/* ===================================================================
   VAIGA – site settings. Fill in the empty values ("") when known.
   Empty values are shown as placeholders or hidden; nothing is invented.
   =================================================================== */
window.VAIGA_CONFIG = {
  /* Empty = the address the site is opened on (vaiga.eu), so share links always work. */
  siteUrl: "",

  /* Website shown behind the "Go to website" buttons (location info on the contact page and in the community app). */
  websiteUrl: "https://vaiga.eu",

  /* Contact – [PLACEHOLDER] fill in the real public address and phone */
  email: "info@vaiga.eu",
  phone: "+351 968 046 741",
  city: "Tavira, Portugal",

  /* Contact form + Plan your party: form service FormSubmit (formsubmit.co, no account; the first message sends an
     activation e-mail to info@vaiga.eu – click the link in it once). Other services (Formspree, Basin) also work.
     Empty = the form opens the visitor's e-mail program with the message (needs "email" above).
     SECURITY: when you fill this in, also add the service's address to "connect-src" in the
     Content-Security-Policy <meta> of contact.html, otherwise the browser blocks sending. */
  formEndpoint: "https://formsubmit.co/ajax/info@vaiga.eu",

  /* Form gateway (decision 2026-11-19): Cloudflare Worker "vaiga-forms" (code: tools/cloudflare-worker/vaiga-forms.js).
     It verifies the "I am not a robot" token with Cloudflare (siteverify, Secret Key only in the Worker) and only
     then forwards the message to FormSubmit. Filled in = forms send here instead of formEndpoint.
     SECURITY: its address must also be in "connect-src" of the Content-Security-Policy of contact.html and plan.html. */
  formGateway: "https://vaiga-forms.latinpulse.workers.dev/send",

  /* Community sign-up: "I am not a robot" check with Cloudflare Turnstile (decision 2026-11-18; free, no Google,
     no tracking cookies). Fill in the SITE KEY of the Turnstile widget (Cloudflare dashboard → Turnstile → Add widget,
     domains vaiga.eu + community.vaiga.eu). The site key is public; the SECRET key never goes in this repo – it belongs
     in the form gateway Worker (formGateway) and in the community server, which verify every token with Cloudflare.
     Widget "vaiga.eu" (hostnames vaiga.eu + community.vaiga.eu, mode Managed), created 2026-11-18.
     Empty = the preview uses Cloudflare's public test key (always passes, shows "testing only"). */
  turnstileSiteKey: "0x4AAAAAAGHanVHArxDxXnK8",

  /* Social media – empty ones are not shown */
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    whatsapp: ""        // a wa.me link, e.g. "https://wa.me/351..."
  },

  /* Latinpulse is one of the VAIGA event concepts (separate brand) */
  // Latinpulse Algarve (partner / Latin concept): website
  latinpulseUrl: "https://latinpulse.eu",
  // Latinpulse Algarve website (link above the Latin Parties concept text)
  latinpulseAlgarveUrl: "https://latinpulsealgarve.eu"
};
