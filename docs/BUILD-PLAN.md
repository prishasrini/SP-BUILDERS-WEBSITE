# SP Builders experience

## Approved redesign — Vermilion / technical

The user selected concept 02 and explicitly approved using `proper_1_20260920010929.mp4` as the actual hero footage. This supersedes the original image-reveal plan below. The production hero uses continuous H.264 footage encoded for desktop/mobile seeking, preserving the source construction and camera movement. Scroll selects time; stopping holds the frame. It never calls video.play(). Text follows decoded frames. The final view holds for the last 9% of the scene scroll.

The new identity uses vermilion, warm white and charcoal; sans-serif headlines; monospaced labels; a vertical progress rail; an opaque header; horizontal project entries; a two-column expertise section and a vertically listed approach. All interior pages and their headings have been redesigned. The earlier teal/serif design and masked image progression are retired. WhatsApp recordings and ALDA content remain reference material only.

Film outputs: `public/media/construction.mp4` (1600px, 24fps), `construction-mobile.mp4` (960px, 24fps), plus matching beginning/completed WebP posters. The media preparation script preserves the approved source and produces new files. Playback remains an illustrative sequence, not a claim of actual project completion.

## Original asset review (historical)

## Source authority
SP Builders company profile is the primary factual source. The two HTML drafts are secondary and contain inconsistencies. ALDA document and both WhatsApp recordings are interaction/editorial references only; their business claims, instructions and project names are excluded. proper_1 is reviewed as a motion reference only and is not copied into the website.

## Asset map
| Source | Role | Treatment |
|---|---|---|
| emppty.png | Hero beginning | Optimized WebP, desktop and mobile |
| stage 2.png | Hero structural frame | Optimized WebP |
| stage 3.png | Hero envelope | Optimized WebP |
| stage 4.png | Hero exterior | Optimized WebP |
| stage 5.png | Hero completion | Optimized WebP; static reduced-motion fallback |
| 1.png, end.png | Alternate angle | Excluded to prevent camera discontinuity |
| signature-building-reference.png | Unverified tower concept | Excluded from portfolio |
| PDF pages 4–11 | Project case studies | Profile render crops; labelled architectural visualisations |
| PDF page 2 | Company image and history | Render crop; factual history |
| PDF page 12 | Logo/contact | Verified phone, email and address |
| Three supplied videos | UX references | Reviewed, never embedded or republished |

## Structure and timeline
Home → pinned scene → story → selected work → capabilities → approach → contact. /projects plus individual /projects/[slug] case studies. Dedicated /about, /services, /process, /contact pages.

0–15%: vision / empty site. 15–40%: structure. 40–65%: enclosure. 65–85%: finish. 85–100%: completed visual. Last portion holds completion and introduces company. Images overlap with masked upward reveals, with independent HTML messages and a progress readout. Progress is explicitly an experience percentage, never a real site completion claim. Forward scroll advances; backward scroll retraces the same deterministic sequence. No auto playback, scroll interception or random resets.

## Architecture
Next.js App Router, React, TypeScript, Tailwind available for utilities; custom design tokens, GSAP timeline, native sticky scene and native scrolling (no Lenis interception needed). Static server-rendered business content. Client islands for scene, menu, filters, lightbox and contact. No Three.js without model assets.

## Responsive/accessibility
Desktop: wide scene, low-left story, low-right percentage. Mobile: image contained in central visual field, separate text overlay below, shorter scroll distance. Reduced motion: completed still with company headline and immediate access to story. Keyboard skip links and stage controls. Responsive WebP, next/image, lazy portfolio images.

## Content caveats
No current project status, dates or completion percentages are inferred. Profile page 6 conflicts between Kolathur heading and Pallikaranai prose: excluded pending clarification. Page 11's two unnamed renders are omitted pending confirmation that they represent distinct projects. No borrowed ALDA services, legacy, testimonials or statistics. Profile verified establishment year: 2000. Project titles derived from verified addresses are descriptive, not invented development names.

## Launch dependencies
Vercel and GitHub deployment require account/repository access. Supabase URL, server key and schema are required for live enquiries. Until configured, the form honestly returns unavailable and offers verified phone/email. Domain env enables canonical/sitemap URLs. No false success states.

