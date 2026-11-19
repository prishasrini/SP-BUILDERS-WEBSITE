import {Process,ContactCTA} from '@/components/sections';
import {PlanningGuide,ProjectQuestions} from '@/components/company-content';
import {Rich} from '@/components/rich';
import {getContent} from '@/lib/content-store';
import {pageMeta} from '@/lib/metadata';
export const metadata=pageMeta('Our Approach','How SP Builders works with you: understanding your needs, your plans, space planning and finishing choices.','/process');
export default async function ProcessPage(){
  const content=await getContent();
  return <main id="main">
  <section className="page-hero"><div className="section"><span className="label">Our approach</span><h1><Rich text={content.approachPage.heading}/></h1><p>{content.approachPage.intro}</p></div></section>
  <Process content={content} heading={false}/><PlanningGuide content={content}/><ProjectQuestions content={content}/><ContactCTA content={content}/></main>}
