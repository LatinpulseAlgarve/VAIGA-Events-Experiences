# VAIGA-Events-Experiences

Demo website for VAIGA Events & Experiences, published at **https://demo.vaiga.eu**.

## Publishing (GitHub Pages)

Every push to `main` copies the site files to the `gh-pages` branch
(`.github/workflows/pages.yml`), and GitHub Pages serves that branch.
The `CNAME` file sets the custom domain `demo.vaiga.eu`.

One-time setup:

1. **DNS** (at the domain provider for vaiga.eu) — add one record:

   | Type  | Name   | Value                         |
   |-------|--------|-------------------------------|
   | CNAME | `demo` | `latinpulsealgarve.github.io` |

2. If the site does not appear: repo *Settings → Pages* → Source: **Deploy from a branch**, branch `gh-pages`, folder `/ (root)`.
3. Once DNS works, tick **Enforce HTTPS** in *Settings → Pages*.

The main site at vaiga.eu is not affected.
