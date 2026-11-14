"""Point the digits at proportional old-style figures, with the alternate
numeral one (the default old-style one reads as a capital I)."""
import sys
from fontTools.ttLib import TTFont

NAMES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

for path in sys.argv[1:]:
    font = TTFont(path)
    for table in font["cmap"].tables:
        for i, name in enumerate(NAMES):
            if 0x30 + i in table.cmap:
                table.cmap[0x30 + i] = "one.01" if name == "one" else f"{name}.osf"
    font.save(path)
