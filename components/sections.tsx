import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, Building2, CalendarCheck, Check, Compass, Hammer, Handshake, Home, Layers, Mail, MapPin, MessageCircle, Palette, Phone, PiggyBank } from 'lucide-react';
import type { Project, SiteContent } from '@/lib/site-content';
import { telLink, whatsappLink } from '@/lib/whatsapp';
import { Rich } from '@/components/rich';

// A status like "Now selling · Under construction" shows as one badge per part.
export const statusList = (status: string) => status.split(/\s*[·,|]\s*/).map(item => item.trim()).filter(Boolean);

export function Story({ content }: { content: SiteContent }) {
  const home = content.home;
  return <section className="section story" id="story">
    <div className="story-grid">
      <div>
        <span className="label">{home.storyLabel}</span>
        <h2><Rich text={home.storyHeading} /></h2>
      </div>
      <div className="story-copy">
        <p className="lead">{home.storyLead}</p>
        <p>{home.storyText}</p>
        <Link className="text-link" href="/about">Meet SP Builders <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
    </div>
    {home.stats.length > 0 && <dl className="stats">
      {home.stats.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd className={stat.value.length > 6 ? 'stat-text' : undefined}>{stat.value}</dd></div>)}
    </dl>}
  </section>;
}

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  return <Link className="project-card" href={`/projects/${project.slug}`}>
    <div className="project-card-image">
      {project.image && <Image src={project.image} alt={`${project.name}, architectural visualisation`} fill sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw" />}
      {index !== undefined && <span className="project-card-index">{String(index + 1).padStart(2, '0')}</span>}
      {project.status && <span className="status-badges">{statusList(project.status).map((item, i) => <span className={`status-badge${i ? ' status-badge-alt' : ''}`} key={item}>{item}</span>)}</span>}
    </div>
    <div className="project-card-body">
      <span className="spec">{project.type} · {project.scope}</span>
      <h3>{project.name}</h3>
      <p>{project.location}</p>
      <p className="spec spec-muted">{project.configuration}</p>
      <span className="card-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
    </div>
  </Link>;
}

