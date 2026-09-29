import {ContactForm} from '@/components/contact-form';
import {company} from '@/lib/content';
import {pageMeta} from '@/lib/metadata';
export const metadata=pageMeta('Start a Conversation','Contact SP Builders in Kolathur, Chennai. Discuss residential apartments, individual villas or your construction requirements.','/contact');
export default function Contact(){return <main id="main" className="section page-intro"><div className="section-kicker">SP / CONTACT</div><h1>What are<br/>you planning?</h1><div className="contact-layout"><div className="contact-details"><p>A site, a set of drawings, or a question. Tell us where you’re starting.</p><a href="tel:+919841145873">{company.phone}</a><a href={`mailto:${company.email}`}>{company.email}</a><address>{company.address}</address></div><ContactForm/></div></main>}
