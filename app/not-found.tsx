import Link from 'next/link';
import {Navigation, Footer} from '@/components/navigation';
import {getContent} from '@/lib/content-store';
export default async function NotFound(){
  const {company}=await getContent();
  return <><Navigation company={company}/><main id="main"><section className="page-hero page-hero-tall"><div className="section"><span className="label">404</span><h1>Page <em>not found.</em></h1><p>The page you were looking for doesn’t exist or has moved.</p><Link className="button" href="/">Back to home</Link></div></section></main><Footer company={company}/></>}
