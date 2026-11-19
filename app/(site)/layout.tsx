import { Navigation, Footer, MobileActions } from '@/components/navigation';
import { getContent } from '@/lib/content-store';
import { siteUrl } from '@/lib/metadata';

export default async function SiteLayout({children}:{children:React.ReactNode}){
  const content = await getContent();
  const { company } = content;
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation company={company}/>
    {children}
    <Footer company={company}/>
    <MobileActions company={company}/>
    {siteUrl&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'GeneralContractor',name:'SP Builders',url:siteUrl,foundingDate:'2000',founder:{'@type':'Person',name:'V. Srinivasan'},telephone:company.phone.replace(/\s/g,''),email:company.email,address:{'@type':'PostalAddress',streetAddress:company.address,addressLocality:'Chennai',addressRegion:'Tamil Nadu',addressCountry:'IN'},areaServed:'Chennai'})}}/>}
  </>;
}
