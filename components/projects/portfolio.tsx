'use client';
import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpRight} from 'lucide-react';
import {projects} from '@/lib/content';
export function Portfolio(){const [filter,setFilter]=useState('All projects');return <><div className="filters" aria-label="Filter projects">{['All projects','Apartments','Villas'].map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}<span>{f==='All projects'?projects.length:projects.filter(p=>p.type===f).length}</span></button>)}</div><div className="portfolio-grid">{projects.filter(p=>filter==='All projects'||p.type===filter).map((p,i)=><Link href={`/projects/${p.slug}`} key={p.slug} className="portfolio-item"><div className="project-image"><Image unoptimized src={p.image} alt={`${p.name}, architectural visualisation`} fill sizes="(max-width: 700px) 90vw, 44vw"/><span className="image-tag">ARCHITECTURAL VISUALISATION</span><span className="image-arrow"><ArrowUpRight/></span></div><div className="project-caption"><div><span className="eyebrow">{p.type} / {p.scope}</span><h2>{p.name}</h2><p>{p.location}</p></div><span>{String(i+1).padStart(2,'0')}</span></div></Link>)}</div></>}
