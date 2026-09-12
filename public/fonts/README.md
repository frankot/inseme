# Fonts

`WorkSans-*.ttf` — SIL Open Font License 1.1, from Google Fonts (latin-ext subset,
so Polish diacritics are covered).

These exist for **`@react-pdf/renderer` only**. The website itself loads Work Sans
through `next/font/google` in `src/app/layout.tsx` and does not read these files.

react-pdf cannot use woff2, and the PDF's built-in Helvetica is WinAnsi-encoded —
it has no ą/ć/ę/ł/ń/ó/ś/ź/ż, so a result sheet rendered with it would be full of
holes. Hence a real TTF checked into the repo rather than a runtime download.
