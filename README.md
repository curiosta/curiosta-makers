# A comprehensive platform for managing makerspaces
Curiosta MINT (Makers Inventory & Tools) is the makerspace inventory app for members and managers. The product name lives in `src/config/brand.ts`.
It provides a user-friendly, intuitive, and reliable solution for all. Built on Medusa, it ensures robustness and safety.

### Our Functionalities:
   1. Users can easily issue or borrow makerspace items remotely.
   2. Administrators have full control over inventory, user actions, and can efficiently manage order approvals, rejections, and completions.
   3. Users and administrators can monitor order and return statuses, eliminating manual data updates.
   4. Administrators can effortlessly add new makerspace items and control item visibility for users.

## Development

```bash
cp .env.example .env.local      # VITE_PUBLIC_BASE_URL=http://localhost:9000 for a local API
npm ci
npm run dev                     # http://localhost:5173 (add it to the API's MMS_CORS)
npm run build                   # static files in dist/ (host on S3+CloudFront, Netlify, ...)
```

* The API is the MINT backend (`makers-backend`, Medusa v1.16.1). In production it is served from the same origin as the app (`/store/*`, `/admin/*` on https://mint.curiosta.com; makers.curiosta.com redirects there), so `VITE_PUBLIC_BASE_URL` is only needed for local development.
* npm is the package manager; `yarn.lock` was dropped. `.npmrc` sets `legacy-peer-deps`, so the Medusa *server*
  package (an unused peer of `@medusajs/medusa-js`) is not installed. Its types are covered by
  `src/types/medusa-shim.d.ts`.
* Uploads:
  * Photos are downscaled in the browser to at most 1600 px JPEG.
  * Files over 4 MB go straight to S3 with a presigned URL, because the API runs on Lambda (6 MB request limit). The S3 bucket needs a CORS rule for the app origin (see the backend README).
* The Google Sheet link comes from the API (`/admin/sheets/link`). It is no longer a build-time variable.

## Brand and styling

The UI follows the shared Curiosta brand skill (rev. 11 Oct 2026):
* **Tokens:** the shared `:root` tokens (`--ink`, `--sea-900`, `--coral`, `--sand` and the rest) are defined once, in `src/index.css`.
  `tailwind.config.js` replaces Tailwind's default palette and maps every theme colour to `var(--token)`. Use classes like `bg-coral`, `text-sea-500` and `bg-sea-900/40`, and never hex values. Site-only additions use the `--mms-` prefix.
* **Fonts:** Fraunces (headings, `font-serif`), Inter (body, `font-sans`) and JetBrains Mono (`font-mono`, `.eyebrow`). They are self-hosted via `@fontsource-variable`, so the PWA keeps its type offline.
* **Buttons:** the primary button is a coral pill with `--sea-900` text, because white on coral fails AA. Small accent text uses `--sea-500` on light surfaces; `--teal` is only for dark bands.
* **Navigation:** a sticky dark-sea top bar plus a bottom tab bar that stays visible at every width.
* **Before a release:** check axe and Lighthouse accessibility at 320/360/390 px and desktop, with no horizontal overflow.
