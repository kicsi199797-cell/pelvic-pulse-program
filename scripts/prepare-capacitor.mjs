// Flattens the SPA build (`CAPACITOR_BUILD=1 vite build`) into a standard
// `dist/` folder with a root `index.html`, which is what Capacitor expects
// (`webDir: "dist"` in capacitor.config.ts).
//
// Input:  dist/client/** (static assets + prerendered routes + _shell.html)
//         dist/server/** (SSR bundle, not needed for native)
// Output: dist/index.html + dist/assets/** + prerendered route folders
import { existsSync } from "node:fs";
import { cp, readdir, rename, rm, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const server = path.join(dist, "server");

if (!existsSync(client)) {
  console.error(
    "[capacitor] dist/client not found. Run `CAPACITOR_BUILD=1 vite build` first (see `build:mobile`).",
  );
  process.exit(1);
}

// Move everything out of dist/client into dist/
for (const entry of await readdir(client)) {
  const target = path.join(dist, entry);
  await rm(target, { recursive: true, force: true });
  await rename(path.join(client, entry), target);
}

await rm(client, { recursive: true, force: true });
await rm(server, { recursive: true, force: true });

// Guarantee a root index.html: prefer the prerendered "/" page, fall back to
// the SPA shell which boots the router client-side for any route.
const indexHtml = path.join(dist, "index.html");
if (!existsSync(indexHtml)) {
  const shell = path.join(dist, "_shell.html");
  if (!existsSync(shell)) {
    console.error("[capacitor] Neither dist/index.html nor dist/_shell.html was generated.");
    process.exit(1);
  }
  await copyFile(shell, indexHtml);
}

// Capacitor serves from the filesystem, so keep a copy of the shell as the
// 404/deep-link fallback used by the native webview.
await cp(indexHtml, path.join(dist, "404.html"), { force: true });

console.log("[capacitor] dist/ ready — index.html generated. Next: bunx cap sync");
