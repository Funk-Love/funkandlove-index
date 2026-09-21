import { stat } from 'node:fs/promises';

// Source, data mapping and generator edits all invalidate the existing previews.
export async function previewsAreCurrent(inputs, outputs) {
  const sources = await Promise.all(inputs.map(path => stat(path)));
  const generated = await Promise.all(outputs.map(async path => {
    try { return await stat(path); }
    catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  }));
  const latestInput = Math.max(...sources.map(file => file.mtimeMs));
  return generated.every(file => file?.size > 0 && file.mtimeMs >= latestInput);
}
