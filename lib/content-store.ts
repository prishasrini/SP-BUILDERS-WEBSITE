import 'server-only';
import { unstable_cache } from 'next/cache';
import { head, list, put } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';
import { defaultContent, withDefaults, type Project, type SiteContent } from './site-content';

// Where admin edits are stored:
// - On Vercel: Vercel Blob (needs BLOB_READ_WRITE_TOKEN, added automatically when you create a Blob store).
// - On your computer: the .data folder, when LOCAL_CONTENT=1 is set (handy for trying the admin page locally).
// - Otherwise the built-in defaults from lib/site-content.ts are shown and saving is disabled.

const CONTENT_PATH = 'site/content.json';
const HISTORY_PREFIX = 'site/history/';
const localDir = path.join(process.cwd(), '.data');

export const storageMode = (): 'blob' | 'local' | 'none' =>
  process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : process.env.LOCAL_CONTENT === '1' ? 'local' : 'none';

function normalise(content: SiteContent): SiteContent {
  return {
    ...content,
    projects: content.projects.map((p: Partial<Project>) => ({
      slug: p.slug ?? '', name: p.name ?? '', location: p.location ?? '', type: p.type === 'Villas' ? 'Villas' : 'Apartments',
      scope: p.scope ?? '', configuration: p.configuration ?? '', image: p.image ?? '', additionalImages: p.additionalImages ?? [],
      description: p.description ?? '', featured: !!p.featured,
    })),
  };
}

async function readStored(): Promise<SiteContent | null> {
  const mode = storageMode();
  try {
    if (mode === 'blob') {
      const meta = await head(CONTENT_PATH);
      // The upload time in the URL skips the CDN copy, so a fresh save is read straight away.
      const response = await fetch(`${meta.url}?v=${meta.uploadedAt.getTime()}`, { cache: 'no-store' });
      if (!response.ok) return null;
      return normalise(withDefaults(await response.json()));
    }
    if (mode === 'local') {
      return normalise(withDefaults(JSON.parse(await fs.readFile(path.join(localDir, 'content.json'), 'utf8'))));
    }
  } catch {
    // Nothing saved yet, or storage unavailable: fall back to defaults.
  }
  return null;
}

// Cached for every visitor; the admin save clears this cache so changes show straight away.
// The deployment id is part of the cache key, so each new deployment starts fresh and picks up
// changes to the built-in defaults; admin saves clear the cache through the 'content' tag.
const cacheVersion = process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_BUILD_STAMP || 'local';
export const getContent = unstable_cache(async (): Promise<SiteContent> => (await readStored()) ?? defaultContent, ['site-content', cacheVersion], { tags: ['content'] });

// Uncached read for the admin page.
export async function getContentFresh(): Promise<SiteContent> {
  return (await readStored()) ?? defaultContent;
}

export async function saveContent(content: SiteContent) {
  const mode = storageMode();
  const body = JSON.stringify(content, null, 2);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  if (mode === 'blob') {
    await put(CONTENT_PATH, body, { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 });
    await put(`${HISTORY_PREFIX}${stamp}.json`, body, { access: 'public', addRandomSuffix: true, contentType: 'application/json' });
    return;
  }
  if (mode === 'local') {
    await fs.mkdir(path.join(localDir, 'history'), { recursive: true });
    await fs.writeFile(path.join(localDir, 'content.json'), body);
    await fs.writeFile(path.join(localDir, 'history', `${stamp}.json`), body);
    return;
  }
  throw new Error('Saving is not set up yet. Create a Vercel Blob store for this project (see ADMIN-SETUP.md).');
}

export type HistoryEntry = { id: string; savedAt: string };

export async function listHistory(): Promise<HistoryEntry[]> {
  const mode = storageMode();
  if (mode === 'blob') {
    const { blobs } = await list({ prefix: HISTORY_PREFIX, limit: 1000 });
    return blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, 15).map(b => ({ id: b.url, savedAt: b.uploadedAt.toISOString() }));
  }
  if (mode === 'local') {
    const files = await fs.readdir(path.join(localDir, 'history')).catch(() => [] as string[]);
    const entries = await Promise.all(files.filter(f => f.endsWith('.json')).map(async f => ({ id: f, savedAt: (await fs.stat(path.join(localDir, 'history', f))).mtime.toISOString() })));
    return entries.sort((a, b) => b.savedAt.localeCompare(a.savedAt)).slice(0, 15);
  }
  return [];
}

export async function readHistory(id: string): Promise<SiteContent | null> {
  const mode = storageMode();
  try {
    if (mode === 'blob') {
      const { blobs } = await list({ prefix: HISTORY_PREFIX, limit: 1000 });
      const match = blobs.find(b => b.url === id);
      if (!match) return null;
      return normalise(withDefaults(await (await fetch(match.url, { cache: 'no-store' })).json()));
    }
    if (mode === 'local' && /^[\w.-]+\.json$/.test(id)) {
      return normalise(withDefaults(JSON.parse(await fs.readFile(path.join(localDir, 'history', id), 'utf8'))));
    }
  } catch {}
  return null;
}

export async function storeImage(name: string, data: ArrayBuffer, contentType: 'image/webp' | 'image/jpeg' = 'image/webp'): Promise<string> {
  const ext = contentType === 'image/jpeg' ? 'jpg' : 'webp';
  const mode = storageMode();
  const safe = name.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'image';
  if (mode === 'blob') {
    const result = await put(`projects/${safe}.${ext}`, data, { access: 'public', addRandomSuffix: true, contentType });
    return result.url;
  }
  if (mode === 'local') {
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(dir, { recursive: true });
    const file = `${safe}-${Date.now().toString(36)}.${ext}`;
    await fs.writeFile(path.join(dir, file), Buffer.from(data));
    return `/uploads/${file}`;
  }
  throw new Error('Image upload is not set up yet. Create a Vercel Blob store for this project (see ADMIN-SETUP.md).');
}
