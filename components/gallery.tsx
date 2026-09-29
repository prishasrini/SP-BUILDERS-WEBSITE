'use client';
import {useRef,useState} from 'react';
import {Expand,X} from 'lucide-react';
export function Gallery({src,alt,additionalImages=[]}:{src:string;alt:string;additionalImages?:string[]}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [selected,setSelected]=useState(src);
 const images=[src,...additionalImages];
 return <><button className="gallery-open" onClick={()=>dialog.current?.showModal()} aria-label={`Enlarge ${alt}`}><img src={selected} alt={`${alt}, complete brochure artwork`}/><span><Expand size={18}/> View full image</span></button>{images.length>1&&<div className="gallery-options" aria-label="Project views">{images.map((image,index)=><button key={image} onClick={()=>setSelected(image)} aria-pressed={selected===image}>{index===0?'Main elevation':'Additional brochure elevation'}</button>)}</div>}<dialog ref={dialog} className="lightbox" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}><button className="close-lightbox" onClick={()=>dialog.current?.close()} aria-label="Close image"><X/></button><img src={selected} alt={`${alt}, complete brochure artwork`}/><p>{alt} · Architectural visualisation</p><a href={selected} target="_blank" rel="noreferrer">Open original-resolution image ↗</a></dialog></>;
}
