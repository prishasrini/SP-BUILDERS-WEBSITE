# Light and Shadow homepage

The built-in image-generation tool produced two decorative background assets, saved in `public/images/light-shadow-story.png` and `public/images/light-shadow-contact.png`. Optimised WebP copies are used by the site. They contain no text, interface controls or project imagery.

Prompt set: photoreal architectural background, landscape 2:1; dark aubergine centre kept quiet for live HTML content. Extreme edges contain angular textured charcoal stone, folded bronze metal, vertical screens, recessed warm lighting, realistic shadows and tropical foliage. Story variant uses a tall illuminated stone reveal and an angled planter. Contact variant uses a framed courtyard with bronze fins, an angular illuminated portal and shallow steps. No letters, logos, symbols, buttons, buildings or pale backgrounds.

Styling and motion are scoped to `.home-atmosphere`, which begins after `ConstructionScene`. Motion uses one-shot intersection reveals and a requestAnimationFrame-throttled background shift capped at 16px. Reduced-motion preference disables these effects. Content stays visible without JavaScript.
