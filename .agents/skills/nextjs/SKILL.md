---
name: nextjs
description: Best practices, conventions, and architectural guidelines for Next.js 15+, React 19, and Supabase SSR integration.
---

# Next.js 15 & Supabase Guidelines for Commit 20

This skill provides guidelines and patterns for building the Commit 20 web application using Next.js 15 (App Router), React 19, Tailwind CSS v4, and Supabase SSR.

---

## 1. App Router & React 19 Core Principles

1. **Server Components by Default:**
   - All components in the `app` directory are React Server Components (RSC) by default.
   - Fetch data directly in Server Components using async/await and Supabase Server Client.
   - Use `'use client'` only when necessary: interactivity (event listeners, `useState`, `useEffect`), browser APIs (timers, audio/video recording, web storage).

2. **Next.js 15 Breaking Changes (Async Request APIs):**
   - In Next.js 15+, `params`, `searchParams`, `cookies()`, and `headers()` are asynchronous.
   - Always `await` them:
     ```tsx
     // Correct in Next.js 15:
     export default async function Page({
       params,
     }: {
       params: Promise<{ slug: string }>
     }) {
       const { slug } = await params;
       return <div>Sprint: {slug}</div>;
     }
     ```

3. **Data Mutation with Server Actions:**
   - Prefer Server Actions for form submissions, timer logs, and state changes.
   - Use `revalidatePath()` or `revalidateTag()` to purge cached views.

---

## 2. Supabase Integration Architecture

1. **Browser Client (`src/lib/supabase/client.ts`):**
   - Used inside Client Components (`'use client'`).
   - Created via `createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)`.

2. **Server Client (`src/lib/supabase/server.ts`):**
   - Used inside Server Components, Server Actions, and Route Handlers.
   - Created via `createServerClient` reading and setting cookies via `await cookies()`.

3. **Middleware (`src/middleware.ts`):**
   - Refreshes auth tokens across incoming requests so sessions don't expire unexpectedly.

---

## 3. Styling & Modern UI Conventions

1. **Tailwind CSS v4:**
   - Utilizes `@import "tailwindcss";` in `src/app/globals.css`.
   - Use mobile-first responsive utilities (`sm:`, `md:`, `lg:`).
2. **Icons & Components:**
   - Use `lucide-react` for clean, consistent iconography.
