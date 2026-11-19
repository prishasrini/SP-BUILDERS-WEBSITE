import { Fragment } from 'react';

// Renders admin text where words wrapped in *stars* become the italic accent font.
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return <>{parts.map((part, index) => part.startsWith('*') && part.endsWith('*') && part.length > 2
    ? <em key={index}>{part.slice(1, -1)}</em>
    : <Fragment key={index}>{part}</Fragment>)}</>;
}

export const plain = (text: string) => text.replace(/\*/g, '');
