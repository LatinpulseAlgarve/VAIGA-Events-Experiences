# VAIGA – Events & Experiences

**LET'S GO. LET'S CELEBRATE.**
Website van VAIGA, het internationale evenementenmerk. Gemaakt met alleen HTML, CSS en vanilla JavaScript, zonder framework en zonder bouwstap. Geschikt voor GitHub Pages met het domein **vaiga.eu**.

## Mappen

```
index.html            Home
events.html           Upcoming events (met filter per concept)
event.html            Evenementpagina (event.html?e=<id>)
categories.html       Event concepts
about.html            About VAIGA
partners.html         Event organisation & partnerships
contact.html          Contact (formulier)
privacy.html          Privacyverklaring (CONCEPT, placeholders)
legal.html            Juridische informatie / colofon (CONCEPT, placeholders)
404.html              "Pagina niet gevonden" (GitHub Pages gebruikt dit vanzelf)
CNAME                 vaiga.eu (domein voor GitHub Pages)
robots.txt, sitemap.xml, site.webmanifest, .nojekyll
assets/css/vaiga.css  Volledige huisstijl (kleuren, typografie, onderdelen)
assets/js/config.js   INSTELLINGEN: e-mail, telefoon, social media, formulierdienst
assets/js/main.js     Menu, animaties, social links, concepten
assets/js/events.js   Evenementenlijsten, evenementpagina, delen, agenda, SEO-gegevens
assets/js/contact.js  Contactformulier
assets/data/events.js      EVENEMENTEN (nu leeg: er worden geen evenementen verzonnen)
assets/data/categories.js  EVENTCONCEPTEN (onbeperkt uit te breiden)
assets/img/           Logo (logo.svg), icoon (icon.svg + png), deelafbeelding (og-image.jpg)
tools/check-site.ps1  Controle: links, SEO-basis, afbeeldingen, JavaScript-fouten
```

## Huisstijl

- **Logo:** gebaseerd op de VAIGA-header. De V is een lint in goud-oranje-magenta dat als boog over "AIGA" omhoog zwiept: "let's go". "AIGA" staat in wit-zilver.
  - `logo.svg`: compact, voor de menubalk.
  - `logo-full.svg`: met "EVENTS & EXPERIENCES", voor de footer.
  - `icon.svg`, `icon-180.png` en `icon-512.png`: de lint-V als app-icoon.
  - **Header:** `header-800/1400/2172.jpg`, de banner bovenaan elke pagina.
  - **Deelafbeelding:** `og-image.jpg`, 1200×630, uitgesneden uit de banner.
- **Kleuren:**

  | Kleur | Code | Gebruik |
  |---|---|---|
  | Night | `#0E0A24` | Basis |
  | Coral | `#FF5A36` | Celebration-verloop |
  | Magenta | `#E5338C` | Celebration-verloop |
  | Violet | `#7B4DFF` | Celebration-verloop |
  | Spark-goud | `#FFB21E` | Accenten |
  | Teal | `#12C2B4` | Accent |
  | Warm wit | `#FFF8F1` | Lichte achtergrond |

- **Typografie:** zware, hoofdletter-koppen (nu "Arial Black" als systeemletter) en een rustige leestekst (systeemletter).
  - Een eigen merkletter is voorbereid in de CSS (`--font-display`, bijvoorbeeld *Archivo Black*). Die zet je later zelf op de site, dus zonder Google-servers, om privacyredenen.
- **Beweging:** zwevende kleurvlekken, een spark-twinkel, een equalizer, een bewegende band en animaties bij het scrollen.
  - Wie in zijn toestel "minder beweging" heeft ingesteld, krijgt geen animaties.

## Een evenement toevoegen

1. Open `assets/data/events.js` en kopieer het voorbeeld uit het commentaar.
2. Vul de echte gegevens in: `id`, `title`, `category` (een id uit `categories.js`), `date` (JJJJ-MM-DD), tijden, locatie, prijs, `ticketUrl`, `description` en `status`.
3. Zet de poster of foto in `assets/img/events/` en vul het pad in bij `image`.
4. Het evenement verschijnt dan vanzelf:
   - op Home en bij Upcoming events;
   - op een eigen pagina met delen, "Add to calendar" en gegevens voor Google (schema.org Event).
5. Is de datum voorbij, dan verdwijnt het evenement vanzelf uit de lijsten.

**Voorbeeldweergave:** voeg `?preview=1` toe aan het adres (bijvoorbeeld `index.html?preview=1`). Dan zie je duidelijk gemarkeerde placeholder-evenementen. Dat is alleen om de opmaak te zien; ze zijn nooit zichtbaar op de echte site.

## Een nieuw eventconcept toevoegen

Voeg in `assets/data/categories.js` één blok toe met:
- `id`, `name`, `styles`, `short` en `long`;
- `bg`: een kleurverloop;
- `icon`: een SVG-pad van 24×24.

Het concept verschijnt dan automatisch:
- op Home en op de conceptenpagina;
- als filter bij Upcoming events.

## Instellingen invullen (`assets/js/config.js`)

