import Link from 'next/link';
import {ArrowUpRight, Check, MessageCircle, Phone} from 'lucide-react';
import {ContactCTA} from '@/components/sections';
import {Rich} from '@/components/rich';
import {getContent} from '@/lib/content-store';
import {pageMeta} from '@/lib/metadata';
import {telLink, whatsappLink} from '@/lib/whatsapp';
export const metadata=pageMeta('Joint Ventures','Own a plot in Chennai? Partner with SP Builders in a joint venture to develop residential apartments on your land.','/joint-ventures');
export default async function JointVentures(){
  const content=await getContent();const jv=content.jvPage;const company=content.company;
  const jvProjects=content.projects.filter(p=>/joint/i.test(p.scope));
  return <main id="main">
    <section className="page-hero"><div className="section">
      <span className="label">Joint ventures</span>
      <h1><Rich text={jv.heading}/></h1>
      <p>{jv.intro}</p>
      <div className="cta-actions">
        <a className="button" href={whatsappLink(jv.message, company.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} aria-hidden="true"/>{jv.ctaLabel}</a>
        <a className="button button-ghost" href={telLink(company.phone)}><Phone size={18} aria-hidden="true"/>{company.phone}</a>
      </div>
    </div></section>

    <section className="section">
      <div className="section-head"><div><span className="label">{jv.stepsLabel}</span><h2><Rich text={jv.stepsHeading}/></h2></div></div>
      <ol className="steps steps-5">{jv.steps.map((step,index)=><li key={step.title+index}><span className="step-number">{String(index+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
    </section>

    <section className="band band-stone"><div className="section">
      <div className="section-head"><div><span className="label">{jv.whyLabel}</span><h2><Rich text={jv.whyHeading}/></h2></div></div>
      <ul className="why-grid why-grid-4">{jv.why.map((item,index)=><li key={item.title+index}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ul>
      {jvProjects.length>0&&<div className="jv-projects"><span className="spec">Our joint-venture projects</span><div>{jvProjects.map(p=><Link key={p.slug} href={`/projects/${p.slug}`}>{p.name}<ArrowUpRight size={16} aria-hidden="true"/></Link>)}</div></div>}
    </div></section>

    <section className="section split">
      <div><span className="label">{jv.bringLabel}</span><h2><Rich text={jv.bringHeading}/></h2><p className="section-intro">Don’t have everything yet? That’s fine. Start with the location and plot size.</p></div>
      <ul className="checklist">{jv.bring.map(item=><li key={item}><Check size={18} aria-hidden="true"/>{item}</li>)}</ul>
    </section>

    <section className="section faq split">
      <div><span className="label">Questions</span><h2><Rich text={jv.faqHeading}/></h2></div>
      <div className="faq-list">{jv.faq.map((item,index)=><details key={item.question+index}><summary>{item.question}<span aria-hidden="true" className="faq-icon"/></summary><p>{item.answer}</p></details>)}</div>
    </section>

    <ContactCTA content={content} message={jv.message}/>
  </main>}
