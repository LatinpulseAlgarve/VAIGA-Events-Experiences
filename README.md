# VAIGA-Events-Experiences

Demo website for VAIGA Events & Experiences, published at **https://demo.vaiga.eu**.

## Publishing (GitHub Pages)

GitHub Pages serves the `main` branch directly: every push to `main` updates the site.
The `CNAME` file sets the custom domain `demo.vaiga.eu`.

One-time setup:

1. **DNS** (at the domain provider for vaiga.eu) — add one record:

   | Type  | Name   | Value                         |
   |-------|--------|-------------------------------|
   | CNAME | `demo` | `latinpulsealgarve.github.io` |

2. Once DNS works, tick **Enforce HTTPS** in repo *Settings → Pages*.

The main site at vaiga.eu is not affected.
