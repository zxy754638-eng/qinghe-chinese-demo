import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_URL = 'https://cc-cedict.org/editor/editor_export_cedict.php?c=gz';
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'dist', 'data', 'cedict.min.json');

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

async function loadSource() {
  const input = argumentValue('--input');
  if (input) return readFile(path.resolve(PROJECT_ROOT, input));

  const response = await fetch(SOURCE_URL, {
    headers: { 'User-Agent': 'Qinghe-Chinese-Dictionary-Updater/1.0' },
  });
  if (!response.ok) throw new Error(`CC-CEDICT download failed: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

function parseCedict(sourceText) {
  const entries = [];
  const headers = [];
  const rejected = [];

  for (const rawLine of sourceText.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('#')) {
      if (headers.length < 20) headers.push(line.slice(1).trim());
      continue;
    }

    const match = line.match(/^(\S+)\s+(\S+)\s+\[{1,2}(.+?)\]{1,2}\s+\/(.*)\/$/);
    if (!match) {
      if (rejected.length < 20) rejected.push(line);
      continue;
    }

    const definitions = match[4].split('/').map((value) => value.trim()).filter(Boolean);
    entries.push([match[1], match[2], match[3], ...definitions]);
  }

  return { entries, headers, rejected };
}

const compressed = await loadSource();
const sourceText = gunzipSync(compressed).toString('utf8');
const { entries, headers, rejected } = parseCedict(sourceText);

if (entries.length < 100000) {
  throw new Error(`Only ${entries.length} entries parsed; refusing to replace the complete dictionary.`);
}
if (rejected.length) {
  throw new Error(`Unparsed CC-CEDICT entries detected:\n${rejected.join('\n')}`);
}

const payload = {
  meta: {
    name: 'CC-CEDICT',
    sourceUrl: 'https://cc-cedict.org/editor/editor.php?handler=Download',
    downloadUrl: SOURCE_URL,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    generatedAt: new Date().toISOString(),
    entryCount: entries.length,
    format: 'qinghe-cedict-array-v1',
    sourceHeaders: headers,
  },
  entries,
};

await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, JSON.stringify(payload), 'utf8');

const sizeMiB = Buffer.byteLength(JSON.stringify(payload)) / 1024 / 1024;
console.log(JSON.stringify({ output: OUTPUT_PATH, entries: entries.length, sizeMiB: Number(sizeMiB.toFixed(2)) }));
