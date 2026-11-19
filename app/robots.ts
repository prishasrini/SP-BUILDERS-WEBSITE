import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/metadata';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',...(siteUrl?{allow:'/',disallow:['/api/','/admin']}:{disallow:'/'})},...(siteUrl?{sitemap:siteUrl+'/sitemap.xml'}:{})}}
