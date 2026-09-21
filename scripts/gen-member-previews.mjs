// node scripts/gen-member-previews.mjs — keep originals, build display-size WebP assets.
import sharp from 'sharp';
import ts from 'typescript';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { previewsAreCurrent } from './preview-freshness.mjs';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const source = await readFile(resolve(root, 'lib/data/members.ts'), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { GENERATIONS } = await import(`data:text/javascript,${encodeURIComponent(js)}`);
const members = GENERATIONS.flatMap(generation => generation.members);
const totals = { count: members.length, sourceBytes: 0, sourcePixels: 0, previewBytes: 0, previewPixels: 0, thumbnailBytes: 0, thumbnailPixels: 0 };
let skipped = 0;

for (const [index, member] of members.entries()) {
  const input = resolve(root, `public${member.image}`);
  const output = resolve(root, `public${member.image.replace('/members/', '/member-previews/').replace(/\.[^/.]+$/, '.webp')}`);
  const thumbnailOutput = output.replace(/\.webp$/, '.thumb.webp');
  if (await previewsAreCurrent([input, fileURLToPath(import.meta.url), resolve(root, 'lib/data/members.ts')], [output, thumbnailOutput])) {
    skipped++;
    console.log(`[${index + 1}/${members.length}] ${member.name}: unchanged, skipped`);
    continue;
  }
  await mkdir(dirname(output), { recursive: true });
  const metadata = await sharp(input).metadata();
  // Decode the large original once; both outputs use this bounded, oriented pixel buffer.
  const { data, info } = await sharp(input).rotate()
    .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
    .raw().toBuffer({ resolveWithObject: true });
  const raw = { width: info.width, height: info.height, channels: info.channels };
  const preview = await sharp(data, { raw }).webp({ quality: 84 }).toFile(output);
  const thumbnail = await sharp(data, { raw })
    .resize({ width: 128, height: 128, fit: 'cover', position: 'centre', withoutEnlargement: true })
    .webp({ quality: 82 }).toFile(thumbnailOutput);
  totals.sourceBytes += (await stat(input)).size;
  totals.sourcePixels += metadata.width * metadata.height;
  totals.previewBytes += preview.size;
  totals.previewPixels += preview.width * preview.height;
  totals.thumbnailBytes += thumbnail.size;
  totals.thumbnailPixels += thumbnail.width * thumbnail.height;
  console.log(`[${index + 1}/${members.length}] ${member.name}: ${metadata.width}×${metadata.height} → ${preview.width}×${preview.height} ${(preview.size / 1024).toFixed(1)} KB; avatar ${(thumbnail.size / 1024).toFixed(1)} KB`);
}
console.log(JSON.stringify({ ...totals, generated: members.length - skipped, skipped }, null, 2));
