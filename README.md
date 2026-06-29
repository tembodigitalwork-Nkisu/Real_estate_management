# Acacia Properties — Real Estate Management

A property platform built with **Next.js 15 (App Router)** and **Supabase**. It has
two halves:

- **Public site** (`/`, `/listings`, `/contact`) — browse and search published
  properties, view details, send enquiries.
- **Admin portal** (`/admin`) — login-gated dashboard to manage properties,
  tenants, leases, maintenance requests and incoming enquiries.

Security is enforced by **Row Level Security** in Postgres: the public site uses
the anon key and can only read `published` properties and insert enquiries.
Everything else requires being listed in the `admins` table.

## Tech stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| Framework      | Next.js 15, React 19, TypeScript        |
| Styling        | Tailwind CSS                            |
| Backend / DB   | Supabase (Postgres, Auth, RLS)          |
| Icons          | lucide-react                            |

## Project structure

```
src/
  app/
    page.tsx                  Public home
    listings/                 Listings grid + detail
    contact/                  Contact form (+ server action)
    admin/
      login/                  Sign-in (outside the dashboard shell)
      (dashboard)/            Auth-guarded portal (sidebar layout)
        page.tsx              Dashboard
        properties/           CRUD
        tenants/  leases/  maintenance/  enquiries/
  components/
    site/                     Public UI (Header, Footer, SearchBar, …)
    admin/                    Portal UI (Sidebar, PropertyForm)
  lib/
    supabase/                 Browser, server and middleware clients
    queries.ts                Public data access
    admin.ts                  requireAdmin() guard
    format.ts  types.ts
supabase/
  schema.sql                  Tables, RLS policies, helpers
  seed.sql                    Sample published listings
```

## Setup

### 1. Create a Supabase project

At <https://supabase.com>, create a project. Then open **SQL Editor** and run:

1. The contents of `supabase/schema.sql` (creates tables + RLS).
2. Optionally `supabase/seed.sql` (sample listings so the site has content).

### 2. Configure environment variables

Copy the example file and fill in values from **Project Settings → API**:

```
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Create your admin user

1. In Supabase: **Authentication → Users → Add user** (email + password).
2. Copy that user's UUID, then in **SQL Editor** run:

   ```sql
   insert into public.admins (user_id, full_name)
   values ('PASTE-USER-UUID', 'Your Name');
   ```

### 4. Install and run

```
npm install
npm run dev
```

Open <http://localhost:3000> for the public site and
<http://localhost:3000/admin> for the portal.

## Notes

- Property images are stored as a list of URLs (paste any image URL in the form).
  Swapping to Supabase Storage uploads is a natural next step.
- The brand name "Acacia Properties" is a placeholder — search the codebase to
  rename it.
