# Project State

## Status

Planning complete. Ready to begin implementation.

## Current Phase

**Phase 1: Data Model + Prisma Schema** — not started

## Completed Work

- Marketing site (`/apps/web`) deployed at `ai-builder-course-v2.vercel.app`
- Branding updated (logo, colors, copy)
- CTA and footer links fixed
- Environment variables configured
- GSD planning files created

## Next Action

Start Phase 1: Add `Course`, `Module`, `Lesson`, `Enrollment`, and `LessonProgress` models to the Prisma schema.

Prisma schema location to check: `/apps/app/prisma/schema.prisma` or look in `packages/database/`.

Steps:
1. Locate the existing Prisma schema
2. Add the new models with proper relations
3. Run `prisma migrate dev` to create the migration
4. Verify the migration succeeds

## Decisions Made

- Payments (Stripe) deferred to Phase 2 — keep MVP focused on content delivery
- Video hosting via external URLs (YouTube/Loom/Vimeo embed) — no upload infrastructure needed
- Clerk `userId` used as the user identifier in all course-related models
- Free enrollment for MVP (no payment gate) — Phase 2 adds Stripe

## Open Questions

- Where is the Prisma schema located in this monorepo? (likely `packages/database/prisma/schema.prisma`)
- Is there an existing seed script to extend?
- What is the Vercel project name for `/apps/app`?

## Last Updated

2026-03-21
