'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Check, ExternalLink, History, ImagePlus, LogOut, Plus, Star, Trash2, X } from 'lucide-react';
import type { Project, SiteContent, TitleText } from '@/lib/site-content';
import type { HistoryEntry } from '@/lib/content-store';
import { loadVersion, logout, save, uploadImage } from '@/app/admin/actions';

type Tab = 'projects' | 'home' | 'pages' | 'contact' | 'history';
const tabs: [Tab, string][] = [['projects', 'Projects'], ['home', 'Home page'], ['pages', 'Other pages'], ['contact', 'Contact details'], ['history', 'History']];

const slugify = (text: string) => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

// Shrinks a photo in the browser before upload so pages stay fast (max 1800px wide).
async function prepareImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1800 / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const toBlob = (type: string, quality: number) => new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));
  let blob = await toBlob('image/webp', .82);
  if (!blob || blob.type !== 'image/webp') blob = await toBlob('image/jpeg', .85);
  if (!blob) throw new Error('This image could not be read. Try a JPG or PNG.');
  return new File([blob], blob.type === 'image/webp' ? 'image.webp' : 'image.jpg', { type: blob.type });
}

/* ---------- Small form building blocks ---------- */

function Field({ label, value, onChange, multiline, hint, placeholder }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; hint?: string; placeholder?: string }) {
  return <label className="admin-field">
    <span>{label}</span>
    {multiline
      ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={Math.min(8, Math.max(3, Math.ceil(value.length / 70)))} placeholder={placeholder} />
      : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
    {hint && <small>{hint}</small>}
  </label>;
}

const accentHint = 'Wrap words in *stars* to show them in the italic accent font.';

function Section({ title, children, description }: { title: string; children: ReactNode; description?: string }) {
  return <section className="admin-section"><h2>{title}</h2>{description && <p className="admin-muted">{description}</p>}<div className="admin-grid">{children}</div></section>;
}

function ListEditor<T>({ items, onChange, render, create, label, max }: { items: T[]; onChange: (items: T[]) => void; render: (item: T, update: (item: T) => void, index: number) => ReactNode; create: () => T; label: string; max?: number }) {
  const move = (from: number, to: number) => { const next = [...items]; const [item] = next.splice(from, 1); next.splice(to, 0, item); onChange(next); };
  return <div className="admin-list">
    {items.map((item, index) => <div className="admin-list-item" key={index}>
      <div className="admin-list-head">
        <strong>{label} {index + 1}</strong>
        <div className="admin-icon-row">
          <button type="button" className="admin-icon" aria-label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}><ArrowUp size={16} /></button>
          <button type="button" className="admin-icon" aria-label="Move down" disabled={index === items.length - 1} onClick={() => move(index, index + 1)}><ArrowDown size={16} /></button>
          <button type="button" className="admin-icon admin-danger" aria-label={`Remove ${label.toLowerCase()} ${index + 1}`} onClick={() => { if (confirm(`Remove ${label.toLowerCase()} ${index + 1}?`)) onChange(items.filter((_, i) => i !== index)); }}><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="admin-grid">{render(item, value => onChange(items.map((old, i) => i === index ? value : old)), index)}</div>
    </div>)}
    {(!max || items.length < max) && <button type="button" className="admin-btn" onClick={() => onChange([...items, create()])}><Plus size={16} /> Add {label.toLowerCase()}</button>}
  </div>;
}

function TitleTextList({ items, onChange, label }: { items: TitleText[]; onChange: (items: TitleText[]) => void; label: string }) {
  return <ListEditor items={items} onChange={onChange} label={label} create={() => ({ title: '', text: '' })} render={(item, update) => <>
    <Field label="Title" value={item.title} onChange={title => update({ ...item, title })} />
    <Field label="Text" value={item.text} multiline onChange={text => update({ ...item, text })} />
  </>} />;
}

