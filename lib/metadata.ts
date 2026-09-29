import type { Metadata } from 'next';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
export function pageMeta(title:string, description:string, path:string):Metadata { return {title, description, ...(siteUrl ? {alternates:{canonical:siteUrl+path}}:{}),openGraph:{title,description,type:'website',...(siteUrl?{url:siteUrl+path}:{}),images:[{url:'/images/company.webp',width:849,height:484,alt:'SP Builders architectural visualisation'}]}} }
