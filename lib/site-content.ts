// Everything on the website that can be edited from /admin.
// The values below are the defaults, used until the first save from the admin page.
// In text fields, wrap words in *stars* to show them in the italic accent font.

import { approach, company, projects as defaultProjects, services } from './content';

export type Project = {
  slug: string;
  name: string;
  location: string;
  type: 'Apartments' | 'Villas';
  scope: string;
  configuration: string;
  image: string;
  additionalImages: string[];
  description: string;
  featured: boolean;
  status: string;
};

export type TitleText = { title: string; text: string };

export type SiteContent = {
  company: { phone: string; whatsapp: string; email: string; address: string; mapLocation: string; footerText: string; visits: string };
  home: {
    storyLabel: string; storyHeading: string; storyLead: string; storyText: string;
    stats: { label: string; value: string }[];
    projectsLabel: string; projectsHeading: string;
    servicesLabel: string; servicesHeading: string; services: TitleText[];
    locationsLabel: string; locationsHeading: string; locationsIntro: string; locations: { name: string; text: string; link: string }[];
    processLabel: string; processHeading: string; processIntro: string;
    faqLabel: string; faqHeading: string;
  };
  approach: TitleText[];
  faq: { question: string; answer: string }[];
  cta: { label: string; heading: string; text: string };
  projectsPage: { heading: string; intro: string; note: string };
  about: {
    heading: string; intro: string; image: string;
    peopleLabel: string; peopleHeading: string; founderHeading: string; founderText: string; founderText2: string;
    values: TitleText[];
  };
  servicesPage: {
    heading: string; intro: string;
    items: { id: string; title: string; text: string; prompt: string; detail: string; linkText: string; link: string; message: string }[];
  };
  approachPage: {
    heading: string; intro: string;
    guideLabel: string; guideHeading: string; guideIntro: string; guide: TitleText[];
  };
  contactPage: { heading: string; intro: string; whatsappHeading: string; whatsappText: string };
  projects: Project[];
};