function ImageInput({ label, value, onChange, name, onError }: { label: string; value: string; onChange: (url: string) => void; name: string; onError: (message: string) => void }) {
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const choose = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const prepared = await prepareImage(file);
      const form = new FormData();
      form.set('file', prepared);
      form.set('name', name || 'project');
      const result = await uploadImage(form);
      if (result.url) onChange(result.url); else onError(result.error ?? 'Upload failed.');
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };
  return <div className="admin-field admin-image">
    <span>{label}</span>
    <div className="admin-image-row">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value ? <img src={value} alt="" /> : <div className="admin-image-empty">No image</div>}
      <div className="admin-image-actions">
        <button type="button" className="admin-btn" disabled={busy} onClick={() => input.current?.click()}><ImagePlus size={16} /> {busy ? 'Uploading…' : value ? 'Replace photo' : 'Upload photo'}</button>
        {value && <button type="button" className="admin-btn admin-btn-quiet" onClick={() => onChange('')}><X size={16} /> Remove</button>}
        <small>JPG, PNG or WebP. Large photos are resized automatically.</small>
      </div>
    </div>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/heic" hidden onChange={e => choose(e.target.files?.[0])} />
  </div>;
}

/* ---------- Project editor ---------- */

function ProjectForm({ project, onChange, onDone, others, onError }: { project: Project; onChange: (project: Project) => void; onDone: () => void; others: Project[]; onError: (message: string) => void }) {
  const [slugTouched, setSlugTouched] = useState(project.slug !== '' && project.slug !== slugify(project.name));
  const set = (patch: Partial<Project>) => onChange({ ...project, ...patch });
  const clash = others.some(other => other.slug === project.slug);
  return <div className="admin-panel">
    <div className="admin-panel-head"><h2>{project.name || 'New project'}</h2><button type="button" className="admin-btn" onClick={onDone}><Check size={16} /> Done</button></div>
    <div className="admin-grid admin-grid-2">
      <Field label="Project name" value={project.name} onChange={name => set({ name, slug: slugTouched ? project.slug : slugify(name) })} placeholder="Third Street Apartments" />
      <label className="admin-field"><span>Web address</span><div className="admin-prefix"><em>/projects/</em><input value={project.slug} onChange={e => { setSlugTouched(true); set({ slug: slugify(e.target.value) || e.target.value.toLowerCase() }); }} /></div>{clash ? <small className="admin-error">Another project already uses this address.</small> : <small>Made from the name. Changing it changes the page link.</small>}</label>
      <label className="admin-field"><span>Type</span><select value={project.type} onChange={e => set({ type: e.target.value === 'Villas' ? 'Villas' : 'Apartments' })}><option value="Apartments">Apartments</option><option value="Villas">Villas</option></select><small>Used by the filter on the Projects page.</small></label>
      <Field label="Project scope" value={project.scope} onChange={scope => set({ scope })} placeholder="Joint venture / Individual villa" />
      <Field label="Location" value={project.location} onChange={location => set({ location })} placeholder="3rd Street, Poombuhar Nagar" />
      <Field label="Configuration" value={project.configuration} onChange={configuration => set({ configuration })} placeholder="Stilt + 2 floors · 4 residences" />
      <Field label="Status badge (optional)" value={project.status} onChange={status => set({ status })} placeholder="Now selling · Under construction" hint="Shown as badges on the project. Separate several with · or a comma. Leave empty for past projects." />
    </div>
    <div className="admin-grid">
      <Field label="Description" value={project.description} multiline onChange={description => set({ description })} />
      <div className="admin-field"><span>Highlights</span>
        <ListEditor items={project.highlights} onChange={highlights => set({ highlights })} label="Highlight" create={() => ''} render={(item, update) =>
          <Field label="Highlight" value={item} placeholder="Nearby metro" onChange={update} />} />
        <small>Short features shown as ticks, for example Nearby metro or Covered car parking.</small>
      </div>
      <label className="admin-check"><input type="checkbox" checked={project.featured} onChange={e => set({ featured: e.target.checked })} /> Show on the home page (the first 3 featured projects appear there)</label>
      <ImageInput label="Main photo" value={project.image} name={project.slug} onChange={image => set({ image })} onError={onError} />
      <div className="admin-field"><span>More photos</span>
        <ListEditor items={project.additionalImages} onChange={additionalImages => set({ additionalImages })} label="Photo" create={() => ''} render={(url, update, index) =>
          <ImageInput label={`Photo ${index + 2}`} value={url} name={`${project.slug}-${index + 2}`} onChange={update} onError={onError} />} />
      </div>
    </div>
  </div>;
}

