'use client';
import {useState} from 'react';
import type {Project} from '@/lib/site-content';
import {ProjectCard} from '@/components/sections';
const filters=['All projects','Apartments','Villas'];
export function Portfolio({projects}:{projects:Project[]}){
  const [filter,setFilter]=useState('All projects');
  const shown=projects.filter(p=>filter==='All projects'||p.type===filter);
  return <>
    <div className="filters" role="group" aria-label="Filter projects">{filters.map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}<span>{f==='All projects'?projects.length:projects.filter(p=>p.type===f).length}</span></button>)}</div>
    <div className="project-grid">{shown.map((p,i)=><ProjectCard project={p} index={i} key={p.slug}/>)}</div>
  </>;
}
