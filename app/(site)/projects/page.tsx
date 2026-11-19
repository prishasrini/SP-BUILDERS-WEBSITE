import {Portfolio} from '@/components/projects/portfolio';
import {ContactCTA} from '@/components/sections';
import {Rich} from '@/components/rich';
import {getContent} from '@/lib/content-store';
import {pageMeta} from '@/lib/metadata';
export const metadata=pageMeta('Our Projects','Residential apartments and individual villas built by SP Builders in Kolathur, Chennai.','/projects');
export default async function Projects(){
  const content=await getContent();
  return <main id="main">
  <section className="page-hero"><div className="section"><span className="label">Projects</span><h1><Rich text={content.projectsPage.heading}/></h1><p>{content.projectsPage.intro}</p></div></section>
  <section className="section"><Portfolio projects={content.projects}/><p className="fine-print">{content.projectsPage.note}</p></section>
  <ContactCTA content={content}/></main>}
