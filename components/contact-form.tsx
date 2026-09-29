import {ArrowUpRight, MessageCircle} from 'lucide-react';

export function ContactForm() {
  return <section className="whatsapp-contact" aria-labelledby="whatsapp-heading">
    <MessageCircle size={32} aria-hidden="true" />
    <h2 id="whatsapp-heading">Let’s talk about your project.</h2>
    <p>Share your ideas, plans or questions with us directly on WhatsApp.</p>
    <a className="button" href="https://wa.me/919841145873" target="_blank" rel="noopener noreferrer">Chat on WhatsApp <ArrowUpRight size={20} aria-hidden="true" /></a>
    <p className="whatsapp-note">Opens WhatsApp so you can write and send your message.</p>
  </section>;
}
