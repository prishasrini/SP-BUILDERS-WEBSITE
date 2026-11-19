import {ConstructionScene} from '@/components/construction/scene';
import {ConstructionSceneVideo} from '@/components/construction/scene-video';
import {Story,Spotlight,SelectedProjects,Capabilities,WhyUs,Process,ContactCTA} from '@/components/sections';
import {LocalWork,ProjectQuestions} from '@/components/company-content';
import {getContent} from '@/lib/content-store';
import {pageMeta} from '@/lib/metadata';
import './hero.css';

// Set NEXT_PUBLIC_HERO_MODE=video to switch back to the original video hero.
const Hero = process.env.NEXT_PUBLIC_HERO_MODE === 'video' ? ConstructionSceneVideo : ConstructionScene;

const homeMeta=pageMeta('SP Builders | Constructors & Developers in Chennai','SP Builders. Residential apartments, individual villas and construction in Kolathur, Chennai since 2000.','/');
export const metadata={...homeMeta,title:{absolute:'SP Builders | Constructors & Developers in Chennai'}};
export default async function Home(){
  const content=await getContent();
  return <main id="main"><Hero/><Spotlight content={content}/><Story content={content}/><SelectedProjects content={content}/><Capabilities content={content}/><WhyUs content={content}/><LocalWork content={content}/><Process content={content}/><ProjectQuestions content={content}/><ContactCTA content={content}/></main>}