export const defaultContent: SiteContent = {
  company: {
    phone: company.phone,
    whatsapp: '919841145873',
    email: company.email,
    address: company.address,
    // What Google Maps searches for. Coordinates (e.g. 13.1211, 80.2134) give an exact pin.
    mapLocation: 'Poompuhar Nagar, Kolathur, Chennai, Tamil Nadu 600099',
    footerText: 'Residential apartments, individual villas and renovations in Chennai. Founded by civil engineer V. Srinivasan in *2000*.',
    visits: 'Please call or message ahead to arrange a meeting.',
  },
  home: {
    storyLabel: 'Kolathur, Chennai · Since 2000',
    storyHeading: 'Homes built by a civil engineer, *for over 25 years.*',
    storyLead: 'SP Builders was founded by civil engineer V. Srinivasan to build homes the way families actually live in them.',
    storyText: 'We take up apartment developments through joint ventures, individual villas and duplex homes, construction contracting and renovation. Your requirements, preferred plans and finishing choices shape the work from the first conversation.',
    stats: [
      { label: 'Founded', value: '2000' },
      { label: 'Years building', value: '25+' },
      { label: 'Featured projects', value: String(defaultProjects.length) },
      { label: 'Led by', value: 'A civil engineer' },
    ],
    projectsLabel: 'Selected work',
    projectsHeading: 'Look *closer.*',
    servicesLabel: 'What we do',
    servicesHeading: 'Built around *your plans.*',
    services: services.map(([title, text]) => ({ title, text })),
    locationsLabel: 'Where we build',
    locationsHeading: 'Homes in familiar *neighbourhoods.*',
    locationsIntro: 'Our residential work is concentrated in and around Kolathur, North Chennai.',
    locations: [
      { name: 'Poombuhar Nagar', text: 'Apartment developments, individual residences and duplex villas.', link: '/projects' },
      { name: 'Vinayagapuram', text: 'An individual ground-plus-one residence in Kolathur.', link: '/projects/vinayagapuram-villa' },
      { name: 'Vetrivel Nagar Extension', text: 'An individual residence with balconies and covered parking.', link: '/projects/vetrivel-nagar-villa' },
    ],
    processLabel: 'Working together',
    processHeading: 'From the *first conversation.*',
    processIntro: 'Arrive with a set of drawings or just an idea of what you need. The conversation starts with you.',
    faqLabel: 'Useful to know',
    faqHeading: 'Before you *get in touch.*',
  },
  approach: approach.map(([title, text]) => ({ title, text })),
  faq: [
    { question: 'Can I bring my own plans?', answer: 'Yes. SP Builders works with customer-provided plans and drawings. Tell us what you already have and which parts of the design or construction you would like to discuss.' },
    { question: 'Do you take up individual homes as well as apartments?', answer: 'Yes. Our portfolio includes residential apartments, individual villas and duplex villas. Contact us with your site and requirements to discuss the scope.' },
    { question: 'Can I enquire about a joint venture?', answer: 'Yes. Our apartment portfolio includes joint-venture projects. Share the location and available details of your property to begin a discussion; any proposal and terms will be specific to the site.' },
    { question: 'Are the projects on this site currently available?', answer: 'The portfolio shows examples of SP Builders’ work. It is not a live availability list. Contact us for the current status, pricing, specifications and viewing arrangements for a particular project.' },
    { question: 'What should I include in my first message?', answer: 'Your contact details, the site or project location, the type of work and a short description of your requirements. Mention whether you have drawings and any budget or timing you want to discuss.' },
    { question: 'Can I get in touch from outside Chennai?', answer: 'Yes. Reach us by WhatsApp, phone or email from wherever you are. Include the project or site location and a suitable time to speak.' },
  ],
  cta: {
    label: 'Start a conversation',
    heading: 'Good homes start *with a conversation.*',
    text: 'Tell us about your site, your plans or the home you have in mind. We usually reply on WhatsApp.',
  },
  projectsPage: {
    heading: 'The work, *in detail.*',
    intro: 'Apartment developments, individual residences and duplex villas from the SP Builders portfolio in and around Kolathur.',
    note: 'Images are architectural visualisations. Contact us for current status and availability.',
  },
  about: {
    heading: 'Chennai. *Since 2000.*',
    intro: 'A construction and development company founded by civil engineer V. Srinivasan, building residential apartments, individual villas and renovations in North Chennai.',
    image: '/images/projects/project-8-clean.webp',
    peopleLabel: 'The people and the purpose',
    peopleHeading: 'A civil engineer. *A Chennai company.*',
    founderHeading: 'Founded by V. Srinivasan',
    founderText: 'SP Builders was founded in 2000 by civil engineer V. Srinivasan. Based in Kolathur, Chennai, the company works on residential apartments, individual homes and construction requirements.',
    founderText2: 'Our portfolio includes joint-venture apartment developments in Poombuhar Nagar, individual residences in Vinayagapuram and Vetrivel Nagar, and duplex villas. A home for one household, or a building shared by several.',
    values: [
      { title: 'Planned around you', text: 'We start by understanding how you want to use the space, and work from your plans or drawings if you have them.' },
      { title: 'Engineered properly', text: 'An engineer-led company, with attention to structure, room relationships and the use of available space.' },
      { title: 'Your finish, your choice', text: 'Explore the finishing options and customise the final design around your requirements.' },
    ],
  },
  servicesPage: {
    heading: 'Construction. *Development.*',
    intro: 'From a home on your own site to a residential apartment development, your requirements shape the work.',
    items: [
      { id: 'apartments', title: 'Apartment developments', text: 'Our residential development portfolio includes four- and six-residence apartment projects in Kolathur, arranged over stilt parking and two floors. Each project page shows its location, configuration and visualisation.', prompt: 'Looking for an apartment?', detail: 'Tell us which project interests you and ask for its current availability, specifications and viewing options.', link: '/projects/third-street-apartments', linkText: 'See an apartment project', message: 'Hi SP Builders, I am looking for an apartment. Could you share what is available?' },
      { id: 'individual-homes', title: 'Individual homes and duplex villas', text: 'An individual home starts with the requirements of the people who will live in it. We work with your preferences, space planning and finishing choices. The portfolio includes ground-plus-one residences and duplex villas.', prompt: 'Planning your own home?', detail: 'Share the site location, any drawings you already have, and the rooms or features that matter to your household.', link: '/projects/poombuhar-duplex', linkText: 'See a duplex villa', message: 'Hi SP Builders, I am planning to build my own home and would like to discuss it.' },
      { id: 'joint-ventures', title: 'Joint-venture development', text: 'Joint-venture development is part of our Poombuhar Nagar apartment portfolio. If you own a site and want to explore a residential development, the first step is a conversation about the property and your objectives.', prompt: 'Have land to discuss?', detail: 'Start with the location and available site information. The suitability, scope and terms of a proposal depend on the specific property.', link: '/contact', linkText: 'Discuss your site', message: 'Hi SP Builders, I own a site and would like to discuss a joint venture.' },
      { id: 'construction', title: 'Construction and renovation', text: 'SP Builders also undertakes construction contracting and renovation coordination. Approach us with your preferred plans or describe the changes you want to make to an existing space.', prompt: 'Already have a plan?', detail: 'Explain the work required, the current condition of the property and your priorities, and we will discuss the scope.', link: '/contact', linkText: 'Discuss the scope', message: 'Hi SP Builders, I have a construction or renovation requirement to discuss.' },
    ],
  },
  approachPage: {
    heading: 'Working with *SP Builders.*',
    intro: 'The conversations and choices behind your home: your requirements, the drawings, the way rooms connect and the finish you want.',
    guideLabel: 'Before we talk',
    guideHeading: 'Bring what *you know so far.*',
    guideIntro: 'You do not need a finished brief to get in touch. These details make the first conversation more useful.',
    guide: [
      { title: 'Your site or project', text: 'Share the location and whether you are considering an apartment, a new home, a joint venture or changes to an existing building. If you are asking about a portfolio project, include its name.' },
      { title: 'Your requirements', text: 'Describe who will use the space, the rooms you need and priorities such as parking, room connections or finishes. Mention your intended budget and timing.' },
      { title: 'Your existing plans', text: 'Let us know whether drawings are available and what has already been decided. For renovations, describe the existing space and the changes you have in mind.' },
      { title: 'Questions to resolve together', text: 'Ask about scope, specifications, responsibilities, estimate and schedule. Confirm what is included before agreeing to the work.' },
    ],
  },
  contactPage: {
    heading: 'What are *you planning?*',
    intro: 'A site, a set of drawings, or a question. Tell us where you’re starting.',
    whatsappHeading: 'Chat with us on WhatsApp',
    whatsappText: 'The quickest way to reach us. Share your ideas, plans or questions and we’ll get back to you.',
  },
  projects: defaultProjects.map(p => ({
    slug: p.slug, name: p.name, location: p.location, type: p.type === 'Villas' ? 'Villas' : 'Apartments', scope: p.scope,
    configuration: p.configuration, image: p.image, additionalImages: p.additionalImages ?? [], description: p.description,
    featured: ['jn-enclave', 'third-street-apartments', 'vetrivel-nagar-villa'].includes(p.slug), status: p.status ?? '',
  })),
};

// Fill in any field missing from saved content with its default, so new fields added
// to the site later never break older saved content.
export function withDefaults(saved: unknown): SiteContent {
  const merge = (base: unknown, value: unknown): unknown => {
    if (Array.isArray(base)) return Array.isArray(value) ? value : base;
    if (base && typeof base === 'object') {
      const out: Record<string, unknown> = {};
      const source = (value && typeof value === 'object' && !Array.isArray(value)) ? value as Record<string, unknown> : {};
      for (const key of Object.keys(base)) out[key] = merge((base as Record<string, unknown>)[key], source[key]);
      return out;
    }
    return typeof value === typeof base ? value : base;
  };
  return merge(defaultContent, saved) as SiteContent;
}
