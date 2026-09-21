// Pull the ungitted public/ tree from OSS: node scripts/fetch-assets.mjs [options]
//   --tier=required|recommended|optional   only this tier (repeatable, comma-separated)
//   --all                                  every tier, promo video included (~1.3 GB)
//   --force                                redownload even when the local size matches
//   --dry-run                              list what would be pulled, write nothing
// Defaults to required + recommended. The bucket is public-read, so no credentials.
import { readFile, mkdir, stat, writeFile, rename } from 'node:fs/promises';
import { resolve, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const publicDir = resolve(root, 'public');
const CONCURRENCY = 8;

const args = process.argv.slice(2);
const flag = name => args.includes(`--${name}`);
const tiers = new Set(args
  .filter(arg => arg.startsWith('--tier='))
  .flatMap(arg => arg.slice('--tier='.length).split(',').filter(Boolean)));
if (flag('all')) ['required', 'recommended', 'optional'].forEach(tier => tiers.add(tier));
if (tiers.size === 0) ['required', 'recommended'].forEach(tier => tiers.add(tier));

const manifest = JSON.parse(await readFile(resolve(root, 'asset-manifest.json'), 'utf8'));
const wanted = manifest.files.filter(file => tiers.has(file.tier));

// Already-correct files are skipped by size; OSS keeps no checksum we can read cheaply.
const pending = [];
for (const file of wanted) {
  const target = resolve(publicDir, file.path);
  if (!flag('force')) {
    const local = await stat(target).catch(() => null);
    if (local?.size === file.bytes) continue;
  }
  pending.push(file);
}

const mb = bytes => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const totalBytes = pending.reduce((sum, file) => sum + file.bytes, 0);
console.log(`tiers: ${[...tiers].join(', ')}`);
console.log(`${wanted.length} in manifest, ${wanted.length - pending.length} already local, ${pending.length} to pull (${mb(totalBytes)})`);

if (flag('dry-run')) {
  for (const file of pending) console.log(`  would pull ${file.path} (${mb(file.bytes)})`);
  process.exit(0);
}

// Chinese directory names (25届 …) must be percent-encoded segment by segment.
const urlFor = path => `${manifest.baseUrl}/${path.split(posix.sep).map(encodeURIComponent).join('/')}`;

let done = 0, pulledBytes = 0;
const missing = [], failed = [];
const queue = pending.slice();

async function worker() {
  for (let file = queue.shift(); file; file = queue.shift()) {
    const target = resolve(publicDir, file.path);
    try {
      const response = await fetch(urlFor(file.path));
      if (response.status === 404) { missing.push(file.path); continue; }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await mkdir(dirname(target), { recursive: true });
      // Write to a sibling temp first so an interrupted run leaves no half file.
      const temp = `${target}.part`;
      await writeFile(temp, Buffer.from(await response.arrayBuffer()));
      await rename(temp, target);
      pulledBytes += file.bytes;
      done += 1;
      console.log(`[${done}/${pending.length}] ${file.path} (${mb(file.bytes)})`);
    } catch (error) {
      failed.push(`${file.path}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`\npulled ${done} files (${mb(pulledBytes)})`);
if (missing.length) {
  console.log(`\nnot on OSS — stale manifest entries, safe to ignore unless you need them:`);
  for (const path of missing) console.log(`  ${path}`);
}
if (failed.length) {
  console.error(`\nfailed:`);
  for (const line of failed) console.error(`  ${line}`);
  process.exit(1);
}
