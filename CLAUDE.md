# VAIGA – Events & Experiences (projectafspraken)

- Communicatie met de gebruiker in het Nederlands; de website zelf in het Engels (internationaal merk).
- VAIGA is een **apart project**, volledig los van Latinpulse (eigen map `Documents\vaiga`, eigen repository). Latinpulse is één van de eventconcepten binnen VAIGA (schrijfwijze: "Latinpulse", kleine p).
- Techniek: uitsluitend HTML, CSS en vanilla JavaScript. Geen React, Next.js of andere frameworks, geen bouwstap. Geschikt voor GitHub Pages + domein vaiga.eu (`CNAME`). `index.html` in de root.
- Publicatie: demo op https://demo.vaiga.eu via GitHub Pages, repo `LatinpulseAlgarve/VAIGA-Events-Experiences` (openbaar), branch `main` (beschermd: wijzigen via branch + pull request). `CNAME` = `demo.vaiga.eu`, alle pagina's `noindex`, absolute adressen naar demo.vaiga.eu. vaiga.eu zelf (OVH-server) niet aanraken. Livegang op vaiga.eu: stappen in README.
- Beveiliging: CSP + referrer-policy als `<meta>` op elke pagina; geen inline scripts/`on…=`-attributen; externe links `rel="noopener"`.
- **Niets automatisch publiceren.** Niet naar GitHub pushen of een repository aanmaken zonder uitdrukkelijke toestemming.
- Geen bestaande bestanden verwijderen zonder toestemming.
- **Geen fictieve evenementen, datums, prijzen of contactgegevens.** Ontbrekende informatie = zichtbare placeholder (`<span class="placeholder-note">[...]</span>` of lege waarde in `config.js`). Voorbeeld-events alleen in `VAIGA_PREVIEW_EVENTS`, zichtbaar met `?preview=1` (gele banner).
- Gegevens: `assets/data/events.js` (evenementen), `assets/data/categories.js` (concepten, onbeperkt uitbreidbaar), `assets/js/config.js` (contact, social, formulierdienst).
- Huisstijl in `assets/css/vaiga.css` (tokens in `:root`). Header-banner `assets/img/header-800/1400/2172.jpg` bovenaan elke pagina (bron: ChatGPT-afbeelding van de gebruiker). Logo gebaseerd op die header: `logo.svg` (compact, menubalk), `logo-full.svg` (met tagline, footer), icoon `icon.svg` (+ png 180/512), deelafbeelding `og-image.jpg` (1200×630).
- Na elke wijziging: `tools\check-site.ps1` draaien en pas "klaar" melden bij **ALL OK**; daarnaast visueel controleren op telefoon (390 px) en laptop.
- Fonts niet van Google-servers laden (privacy); eigen merkletter alleen self-hosted en pas na toestemming downloaden.
