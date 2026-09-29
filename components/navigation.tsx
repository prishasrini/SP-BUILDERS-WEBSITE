'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { company } from '@/lib/content';

const links = [['Home', '/'], ['Projects', '/projects'], ['Company', '/about'], ['Expertise', '/services'], ['Approach', '/process']];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', dismiss);
    return () => window.removeEventListener('keydown', dismiss);
  }, []);
  return (
    <header className="navigation">
      <Link className="brand" href="/" aria-label="SP Builders home"><Image src="/images/logo.png" alt="" width={37} height={42} /><span>SP BUILDERS<small>CONSTRUCTORS & DEVELOPERS</small></span></Link>
      <span className="nav-location">CHENNAI, IN<br />EST. 2000</span>
      <button className="menu-toggle" aria-expanded={open} aria-controls="site-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="site-nav" className={open ? 'open' : ''} aria-label="Main navigation">
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}
        <Link className="nav-contact" href="/contact" onClick={() => setOpen(false)}>Start a conversation <ArrowUpRight size={17} /></Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return <footer><div className="footer-top"><Link className="footer-brand" href="/">SP BUILDERS<span>Constructors & developers / Chennai</span></Link><div className="footer-links"><Link href="/projects">Projects</Link><Link href="/about">Company</Link><Link href="/contact">Contact</Link></div><a href="tel:+919841145873">{company.phone}</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SP Builders</span><Link href="/privacy">Privacy notice</Link><a href="#main">Return to top ↑</a></div></footer>;
}
