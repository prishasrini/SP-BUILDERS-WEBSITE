import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';

export function CompanyDepth() {
  return <section className="section content-editorial" aria-labelledby="company-background">
    <div><div className="section-kicker">THE PEOPLE & THE PURPOSE</div><h2 id="company-background">A civil engineer.<br/>A Chennai company.</h2></div>
    <div className="editorial-copy"><h3>Founded by V. Srinivasan</h3><p>SP Builders was founded in 2000 by civil engineer V. Srinivasan. Based in Kolathur, Chennai, the company works on residential apartments, individual homes and construction requirements.</p><p>Our portfolio includes joint-venture apartment developments in Poombuhar Nagar, individual residences in Vinayagapuram and Vetrivel Nagar, and a duplex villa on First Main Road. These projects show the different scales at which we work: a home for one household, or a building shared by several.</p><h3>Planning around the customer</h3><p>Our approach starts with understanding how you want to use the space. You can bring your own plans and drawings, discuss the layout, and explore finishing choices around your requirements.</p><p>A home has to accommodate everyday routines as well as personal preferences. The relationship between rooms, their purpose and the use of available space are central to that conversation.</p><Link className="text-link" href="/projects">See the residential portfolio <ArrowUpRight size={18}/></Link></div>
  </section>;
}

const serviceDetails = [
  {id:'apartments', title:'Apartment developments', text:'Our residential development portfolio includes four- and six-residence apartment projects in Kolathur, both arranged over stilt parking and two floors. Explore the individual project pages for their location, configuration and architectural visualisation.', prompt:'Looking for an apartment?', detail:'Tell us which project interests you and ask for its current availability, specifications and viewing options.', href:'/projects/third-street-apartments', link:'Explore an apartment project'},
  {id:'individual-homes', title:'Individual homes & duplex villas', text:'An individual home starts with the requirements of the people who will live in it. SP Builders works with customer preferences, space planning and finishing choices. The portfolio includes ground-plus-one-floor residences and a duplex villa.', prompt:'Planning your own home?', detail:'Share the site location, any drawings you already have, and the rooms or features that matter to your household.', href:'/projects/poombuhar-duplex', link:'Explore a duplex villa'},
  {id:'joint-ventures', title:'Joint-venture enquiries', text:'Joint-venture development is represented in our Poombuhar Nagar apartment portfolio. If you own a site and want to explore a residential development, the first step is a conversation about the property and your objectives.', prompt:'Have land to discuss?', detail:'Start with the location and available site information. The suitability, scope and terms of a proposal need to be discussed for that specific property.', href:'/contact', link:'Discuss your site'},
  {id:'construction', title:'Construction & renovation', text:'SP Builders also undertakes construction contracting and renovation coordination. You can approach us with your preferred plans or describe the changes you want to make to an existing space.', prompt:'Already have a plan?', detail:'Explain the work required, the current condition of the property and your priorities. Ask which parts of the work can be included in the proposed scope.', href:'/contact', link:'Discuss the scope'},
];

export function ServiceDetails() {
  return <section className="section service-details" aria-label="Services in detail">{serviceDetails.map((service,index)=><article className="service-detail" id={service.id} key={service.id}><div><span className="section-kicker">0{index+1} / WHAT WE DO</span><h2>{service.title}</h2></div><div className="editorial-copy"><p>{service.text}</p><h3>{service.prompt}</h3><p>{service.detail}</p><Link className="text-link" href={service.href}>{service.link}<ArrowUpRight size={18}/></Link></div></article>)}</section>;
}

export function LocalWork() {
  const locations = [
    ['Poombuhar Nagar','Apartment developments, an individual residence and a duplex villa.','/projects/third-street-apartments'],
    ['Vinayagapuram','An individual ground-plus-one-floor residence in Kolathur.','/projects/vinayagapuram-villa'],
    ['Vetrivel Nagar Extension','An individual residence with balconies and covered parking shown in the project visualisation.','/projects/vetrivel-nagar-villa'],
  ];
  return <section className="section local-work" aria-labelledby="locations-title"><div className="section-heading"><div><div className="section-kicker">OUR WORK IN CHENNAI</div><h2 id="locations-title">Homes in familiar<br/>neighbourhoods.</h2></div><p className="section-context">Explore the places represented in our residential portfolio. Each project has its own page with the location, building configuration and scope.</p></div><div className="location-list">{locations.map(([name,description,href])=><Link href={href} key={name}><h3>{name}</h3><p>{description}</p><span>Explore the work <ArrowUpRight size={17}/></span></Link>)}</div></section>;
}

export function PlanningGuide() {
  return <section className="section content-editorial planning-guide" aria-labelledby="planning-title"><div><div className="section-kicker">BEFORE WE TALK</div><h2 id="planning-title">Bring what<br/>you know so far.</h2><p className="section-context">You do not need a finished brief to make an enquiry. These details help make the first conversation more useful.</p></div><div className="editorial-copy"><h3>Your site or project</h3><p>Share the location and whether you are considering an apartment, a new home, a joint venture or changes to an existing building. If you are enquiring about a portfolio project, include its name.</p><h3>Your requirements</h3><p>Describe who will use the space, the rooms you need and any priorities such as parking, room connections or finishing preferences. Mention your intended budget and timing so these can be discussed.</p><h3>Your existing plans</h3><p>Let us know whether drawings are available and what has already been decided. For renovation enquiries, describe the existing space and the changes you have in mind.</p><h3>Questions to resolve together</h3><p>Ask about the proposed scope, specifications, responsibilities, estimate and schedule. Confirm what is included and what remains to be decided before agreeing to the work.</p><Link className="text-link" href="/contact">Start with your requirements <ArrowUpRight size={18}/></Link></div></section>;
}

const questions = [
  ['Can I bring my own plans?','Yes. SP Builders works with customer-provided plans and drawings. Tell us what you already have and which parts of the design or construction you would like to discuss.'],
  ['Do you take up individual homes as well as apartments?','Our portfolio includes residential apartments, individual villas and a duplex villa. Contact us with your site and requirements to discuss the relevant scope.'],
  ['Can I enquire about a joint venture?','Yes. Our apartment portfolio includes joint-venture projects. Share the location and available details of your property to begin a discussion; any proposal and terms will be specific to the site.'],
  ['Are the projects on this site currently available?','The portfolio shows examples of SP Builders’ work. It is not a live availability list. Please contact us for the current status, pricing, specifications and viewing arrangements for a particular project.'],
  ['What should I include in my first enquiry?','Include your preferred contact details, the site or project location, the type of work and a short description of your requirements. Mention whether you have drawings and any budget or timing you want to discuss.'],
  ['Can I make an enquiry from outside Chennai?','You can contact us by phone or email from wherever you are. Include the project or site location and a suitable time to speak, especially if you are in a different time zone.'],
];

export function ProjectQuestions() {
  return <section className="section content-editorial project-questions" aria-labelledby="questions-title"><div><div className="section-kicker">USEFUL TO KNOW</div><h2 id="questions-title">Before your<br/>first enquiry.</h2><p className="section-context">A few answers to help you find the right starting point.</p></div><div className="faq-list">{questions.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>;
}