function ProjectsTab({ content, setContent, onError }: { content: SiteContent; setContent: (fn: (c: SiteContent) => void) => void; onError: (message: string) => void }) {
  const [editing, setEditing] = useState<number | null>(null);
  const projects = content.projects;
  if (editing !== null && projects[editing]) {
    return <ProjectForm project={projects[editing]} others={projects.filter((_, i) => i !== editing)} onError={onError}
      onChange={project => setContent(c => { c.projects[editing] = project; })} onDone={() => setEditing(null)} />;
  }
  const move = (from: number, to: number) => setContent(c => { const [p] = c.projects.splice(from, 1); c.projects.splice(to, 0, p); });
  const add = () => {
    setContent(c => { c.projects.unshift({ slug: '', name: '', location: '', type: 'Apartments', scope: '', configuration: '', image: '', additionalImages: [], description: '', featured: false, status: '', highlights: [] }); });
    setEditing(0);
  };
  return <div>
    <div className="admin-panel-head"><div><h2>Projects ({projects.length})</h2><p className="admin-muted">The order here is the order on the website. Star a project to show it on the home page.</p></div><button type="button" className="admin-btn admin-btn-primary" onClick={add}><Plus size={16} /> Add project</button></div>
    <ul className="admin-projects">{projects.map((project, index) => <li key={project.slug + index}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {project.image ? <img src={project.image} alt="" /> : <div className="admin-image-empty">No photo</div>}
      <div className="admin-project-info"><strong>{project.name || 'Untitled project'}</strong><span>{project.status ? `${project.status} · ` : ''}{project.type} · {project.location || 'No location'}</span></div>
      <div className="admin-icon-row">
        <button type="button" className={`admin-icon ${project.featured ? 'admin-star-on' : ''}`} aria-pressed={project.featured} aria-label={project.featured ? 'Remove from home page' : 'Show on home page'} title={project.featured ? 'Shown on home page' : 'Show on home page'} onClick={() => setContent(c => { c.projects[index].featured = !c.projects[index].featured; })}><Star size={17} /></button>
        <button type="button" className="admin-icon" aria-label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}><ArrowUp size={16} /></button>
        <button type="button" className="admin-icon" aria-label="Move down" disabled={index === projects.length - 1} onClick={() => move(index, index + 1)}><ArrowDown size={16} /></button>
        <button type="button" className="admin-btn" onClick={() => setEditing(index)}>Edit</button>
        <button type="button" className="admin-icon admin-danger" aria-label={`Delete ${project.name}`} onClick={() => { if (confirm(`Delete “${project.name || 'this project'}”? You can undo this from History after saving.`)) setContent(c => { c.projects.splice(index, 1); }); }}><Trash2 size={16} /></button>
      </div>
    </li>)}</ul>
  </div>;
}

/* ---------- Main editor ---------- */

