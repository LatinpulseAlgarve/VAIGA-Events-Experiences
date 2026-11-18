# VAIGA-Events-Experiences

Demo website for VAIGA Events & Experiences, published at **https://latinpulsealgarve.github.io/VAIGA-Events-Experiences/**.

The custom domain `demo.vaiga.eu` is temporarily switched off until its DNS record exists (see below).

## Publishing (GitHub Pages)

GitHub Pages serves the `main` branch directly: every push to `main` updates the site.
To use `demo.vaiga.eu` again: add the DNS record below, then add a file `CNAME` containing `demo.vaiga.eu` (or set the custom domain in *Settings → Pages*).

One-time setup:

1. **DNS** (at the domain provider for vaiga.eu) — add one record:

   | Type  | Name   | Value                         |
   |-------|--------|-------------------------------|
   | CNAME | `demo` | `latinpulsealgarve.github.io` |

2. Once DNS works, tick **Enforce HTTPS** in repo *Settings → Pages*.

The main site at vaiga.eu is not affected.
