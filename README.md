# Portfolio

Ash Dev's site, served by GitHub Pages: https://ashdev18.github.io/Portfolio/

The page is laid out as a rally route book. Sections are special stages (SS1–SS4),
each tool is a roadbook box with a tulip diagram and a pace-note call, and opening a
box shows its "homologation sheet" (asset ID, versions, Unity compatibility, links).

## Files

```
index.html          page structure and copy
styles/site.css     all styling; colours are tokens at the top (paper, ink, signal)
js/data.js          the tools, the timing sheet and the review quotes — edit this to update the site
js/roadbook.js      builds the tool list, timing sheet and quotes from data.js
js/stage.js         the drivable test-track car in the masthead (top-down slip model, no libraries)
media/              game reel (H.264, cropped Steam clips), its poster, and the 1200×630 share image
images/thumbs/      720px copies of the asset key art used in the sheets; originals are in images/
```

## Updating

- New tool or new version: add or edit an entry in `js/data.js`. The `call` field is the pace
  note shown next to it, e.g. `["R", 4, "long"]`; it also draws the tulip.
- New release worth noting: add a row to `TIMING` in `js/data.js`.
- Share image: `media/og-route-book.jpg`. Social sites cache it, so rename the file when it changes
  and update the `og:image` tag.
