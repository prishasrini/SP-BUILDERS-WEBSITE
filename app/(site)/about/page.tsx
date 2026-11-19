import Image from 'next/image';
import {ContactCTA} from '@/components/sections';
import {CompanyDepth,Founder,LocalWork} from '@/components/company-content';
import {Rich} from '@/components/rich';
import {getContent} from '@/lib/content-store';
import {pageMeta} from '@/lib/metadata';
export const metadata=pageMeta('About Us','Founded in Chennai in 2000 by civil engineer V. Srinivasan, SP Builders builds residential apartments and individual homes in Kolathur.','/about');
export default async function About(){
  const content=await getContent();const about=content.about;
  return <main id="main">
  <section className="page-hero"><div className="section split split-end"><div><span className="label">About SP Builders</span><h1><Rich text={about.heading}/></h1></div><p>{about.intro}</p></div></section>
  {about.image&&<div className="section about-visual"><Image src={about.image} alt="A home from the SP Builders portfolio" width={1448} height={1086} sizes="(max-width: 1200px) 92vw, 1100px" priority/></div>}
  <CompanyDepth content={content}/><Founder content={content}/><LocalWork content={content}/><ContactCTA content={content}/></main>}
