# DevVault website

Next.js App Router website for DevVault, including Supabase authentication and protected account pages.

Complete project documentation:

- [Documentation index](../docs/README.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [Feature rules](../docs/FEATURES.md)
- [Development guide](../docs/DEVELOPMENT.md)
- [Web API](../docs/WEB_API.md)
- [User guide](../docs/USER_GUIDE.md)

This README remains the quick setup reference for the web subproject.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase Auth setup

1. Create a Supabase project.
2. Copy the Project URL and Publishable key from the project Connect dialog into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

3. In Authentication > URL Configuration, add these redirect URLs:

```text
http://localhost:3000/auth/callback
https://devvault.app/auth/callback
```

4. Email/password authentication works once the variables are set. Configure SMTP before production use.
5. Apply [`supabase/migrations/20260611000000_create_profiles.sql`](supabase/migrations/20260611000000_create_profiles.sql) in the Supabase SQL Editor or with the Supabase CLI.

## GitHub OAuth

The UI and PKCE callback route are already implemented. To enable GitHub:

1. Enable GitHub in Supabase Authentication > Providers.
2. Create a GitHub OAuth App using the Supabase provider callback URL shown in that screen.
3. Add the GitHub Client ID and Client Secret to the Supabase provider configuration.

## User metadata

New users receive these placeholder subscription fields. The database trigger copies them into the RLS-protected `profiles` table:

```json
{
  "plan": "free",
  "licenseStatus": "inactive",
  "stripeCustomerId": null
}
```

Users can read their profile row, but no client update policy exists for billing or license fields. Only the trusted Stripe webhook updates them.

## Stripe Checkout

Create a Stripe Product and a Price for DevVault Pro, then configure:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_PRO=price_...
SUPABASE_SECRET_KEY=sb_secret_...
```

The Checkout mode is derived from the configured Stripe Price:

- A one-time Price creates a `payment` Checkout Session for Pro Lifetime.
- A recurring Price creates a `subscription` Checkout Session.

Configure the Stripe webhook endpoint as:

```text
https://devvault.app/api/stripe/webhook
```

For local testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The webhook activates Pro in the RLS-protected `profiles` table. The success redirect alone never grants access.

The billing page creates short-lived Customer Portal sessions through `POST /api/stripe/create-portal-session`. Enable and configure the Customer Portal separately in the Stripe Dashboard for both test and live modes.

## Desktop license API

Apply [`supabase/migrations/20260612000000_create_licenses.sql`](supabase/migrations/20260612000000_create_licenses.sql) after the profiles migration.

Desktop requests authenticate with the user's Supabase access token:

```text
Authorization: Bearer <supabase-access-token>
```

Endpoints:

```text
GET  /api/license/status?deviceId=<device-id>
POST /api/license/activate    { "deviceId": "...", "licenseKey": "DVLT-..." }
POST /api/license/deactivate  { "deviceId": "..." }
POST /api/license/refresh     { "deviceId": "..." }
```

Free users receive a valid Free payload and do not provide a license key. Pro licenses allow one active device in the MVP. License responses contain:

```json
{
  "status": "active",
  "plan": "pro",
  "limits": {
    "projects": null,
    "environmentsPerProject": null,
    "customTemplates": null,
    "activeDevices": 1
  },
  "expiresAt": null,
  "signature": "unsigned:mvp"
}
```

`signature` is intentionally a placeholder. Add asymmetric response signing before treating offline license files as tamper-resistant.

## Encrypted sync backend

Not implemented yet. The desktop has opt-in preferences and portable AES-256-GCM encryption, but the website does not currently expose sync storage routes or the real desktop auth callback required for a Supabase access token.

The target contract is documented in [`../docs/SYNC.md`](../docs/SYNC.md). Implementation should add a RLS-protected `sync_snapshots` migration and authenticated `/api/sync/*` Route Handlers. The server must never receive the recovery key or plaintext bundle.

## Verification

```bash
npm run lint
npm run build
```
