'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function HomeAtmosphere({children}: {children: ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (preference.matches) return;
      const sections = [...container.querySelectorAll<HTMLElement>(':scope > section')];
      const targets = [...container.querySelectorAll<HTMLElement>('h2, .work-entry, .service-stack > a, .process-list > li')];
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          const peers = element.parentElement ? [...element.parentElement.children].filter(child => targets.includes(child as HTMLElement)) : [];
          const delay = Math.max(0, peers.indexOf(element)) * 100;
          element.animate([{opacity: .2, transform: 'translateY(30px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 850, delay, fill: 'backwards', easing: 'cubic-bezier(.2,.65,.3,1)'});
          observer.unobserve(element);
        });
      }, {threshold: .12});
      targets.forEach(target => observer.observe(target));
      let frame = 0;
      const surfaces = sections.filter(section => section.matches('.story, .capabilities, .conversation'));
      const pointer = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        const section = event.currentTarget as HTMLElement;
        const box = section.getBoundingClientRect();
        section.style.setProperty('--pointer-x', `${((event.clientX - box.left) / box.width - .5) * 14}px`);
        section.style.setProperty('--pointer-y', `${((event.clientY - box.top) / box.height - .5) * 8}px`);
      };
      const resetPointer = (event: PointerEvent) => {
        const section = event.currentTarget as HTMLElement;
        section.style.setProperty('--pointer-x', '0px');
        section.style.setProperty('--pointer-y', '0px');
      };
      surfaces.forEach(section => {section.addEventListener('pointermove', pointer); section.addEventListener('pointerleave', resetPointer);});
      const paint = () => {
        frame = 0;
        sections.forEach(section => {
          const bounds = section.getBoundingClientRect();
          if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
          const position = (window.innerHeight / 2 - bounds.top - bounds.height / 2) / window.innerHeight;
          section.style.setProperty('--atmosphere-shift', `${Math.max(-16, Math.min(16, position * 20))}px`);
          section.style.setProperty('--atmosphere-light', `${1 - Math.min(.15, Math.abs(position) * .12)}`);
          if (section.matches('.process')) {
            section.querySelectorAll<HTMLElement>('.process-list li').forEach(item => {
              const top = item.getBoundingClientRect().top;
              item.classList.toggle('step-lit', top < window.innerHeight * .78);
            });
          }
        });
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
      window.addEventListener('scroll', schedule, {passive: true});
      window.addEventListener('resize', schedule);
      paint();
      cleanup = () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        surfaces.forEach(section => {section.removeEventListener('pointermove', pointer); section.removeEventListener('pointerleave', resetPointer); section.style.removeProperty('--pointer-x'); section.style.removeProperty('--pointer-y');});
        container.querySelectorAll('.step-lit').forEach(item => item.classList.remove('step-lit'));
        targets.forEach(target => target.getAnimations().forEach(animation => animation.cancel()));
        sections.forEach(section => {section.style.removeProperty('--atmosphere-shift'); section.style.removeProperty('--atmosphere-light');});
      };
    };
    setup();
    preference.addEventListener('change', setup);
    return () => {cleanup(); preference.removeEventListener('change', setup);};
  }, []);
  return <div className="home-atmosphere" ref={root}>{children}</div>;
}
