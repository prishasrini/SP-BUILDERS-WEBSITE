import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { siteUrl } from '@/lib/metadata';
import './globals.css';

const headFont = localFont({src:'../public/fonts/v2/inter-tight-latin-wght-normal.woff2',weight:'400 800',variable:'--font-head',display:'swap'});
const bodyFont = localFont({src:'../public/fonts/v2/inter-latin-wght-normal.woff2',weight:'300 700',variable:'--font-body',display:'swap'});
const accentFont = localFont({src:[{path:'../public/fonts/v2/instrument-serif-latin-400-normal.woff2',style:'normal'},{path:'../public/fonts/v2/instrument-serif-latin-400-italic.woff2',style:'italic'}],weight:'400',variable:'--font-accent',display:'swap'});
const monoFont = localFont({src:'../public/fonts/v2/jetbrains-mono-latin-wght-normal.woff2',weight:'400 600',variable:'--font-mono',display:'swap',preload:false});

export const metadata:Metadata={metadataBase:new URL(siteUrl || 'http://localhost:3000'),title:{default:'SP Builders | Constructors & Developers, Chennai',template:'%s | SP Builders'},description:'SP Builders, constructors and developers in Kolathur, Chennai since 2000. Residential apartments, individual villas, construction and renovation.',robots:{index:!!siteUrl,follow:true},openGraph:{images:['/images/company.webp']}};
export const viewport:Viewport={themeColor:'#F6F3EE'};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en" className={`${headFont.variable} ${bodyFont.variable} ${accentFont.variable} ${monoFont.variable}`}><body>{children}</body></html>;
}
