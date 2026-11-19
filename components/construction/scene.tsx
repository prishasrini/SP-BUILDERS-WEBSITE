'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowDown, ArrowUpRight} from 'lucide-react';

// Scroll-driven construction hero. The film is played back as an image sequence drawn on a
// canvas, which seeks instantly, eases between frames and loads on phones without a tap.
// The original video version is kept in scene-video.tsx (NEXT_PUBLIC_HERO_MODE=video).

const FRAME_COUNT = 80;
// Phones get a portrait crop of the film that fills the screen. Set to false to show the
// full-width film letterboxed in the middle, as in the original design.
const MOBILE_FILL = true;
type FrameSet = 'd' | 'm' | 'p';
const frameUrl = (set: FrameSet, index: number) => `/media/hero/${set}/${String(index + 1).padStart(3, '0')}.webp`;

const stages = [
  {at:0, label:'The beginning', title:'A vision takes shape.'},
  {at:.18, label:'Groundwork', title:'From the ground, up.'},
  {at:.36, label:'Structure', title:'Built with purpose.'},
  {at:.55, label:'Taking shape', title:'Space becomes home.'},
  {at:.76, label:'The details', title:'Every detail matters.'},
  {at:.94, label:'Complete', title:'Made for living.'},
];

// Load order: first frame, then progressively finer passes so any scroll position has a nearby frame.
function loadOrder(count: number) {
  const order: number[] = [0];
  const seen = new Set(order);
  for (const stride of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += stride) if (!seen.has(i)) { seen.add(i); order.push(i); }
  }
  if (!seen.has(count - 1)) order.push(count - 1);
  return order;
}

export function ConstructionScene() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync(); query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const section = root.current;
    const surface = canvas.current;
    if (!section || !surface || reduced) return;
    const context = surface.getContext('2d');
    if (!context) return;

    const devicePixels = surface.getBoundingClientRect().width * (window.devicePixelRatio || 1);
    const set: FrameSet = MOBILE_FILL && matchMedia('(max-width: 650px) and (orientation: portrait)').matches ? 'p' : devicePixels <= 1400 ? 'm' : 'd';
    const frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    let cancelled = false;
    let current = 0;
    let target = 0;
    let drawn = -1;
    let frame = 0;
    let lastReported = -1;

    const nearestLoaded = (index: number) => {
      for (let offset = 0; offset < FRAME_COUNT; offset++) {
        if (frames[index - offset]) return index - offset;
        if (frames[index + offset]) return index + offset;
      }
      return -1;
    };

    const draw = (index: number) => {
      const found = nearestLoaded(index);
      if (found < 0 || found === drawn) return;
      const image = frames[found]!;
      if (surface.width !== image.naturalWidth) { surface.width = image.naturalWidth; surface.height = image.naturalHeight; }
      context.drawImage(image, 0, 0);
      drawn = found;
    };

    const tick = () => {
      frame = 0;
      const difference = target - current;
      current = Math.abs(difference) < .002 ? target : current + difference * .16;
      draw(Math.round(current * (FRAME_COUNT - 1)));
      const rounded = Math.round(current * 1000) / 1000;
      if (rounded !== lastReported) { lastReported = rounded; setProgress(rounded); }
      if (current !== target) frame = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };

    const measure = () => {
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const position = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance));
      // Spend 84% of the scroll constructing, then hold the finished building.
      target = Math.min(1, position / .84);
      schedule();
    };

    // Fetch frames a few at a time in priority order.
    const queue = loadOrder(FRAME_COUNT);
    const loadNext = () => {
      const index = queue.shift();
      if (index === undefined || cancelled) return;
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        if (cancelled) return;
        frames[index] = image;
        if (index === 0) setReady(true);
        drawn = -1;
        draw(Math.round(current * (FRAME_COUNT - 1)));
        loadNext();
      };
      image.onerror = () => loadNext();
      image.src = frameUrl(set, index);
    };
    // Fetch the first frame alone so it arrives quickly on slow connections, then widen.
    let started = false;
    const widen = () => { if (started) return; started = true; for (let i = 0; i < 4; i++) loadNext(); };
    loadNext();
    const firstReady = setInterval(() => { if (frames[0] || cancelled) { clearInterval(firstReady); widen(); } }, 50);

    window.addEventListener('scroll', measure, {passive:true});
    window.addEventListener('resize', measure);
    measure();
    return () => {
      cancelled = true;
      clearInterval(firstReady);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [reduced]);

  const shown = reduced ? 1 : progress;
  const stage = stages.reduce((current, item, index) => shown >= item.at ? index : current, 0);
  return <section ref={root} className={`construction construction-film construction-frames ${MOBILE_FILL ? 'mobile-fill' : ''} ${reduced ? 'motion-reduced' : ''}`} aria-label="Scroll through the construction film">
    <div className="scene">
      <div className="scene-media">
        {reduced && <img className="scene-poster" src="/media/proper-af-completed.webp" alt="Building from the SP Builders construction film" />}
        {/* First frame doubles as the poster: small, high priority, and already cached when the canvas starts. */}
        {!reduced && !ready && <picture>{MOBILE_FILL && <source media="(max-width: 650px) and (orientation: portrait)" srcSet={frameUrl('p', 0)} />}<source media="(max-width: 1400px)" srcSet={frameUrl('m', 0)} /><img className="scene-poster" src={frameUrl('d', 0)} alt="Building from the SP Builders construction film" fetchPriority="high" /></picture>}
        {!reduced && <canvas ref={canvas} className={`scene-canvas ${ready ? 'film-ready' : ''}`} style={{transform:`scale(${1.04 + .04 * Math.sin(progress * Math.PI)})`,transformOrigin:'50% 48%'}} aria-hidden="true" />}
      </div>
      <div className="scene-shade" />
      <div className="scene-rail" aria-hidden="true"><span>GROUND</span><span>STRUCTURE</span><span>HOME</span><div className="rail-progress" style={{transform:`scaleY(${shown})`}} /></div>
      <div className="scene-copy scene-copy-3d"><span className="eyebrow">SP BUILDERS / {stages[stage].label}</span><div className="chapter-copy"><h1>{stages[stage].title}</h1><p>Better spaces. Brighter tomorrows.</p></div></div>
      <div className="scene-stage"><span>BUILD SEQUENCE</span><strong>{String(stage + 1).padStart(2,'0')}<small>/06</small></strong><span>{stages[stage].label}</span></div>
      <div className="scene-bottom"><a href="#story" className="scene-skip">Explore SP Builders <ArrowUpRight size={15}/></a><span className="film-scroll-label">SCROLL TO CONSTRUCT <ArrowDown size={14}/></span><div className="scene-status"><span>{Math.round(shown * 100)}%</span></div></div>
    </div>
  </section>;
}
