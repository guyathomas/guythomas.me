# Attributions

Everything on the sheet itself is made in code. These third-party assets are used around it.

| Asset | Used for | Source | Licence |
|---|---|---|---|
| EB Garamond (Georg Duffner, Octavio Pardo) | All type | https://github.com/octaviopardo/EBGaramond12 | SIL Open Font License 1.1 (`src/fonts/OFL.txt`) |
| "Wood Table Worn" texture | Desk surface | https://polyhaven.com/a/wood_table_worn | CC0 |
| "Artist Workshop" HDRI | Reflections and ambient light | https://polyhaven.com/a/artist_workshop | CC0 |

The font files in `src/fonts` are subsets of EB Garamond with features frozen in
(old-style figures, small caps, the alternate numeral one) so canvas text matches
CSS text exactly. `tools/build-fonts.sh` rebuilds them.
