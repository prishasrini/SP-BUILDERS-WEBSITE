'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, updateTag } from 'next/cache';
import { endSession, passwordMatches, requireAdmin, startSession } from '@/lib/admin-auth';
import { listHistory, readHistory, saveContent, storeImage, type HistoryEntry } from '@/lib/content-store';
import { withDefaults, type SiteContent } from '@/lib/site-content';

export async function login(_: { error?: string } | undefined, form: FormData) {
  const password = String(form.get('password') ?? '');
  if (!passwordMatches(password)) {
    await new Promise(resolve => setTimeout(resolve, 900));
    return { error: 'That password is not correct.' };
  }
  await startSession();
  redirect('/admin');
}

export async function logout() {
  await endSession();
  redirect('/admin');
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Checks content from the editor before it is saved.
function clean(input: unknown): { content?: SiteContent; error?: string } {
  const content = withDefaults(input);
  const slugs = new Set<string>();
  for (const project of content.projects) {
    if (!project.name.trim()) return { error: 'Every project needs a name.' };
    if (!slugPattern.test(project.slug)) return { error: `“${project.name}” has an invalid web address. Use lowercase letters, numbers and hyphens.` };
    if (slugs.has(project.slug)) return { error: `Two projects use the web address “${project.slug}”. Each needs its own.` };
    slugs.add(project.slug);
    project.type = project.type === 'Villas' ? 'Villas' : 'Apartments';
    project.additionalImages = (project.additionalImages ?? []).filter(Boolean);
    project.featured = !!project.featured;
  }
  if (JSON.stringify(content).length > 900_000) return { error: 'The content is too large to save.' };
  return { content };
}

export async function save(input: SiteContent): Promise<{ ok: boolean; error?: string; history?: HistoryEntry[] }> {
  try {
    await requireAdmin();
    const { content, error } = clean(input);
    if (!content) return { ok: false, error };
    await saveContent(content);
    updateTag('content');
    revalidatePath('/', 'layout');
    return { ok: true, history: await listHistory() };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Saving failed. Please try again.' };
  }
}

export async function uploadImage(form: FormData): Promise<{ url?: string; error?: string }> {
  try {
    await requireAdmin();
    const file = form.get('file');
    if (!(file instanceof File)) return { error: 'No image received.' };
    if (file.type !== 'image/webp' && file.type !== 'image/jpeg') return { error: 'Please upload a photo (JPG, PNG or WebP).' };
    if (file.size > 5 * 1024 * 1024) return { error: 'That image is too large. Please use one under 5 MB.' };
    const url = await storeImage(String(form.get('name') ?? 'image'), await file.arrayBuffer(), file.type);
    return { url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Upload failed. Please try again.' };
  }
}

export async function loadVersion(id: string): Promise<{ content?: SiteContent; error?: string }> {
  try {
    await requireAdmin();
    const content = await readHistory(id);
    return content ? { content } : { error: 'That version could not be found.' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Could not load that version.' };
  }
}
