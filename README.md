# Keith Francis · Personal Site

Portfolio site for AI Engineer roles. It's plain HTML, CSS and JavaScript with no build step.

Live at: https://v8integra.github.io/PersonalSite/ (once GitHub Pages is turned on)

## Files

- `index.html`: all page content, including the project cards
- `assets/css/site.css`: styles, with light and dark themes
- `assets/js/site.js`: the Ctrl+K command palette and the achievements
- `Keith_Francis_Resume.pdf`: the résumé linked from the site
- `404.html`: GitHub Pages' not-found page
- `.nojekyll`: tells GitHub Pages to serve the files as they are

## Run it locally

```bash
python -m http.server 8080
```

Then open http://localhost:8080.

## Publish on GitHub Pages

1. Push `main` to `github.com/v8integra/PersonalSite`.
2. On GitHub, open the repo's **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, then pick `main` and `/ (root)`.
4. Save. The site appears at the URL above within a minute or two.

## Common edits

- **New project:** copy an `<article class="proj">` block in `index.html` and give it a unique `data-id`. The palette's `open <name>` command picks it up automatically.
- **New résumé:** replace `Keith_Francis_Resume.pdf` with a file of the same name.
- **Palette answers:** edit `ANSWERS` in `assets/js/site.js`.
- **Custom domain:** if you move to your own domain, update the `canonical`, `og:url` and JSON-LD `url` in `index.html`, and the `/PersonalSite/` paths in `404.html`.
