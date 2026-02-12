# Jaxsenville's Philanthropy Clinic

![Philanthropy Clinic](/public/logo.svg)

Philanthropy for the people. Benefitting the noblest cause: Me.

## Making Edits
**TypeScript build must be successful before pushing.** Vercel will not deploy if the build fails.

## Running locally

### 1. Install:
```bash
pnpm i
```

### 2. Setup [environment variables](#environment-variables).

### 3. Run:
```bash
pnpm dev
```

The website can now be viewed in your web browser using the link provided in the terminal.

### Deployment

### 1. Build:
```bash
pnpm build
```

### 2. Preview:
```bash
pnpm preview
```

## Environment Variables
Store in `.env` file in the root of the project.

| Name                      | Description            |
|---------------------------|------------------------|
| `VITE_STRIPE_PUBLISH_KEY` | Stripe publishable key |
| `STRIPE_PRIVATE_KEY`      | Stripe private key     |
