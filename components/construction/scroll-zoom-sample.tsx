'use client';

import {useEffect, useRef, useState} from 'react';

const stages = [
  {image: '/images/scene-0.webp', label: 'The site'},
  {image: '/images/scene-1.webp', label: 'Foundation'},
  {image: '/images/scene-2.webp', label: 'Structure'},
  {image: '/images/scene-3.webp', label: 'Finishing'},
  {image: '/images/scene-4.webp', label: 'Complete'},
];

export function ScrollZoomSample() {
  const root = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(Math.max(0, Math.min(1, -rect.top / range)));
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', requestUpdate, {passive: true});
    window.addEventListener('resize', requestUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  const position = progress * (stages.length - 1);
  const active = Math.min(stages.length - 1, Math.floor(position + 0.15));
  const scale = 0.82 + progress * 0.72;
  const lift = 7 - progress * 12;

  return <section ref={root} className="zoom-sample" aria-label="Scroll construction and zoom demonstration">
    <div className="zoom-sample-sticky">
      <div className="zoom-sample-camera" style={{transform: `translate3d(0, ${lift}%, 0) scale(${scale})`}} aria-hidden="true">
        {stages.map((stage, index) => {
          const opacity = Math.max(0, Math.min(1, position - index + 1));
          return <img key={stage.image} src={stage.image} alt="" style={{opacity}} />;
        })}
      </div>
      <div className="zoom-sample-shade" />
      <div className="zoom-sample-copy">
        <span>LIGHTWEIGHT INTERACTION SAMPLE</span>
        <h1>{progress < .92 ? 'Scroll. Build. Move closer.' : 'From first line to final form.'}</h1>
        <p>The building and camera move together.</p>
      </div>
      <div className="zoom-sample-meter">
        <span>{String(Math.round(progress * 100)).padStart(2, '0')}%</span>
        <div><i style={{transform: `scaleX(${progress})`}} /></div>
        <strong>{stages[active].label}</strong>
      </div>
      <div className="zoom-sample-hint">SCROLL TO CONSTRUCT <span>↓</span></div>
    </div>
  </section>;
}
