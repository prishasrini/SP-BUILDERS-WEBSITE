# SP Builders website

Next.js, React and TypeScript website for SP Builders, Chennai. Includes the approved scroll-controlled construction footage, dark architectural design, responsive layouts, project portfolio, and direct WhatsApp contact.

## Local development

Use Node.js 22 LTS or a compatible newer LTS version.

```sh
npm ci
npm run dev
```

Production verification: `npm run build`, then `npm start`. The local server runs at http://127.0.0.1:3000. Webpack is selected for compatibility with the development environment.

## Contact

The live contact UI links directly to https://wa.me/919841145873. Visitors compose and send their message in WhatsApp. Email links use spbuilders2003@gmail.com.

No Supabase, Resend or Twilio account or API key is needed for the current website. The earlier optional enquiry backend and its documentation remain in the repository but are not used by the contact UI. Leave those credentials unset unless deliberately reintroducing that feature.

## Publish through GitHub Desktop

1. Select File > Add Local Repository and choose this project folder (the folder containing package.json).
2. The initial website commit is prepared locally. Select Publish repository.
3. Use a repository name such as `sp-builders-website`. Keep the code private unless you intend to share it publicly.
4. Publish to your GitHub account. This uploads the code; it does not deploy the website.

Do not create another project folder or copy node_modules. The .gitignore excludes dependencies, build output and private environment files.

## Deploy on Vercel

1. Sign in to Vercel and choose Add New > Project.
2. Connect GitHub and import the published repository. Grant access only to this repository when possible.
3. Use the Next.js framework preset, repository root directory, build command `npm run build`, and the default output directory. Leave the install command at its detected default.
4. Deploy. The WhatsApp contact link works without environment variables.
5. Once the production URL is assigned, set `NEXT_PUBLIC_SITE_URL` in the production environment to its HTTPS origin with no trailing slash, then redeploy. This enables indexing, canonical URLs and sitemap URLs. Without it, the website intentionally blocks indexing.
6. If adding a custom domain, connect it in Vercel, follow the displayed DNS instructions, and update NEXT_PUBLIC_SITE_URL to that domain before redeploying.
7. Check the home-page construction animation, project images, navigation, mobile layout, and WhatsApp link on the live URL.

This is a business website. Vercel restricts its Hobby plan to personal, non-commercial use; use an appropriate commercial plan. Review account pricing before choosing a paid plan.

Future commits pushed to the connected production branch trigger Vercel deployments.

References: [GitHub Desktop](https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop), [Vercel Git deployment](https://vercel.com/docs/git), [Vercel Hobby plan](https://vercel.com/docs/plans/hobby).

## Content and assets

Company and project data lives in lib/content.ts. The supplied company brochure is the factual source; ALDA content is reference material. Image cleanup and atmospheric design assets are documented in docs/IMAGE-CLEANUP.md and docs/LIGHT-SHADOW-ASSETS.md.

The hero uses the approved proper-af construction footage in public/media. Keep the original scroll interaction intact when editing content sections.
