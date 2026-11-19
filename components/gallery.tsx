'use client';
import {useRef,useState} from 'react';
import Image from 'next/image';
import {Expand,X} from 'lucide-react';
export function Gallery({src,alt,additionalImages=[]}:{src:string;alt:string;additionalImages?:string[]}){
  const dialog=useRef<HTMLDialogElement>(null);
  const [selected,setSelected]=useState(src);
  const images=[src,...additionalImages];
  return <>
    <button className="gallery-open" onClick={()=>dialog.current?.showModal()} aria-label={`Enlarge image of ${alt}`}>
      <Image src={selected} alt={`${alt}, architectural visualisation`} width={1448} height={1086} sizes="(max-width: 900px) 92vw, 60vw" priority/>
      <span><Expand size={16} aria-hidden="true"/>View larger</span>
    </button>
    {images.length>1&&<div className="gallery-options" role="group" aria-label="Project views">{images.map((image,index)=><button key={image} onClick={()=>setSelected(image)} aria-pressed={selected===image}>{index===0?'Main view':`View ${index+1}`}</button>)}</div>}
    <dialog ref={dialog} className="lightbox" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}>
      <button className="close-lightbox" onClick={()=>dialog.current?.close()} aria-label="Close image"><X/></button>
      <img src={selected} alt={`${alt}, architectural visualisation`}/>
      <p>{alt} · Architectural visualisation</p>
    </dialog>
  </>;
}
