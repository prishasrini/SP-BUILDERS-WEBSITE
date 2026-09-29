'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowDown, ArrowUpRight, Pause, Play} from 'lucide-react';

const stages = [
  {at:0, label:'The beginning', title:'A vision takes shape.'},
  {at:.18, label:'Groundwork', title:'From the ground, up.'},
  {at:.36, label:'Structure', title:'Built with purpose.'},
  {at:.55, label:'Taking shape', title:'Space becomes home.'},
  {at:.76, label:'The details', title:'Every detail matters.'},
  {at:.94, label:'Complete', title:'Made for living.'},
];

export function ConstructionScene() {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync(); query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const video = film.current;
    const section = root.current;
    if (!video || !section || reduced || failed) return;
    let frame = 0;
    let target = 0;
    const duration = () => Math.max(0, (video.duration || 0) - 1 / 24);
    const seek = () => {
      frame = 0;
      if (paused || video.seeking || !Number.isFinite(video.duration) || !duration()) return;
      if (Math.abs(video.currentTime - target) > 1 / 48) video.currentTime = target;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(seek); };
    const measure = () => {
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const position = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance));
      // Spend 84% of the longer scene constructing, then hold the finished frame.
      target = Math.min(1, position / .84) * duration();
      schedule();
    };
    const settled = () => {
      if (duration()) setProgress(video.currentTime / duration());
      schedule();
    };
    const loaded = () => { setReady(true); measure(); };
    video.addEventListener('loadeddata', loaded);
    video.addEventListener('seeked', settled);
    window.addEventListener('scroll', measure, {passive:true});
    window.addEventListener('resize', measure);
    if (video.readyState >= 2) loaded();
    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener('loadeddata', loaded);
      video.removeEventListener('seeked', settled);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [paused, reduced, failed]);

  const shown = reduced ? 1 : progress;
  const stage = stages.reduce((current, item, index) => shown >= item.at ? index : current, 0);
  return <section ref={root} className={`construction construction-film ${reduced || failed ? 'motion-reduced' : ''}`} aria-label="Scroll through the construction film">
    <div className="scene">
      <div className="scene-media">
        {/* The user's exact proper_af footage, not a generated model. */}
        {!reduced && <video ref={film} className={ready ? 'film-ready' : ''} style={{transform:`scale(${1.04 + .04 * Math.sin(progress * Math.PI)})`,transformOrigin:'50% 48%'}} src="/media/proper-af.mp4" poster="/media/proper-af-beginning.webp" preload="auto" muted playsInline disablePictureInPicture onError={() => setFailed(true)} aria-hidden="true" />}
        {(reduced || failed) && <img className="scene-poster" src="/media/proper-af-completed.webp" alt="Completed building from the supplied construction film" />}
      </div>
      <div className="scene-shade" />
      <div className="scene-rail" aria-hidden="true"><span>GROUND</span><span>STRUCTURE</span><span>HOME</span><div className="rail-progress" style={{transform:`scaleY(${shown})`}} /></div>
      <div className="scene-copy scene-copy-3d"><span className="eyebrow">SP BUILDERS / {stages[stage].label}</span><div className="chapter-copy"><h1>{stages[stage].title}</h1><p>Better spaces. Brighter tomorrows.</p></div></div>
      <div className="scene-stage"><span>BUILD SEQUENCE</span><strong>{String(stage + 1).padStart(2,'0')}<small>/06</small></strong><span>{stages[stage].label}</span></div>
      <div className="scene-bottom"><a href="#story" className="scene-skip">Explore SP Builders <ArrowUpRight size={15}/></a><span className="film-scroll-label">SCROLL TO CONSTRUCT <ArrowDown size={14}/></span><div className="scene-status"><span>{Math.round(shown * 100)}%</span>{!reduced && !failed && <button className="pause-film" aria-label={paused ? 'Resume scroll animation' : 'Pause scroll animation'} onClick={() => setPaused(!paused)}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>}</div></div>
      {failed && <p className="film-note">Film unavailable. Continue to explore SP Builders.</p>}
    </div>
  </section>;
}
