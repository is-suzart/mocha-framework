import { palettes, colorKeys } from "../src/palettes";
import type { FlavorName, Palette } from "../src/palettes";
import * as fs from "fs";
import * as path from "path";

const OUTPUT_PATH = path.resolve(import.meta.dirname!, "..", "..", "..", "design-system", "MochaDS", "ThemeGenerated.qml");

function generateQmlPalette(flavorName: FlavorName, palette: Palette): string {
  let entries = "";
  const keys = [...colorKeys, "contrastDark", "contrastLight"] as const;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    entries += `                "${key}": "${palette[key]}"`;
    if (i < keys.length - 1) {
      entries += ",\n";
    } else {
      entries += "\n";
    }
  }

  return `            "${flavorName}": {\n${entries}            }`;
}

function generate(): void {
  const flavourEntries = (Object.keys(palettes) as FlavorName[])
    .map((name) => generateQmlPalette(name, palettes[name]))
    .join(",\n");

  const qml = `pragma Singleton
import QtQuick

Item {
    id: root

    readonly property var palettes: {
        return {
${flavourEntries}
        };
    }

    function resolveColor(flavor, name) {
        var palette = palettes[flavor];
        if (!palette) palette = palettes["mocha"];
        return palette[name] || "#000000";
    }
}
`;

  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, qml);
  console.log(`✓ ThemeGenerated.qml written to ${OUTPUT_PATH}`);
}

generate();