- **`email`, `phone`, `city`:** de echte openbare contactgegevens. Zolang ze leeg zijn, staat er een gele placeholder.
- **`social`:** de links naar Instagram, Facebook, TikTok, YouTube en WhatsApp. Lege links worden niet getoond.
- **`formEndpoint`:** dit is optioneel. Je kunt een formulierdienst gebruiken, zoals Formspree. Zonder zo'n dienst opent het contactformulier het e-mailprogramma van de bezoeker, met het bericht al ingevuld.
- **`latinpulseUrl`:** de link naar de website van Latinpulse.

## Foto's

Alle foto-vlakken zijn nu kleurige placeholders met een label, zoals "Photo: …". Vervang ze door echte foto's waarop je de rechten hebt, en waarvoor herkenbare personen toestemming hebben gegeven.
- In de HTML vervang je `<div class="ph">…</div>` door `<img src="assets/img/…" alt="…">`.
- Gebruik bij voorkeur WebP of JPEG, ongeveer 1600 px breed.

## Lokaal bekijken

Dubbelklik `index.html`, of draai een kleine lokale server in de map.

## Controleren

```
powershell -NoProfile -ExecutionPolicy Bypass -File tools\check-site.ps1
```

Dit controleert:
- alle interne links en bestanden;
- titel, beschrijving, canonical en h1 per pagina;
- alt-teksten bij afbeeldingen;
- of de pagina's zonder JavaScript-fouten werken, ook in de voorbeeldweergave.

Het resultaat moet **ALL OK** zijn.

## Live: vaiga.eu (GitHub Pages)

- Repository: https://github.com/LatinpulseAlgarve/VAIGA-Events-Experiences (openbaar), branch `main`, map `/ (root)`.
- Elke wijziging in `main` staat binnen ~1 minuut op https://vaiga.eu. Werk op een eigen branch en voeg samen via een pull request (`main` is beschermd).
- `CNAME` = `vaiga.eu`. `www.vaiga.eu` stuurt GitHub vanzelf door naar `vaiga.eu`.
- DNS bij OVH: A/AAAA `@` → GitHub Pages, CNAME `www` → `latinpulsealgarve.github.io`. **E-mail (MX, SPF) blijft bij OVH; niet aanraken.**
- Absolute adressen (canonical, og, sitemap) wijzen naar `https://vaiga.eu/`.
- Bewaard: oude eenvoudige demo op tag `backup-oude-demo-2026-11-18`.

### Blijven wijzigen met Claude

Open Claude Code in `Documents\vaiga` en vraag de wijziging. Claude werkt op een nieuwe branch, draait `tools\check-site.ps1` (ALL OK), controleert telefoon en laptop, en zet het na jouw akkoord via een pull request op `main` → live.

### Beveiliging

GitHub Pages kan geen eigen HTTP-headers sturen. Daarom staat de beveiliging in `<meta>`-tags op elke pagina:
- **Content-Security-Policy:** alleen scripts, stijlen, afbeeldingen en lettertypes van de site zelf. Geen inline scripts of `onclick=` gebruiken (dat wordt geblokkeerd). Een formulierdienst in `config.js` → het adres ook toevoegen aan `connect-src` in `contact.html`.
- **Referrer-Policy:** `strict-origin-when-cross-origin`.
- Externe links altijd met `target="_blank" rel="noopener"`.
- HTTPS wordt afgedwongen (Settings → Pages → Enforce HTTPS).
- `tools/check-site.ps1` bewaakt dit allemaal.

## Hoe vaiga.eu naar GitHub Pages is gezet

1. `CNAME` = `vaiga.eu`; geen `noindex`; adressen naar `https://vaiga.eu/`; `robots.txt` met sitemap.
2. `tools/check-site.ps1` moet ALL OK geven.
3. **DNS bij OVH** (Web Cloud → Domeinnamen → vaiga.eu → DNS-zone):
   - Maak vier **A-records** voor `@`, naar `185.199.108.153`, `185.199.109.153`, `185.199.110.153` en `185.199.111.153`.
   - Maak voor IPv6 eventueel ook **AAAA-records** voor `@`, naar `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153` en `2606:50c0:8003::153`.
   - Maak een **CNAME-record** voor `www`, naar `latinpulsealgarve.github.io.`
   - Het kan tot 24 uur duren voordat dit werkt. Daarna staat de site op https://vaiga.eu.
4. **Domein verifiëren:** verifieer vaiga.eu ook onder GitHub **Settings → Pages → Verified domains**. Dan kan niemand anders je domein (en subdomeinen zoals demo.vaiga.eu) claimen.
5. **Zoekmachines:** meld de site aan bij Google Search Console, met `https://vaiga.eu/sitemap.xml`.

## Vóór livegang invullen

- [ ] Contactgegevens en social media in `config.js`.
- [ ] Juridische gegevens (naam, adres, registratie, NIF/btw) in `legal.html` en `privacy.html`. Laat de teksten nakijken.
- [ ] Echte foto's.
- [ ] Echte evenementen in `events.js`.
- [ ] Het verhaal achter VAIGA in `about.html` (de sectie "Our story").
- [ ] Eventueel de eigen merkletter (self-hosted).
