/* VAIGA – form gateway (Cloudflare Worker "vaiga-forms").
   NOT part of the website itself: this code is pasted into a Cloudflare Worker (dashboard → Workers & Pages).

   Why: vaiga.eu is a static site (GitHub Pages) and cannot check the "I am not a robot" token itself.
   This Worker does it: the contact form and Plan your party send their message HERE, the Worker asks
   Cloudflare (siteverify) whether the Turnstile token is real, and only then forwards the message to
   FormSubmit, which e-mails it to VAIGA. No token, a fake token or another website = nothing is sent.

   Settings in the Worker (Settings → Variables and Secrets), never in this file or in the repo:
   - TURNSTILE_SECRET  (type Secret, required): Secret Key of the Turnstile widget "vaiga.eu"
   - FORM_ENDPOINT     (type Secret, optional): FormSubmit address; default https://formsubmit.co/ajax/info@vaiga.eu.
                       Better later: the random FormSubmit alias (from the FormSubmit e-mail) so bots cannot post
                       to FormSubmit directly with the e-mail address.
   Nothing is stored by this Worker. */

const ALLOWED_ORIGINS = ["https://vaiga.eu", "https://www.vaiga.eu"];
const ALLOWED_HOSTNAMES = ["vaiga.eu", "www.vaiga.eu"];
const DEFAULT_ENDPOINT = "https://formsubmit.co/ajax/info@vaiga.eu";
// the only fields that are forwarded (what contact.js sends); everything else is dropped
const FIELDS = ["_subject", "_replyto", "_template", "_captcha", "name", "email", "phone", "message"];
const MAX_BYTES = 20000;

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Accept",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function reply(status, data, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: Object.assign({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, origin ? cors(origin) : {})
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const okOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";

    if (url.pathname !== "/send") return reply(404, { success: false, error: "not_found" }, okOrigin);
    if (request.method === "OPTIONS") return okOrigin ? new Response(null, { status: 204, headers: cors(okOrigin) }) : new Response(null, { status: 403 });
    if (request.method !== "POST") return reply(405, { success: false, error: "method" }, okOrigin);
    if (!okOrigin) return reply(403, { success: false, error: "origin" }, "");
    if (!env.TURNSTILE_SECRET) return reply(500, { success: false, error: "not_configured" }, okOrigin);
    if (Number(request.headers.get("Content-Length") || 0) > MAX_BYTES) return reply(413, { success: false, error: "too_large" }, okOrigin);

    let form;
    try { form = await request.formData(); } catch (e) { return reply(400, { success: false, error: "bad_request" }, okOrigin); }

    // 1. "I am not a robot": ask Cloudflare whether the token is real, unused and made on vaiga.eu
    const token = String(form.get("cf-turnstile-response") || "");
    if (!token || token.length > 2048) return reply(403, { success: false, error: "robot" }, okOrigin);
    const check = new FormData();
    check.append("secret", env.TURNSTILE_SECRET);
    check.append("response", token);
    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) check.append("remoteip", ip);
    let outcome = {};
    try {
      const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: check });
      outcome = await r.json();
    } catch (e) { return reply(502, { success: false, error: "verify_unavailable" }, okOrigin); }
    if (!outcome.success || !ALLOWED_HOSTNAMES.includes(outcome.hostname)) return reply(403, { success: false, error: "robot" }, okOrigin);

    // 2. forward only the known fields to FormSubmit
    const out = new FormData();
    for (const k of FIELDS) {
      const v = form.get(k);
      if (typeof v === "string" && v.length) out.append(k, v.slice(0, 8000));
    }
    if (!out.get("email") || !out.get("message")) return reply(400, { success: false, error: "missing" }, okOrigin);
    try {
      const r = await fetch(env.FORM_ENDPOINT || DEFAULT_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json", "Origin": "https://vaiga.eu", "Referer": "https://vaiga.eu/contact.html" },
        body: out
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === false || j.success === "false") return reply(502, { success: false, error: "send_failed" }, okOrigin);
    } catch (e) { return reply(502, { success: false, error: "send_failed" }, okOrigin); }
    return reply(200, { success: true }, okOrigin);
  }
};
