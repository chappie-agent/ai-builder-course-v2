# Project State

## Current Status

**Phases 1–4 — Complete**

### Phase 1: Course Data Model ✅

- [x] Add `CourseTier` and `EnrollmentStatus` enums to Prisma schema
- [x] Add `Course`, `Module`, `Lesson`, `Enrollment`, `LessonProgress` models
- [x] Create seed script (`packages/database/prisma/seed.ts`)
- [ ] Run `prisma migrate dev` against a live database (environment required)
- [ ] Run `prisma db seed` to populate sample data

### Phases 2–4: Course Platform UI ✅

- [x] Server actions: `enrollInCourse`, `markLessonComplete`, `getCourseProgress` (`apps/app/app/actions/course.ts`)
- [x] Course Catalog page (`/courses`) — lists all published courses with tier badges
- [x] Course Detail page (`/courses/[slug]`) — modules, lessons, enroll button, progress
- [x] Lesson Viewer (`/courses/[slug]/lessons/[lessonSlug]`) — video, content, completion, prev/next nav
- [x] Sidebar updated with Courses navigation (GraduationCap icon)
- [x] Dashboard updated with enrolled courses, progress, "continue learning" banner, discovery section

### Next Steps

- Phase 5: Admin UI for course/lesson management
- Phase 6: Stripe payment gate for MINI/FULL tier courses
- Run `prisma migrate dev` once database connection is available

## Completed Work

- Marketing site (`/apps/web`) deployed at `ai-builder-course-v2.vercel.app`
- Branding updated (logo, colors, copy)
- CTA and footer links fixed
- Environment variables configured
- GSD planning files created
- Phase 1 schema and seed script committed
- Full course platform UI (catalog, detail, lesson viewer, dashboard) built

## Decisions Made

- Payments (Stripe) deferred — keep MVP focused on content delivery
- Video hosting via external URLs (YouTube/Loom/Vimeo embed) — no upload infrastructure needed
- Clerk `userId` used as the user identifier in all course-related models
- Free enrollment for MVP (no payment gate) — Phase 2 adds Stripe
- Markdown content rendered as `whitespace-pre-wrap` — no markdown library dependency added
- Enrollment check on lesson viewer server-side redirects unenrolled users to course detail

## Last Updated

2026-03-21
