# Project State

## Current Status

**Phase 1 — In Progress**

### Phase 1: Course Data Model

- [x] Add `CourseTier` and `EnrollmentStatus` enums to Prisma schema
- [x] Add `Course` model
- [x] Add `Module` model
- [x] Add `Lesson` model
- [x] Add `Enrollment` model
- [x] Add `LessonProgress` model
- [x] Create seed script (`packages/database/prisma/seed.ts`)
- [ ] Run `prisma migrate dev` against a live database
- [ ] Run `prisma db seed` to populate sample data

### Next Steps

- Phase 2: API routes / Server Actions for courses, enrollment, and progress tracking

## Completed Work

- Marketing site (`/apps/web`) deployed at `ai-builder-course-v2.vercel.app`
- Branding updated (logo, colors, copy)
- CTA and footer links fixed
- Environment variables configured
- GSD planning files created
- Phase 1 schema and seed script committed

## Decisions Made

- Payments (Stripe) deferred to Phase 2 — keep MVP focused on content delivery
- Video hosting via external URLs (YouTube/Loom/Vimeo embed) — no upload infrastructure needed
- Clerk `userId` used as the user identifier in all course-related models
- Free enrollment for MVP (no payment gate) — Phase 2 adds Stripe

## Last Updated

2026-03-21
