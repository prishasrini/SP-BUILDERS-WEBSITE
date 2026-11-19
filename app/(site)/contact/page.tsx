import {Clock, ExternalLink, Mail, MapPin, MessageCircle, Navigation, Phone} from 'lucide-react';
import {Rich} from '@/components/rich';
import {getContent} from '@/lib/content-store';
import {pageMeta} from '@/lib/metadata';
import {telLink, whatsappLink} from '@/lib/whatsapp';
export const metadata=pageMeta('Contact','Contact SP Builders in Kolathur, Chennai on WhatsApp, phone or email to discuss apartments, villas or construction.','/contact');
export default async function Contact(){
  const content=await getContent();const company=content.company;const page=content.contactPage;
  const mapQuery=encodeURIComponent(company.mapLocation || company.address);
  const openMaps=`https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const directions=`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  return <main id="main">
  <section className="page-hero"><div className="section"><span className="label">Contact</span><h1><Rich text={page.heading}/></h1><p>{page.intro}</p></div></section>
  <section className="section contact">
    <div className="contact-grid">
      <div className="contact-card contact-card-primary">
        <MessageCircle size={28} aria-hidden="true"/>
        <h2>{page.whatsappHeading}</h2>
        <p>{page.whatsappText}</p>
        <a className="button" href={whatsappLink(undefined, company.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} aria-hidden="true"/>Open WhatsApp</a>
      </div>
      <ul className="contact-list">
        <li><Phone size={20} aria-hidden="true"/><div><span className="spec">Call</span><a href={telLink(company.phone)}>{company.phone}</a></div></li>
        <li><Mail size={20} aria-hidden="true"/><div><span className="spec">Email</span><a href={`mailto:${company.email}`}>{company.email}</a></div></li>
        <li><MapPin size={20} aria-hidden="true"/><div><span className="spec">Office</span><address>{company.address}</address><a className="text-link" href={directions} target="_blank" rel="noopener noreferrer">Get directions</a></div></li>
        <li><Clock size={20} aria-hidden="true"/><div><span className="spec">Visits</span><p>{company.visits}</p></div></li>
      </ul>
    </div>
    {/* The whole map opens Google Maps; our card covers Google's own info box. */}
    <a className="map" href={openMaps} target="_blank" rel="noopener noreferrer" aria-label="Open the SP Builders office in Google Maps">
      <iframe title="SP Builders office location on Google Maps" src={`https://www.google.com/maps?q=${mapQuery}&z=17&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} aria-hidden="true"/>
      <span className="map-card"><strong>SP Builders office</strong><span>{company.address}</span><span className="map-card-actions"><span className="map-open"><ExternalLink size={15} aria-hidden="true"/>Open in Google Maps</span><span className="map-dir" aria-hidden="true"><Navigation size={16}/></span></span></span>
    </a>
  </section></main>}
