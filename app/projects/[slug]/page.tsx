import {notFound} from 'next/navigation';
import Link from 'next/link';
import {projects} from '@/lib/content';
import {Gallery} from '@/components/gallery';
import {ContactCTA} from '@/components/sections';
import {pageMeta} from '@/lib/metadata';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projects.find(p=>p.slug===slug);return p?pageMeta(p.name,p.description,`/projects/${slug}`):{title:'Project not found'}}
export default async function Project({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projects.find(p=>p.slug===slug);if(!p)notFound();const next=projects[(projects.indexOf(p)+1)%projects.length];return <main id="main"><section className="section page-intro case-study"><Link className="text-link" href="/projects">← All projects</Link><div className="section-kicker">{p.type} / {p.scope}</div><h1>{p.name}</h1><p>{p.location}</p><Gallery src={p.image} alt={p.name} additionalImages={p.additionalImages}/><div className="case-details"><h2>Project<br/>at a glance.</h2><div><p>{p.description}</p><dl><div><dt>Location</dt><dd>{p.location}</dd></div><div><dt>Project type</dt><dd>{p.scope}</dd></div><div><dt>Configuration</dt><dd>{p.configuration}</dd></div><div><dt>Imagery</dt><dd>Architectural visualisation</dd></div></dl><p className="source-note">{p.sourceNote ?? 'Brochure visualisations cleaned with AI to remove printed labels and framing; obscured areas have been reconstructed.'} Please enquire for current status and specifications.</p></div></div><Link className="next-project" href={`/projects/${next.slug}`}><span>NEXT PROJECT</span><h2>{next.name} ↗</h2></Link></section><ContactCTA/></main>}



