import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Navigation, Footer } from '@/components/navigation';
import { siteUrl } from '@/lib/metadata';
import './globals.css';
import './aubergine.css';
import './mobile.css';
const displayFont = localFont({src:[{path:'../public/fonts/cormorant-garamond-400.ttf',weight:'400'},{path:'../public/fonts/cormorant-garamond-500.ttf',weight:'500'},{path:'../public/fonts/cormorant-garamond-600.ttf',weight:'600'}],variable:'--font-display',display:'swap'});
const bodyFont = localFont({src:[{path:'../public/fonts/manrope-400.ttf',weight:'400'},{path:'../public/fonts/manrope-500.ttf',weight:'500'},{path:'../public/fonts/manrope-600.ttf',weight:'600'},{path:'../public/fonts/manrope-700.ttf',weight:'700'}],variable:'--font-body',display:'swap'});
export const metadata:Metadata={metadataBase:new URL(siteUrl || 'http://localhost:3000'),title:{default:'SP Builders | Constructors & Developers, Chennai',template:'%s | SP Builders'},description:'SP Builders, constructors and developers in Chennai since 2000. Explore residential apartments, individual villas and our approach to building.',robots:{index:!!siteUrl,follow:true},openGraph:{images:['/images/company.webp']}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}><body><a className="skip-link" href="#main">Skip to content</a><Navigation/>{children}<Footer/>{siteUrl&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'GeneralContractor',name:'SP Builders',url:siteUrl,foundingDate:'2000',telephone:'+919841145873',email:'spbuilders2003@gmail.com',address:{'@type':'PostalAddress',streetAddress:'No. 5/1, 1st Cross Street, Poombugar Nagar, Kolathur',addressLocality:'Chennai',postalCode:'600099',addressCountry:'IN'}})}}/>}</body></html>}

