import type {MetadataRoute} from 'next';
import {projects} from '@/lib/content';
import {siteUrl} from '@/lib/metadata';
export default function sitemap():MetadataRoute.Sitemap{return siteUrl?['','/about','/projects','/services','/process','/contact','/privacy',...projects.map(p=>`/projects/${p.slug}`)].map(path=>({url:siteUrl+path})):[]}
