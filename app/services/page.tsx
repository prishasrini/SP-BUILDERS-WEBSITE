import {ContactCTA} from '@/components/sections';
import {pageMeta} from '@/lib/metadata';
import {ServiceDetails} from '@/components/company-content';
export const metadata=pageMeta('Capabilities','Residential apartments, individual villas, construction contracting and renovation coordination from SP Builders in Chennai.','/services');
export default function Services(){return <main id="main"><div className="section page-intro compact"><div className="section-kicker">SP / EXPERTISE</div><h1>Construction.<br/>Development.</h1><p>From a home on your own site to a residential apartment development, the requirements shape the work. Explore our services and what to bring to the first conversation.</p></div><ServiceDetails/><ContactCTA/></main>}
