import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const publicDir = path.resolve("public");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (!entry.isFile() || !entry.name.includes("?")) {
      continue;
    }

    const cleanName = entry.name.replace(/\?.*$/, "");
    const cleanPath = path.join(dir, cleanName);
    const sourcePath = fullPath;
    const sourceBuffer = await readFile(sourcePath);

    let output = sourceBuffer;

    if (path.extname(cleanName) === ".css") {
      output = Buffer.from(sourceBuffer.toString("utf8").replace(/%3F/gi, "?"), "utf8");
    }

    await mkdir(path.dirname(cleanPath), { recursive: true });
    await writeFile(cleanPath, output);
  }
}

const publicStats = await stat(publicDir);

if (!publicStats.isDirectory()) {
  throw new Error(`Expected public directory at ${publicDir}`);
}

await walk(publicDir);
