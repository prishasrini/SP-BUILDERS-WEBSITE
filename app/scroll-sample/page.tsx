import type {Metadata} from 'next';
import {ScrollZoomSample} from '@/components/construction/scroll-zoom-sample';

export const metadata: Metadata = {
  title: 'Scroll Construction Sample',
  description: 'A lightweight demonstration of simultaneous building construction and camera zoom.',
  robots: {index: false, follow: false},
};

export default function ScrollSamplePage() {
  return <main id="main" className="sample-page">
    <ScrollZoomSample />
    <section className="sample-end">
      <span>END OF SAMPLE</span>
      <h2>The finished building fills the screen.</h2>
      <p>In the final version, this close view can transition directly into the next website section.</p>
    </section>
  </main>;
}