export function Editor({ initial, history: initialHistory, storage }: { initial: SiteContent; history: HistoryEntry[]; storage: 'blob' | 'local' | 'none' }) {
  const [content, setRaw] = useState(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [tab, setTab] = useState<Tab>('projects');
  const [history, setHistory] = useState(initialHistory);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const dirty = useMemo(() => JSON.stringify(content) !== saved, [content, saved]);

  const setContent = (fn: (c: SiteContent) => void) => setRaw(previous => { const next = structuredClone(previous); fn(next); return next; });
  const error = (text: string) => setStatus({ kind: 'error', text });

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const onSave = async () => {
    setSaving(true); setStatus(null);
    const result = await save(content);
    setSaving(false);
    if (result.ok) { setSaved(JSON.stringify(content)); if (result.history) setHistory(result.history); setStatus({ kind: 'ok', text: 'Saved. The website is updated.' }); }
    else error(result.error ?? 'Saving failed.');
  };

  const h = content.home;
  const setHome = (patch: Partial<SiteContent['home']>) => setContent(c => { Object.assign(c.home, patch); });

  return <div className="admin">
    <header className="admin-bar">
      <div className="admin-brand">SP Builders <span>admin</span></div>
      <div className="admin-bar-actions">
        <span className={`admin-state ${dirty ? 'is-dirty' : ''}`}>{dirty ? 'Unsaved changes' : 'All changes saved'}</span>
        <a className="admin-btn admin-btn-quiet" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> View site</a>
        <button type="button" className="admin-btn admin-btn-primary" disabled={!dirty || saving || storage === 'none'} onClick={onSave}>{saving ? 'Saving…' : 'Save changes'}</button>
        <form action={logout}><button className="admin-icon" aria-label="Log out" title="Log out"><LogOut size={18} /></button></form>
      </div>
    </header>
    {storage === 'none' && <div className="admin-banner">Saving is not set up yet: create a Vercel Blob store for this project (see ADMIN-SETUP.md). You can look around, but changes can’t be saved.</div>}
    {status && <div className={`admin-toast ${status.kind}`} role="status">{status.text}<button aria-label="Dismiss" onClick={() => setStatus(null)}><X size={16} /></button></div>}
    <nav className="admin-tabs" aria-label="Admin sections">{tabs.map(([id, label]) => <button key={id} type="button" aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)}>{label}</button>)}</nav>

    <main className="admin-main">
      {tab === 'projects' && <ProjectsTab content={content} setContent={setContent} onError={error} />}

      {tab === 'home' && <>
        <Section title="Introduction" description="The section right after the building animation.">
          <Field label="Small label" value={h.storyLabel} onChange={storyLabel => setHome({ storyLabel })} />
          <Field label="Heading" value={h.storyHeading} hint={accentHint} onChange={storyHeading => setHome({ storyHeading })} />
          <Field label="Large intro sentence" value={h.storyLead} multiline onChange={storyLead => setHome({ storyLead })} />
          <Field label="Paragraph" value={h.storyText} multiline onChange={storyText => setHome({ storyText })} />
        </Section>
        <Section title="Numbers strip">
          <ListEditor items={h.stats} max={4} label="Number" onChange={stats => setHome({ stats })} create={() => ({ label: '', value: '' })} render={(stat, update) => <>
            <Field label="Value" value={stat.value} placeholder="25+" onChange={value => update({ ...stat, value })} />
            <Field label="Label" value={stat.label} placeholder="Years building" onChange={label => update({ ...stat, label })} />
          </>} />
        </Section>
        <Section title="Now selling band" description="Appears right after the building animation, for the first project whose status says Now selling.">
          <Field label="Small label" value={h.spotlightLabel} onChange={spotlightLabel => setHome({ spotlightLabel })} />
          <Field label="Button text" value={h.spotlightButton} onChange={spotlightButton => setHome({ spotlightButton })} />
        </Section>
        <Section title="Why SP Builders">
          <Field label="Small label" value={h.whyLabel} onChange={whyLabel => setHome({ whyLabel })} />
          <Field label="Heading" value={h.whyHeading} hint={accentHint} onChange={whyHeading => setHome({ whyHeading })} />
          <Field label="Intro" value={h.whyIntro} multiline onChange={whyIntro => setHome({ whyIntro })} />
          <TitleTextList items={h.why} label="Reason" onChange={why => setHome({ why })} />
        </Section>
        <Section title="Selected work heading">
          <Field label="Small label" value={h.projectsLabel} onChange={projectsLabel => setHome({ projectsLabel })} />
          <Field label="Heading" value={h.projectsHeading} hint={accentHint} onChange={projectsHeading => setHome({ projectsHeading })} />
        </Section>
        <Section title="What we do">
          <Field label="Small label" value={h.servicesLabel} onChange={servicesLabel => setHome({ servicesLabel })} />
          <Field label="Heading" value={h.servicesHeading} hint={accentHint} onChange={servicesHeading => setHome({ servicesHeading })} />
          <TitleTextList items={h.services} label="Service card" onChange={services => setHome({ services })} />
        </Section>
        <Section title="Where we build">
          <Field label="Small label" value={h.locationsLabel} onChange={locationsLabel => setHome({ locationsLabel })} />
          <Field label="Heading" value={h.locationsHeading} hint={accentHint} onChange={locationsHeading => setHome({ locationsHeading })} />
          <Field label="Intro" value={h.locationsIntro} multiline onChange={locationsIntro => setHome({ locationsIntro })} />
          <ListEditor items={h.locations} label="Area" onChange={locations => setHome({ locations })} create={() => ({ name: '', text: '', link: '/projects' })} render={(place, update) => <>
            <Field label="Area name" value={place.name} onChange={name => update({ ...place, name })} />
            <Field label="Description" value={place.text} onChange={text => update({ ...place, text })} />
            <Field label="Links to" value={place.link} hint="A page on the site, like /projects or /projects/third-street-apartments" onChange={link => update({ ...place, link })} />
          </>} />
        </Section>
        <Section title="Working together (process steps)" description="Also shown on the Approach page.">
          <Field label="Small label" value={h.processLabel} onChange={processLabel => setHome({ processLabel })} />
          <Field label="Heading" value={h.processHeading} hint={accentHint} onChange={processHeading => setHome({ processHeading })} />
          <Field label="Intro" value={h.processIntro} multiline onChange={processIntro => setHome({ processIntro })} />
          <TitleTextList items={content.approach} label="Step" onChange={approach => setContent(c => { c.approach = approach; })} />
        </Section>
        <Section title="Questions (FAQ)" description="Also shown on the Approach page.">
          <Field label="Small label" value={h.faqLabel} onChange={faqLabel => setHome({ faqLabel })} />
          <Field label="Heading" value={h.faqHeading} hint={accentHint} onChange={faqHeading => setHome({ faqHeading })} />
          <ListEditor items={content.faq} label="Question" onChange={faq => setContent(c => { c.faq = faq; })} create={() => ({ question: '', answer: '' })} render={(item, update) => <>
            <Field label="Question" value={item.question} onChange={question => update({ ...item, question })} />
            <Field label="Answer" value={item.answer} multiline onChange={answer => update({ ...item, answer })} />
          </>} />
        </Section>
        <Section title="Contact band" description="The dark section near the bottom of most pages.">
          <Field label="Small label" value={content.cta.label} onChange={label => setContent(c => { c.cta.label = label; })} />
          <Field label="Heading" value={content.cta.heading} hint={accentHint} onChange={heading => setContent(c => { c.cta.heading = heading; })} />
          <Field label="Text" value={content.cta.text} multiline onChange={text => setContent(c => { c.cta.text = text; })} />
        </Section>
      </>}

      {tab === 'pages' && <>
        <Section title="Projects page">
          <Field label="Heading" value={content.projectsPage.heading} hint={accentHint} onChange={v => setContent(c => { c.projectsPage.heading = v; })} />
          <Field label="Intro" value={content.projectsPage.intro} multiline onChange={v => setContent(c => { c.projectsPage.intro = v; })} />
          <Field label="Image note" value={content.projectsPage.note} hint="Small note under project images, on several pages." onChange={v => setContent(c => { c.projectsPage.note = v; })} />
        </Section>
        <Section title="About page">
          <Field label="Heading" value={content.about.heading} hint={accentHint} onChange={v => setContent(c => { c.about.heading = v; })} />
          <Field label="Intro" value={content.about.intro} multiline onChange={v => setContent(c => { c.about.intro = v; })} />
          <ImageInput label="Main photo" value={content.about.image} name="about" onChange={v => setContent(c => { c.about.image = v; })} onError={error} />
          <Field label="Section label" value={content.about.peopleLabel} onChange={v => setContent(c => { c.about.peopleLabel = v; })} />
          <Field label="Section heading" value={content.about.peopleHeading} hint={accentHint} onChange={v => setContent(c => { c.about.peopleHeading = v; })} />
          <Field label="Founder heading" value={content.about.founderHeading} onChange={v => setContent(c => { c.about.founderHeading = v; })} />
          <Field label="Founder paragraph" value={content.about.founderText} multiline onChange={v => setContent(c => { c.about.founderText = v; })} />
          <Field label="Second paragraph" value={content.about.founderText2} multiline onChange={v => setContent(c => { c.about.founderText2 = v; })} />
          <TitleTextList items={content.about.values} label="Value" onChange={values => setContent(c => { c.about.values = values; })} />
          <Field label="Founder name" value={content.about.founderName} onChange={v => setContent(c => { c.about.founderName = v; })} />
          <Field label="Founder role" value={content.about.founderRole} onChange={v => setContent(c => { c.about.founderRole = v; })} />
          <Field label="Founder bio" value={content.about.founderBio} multiline onChange={v => setContent(c => { c.about.founderBio = v; })} />
          <Field label="Philosophy label" value={content.about.philosophyLabel} onChange={v => setContent(c => { c.about.philosophyLabel = v; })} />
          <Field label="Philosophy" value={content.about.philosophy} multiline onChange={v => setContent(c => { c.about.philosophy = v; })} />
          <Field label="Motto" value={content.about.motto} hint={accentHint} onChange={v => setContent(c => { c.about.motto = v; })} />
        </Section>
        <Section title="Services page">
          <Field label="Heading" value={content.servicesPage.heading} hint={accentHint} onChange={v => setContent(c => { c.servicesPage.heading = v; })} />
          <Field label="Intro" value={content.servicesPage.intro} multiline onChange={v => setContent(c => { c.servicesPage.intro = v; })} />
          <ListEditor items={content.servicesPage.items} label="Service" onChange={items => setContent(c => { c.servicesPage.items = items; })}
            create={() => ({ id: '', title: '', text: '', prompt: '', detail: '', linkText: '', link: '', message: '' })}
            render={(item, update) => <>
              <Field label="Title" value={item.title} onChange={title => update({ ...item, title, id: item.id || slugify(title) })} />
              <Field label="Description" value={item.text} multiline onChange={text => update({ ...item, text })} />
              <Field label="Question heading" value={item.prompt} placeholder="Planning your own home?" onChange={prompt => update({ ...item, prompt })} />
              <Field label="Answer" value={item.detail} multiline onChange={detail => update({ ...item, detail })} />
              <Field label="WhatsApp starting message" value={item.message} multiline onChange={message => update({ ...item, message })} />
              <Field label="Link text" value={item.linkText} onChange={linkText => update({ ...item, linkText })} />
              <Field label="Link to" value={item.link} hint="A page on the site, like /contact" onChange={link => update({ ...item, link })} />
            </>} />
        </Section>
        <Section title="Joint ventures page">
          <Field label="Heading" value={content.jvPage.heading} hint={accentHint} onChange={v => setContent(c => { c.jvPage.heading = v; })} />
          <Field label="Intro" value={content.jvPage.intro} multiline onChange={v => setContent(c => { c.jvPage.intro = v; })} />
          <Field label="Button text" value={content.jvPage.ctaLabel} onChange={v => setContent(c => { c.jvPage.ctaLabel = v; })} />
          <Field label="WhatsApp starting message" value={content.jvPage.message} multiline onChange={v => setContent(c => { c.jvPage.message = v; })} />
          <Field label="Steps heading" value={content.jvPage.stepsHeading} hint={accentHint} onChange={v => setContent(c => { c.jvPage.stepsHeading = v; })} />
          <TitleTextList items={content.jvPage.steps} label="Step" onChange={steps => setContent(c => { c.jvPage.steps = steps; })} />
          <Field label="Why partner heading" value={content.jvPage.whyHeading} hint={accentHint} onChange={v => setContent(c => { c.jvPage.whyHeading = v; })} />
          <TitleTextList items={content.jvPage.why} label="Reason" onChange={why => setContent(c => { c.jvPage.why = why; })} />
          <Field label="Checklist heading" value={content.jvPage.bringHeading} hint={accentHint} onChange={v => setContent(c => { c.jvPage.bringHeading = v; })} />
          <ListEditor items={content.jvPage.bring} label="Checklist item" onChange={bring => setContent(c => { c.jvPage.bring = bring; })} create={() => ''} render={(item, update) => <Field label="Item" value={item} onChange={update} />} />
          <Field label="Questions heading" value={content.jvPage.faqHeading} hint={accentHint} onChange={v => setContent(c => { c.jvPage.faqHeading = v; })} />
          <ListEditor items={content.jvPage.faq} label="Question" onChange={faq => setContent(c => { c.jvPage.faq = faq; })} create={() => ({ question: '', answer: '' })} render={(item, update) => <>
            <Field label="Question" value={item.question} onChange={question => update({ ...item, question })} />
            <Field label="Answer" value={item.answer} multiline onChange={answer => update({ ...item, answer })} />
          </>} />
        </Section>
        <Section title="Approach page">
          <Field label="Heading" value={content.approachPage.heading} hint={accentHint} onChange={v => setContent(c => { c.approachPage.heading = v; })} />
          <Field label="Intro" value={content.approachPage.intro} multiline onChange={v => setContent(c => { c.approachPage.intro = v; })} />
          <Field label="Guide label" value={content.approachPage.guideLabel} onChange={v => setContent(c => { c.approachPage.guideLabel = v; })} />
          <Field label="Guide heading" value={content.approachPage.guideHeading} hint={accentHint} onChange={v => setContent(c => { c.approachPage.guideHeading = v; })} />
          <Field label="Guide intro" value={content.approachPage.guideIntro} multiline onChange={v => setContent(c => { c.approachPage.guideIntro = v; })} />
          <TitleTextList items={content.approachPage.guide} label="Guide item" onChange={guide => setContent(c => { c.approachPage.guide = guide; })} />
        </Section>
        <Section title="Contact page">
          <Field label="Heading" value={content.contactPage.heading} hint={accentHint} onChange={v => setContent(c => { c.contactPage.heading = v; })} />
          <Field label="Intro" value={content.contactPage.intro} multiline onChange={v => setContent(c => { c.contactPage.intro = v; })} />
          <Field label="WhatsApp box heading" value={content.contactPage.whatsappHeading} onChange={v => setContent(c => { c.contactPage.whatsappHeading = v; })} />
          <Field label="WhatsApp box text" value={content.contactPage.whatsappText} multiline onChange={v => setContent(c => { c.contactPage.whatsappText = v; })} />
        </Section>
      </>}

      {tab === 'contact' && <Section title="Contact details" description="Used everywhere on the site: buttons, footer, contact page and the phone bar.">
        <Field label="Phone number (as shown)" value={content.company.phone} placeholder="+91 98411 45873" onChange={v => setContent(c => { c.company.phone = v; })} />
        <Field label="WhatsApp number" value={content.company.whatsapp} hint="Country code and number, digits only. Example: 919841145873" onChange={v => setContent(c => { c.company.whatsapp = v.replace(/\D/g, ''); })} />
        <Field label="Email" value={content.company.email} onChange={v => setContent(c => { c.company.email = v; })} />
        <Field label="Office address" value={content.company.address} multiline onChange={v => setContent(c => { c.company.address = v; })} />
        <Field label="Map location" value={content.company.mapLocation} hint="What the map on the Contact page points to. For an exact pin, open Google Maps, long-press or right-click the office, copy the numbers shown (like 13.1211, 80.2134) and paste them here." onChange={v => setContent(c => { c.company.mapLocation = v; })} />
        <Field label="Visits note" value={content.company.visits} onChange={v => setContent(c => { c.company.visits = v; })} />
        <Field label="Footer text" value={content.company.footerText} multiline hint={accentHint} onChange={v => setContent(c => { c.company.footerText = v; })} />
      </Section>}

      {tab === 'history' && <Section title="Saved versions" description="Every save is kept. Load an older version to review it, then press Save changes to put it back on the site.">
        {history.length === 0 ? <p className="admin-muted">No saves yet.</p> : <ul className="admin-history">{history.map(entry => <li key={entry.id}>
          <History size={16} aria-hidden="true" /><span>{new Date(entry.savedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          <button type="button" className="admin-btn" onClick={async () => {
            if (dirty && !confirm('Load this version? Your unsaved changes will be replaced.')) return;
            const result = await loadVersion(entry.id);
            if (result.content) { setRaw(result.content); setStatus({ kind: 'ok', text: 'Version loaded. Press Save changes to put it back on the website.' }); setTab('projects'); }
            else error(result.error ?? 'Could not load that version.');
          }}>Load this version</button>
        </li>)}</ul>}
      </Section>}
    </main>
  </div>;
}
