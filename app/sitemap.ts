import type {MetadataRoute} from 'next';
import {getContent} from '@/lib/content-store';
import {siteUrl} from '@/lib/metadata';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  if(!siteUrl)return [];
  const {projects}=await getContent();
  return ['','/about','/projects','/services','/joint-ventures','/process','/contact','/privacy',...projects.map(p=>`/projects/${p.slug}`)].map(path=>({url:siteUrl+path}));
}
