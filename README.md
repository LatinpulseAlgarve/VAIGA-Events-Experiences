# VAIGA-Events-Experiences

Demo website for VAIGA Events & Experiences, published at **https://demo.vaiga.eu**.

## Publishing (GitHub Pages)

Every push to `main` deploys the site via `.github/workflows/pages.yml`.

One-time setup:

1. **GitHub** → repo *Settings → Pages* → *Build and deployment* → Source: **GitHub Actions**.
2. **DNS** (at the domain provider for vaiga.eu) — add one record:

   | Type  | Name   | Value                         |
   |-------|--------|-------------------------------|
   | CNAME | `demo` | `latinpulsealgarve.github.io` |

3. Back in *Settings → Pages*: confirm the custom domain `demo.vaiga.eu` and tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).

The main site at vaiga.eu is not affected.
