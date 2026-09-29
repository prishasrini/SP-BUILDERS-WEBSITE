import {ConstructionScene} from '@/components/construction/scene';
import {HomeAtmosphere} from '@/components/home-atmosphere';
import './light-shadow.css';
import {Story,SelectedProjects,Capabilities,Process,ContactCTA} from '@/components/sections';
import {pageMeta} from '@/lib/metadata';
import {LocalWork,ProjectQuestions} from '@/components/company-content';
export const metadata=pageMeta('Constructors & Developers in Chennai','SP Builders. A personal approach to residential apartments, individual villas and construction in Chennai since 2000.','/');
export default function Home(){return <main id="main"><ConstructionScene/><HomeAtmosphere><Story/><SelectedProjects/><Capabilities sculpted/><LocalWork/><Process sculpted/><ProjectQuestions/><ContactCTA/></HomeAtmosphere></main>}

