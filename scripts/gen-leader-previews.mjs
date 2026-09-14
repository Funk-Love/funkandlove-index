// Local display assets: node scripts/gen-leader-previews.mjs
// Preserve originals; rerun after changing leader portraits.
import sharp from 'sharp';
import ts from 'typescript';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const source = await readFile(resolve(root, 'lib/data/leaders.ts'), 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { LEADERS } = await import(`data:text/javascript,${encodeURIComponent(js)}`);
const output = resolve(root, 'public/images/leader-previews');
await mkdir(output, { recursive: true });
let sourceBytes = 0, previewBytes = 0, sourcePixels = 0, previewPixels = 0;
for (const [index, leader] of LEADERS.entries()) {
  const input = resolve(root, `public${leader.image}`);
  const metadata = await sharp(input).metadata();
  const result = await sharp(input).rotate()
    .resize({ width: 1600, height: 960, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(resolve(output, `${leader.id}.webp`));
  sourceBytes += (await stat(input)).size;
  previewBytes += result.size;
  sourcePixels += metadata.width * metadata.height;
  previewPixels += result.width * result.height;
  console.log(`[${index + 1}/${LEADERS.length}] ${leader.name}: ${metadata.width}x${metadata.height} -> ${result.width}x${result.height}, ${(result.size / 1024).toFixed(1)} KB`);
}
console.log(JSON.stringify({ sourceBytes, previewBytes, sourcePixels, previewPixels }, null, 2));
