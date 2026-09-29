import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';
import { approach, company, projects, services } from '@/lib/content';

export function Story() {
  return <section className="section story" id="story"><div className="section-kicker">CHENNAI / CONSTRUCTORS & DEVELOPERS</div><h2>A home is personal.<br /><em>So is our approach.</em></h2><div className="story-bottom"><div className="story-date"><span>OUR STORY BEGAN IN</span><strong>2000<span>.</span></strong><p>Kolathur, Chennai</p></div><div className="story-text"><p>Founded by civil engineer V. Srinivasan, SP Builders works on residential apartments and individual homes in Chennai.</p><p>Our work includes apartment developments through joint ventures, individual villas, duplex homes, construction contracting and renovation coordination. Your requirements, preferred plans and finishing choices shape the conversation from the start.</p><Link className="text-link" href="/about">Meet SP Builders <ArrowUpRight size={18} /></Link></div></div></section>;
}

export function SelectedProjects() {
  return <section className="section selected" id="work"><div className="section-heading"><div><div className="section-kicker">SELECTED WORK</div><h2>Look closer.</h2></div><Link className="text-link" href="/projects">The full portfolio <ArrowUpRight size={18} /></Link></div><div className="work-index">{['third-street-apartments', 'vetrivel-nagar-villa', 'first-main-road-residence'].map(slug => projects.find(project => project.slug === slug)!).map((project, index) => <Link className="work-entry" href={`/projects/${project.slug}`} key={project.slug}><span className="work-number">0{index + 1}</span><div className="work-image"><Image unoptimized src={project.image} alt={`${project.name} architectural visualisation`} fill sizes="(max-width: 700px) 90vw, 43vw" /><span className="image-tag">Architectural visualisation</span></div><div className="work-info"><span className="eyebrow">{project.type} / {project.scope}</span><h3>{project.name}</h3><p>{project.location}</p><p className="work-configuration">{project.configuration}</p><p className="work-description">{project.description}</p><div className="work-link">View project <ArrowUpRight size={19} /></div></div></Link>)}</div></section>;
}

export function Capabilities({ sculpted = false }: { sculpted?: boolean }) {
  return <section className="section capabilities" id="capabilities"><div className="capability-side"><div className="section-kicker">WHAT BRINGS YOU HERE?</div><h2>{sculpted ? <>Built around your plans.</> : <>Your next<br />chapter.</>}</h2><p>A home on your own site.<br />An apartment development.<br />A space ready for change.</p><Link className="text-link" href="/services">Explore our expertise <ArrowUpRight size={18} /></Link></div><div className="service-stack">{services.map(([title, description], index) => <Link href={`/services#${['apartments','individual-homes','construction'][index]}`} key={title}><span className="section-kicker">0{index + 1} / {['DEVELOP','BUILD','TRANSFORM'][index]}</span><h3>{title}</h3><p>{description}</p><ArrowUpRight aria-hidden="true" /></Link>)}</div></section>;
}

export function Process({ sculpted = false }: { sculpted?: boolean }) {
  return <section className="section process" id="process"><div className="process-heading"><div className="section-kicker">WORKING TOGETHER</div><h2>{sculpted ? <>From the first conversation.</> : <>Your project.<br />From the start.</>}</h2><p>You can arrive with a set of drawings or an idea of what you need. The conversation starts with you.</p></div><ol className="process-list">{approach.map(([title, description], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></section>;
}

export function ContactCTA() {
  return <section className="section conversation" aria-label="Start a conversation" id="conversation">
    <div className="conversation-fins conversation-fins-left" aria-hidden="true" />
    <div className="conversation-fins conversation-fins-right" aria-hidden="true" />
    <div className="conversation-edge conversation-edge-left" aria-hidden="true"><span>HOMES<br />COMMUNITIES<br />STRONGER<br />TOMORROWS</span></div>
    <div className="conversation-edge conversation-edge-right" aria-hidden="true"><span>LET’S<br />BUILD<br />WHAT<br />MATTERS</span></div>
    <div className="conversation-corner" aria-hidden="true">PEOPLE<br />SPACES<br />BETTER LIVES</div>
    <div className="conversation-content">
      <div className="conversation-brand"><span>SP BUILDERS</span><small>BUILDING A BRIGHTER TOMORROW</small></div>
      <h2>Good homes start<br />with a conversation.</h2>
      <a className="conversation-button" href="https://wa.me/919841145873" target="_blank" rel="noopener noreferrer">Chat on WhatsApp <ArrowUpRight size={23} aria-hidden="true" /></a>
      <div className="conversation-contacts">
        <a href="tel:+919841145873"><Phone aria-hidden="true" /><span>{company.phone}<small>CALL US</small></span></a>
        <a href={`mailto:${company.email}`}><Mail aria-hidden="true" /><span>{company.email}<small>MAIL US</small></span></a>
        <Link href="/contact"><MapPin aria-hidden="true" /><span>CHENNAI, TAMIL NADU<small>OUR LOCATION</small></span></Link>
      </div>
      <p className="conversation-signoff">BETTER SPACES. BRIGHTER TOMORROWS.</p>
    </div>
  </section>;
}



