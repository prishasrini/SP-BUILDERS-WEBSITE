import {pageMeta} from '@/lib/metadata';
import {getContent} from '@/lib/content-store';
export const metadata=pageMeta('Privacy Notice','How information shared with SP Builders is handled.','/privacy');
export default async function Privacy(){const {company}=await getContent();return <main id="main">
  <section className="page-hero"><div className="section"><span className="label">Privacy</span><h1>Privacy <em>notice.</em></h1></div></section>
  <section className="section legal">
    <h2>Contacting us</h2><p>You can contact SP Builders through WhatsApp, email or telephone. We use the contact details and project information you share to respond to your enquiry and discuss your project.</p>
    <h2>WhatsApp links</h2><p>The WhatsApp buttons open WhatsApp with a suggested message, which you can edit before choosing whether to send. Clicking a link does not submit anything through this website. Your use of WhatsApp is subject to its own privacy policy.</p>
    <h2>Map</h2><p>The contact page shows an embedded Google Map, which is provided by Google and subject to Google’s privacy policy.</p>
    <h2>Your choices</h2><p>To ask about information you have shared with us or request its removal, email <a href={`mailto:${company.email}`}>{company.email}</a>.</p>
  </section></main>}
