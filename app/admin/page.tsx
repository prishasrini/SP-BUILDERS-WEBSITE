import type { Metadata } from 'next';
import { adminConfigured, isAdmin } from '@/lib/admin-auth';
import { getContentFresh, listHistory, storageMode } from '@/lib/content-store';
import { LoginForm } from '@/components/admin/login-form';
import { Editor } from '@/components/admin/editor';
import './admin.css';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!adminConfigured()) {
    return <main className="admin admin-center"><div className="admin-card">
      <h1>Admin is not set up yet</h1>
      <p>Add an environment variable called <code>ADMIN_PASSWORD</code> (at least 8 characters) in your Vercel project settings, then redeploy. The steps are in <code>ADMIN-SETUP.md</code>.</p>
    </div></main>;
  }
  if (!(await isAdmin())) return <main className="admin admin-center"><LoginForm /></main>;
  const [content, history] = await Promise.all([getContentFresh(), listHistory()]);
  return <Editor initial={content} history={history} storage={storageMode()} />;
}
