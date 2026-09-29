import {Portfolio} from '@/components/projects/portfolio';
import {ContactCTA} from '@/components/sections';
import {pageMeta} from '@/lib/metadata';
export const metadata=pageMeta('Our Projects','Explore SP Builders residential apartments and individual villas in Chennai.','/projects');
export default function Projects(){return <main id="main"><section className="section page-intro"><div className="section-kicker">SP / PROJECT INDEX</div><h1>The work,<br/>in detail.</h1><p>Apartment developments, individual residences and duplex villas from the SP Builders portfolio.</p><p className="source-note">Architectural visualisations. Please enquire for current project status and availability.</p><Portfolio/></section><ContactCTA/></main>}
