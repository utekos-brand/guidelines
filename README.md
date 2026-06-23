# Utekos Brand Guidelines

Internal Next.js app for Utekos brand color selection and brand guidelines.

## Local Development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm build
```

The color data lives in `lib/brand/color-tokens.json` and was copied from
`utekos-headless` without importing that project's global CSS.

## Deployment

Current Vercel and DNS status is tracked in `docs/deployment.md`.
