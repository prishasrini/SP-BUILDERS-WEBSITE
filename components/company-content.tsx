import Link from 'next/link';
import {ArrowUpRight, Compass, Ruler, Users} from 'lucide-react';
import type {SiteContent} from '@/lib/site-content';
import {whatsappLink} from '@/lib/whatsapp';
import {Rich} from '@/components/rich';

const valueIcons = [Users, Ruler, Compass];

export function CompanyDepth({content}:{content:SiteContent}) {
  const about = content.about;
  return <section className="section company" aria-labelledby="company-background">
    <div className="split">
      <div>
        <span className="label">{about.peopleLabel}</span>
        <h2 id="company-background"><Rich text={about.peopleHeading}/></h2>
      </div>
      <div className="prose">
        <h3>{about.founderHeading}</h3>
        <p>{about.founderText}</p>
        {about.founderText2 && <p>{about.founderText2}</p>}
      </div>
    </div>
    <div className="values">{about.values.map((value,index)=>{const Icon=valueIcons[index%valueIcons.length];return <div key={value.title+index}><Icon size={22} aria-hidden="true"/><h3>{value.title}</h3><p>{value.text}</p></div>})}</div>
  </section>;
}

export function ServiceDetails({content}:{content:SiteContent}) {
  return <section className="section service-details" aria-label="Services in detail">{content.servicesPage.items.map((service,index)=><article className="service-detail" id={service.id || undefined} key={service.title+index}>
    <div><span className="spec">{String(index+1).padStart(2,'0')} / Service</span><h2>{service.title}</h2></div>
    <div className="prose">
      <p>{service.text}</p>
      {service.prompt && <h3>{service.prompt}</h3>}
      {service.detail && <p>{service.detail}</p>}
      <div className="inline-actions"><a className="button button-small" href={whatsappLink(service.message || undefined, content.company.whatsapp)} target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>{service.link && service.linkText && <Link className="text-link" href={service.link}>{service.linkText}<ArrowUpRight size={18} aria-hidden="true"/></Link>}</div>
    </div>
  </article>)}</section>;
}

export function LocalWork({content}:{content:SiteContent}) {
  const home = content.home;
  return <section className="section local-work" aria-labelledby="locations-title">
    <div className="section-head">
      <div><span className="label">{home.locationsLabel}</span><h2 id="locations-title"><Rich text={home.locationsHeading}/></h2></div>
      <p className="section-intro">{home.locationsIntro}</p>
    </div>
    <div className="location-list">{home.locations.map((place,index)=><Link href={place.link || '/projects'} key={place.name+index}><span className="spec">Kolathur area</span><h3>{place.name}</h3><p>{place.text}</p><span className="card-arrow" aria-hidden="true"><ArrowUpRight size={18}/></span></Link>)}</div>
  </section>;
}

export function PlanningGuide({content}:{content:SiteContent}) {
  const page = content.approachPage;
  return <section className="band band-stone" aria-labelledby="planning-title"><div className="section split">
    <div><span className="label">{page.guideLabel}</span><h2 id="planning-title"><Rich text={page.guideHeading}/></h2><p className="section-intro">{page.guideIntro}</p></div>
    <div className="guide-list">{page.guide.map((item,index)=><div key={item.title+index}><span className="step-number">{String(index+1).padStart(2,'0')}</span><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
  </div></section>;
}

export function ProjectQuestions({content}:{content:SiteContent}) {
  return <section className="section faq" aria-labelledby="questions-title"><div className="split">
    <div><span className="label">{content.home.faqLabel}</span><h2 id="questions-title"><Rich text={content.home.faqHeading}/></h2><p className="section-intro">Can’t find your answer? <a href={whatsappLink('Hi SP Builders, I have a question.', content.company.whatsapp)} target="_blank" rel="noopener noreferrer">Ask us on WhatsApp</a>.</p></div>
    <div className="faq-list">{content.faq.map((item,index)=><details key={item.question+index}><summary>{item.question}<span aria-hidden="true" className="faq-icon" /></summary><p>{item.answer}</p></details>)}</div>
  </div></section>;
}

export function Founder({content}:{content:SiteContent}) {
  const about = content.about;
  const initials = about.founderName.replace(/[^A-Za-z ]/g,'').split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return <section className="band band-stone" aria-labelledby="founder-title"><div className="section founder">
    <div className="founder-card">
      <span className="founder-mark" aria-hidden="true">{initials}</span>
      <div><h2 id="founder-title">{about.founderName}</h2><span className="spec">{about.founderRole}</span></div>
      <p>{about.founderBio}</p>
    </div>
    <figure className="philosophy">
      <span className="label">{about.philosophyLabel}</span>
      <blockquote><p>{about.philosophy}</p></blockquote>
      {about.motto && <figcaption><Rich text={about.motto}/></figcaption>}
    </figure>
  </div></section>;
}
