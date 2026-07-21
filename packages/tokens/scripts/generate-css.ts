import { palettes, cssDefaultFlavor, colorKeys } from "../src/palettes";
import { semanticAliases, shadowTokens, transitionTokens } from "../src/semantics";
import { typography } from "../src/typography";
import { geometry } from "../src/geometry";
import type { FlavorName, Palette } from "../src/palettes";
import * as fs from "fs";
import * as path from "path";

const OUTPUT_PATH = path.resolve(import.meta.dirname!, "..", "..", "css", "src", "tokens.css");

function cssVar(name: string): string {
  return `--ctp-${name}`;
}

function flavorSemantics(flavorName: FlavorName): Record<string, string> {
  if (flavorName === "vercel" || flavorName === "vercel-light") {
    return {
      primary: "text",
      secondary: "surface2",
      success: "green",
      warning: "yellow",
      danger: "red",
      info: "teal",
    };
  }
  return semanticAliases as Record<string, string>;
}

function generateFlavorBlock(flavorName: FlavorName, selector: string, palette: Palette): string {
  const displayName = flavorName.charAt(0).toUpperCase() + flavorName.slice(1);
  let block = `/* ${displayName} Flavor */\n`;
  block += `${selector} {\n`;

  for (const key of colorKeys) {
    block += `  ${cssVar(key)}: ${palette[key]};\n`;
  }

  block += `\n  /* Contrast colors */\n`;
  block += `  ${cssVar("contrast-dark")}: ${palette.contrastDark};\n`;
  block += `  ${cssVar("contrast-light")}: ${palette.contrastLight};\n`;

  block += `\n  /* Semantic Colors */\n`;
  const alias = flavorSemantics(flavorName);
  for (const [semantic, colorKey] of Object.entries(alias)) {
    block += `  ${cssVar(semantic)}: var(${cssVar(colorKey)});\n`;
  }

  if (flavorName === cssDefaultFlavor) {
    block += `\n  /* Shadow variables */\n`;
    for (const [size, value] of Object.entries(shadowTokens)) {
      block += `  ${cssVar(`shadow-${size}`)}: ${value};\n`;
    }
  }

  block += `}\n\n`;
  return block;
}

function generate(): void {
  const defaultPalette = palettes[cssDefaultFlavor];

  let css = `/* Import Google Fonts */\n`;
  css += `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');\n`;
  css += `@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');\n\n`;

  css += `/* Default variables (${cssDefaultFlavor} flavor) */\n`;
  css += `:root {\n`;
  css += `  --ctp-font-family: '${typography.family}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n`;
  css += `  --ctp-font-family-display: '${typography.familyDisplay}', var(--ctp-font-family);\n`;
  css += `  --ctp-font-family-mono: '${typography.familyMono}', monospace;\n\n`;

  css += `  /* Radius tokens */\n`;
  css += `  --ctp-radius-square: 0px;\n`;
  css += `  --ctp-radius-rounded: ${geometry.radiusMd}px;\n`;
  css += `  --ctp-radius-pill: ${geometry.radiusPill}px;\n\n`;

  css += `  /* Transition tokens */\n`;
  css += `  --ctp-transition-timing: ${transitionTokens.timing};\n`;
  css += `  --ctp-transition-duration: ${transitionTokens.duration};\n`;
  css += `  --ctp-transition: all var(--ctp-transition-duration) var(--ctp-transition-timing);\n\n`;

  for (const key of colorKeys) {
    css += `  ${cssVar(key)}: ${defaultPalette[key]};\n`;
  }

  css += `\n  /* Contrast colors */\n`;
  css += `  ${cssVar("contrast-dark")}: ${defaultPalette.contrastDark};\n`;
  css += `  ${cssVar("contrast-light")}: ${defaultPalette.contrastLight};\n`;

  css += `\n  /* Semantic Colors */\n`;
  for (const [semantic, colorKey] of Object.entries(semanticAliases)) {
    css += `  ${cssVar(semantic)}: var(${cssVar(colorKey)});\n`;
  }

  css += `\n  /* Shadow variables */\n`;
  for (const [size, value] of Object.entries(shadowTokens)) {
    css += `  ${cssVar(`shadow-${size}`)}: ${value};\n`;
  }

  css += `}\n\n`;

  css += generateFlavorBlock("mocha", '[data-theme="mocha"]', palettes.mocha);
  css += generateFlavorBlock("frappe", '[data-theme="frappe"]', palettes.frappe);
  css += generateFlavorBlock("latte", '[data-theme="latte"]', palettes.latte);
  css += generateFlavorBlock("vercel", '[data-theme="vercel"]', palettes.vercel);
  css += generateFlavorBlock("vercel-light", '[data-theme="vercel-light"]', palettes["vercel-light"]);

  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, css);
  console.log(`✓ tokens.css written to ${OUTPUT_PATH}`);
}

generate();
