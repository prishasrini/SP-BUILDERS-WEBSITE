import {notFound} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft, ArrowUpRight, MessageCircle, Phone} from 'lucide-react';
import {Gallery} from '@/components/gallery';
import {ContactCTA} from '@/components/sections';
import {getContent} from '@/lib/content-store';
import {pageMeta} from '@/lib/metadata';
import {telLink, whatsappLink} from '@/lib/whatsapp';
export async function generateStaticParams(){return (await getContent()).projects.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=(await getContent()).projects.find(p=>p.slug===slug);return p?pageMeta(p.name,p.description.slice(0,160),`/projects/${slug}`):{title:'Project not found'}}
export default async function Project({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const content=await getContent();const projects=content.projects;
  const p=projects.find(p=>p.slug===slug);if(!p)notFound();
  const next=projects[(projects.indexOf(p)+1)%projects.length];
  const message=`Hi SP Builders, I'm interested in ${p.name}${p.location&&!p.location.startsWith('Location')?` (${p.location})`:''}. Could you share more details?`;
  return <main id="main">
    <section className="section project-page">
      <Link className="back-link" href="/projects"><ArrowLeft size={16} aria-hidden="true"/>All projects</Link>
      <div className="project-layout">
        <div className="project-media">{p.image&&<Gallery src={p.image} alt={p.name} additionalImages={p.additionalImages}/>}</div>
        <aside className="project-facts">
          <span className="spec">{p.type} · {p.scope}</span>
          <h1>{p.name}</h1>
          <p className="project-location">{p.location}</p>
          <dl>
            <div><dt>Location</dt><dd>{p.location}</dd></div>
            <div><dt>Project type</dt><dd>{p.scope}</dd></div>
            <div><dt>Configuration</dt><dd>{p.configuration}</dd></div>
          </dl>
          <a className="button button-block" href={whatsappLink(message, content.company.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} aria-hidden="true"/>Ask about this project</a>
          <a className="button button-ghost-dark button-block" href={telLink(content.company.phone)}><Phone size={18} aria-hidden="true"/>{content.company.phone}</a>
          <p className="fine-print">{content.projectsPage.note}</p>
        </aside>
      </div>
      {p.description&&<div className="project-about"><span className="label">About the project</span><p>{p.description}</p></div>}
      {next&&next.slug!==p.slug&&<Link className="next-project" href={`/projects/${next.slug}`}><span className="spec">Next project</span><strong>{next.name}</strong><ArrowUpRight size={22} aria-hidden="true"/></Link>}
    </section>
    <ContactCTA content={content} message={message}/>
  </main>}
