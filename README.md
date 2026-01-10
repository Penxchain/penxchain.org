# Penxchain Official Website

Simple, clear information about this project.

## About
This repository holds the website for Penxchain.  
It is built with Next.js and TypeScript. The site shows project info, blog posts, and team details.

## Features
- Fast client-side UI with React and Next.js
- Tailwind CSS for layout and styling
- SEO-ready blog pages
- Three.js and WebGL scenes for visuals
- Simple build and deploy scripts

## Quick start (for developers)
### Prerequisites
- Node.js 18+ (use the version your deployment requires)
- npm or yarn

### Install
1. Clone the repo:
   git clone https://github.com/Penxchain/penxchain.org.git
2. Enter the folder:
   cd penxchain.org
3. Install packages:
   npm install

### Run locally
- Start the dev server:
  npm run dev
- Open http://localhost:3000 in your browser

### Build and serve
- Build:
  npm run build
- Start the production server:
  npm run start

## Deployment
- The project is set up to build with `npm run build`.
- If using GitHub Pages, check the Pages workflow in Actions.
- If using Vercel, make sure the repo is linked and redeploy from Vercel dashboard if needed.

## Project structure
- /public — static files
- /src — application source code (pages, components, styles)
- next.config.ts — Next.js settings
- tailwind.config.ts — Tailwind CSS config
- package.json — build and dev scripts

## Troubleshooting deployment
- If your latest commit appears on GitHub but the site did not update:
  - Check Actions logs for the commit build.
  - Re-run the pages build or push an empty commit to trigger a new build.
  - Check the Pages settings to confirm the branch and build settings.
  - If using Vercel, check the Vercel dashboard and logs.
- If the build fails, copy the error message and paste it here for help.

## Contributing
- Please open issues for bugs or suggestions.
- For code changes, create a branch, make changes, test locally, and open a pull request.

## Contact
- For questions, create an issue or contact the repo maintainers.