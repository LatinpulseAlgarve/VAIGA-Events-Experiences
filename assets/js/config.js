/* ===================================================================
   VAIGA – site settings. Fill in the empty values ("") when known.
   Empty values are shown as placeholders or hidden; nothing is invented.
   =================================================================== */
window.VAIGA_CONFIG = {
  /* Empty = the address the site is opened on (vaiga.eu), so share links always work. */
  siteUrl: "",

  /* Contact – [PLACEHOLDER] fill in the real public address and phone */
  email: "info@vaiga.eu",
  phone: "+351 922 034 972",
  city: "Tavira, Portugal",

  /* Contact form: optional form service (e.g. Formspree, Basin, Getform).
     Empty = the form opens the visitor's e-mail program with the message (needs "email" above).
     SECURITY: when you fill this in, also add the service's address to "connect-src" in the
     Content-Security-Policy <meta> of contact.html, otherwise the browser blocks sending. */
  formEndpoint: "",

  /* Social media – empty ones are not shown */
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    whatsapp: ""        // a wa.me link, e.g. "https://wa.me/351..."
  },

  /* Latinpulse is one of the VAIGA event concepts (separate brand) */
  latinpulseUrl: "https://www.latinpulsealgarve.pt"   // Latinpulse Algarve (partner / Latin concept)
};
