#!/usr/bin/env bash
# Rebuilds src/fonts from the EB Garamond sources.
# Needs python3 with: fonttools brotli opentype-feature-freezer
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="$here/../src/fonts"
work="$(mktemp -d)"
curl -sL -o "$work/ebg.zip" https://github.com/octaviopardo/EBGaramond12/archive/refs/heads/master.zip
unzip -q "$work/ebg.zip" -d "$work"
src="$work/EBGaramond12-master/fonts/ttf"
glyphs="U+0020-007E,U+00A0-00FF,U+2009,U+200A,U+2012-2014,U+2018,U+2019,U+201C,U+201D,U+2020,U+2022,U+2026,U+2116,U+2192,U+2619,U+261E,U+25E6,U+2766,U+2767"

build() { # <source ttf> <features> <family suffix> <output name>
  pyftfeatfreeze -f "$2" -S -U "$3" "$src/$1" "$work/$4.ttf" 2>/dev/null
  python3 "$here/oldstyle-figures.py" "$work/$4.ttf"
  pyftsubset "$work/$4.ttf" --unicodes="$glyphs" --flavor=woff2 --name-IDs='*' \
    --layout-features='kern,liga,clig,calt,mark,mkmk,locl,ccmp' --output-file="$out/$4.woff2"
}

build EBGaramond-Regular.ttf onum Text ebg-text
build EBGaramond-Italic.ttf onum TextItalic ebg-italic
build EBGaramond-Regular.ttf smcp,c2sc,onum SC ebg-sc
build EBGaramond-Medium.ttf onum TextMedium ebg-medium
cp "$work/EBGaramond12-master/OFL.txt" "$out/OFL.txt"
