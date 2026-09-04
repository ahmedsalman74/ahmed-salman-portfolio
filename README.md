# Ahmed Salman Portfolio

Modern personal portfolio for Ahmed Salman, a mid-senior backend software engineer focused on Node.js, TypeScript, microservices, distributed systems, cloud platforms, API design, and performance tuning.

[![CI](https://github.com/ahmedsalman74/ahmed-salman-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ahmedsalman74/ahmed-salman-portfolio/actions/workflows/ci.yml)

## Live Site

- Portfolio: https://ahmed-salman-74.ahmedsalman74.chatgpt.site
- CV preview: https://ahmed-salman-74.ahmedsalman74.chatgpt.site/cv
- Admin dashboard: `/admin`

## Tech Stack

- React 19
- TypeScript
- Vinext
- Tailwind CSS
- OpenAI Sites deployment target

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

The GitHub Actions workflow runs this same build on pushes and pull requests to `main`.

## Deployment

The current production site is deployed with Codex Sites. The GitHub repository provides normal source visibility and CI build checks. Production deployment is currently triggered from Codex Sites by saving and deploying a validated version.

## Admin Dashboard

The dashboard at `/admin` manages:

- profile, hero, trusted companies, stats, services, process, skills, and education content
- projects and experience entries
- contact tickets submitted from the public site
- replacement CV PDF uploads

Admin credentials are provided through deployment environment variables and must not be committed:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_SALT`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`

The editable content and tickets use D1. Cloudflare Pages stores replacement CV PDFs in KV through the `CV_STORE` binding; the Sites deployment can continue using R2 through `CV_BUCKET`. The bundled `public/cv.pdf` is the fallback shown before a custom PDF is uploaded.
