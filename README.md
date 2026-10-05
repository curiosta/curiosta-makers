# A comprehensive platform for managing makerspaces
Curiosta is a customizable makerspace management platform that caters to both makerspace users and managers.
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

* The API is the MMS backend (`makers-backend`, Medusa v1.16.1). In production it is served from the same origin as the app (`/store/*`, `/admin/*` on https://makers.curiosta.com), so `VITE_PUBLIC_BASE_URL` is only needed for local development.
* npm is the package manager; `yarn.lock` was dropped. `.npmrc` sets `legacy-peer-deps`, so the Medusa *server*
  package (an unused peer of `@medusajs/medusa-js`) is not installed. Its types are covered by
  `src/types/medusa-shim.d.ts`.
* Uploads:
  * Photos are downscaled in the browser to at most 1600 px JPEG.
  * Files over 4 MB go straight to S3 with a presigned URL, because the API runs on Lambda (6 MB request limit). The S3 bucket needs a CORS rule for the app origin (see the backend README).
* The Google Sheet link comes from the API (`/admin/sheets/link`). It is no longer a build-time variable.
