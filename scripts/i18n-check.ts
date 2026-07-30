/**
 * i18n completeness checker.
 * Run with: bun scripts/i18n-check.ts
 * Fails (exit 1) if any locale is missing keys, has extra keys,
 * or has interpolation placeholders that differ from English.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "src/lib/i18n/locales");

type Node = Record<string, unknown>;

function flatten(obj: Node, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object") Object.assign(out, flatten(v as Node, `${prefix}${k}.`));
    else out[`${prefix}${k}`] = String(v);
  }
  return out;
}

const vars = (s: string) => (s.match(/\{(\w+)\}/g) ?? []).sort().join(",");

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".ts"));
const en = flatten((await import(path.join(DIR, "en.ts"))).default);
const enKeys = Object.keys(en);

let failed = false;
for (const file of files) {
  if (file === "en.ts") continue;
  const dict = flatten((await import(path.join(DIR, file))).default);
  const keys = Object.keys(dict);
  const missing = enKeys.filter((k) => !(k in dict));
  const extra = keys.filter((k) => !(k in en));
  const badVars = enKeys.filter((k) => k in dict && vars(dict[k]) !== vars(en[k]));

  if (missing.length || extra.length || badVars.length) {
    failed = true;
    console.error(`✗ ${file}`);
    if (missing.length) console.error(`  missing keys: ${missing.join(", ")}`);
    if (extra.length) console.error(`  unknown keys: ${extra.join(", ")}`);
    if (badVars.length) console.error(`  placeholder mismatch: ${badVars.join(", ")}`);
  } else {
    console.log(`✓ ${file} (${keys.length} keys)`);
  }
}

if (failed) process.exit(1);
console.log(`\nAll locales complete — ${enKeys.length} keys × ${files.length} languages.`);
