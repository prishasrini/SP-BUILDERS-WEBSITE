import {ContactCTA} from '@/components/sections';
import {ServiceDetails} from '@/components/company-content';
import {Rich} from '@/components/rich';
import {getContent} from '@/lib/content-store';
import {pageMeta} from '@/lib/metadata';
export const metadata=pageMeta('Services','Residential apartments, individual villas, joint ventures, construction contracting and renovation from SP Builders in Chennai.','/services');
export default async function Services(){
  const content=await getContent();
  return <main id="main">
  <section className="page-hero"><div className="section"><span className="label">Services</span><h1><Rich text={content.servicesPage.heading}/></h1><p>{content.servicesPage.intro}</p></div></section>
  <ServiceDetails content={content}/><ContactCTA content={content}/></main>}
