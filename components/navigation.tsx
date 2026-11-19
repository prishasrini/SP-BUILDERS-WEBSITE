'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, MessageCircle, Phone, X } from 'lucide-react';
import type { SiteContent } from '@/lib/site-content';
import { telLink, whatsappLink } from '@/lib/whatsapp';
import { Rich } from '@/components/rich';

type Company = SiteContent['company'];

const links = [['Projects', '/projects'], ['About', '/about'], ['Services', '/services'], ['Approach', '/process'], ['Contact', '/contact']];

export function Navigation({ company }: { company: Company }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', dismiss);
    return () => window.removeEventListener('keydown', dismiss);
  }, []);
  return (
    <header className="nav">
      <Link className="nav-brand" href="/" aria-label="SP Builders home"><Image src="/images/logo-spb-sm.png" alt="" width={125} height={120} priority /><span>SP BUILDERS<small>Constructors &amp; developers · Since 2000</small></span></Link>
      <button className="nav-toggle" aria-expanded={open} aria-controls="site-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="site-nav" className={open ? 'open' : ''} aria-label="Main navigation">
        {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href || (href !== '/' && pathname.startsWith(href + '/')) ? 'page' : undefined}>{label}</Link>)}
        <a className="nav-cta" href={whatsappLink(undefined, company.whatsapp)} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" />WhatsApp us</a>
      </nav>
    </header>
  );
}

export function Footer({ company }: { company: Company }) {
  const year = new Date().getFullYear();
  return <footer className="footer">
    <div className="footer-grid">
      <div className="footer-about">
        <Link className="footer-brand" href="/">SP BUILDERS</Link>
        <p><Rich text={company.footerText} /></p>
      </div>
      <div>
        <span className="label">Explore</span>
        <ul><li><Link href="/projects">Projects</Link></li><li><Link href="/about">About</Link></li><li><Link href="/services">Services</Link></li><li><Link href="/process">Approach</Link></li></ul>
      </div>
      <div>
        <span className="label">Contact</span>
        <ul><li><a href={telLink(company.phone)}>{company.phone}</a></li><li><a href={`mailto:${company.email}`}>{company.email}</a></li><li><a href={whatsappLink(undefined, company.whatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={14} aria-hidden="true" /></a></li></ul>
      </div>
      <div>
        <span className="label">Office</span>
        <address>{company.address}</address>
      </div>
    </div>
    <div className="footer-bottom"><span>© {year} SP Builders</span><Link href="/privacy">Privacy notice</Link><a href="#main">Back to top ↑</a></div>
  </footer>;
}

// Always-visible call and WhatsApp buttons on phones, shown once the visitor is past the hero film.
export function MobileActions({ company }: { company: Company }) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector('.construction');
      setVisible(!hero || hero.getBoundingClientRect().bottom < window.innerHeight * .9);
    };
    update();
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [pathname]);
  return <div className={`mobile-actions ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
    <a href={telLink(company.phone)} tabIndex={visible ? 0 : -1}><Phone size={18} aria-hidden="true" />Call</a>
    <a className="primary" href={whatsappLink(undefined, company.whatsapp)} target="_blank" rel="noopener noreferrer" tabIndex={visible ? 0 : -1}><MessageCircle size={18} aria-hidden="true" />WhatsApp</a>
  </div>;
}
