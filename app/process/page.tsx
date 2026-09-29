import {Process,ContactCTA} from '@/components/sections';
import {pageMeta} from '@/lib/metadata';
import {PlanningGuide,ProjectQuestions} from '@/components/company-content';
export const metadata=pageMeta('Our Approach','Understanding customer needs, thoughtful space planning, construction coordination and personal finishing choices.','/process');
export default function ProcessPage(){return <main id="main"><div className="section page-intro compact"><div className="section-kicker">SP / OUR APPROACH</div><h1>Working with<br/>SP Builders.</h1><p>A closer look at the conversations and choices behind your home: your requirements, the drawings, the way rooms connect and the finish you want to achieve.</p></div><Process/><PlanningGuide/><ProjectQuestions/><ContactCTA/></main>}
