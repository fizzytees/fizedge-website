# FizEdge Projects website

The new fizedge.com: an apparel company with two pillars, the **Apparel Artwork Service** and **Our Apparel Brands** (starting with Coolprez).

Plain HTML, CSS and JavaScript. No build step, no frameworks, no dependencies. It runs on GitHub Pages exactly like the old site.

## Pages

| URL | File |
|---|---|
| `/` | `index.html` |
| `/apparel-artwork/` | `apparel-artwork/index.html` |
| `/brands/coolprez/` | `brands/coolprez/index.html` |
| `/about/` | `about/index.html` (founder, team, partners, company info) |
| `/contact/` | `contact/index.html` (sends to Formspree) |
| `/legal/privacy/`, `/legal/terms/` | drafts, see "Before launch" |
| `404.html` | shown for missing pages |

Old URLs (`/services/`, `/prep/`, `/artwork-upscaling/`, `/ehancement/`, `/illustration-artwork/`, `/our-journey/`, `/team/`, `/founder/`) still exist as small redirect pages, so old links and search results keep working.

## Everyday changes

**Coolprez status.** Open `assets/js/config.js` and change `status`:

- `'in-development'`: "In development" badges; buttons go to the Coolprez page (current setting)
- `'launch-list'`: "Coming soon" badges, plus an email sign-up form on the Coolprez page
- `'live'`: "Now open" badges; buttons open the store. Also set `storeUrl`, e.g. `'https://coolprez.com'`

Every Coolprez badge and button on the site updates from that one setting.

**Contact form.** Messages go to the same Formspree form as the old site (`formEndpoint` in `config.js`).

**Text and photos.** Edit the HTML file for that page. Header and footer are repeated in each page, so a menu change needs to be made in every `index.html`. Images live in `assets/img/` (team photos in `assets/img/team/`).

**Styles.** Everything is in `assets/css/site.css`. Brand colours are at the top (`--blue`, `--green`, `--orange`, plus the Coolprez colours).

After changing CSS or JS, raise the `?v=1` number on the `site.css` / `site.js` / `config.js` lines in each page so visitors' browsers fetch the new version.

## Preview on your computer

Links are relative, so most browsers show the pages if you open `index.html` directly. For an exact preview (forms, folder links), run a small local server in this folder:

- With Python: `python -m http.server 8000`, then open http://localhost:8000
- Or in VS Code: install the "Live Server" extension and click "Go Live"

## Publishing (GitHub Pages)

1. Back up the current site first: in the GitHub repo, create a branch called `old-site` from `main`.
2. Replace the contents of the repo's `main` branch with the contents of this folder (keep `CNAME`, which points to fizedge.com).
3. Commit and push. GitHub Pages republishes in a minute or two.
4. To roll back, restore `main` from the `old-site` branch.

The old `media/` folder (386 MB of GIFs and videos) is no longer used and can be removed from the repo.

## Company names

The footer, About page, privacy notice and terms use: "FizEdge Projects operates through two registered companies: Fizedge Projects Ltd (Nigeria, company no. 8693246) and Fizedge Projects Inc. (Canada, corporation no. 1794440-3)." The legal names use the registered spelling "Fizedge"; the public brand is written "FizEdge Projects". The only public contact is 244project@fizedge.com.

## Still worth doing

- Have the privacy notice and terms checked by someone qualified in Nigeria and Canada.
- Send one real test message through the contact form after launch.
- Replace the Coolprez concept shirts with real product photos when you have them.

## Fonts

Archivo, IBM Plex Mono and Bagel Fat One load from Google Fonts.

## Not included yet

- Analytics (none installed; the privacy notice says so).
- A file-upload field (the form asks for a file link instead).
- Real Coolprez product photos (the shirts shown are labelled concept mockups).
