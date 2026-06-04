This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Claude Code Skill: `/ai-positioning`

This repo ships with a Claude Code skill that packages the same positioning logic the web app uses — DWA, AP/AR, Print, and PDF prompts, objection handling, discovery questions, deck templates. Use it when you want positioning help without spinning up the dev server.

**To use it:**

1. Open a Claude Code session anywhere inside this repo.
2. Type `/ai-positioning` or describe what you're working on (e.g. "Help me position DWA for Citibank" — the skill auto-triggers from the description).
3. Claude will ask which pillar applies, then produce account-specific positioning.

The skill outputs markdown only. For branded `.pptx` / `.docx` files, run the web app's Content Generator panel.

The skill lives at `.claude/skills/ai-positioning/`. To update it when the system prompts in `lib/*-system-prompt.ts` change, manually re-sync the matching `references/*.md` files.


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
