import Image from 'next/image';
import {ContactCTA} from '@/components/sections';
import {CompanyDepth,LocalWork} from '@/components/company-content';
import {pageMeta} from '@/lib/metadata';
export const metadata=pageMeta('Our Story','Founded in Chennai in 2000 by civil engineer V. Srinivasan, SP Builders puts customer trust and living comfort at the heart of construction.','/about');
export default function About(){return <main id="main"><section className="section page-intro"><div className="section-kicker">SP / THE COMPANY</div><div className="about-heading"><h1>Chennai.<br/>Since 2000.</h1><p>SP Builders is a construction and development company founded by civil engineer V. Srinivasan. Our work includes residential apartments, individual villas and renovation coordination.</p></div><div className="about-visual"><Image src="/images/project-8-clean.png" alt="SP Builders residential architectural visualisation" width={1448} height={1086} priority/><span>FROM THE COMPANY PORTFOLIO / ARCHITECTURAL VISUALISATION</span></div></section><CompanyDepth/><LocalWork/><ContactCTA/></main>}


