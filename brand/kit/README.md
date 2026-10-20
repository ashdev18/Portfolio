# Ash Dev brand kit

Two candidate marks are in review, **Sprout Studio** and **Peek**. They share everything else:
the colour roles, the motion rules and the emotion set. Open `index.html` to see the kit; the
buttons at the top switch the mark and the palette, and every section follows. You can link to
a combination directly, for example `index.html#peek-ocean`.

## Palettes

| Mark | Palettes (first is the default) |
| --- | --- |
| Sprout Studio | Forest, Midnight, Citrus, Lime pop |
| Peek | Leaf, Ocean, Sunny, Bubblegum, Night |

Every palette has the same roles (`bg`, `surface`, `ink`, `muted`, `brand`, `onBrand`, `accent`,
`highlight`, `deep`, `soft`) plus the mark's own colours. Text pairs (ink on background, button text
on brand, accent on surface and on background) all pass WCAG AA.

## Files

```
marks.js          the source: both marks, six emotions, palettes, motion CSS
export.js         writes every asset below from marks.js
render-png.js     the PNG part of the export (headless Chromium)
index.html        the brand kit page (kit.css, kit.js)
tokens.css        every palette as CSS variables; use data-brand="peek" data-palette="ocean"
tokens.json       every palette as data, for thumbnails, Unity UI themes and so on
fonts/            the two wordmark fonts, used to outline the lettering in the SVGs
assets/<mark>/<palette>/
  logo-horizontal.svg, logo-horizontal-light.svg   main logo, and the version for dark backgrounds
  logo-stacked.svg, logo-stacked-light.svg         mark above the lettering
  wordmark.svg, wordmark-light.svg                 lettering only
  mark-<emotion>.svg                               neutral, happy, surprised, sleepy, focused, oops
  mark-<emotion>-animated.svg                      the same, moving (CSS inside the SVG)
  icon-512.png, favicon-32.png, avatar-800.png      app icon, browser tab, round avatars
  youtube-banner-2560x1440.png                     logo inside YouTube's 1546 x 423 safe area
  logo-horizontal-1200.png                         transparent PNG of the main logo
assets/photos/    placeholder game frames used on the kit page
```

The lettering in the SVG logos is converted to outlines, so the files look the same everywhere,
with or without the fonts installed.

## Changing something

Edit `marks.js` (a shape, a colour, a new palette), then regenerate everything:

```
npm install            # opentype.js, and Playwright for the PNGs
node export.js         # SVGs, tokens.css, tokens.json
node export.js --png   # also the PNGs
```

If Chromium is already installed somewhere, `CHROMIUM_PATH=/path/to/chrome node export.js --png`
uses it instead of Playwright's own download.

## Fonts

Bricolage Grotesque (Sprout Studio) and Gabarito (Peek) are both under the SIL Open Font License
and come from Google Fonts. Text on the page uses Instrument Sans or Gabarito, with IBM Plex Mono for
labels and data.

## Status

These drawings are good enough to choose between and to use on the web. Before printing
merchandise or a large banner, have an illustrator refine the final mark from these files.