export function SelectedProjects({ content }: { content: SiteContent }) {
  const featured = content.projects.filter(p => p.featured);
  const shown = (featured.length ? featured : content.projects).slice(0, 3);
  return <section className="section selected" id="work">
    <div className="section-head">
      <div><span className="label">{content.home.projectsLabel}</span><h2><Rich text={content.home.projectsHeading} /></h2></div>
      <Link className="text-link" href="/projects">All {content.projects.length} projects <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </div>
    <div className="project-grid">{shown.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div>
    <p className="fine-print">{content.projectsPage.note}</p>
  </section>;
}

const serviceIcons = [Building2, Home, Handshake, Hammer];

export function Capabilities({ content }: { content: SiteContent }) {
  return <section className="band band-stone" id="capabilities">
    <div className="section">
      <div className="section-head">
        <div><span className="label">{content.home.servicesLabel}</span><h2><Rich text={content.home.servicesHeading} /></h2></div>
        <Link className="text-link" href="/services">Our services <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
      <div className="service-grid">{content.home.services.map((service, index) => {
        const Icon = serviceIcons[index % serviceIcons.length];
        return <Link className="service-card" href={content.servicesPage.items[index]?.id === 'joint-ventures' ? '/joint-ventures' : `/services${content.servicesPage.items[index]?.id ? `#${content.servicesPage.items[index].id}` : ''}`} key={service.title + index}>
          <span className="service-icon"><Icon size={22} aria-hidden="true" /></span>
          <span className="spec">{String(index + 1).padStart(2, '0')}</span>
          <h3>{service.title}</h3>
          <p>{service.text}</p>
          <span className="card-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
        </Link>;
      })}</div>
    </div>
  </section>;
}

export function Process({ content, heading = true }: { content: SiteContent; heading?: boolean }) {
  return <section className="section process" id="process">
    {heading && <div className="section-head">
      <div><span className="label">{content.home.processLabel}</span><h2><Rich text={content.home.processHeading} /></h2></div>
      <p className="section-intro">{content.home.processIntro}</p>
    </div>}
    <ol className="steps">{content.approach.map((step, index) => <li key={step.title + index}>
      <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
      <h3>{step.title}</h3>
      <p>{step.text}</p>
    </li>)}</ol>
  </section>;
}

export function ContactCTA({ content, message }: { content: SiteContent; message?: string }) {
  const { company, cta } = content;
  return <section className="cta" aria-labelledby="cta-title" id="conversation">
    <div className="cta-inner">
      <span className="label label-light">{cta.label}</span>
      <h2 id="cta-title"><Rich text={cta.heading} /></h2>
      <p>{cta.text}</p>
      <div className="cta-actions">
        <a className="button" href={whatsappLink(message, company.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} aria-hidden="true" />Chat on WhatsApp</a>
        <a className="button button-ghost" href={telLink(company.phone)}><Phone size={18} aria-hidden="true" />{company.phone}</a>
      </div>
      <div className="cta-meta">
        <a href={`mailto:${company.email}`}><Mail size={16} aria-hidden="true" />{company.email}</a>
        <Link href="/contact"><MapPin size={16} aria-hidden="true" />Kolathur, Chennai</Link>
      </div>
    </div>
  </section>;
}

// Home page band for the project currently on sale (the first project whose status says "selling").
export function Spotlight({ content }: { content: SiteContent }) {
  const project = content.projects.find(p => /sell|sale|book/i.test(p.status));
  if (!project) return null;
  const message = `Hi SP Builders, I'm interested in ${project.name}. I'd like to book a site visit.`;
  return <section className="spotlight" aria-labelledby="spotlight-title">
    <div className="spotlight-inner">
      <Link className="spotlight-image" href={`/projects/${project.slug}`} tabIndex={-1} aria-hidden="true">
        {project.image && <Image src={project.image} alt="" fill sizes="(max-width: 900px) 92vw, 50vw" />}
      </Link>
      <div className="spotlight-copy">
        <span className="label label-light">{content.home.spotlightLabel}</span>
        <div className="status-badges status-badges-inline">{statusList(project.status).map((item, i) => <span className={`status-badge${i ? ' status-badge-alt' : ''}`} key={item}>{item}</span>)}</div>
        <h2 id="spotlight-title">{project.name}</h2>
        <p className="spotlight-meta">{project.scope}{project.location ? ` · ${project.location}` : ''}</p>
        {project.configuration && <p className="spotlight-sizes">{project.configuration}</p>}
        {project.highlights.length > 0 && <ul className="highlights">{project.highlights.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>}
        <div className="cta-actions">
          <a className="button" href={whatsappLink(message, content.company.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} aria-hidden="true" />{content.home.spotlightButton}</a>
          <Link className="button button-ghost" href={`/projects/${project.slug}`}>View project <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  </section>;
}

const whyIcons = [PiggyBank, BadgeCheck, Layers, CalendarCheck, Compass, Palette];

export function WhyUs({ content }: { content: SiteContent }) {
  const home = content.home;
  if (!home.why.length) return null;
  return <section className="section why" aria-labelledby="why-title">
    <div className="section-head">
      <div><span className="label">{home.whyLabel}</span><h2 id="why-title"><Rich text={home.whyHeading} /></h2></div>
      {home.whyIntro && <p className="section-intro">{home.whyIntro}</p>}
    </div>
    <ul className="why-grid">{home.why.map((item, index) => {
      const Icon = whyIcons[index % whyIcons.length];
      return <li key={item.title + index}><span className="why-icon"><Icon size={22} aria-hidden="true" /></span><h3>{item.title}</h3><p>{item.text}</p></li>;
    })}</ul>
  </section>;
}
