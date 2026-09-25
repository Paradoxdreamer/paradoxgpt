"use strict";
/**
 * Production build: copy src → dist, obfuscate JS.
 * Usage: node scripts/build.js
 */
const fs = require("fs-extra");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SRC = path.join(ROOT, "src");

const OBFUSCATOR_OPTIONS = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: "hexadecimal",
  renameGlobals: false,
  selfDefending: false,
  stringArray: true,
  stringArrayEncoding: ["base64"],
  stringArrayThreshold: 0.75,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  target: "node",
  ignoreImports: true,
};

async function walkJs(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walkJs(full, out);
    else if (e.isFile() && e.name.endsWith(".js")) out.push(full);
  }
  return out;
}

async function main() {
  console.log("ParadoxGPT production build (obfuscated)\n");

  await fs.remove(DIST);
  await fs.ensureDir(DIST);

  console.log("→ Copying src/ → dist/");
  await fs.copy(SRC, DIST, {
    filter: (src) => !src.includes("node_modules"),
  });

  let JavaScriptObfuscator;
  try {
    JavaScriptObfuscator = require("javascript-obfuscator");
  } catch {
    console.error("javascript-obfuscator not installed. Run: npm i -D javascript-obfuscator");
    process.exit(1);
  }

  const files = await walkJs(DIST);
  console.log(`→ Obfuscating ${files.length} files…`);

  let ok = 0;
  for (const file of files) {
    try {
      const code = await fs.readFile(file, "utf8");
      const result = JavaScriptObfuscator.obfuscate(code, OBFUSCATOR_OPTIONS);
      await fs.writeFile(file, result.getObfuscatedCode(), "utf8");
      ok++;
    } catch (err) {
      console.warn(`  ! skip ${path.relative(ROOT, file)}: ${err.message}`);
    }
  }

  await fs.writeJson(
    path.join(DIST, "build-meta.json"),
    { builtAt: new Date().toISOString(), files: ok, obfuscated: true },
    { spaces: 2 }
  );

  console.log(`\nBuild complete: dist/ (${ok} files obfuscated)`);
  console.log("   Start with: npm run start:prod");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
