# Mission Rated

Mission Rated helps military families discover trusted businesses, verified military deals, and community reviews around their installation.

## Local development

Requires Node.js 22+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The homepage runs in a labeled preview state without environment variables. Add the public Supabase URL and publishable key to load production records. Never expose a Supabase secret or service-role key to the browser.

## Quality checks

```bash
pnpm lint
pnpm test
pnpm build
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for data boundaries and [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) for product rules.
