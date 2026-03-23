# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-22)

**Core value:** Students can access enrolled courses, watch video lessons in sequence, and clearly see their progress
**Current focus:** Phase 5 — Database migration + production deploy

## Current Status

**Milestone 1 — Course Platform MVP**
Progress: ████████░░ 70% (Phases 1-4 complete, Phase 5 pending)

| Phase | Name | Status | Plans |
|-------|------|--------|-------|
| 1 | Data Model + Schema | ✓ | Complete |
| 2 | Seed Data | ✓ | Complete (script written) |
| 3 | Course Catalog + Detail | ✓ | Complete |
| 4 | Lesson Viewer + Progress + Dashboard | ✓ | Complete |
| 5 | Database + Deploy | ○ | Not started |
| 6 | Stripe Payment Gate | ○ | Not started |

## What's Built (Phases 1-4)

- **Prisma schema**: Course, Module, Lesson, Enrollment, LessonProgress, CourseTier enum
- **Seed script**: `packages/database/prisma/seed.ts`
- **Server actions**: `apps/app/app/actions/course.ts` — enrollInCourse, markLessonComplete, getCourseProgress
- **Course catalog**: `/courses` — lists published courses with tier badges
- **Course detail**: `/courses/[slug]` — modules, lessons, enroll button, progress
- **Lesson viewer**: `/courses/[slug]/lessons/[lessonSlug]` — video embed, content, completion, nav
- **Dashboard**: Updated with enrolled courses, progress bars, continue learning banner

## What's Pending

- `prisma migrate dev` — needs live database connection (Neon/Postgres env vars)
- `prisma db seed` — populate sample data
- Production smoke test and deploy
- Stripe payment gate (Phase 6)

## Decisions Made

- Payments deferred — keep MVP focused on content delivery
- Video hosting via external URLs (YouTube/Loom/Vimeo embed)
- Clerk `userId` as user identifier in all course models
- Free enrollment for MVP, payment gate in Phase 6
- Markdown rendered as `whitespace-pre-wrap` (may revisit for MDX)
- Enrollment check server-side redirects unenrolled users

## Last Updated

2026-03-22 — GSD project initialized; existing work from prior session captured
