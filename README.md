# Atelier Arvena

Dark editorial architecture portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS, and accessible shadcn/ui-style Radix primitives.

## Run

```powershell
npm install
npm run dev
```

## Verify

```powershell
npm test
npm run typecheck
npm run lint
npm run build
```

`npm start` runs the production build. All sixteen project routes are generated from `src/data/projects.ts`.

## Content

- Brand settings and the receiving email: `src/data/site.ts`.
- Portfolio concepts, categories, narratives, and navigation: `src/data/projects.ts`.
- Local photographs, source pages, photographers, retrieval dates, and license links: `src/data/assets.json`.
- Re-download permitted photographs with `node scripts/download-assets.mjs`.

The portfolio contains original architectural concepts, not claims of built commissions. Team identities are fictional; portraits are licensed editorial photography. Images illustrate material and spatial directions; galleries are not photographic records of commissioned projects.

The five-step enquiry retains values while navigating within the form. It does not persist personal information across reloads, submit to a server, or send email. The final action opens an email draft to the configured recipient. Copy and text-download handoffs are also available. No analytics or tracking is installed.

No public domain has been supplied. Metadata uses relative image URLs; set `metadataBase` to the real production origin before deploying under a public domain. Do not substitute an invented domain.
