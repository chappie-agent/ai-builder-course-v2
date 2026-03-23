# AI Builder Course Platform

## What This Is

A course delivery platform built on the existing next-forge monorepo (`/apps/app`), transforming the SaaS boilerplate into a structured learning experience for the AI Builder Course. Students browse, enroll in, and complete video-based courses organized into modules. The platform serves a value ladder from free content to a €97/month community membership.

## Core Value

Students can access their enrolled courses, watch video lessons in sequence, and clearly see their progress — the full learning journey must work end-to-end before anything else.

## Requirements

### Validated

- ✓ Prisma schema defined (Course, Module, Lesson, Enrollment, LessonProgress) — Phase 1
- ✓ Clerk authentication integrated via `@repo/auth` — existing
- ✓ Stripe payments connected via `@repo/payments` — existing
- ✓ Course catalog page (`/courses`) with tier badges — Phase 3
- ✓ Course detail page (`/courses/[slug]`) with module/lesson list — Phase 3
- ✓ Lesson viewer with video, content, prev/next nav — Phase 4
- ✓ Student progress tracking (mark complete, progress %) — Phase 4
- ✓ Student dashboard with enrolled courses and continue learning — Phase 4
- ✓ Server actions: enrollInCourse, markLessonComplete, getCourseProgress — Phase 4

### Active

- [ ] Prisma migration run against live database (environment required)
- [ ] Database seeded with sample course content
- [ ] Stripe payment gate for MINI/FULL tier courses (Phase 2)
- [ ] Admin UI for content management (Phase 2)

### Out of Scope

- Community features (Liveblocks) — phase 2, not core to learning MVP
- Email notifications — not blocking MVP
- Course completion certificates — future enhancement
- Mobile app — web-first
- AI-powered recommendations — future enhancement

## Context

**Monorepo structure:**
- `/apps/app` — SaaS app (course platform, primary focus)
- `/apps/web` — Marketing site (deployed at ai-builder-course-v2.vercel.app, leave untouched)
- `/packages/database` — Prisma schema + generated client
- `/packages/auth` — Clerk auth helpers
- `/packages/payments` — Stripe integration
- `/packages/design-system` — shadcn/ui components

**Existing Prisma models:** Course (with tier enum: FREE/MINI/FULL), Module (ordered), Lesson (with videoUrl, content, duration), Enrollment (userId + courseId), LessonProgress (userId + lessonId + completed)

**Value ladder:**
- FREE tier — free content/preview
- MINI tier — €47 mini-course
- FULL tier — €497-697 full course
- Community — €97/month (Liveblocks, phase 2)

**Current build state:** Phases 1-4 complete. Course catalog, detail pages, lesson viewer, progress tracking, and dashboard are all implemented. Pending: live DB migration and seed, then payment gating.

## Constraints

- **Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind — must use existing packages
- **Database**: Prisma + PostgreSQL via `@repo/database` — extend schema there, not in app
- **Auth**: Clerk only via `@repo/auth` — userId is string (Clerk ID)
- **Payments**: Stripe via `@repo/payments` — phase 2
- **Monorepo**: All shared code in `/packages/*`, app-specific code in `/apps/app`
- **Video**: External URLs only (YouTube/Loom/Vimeo embed) — no blob storage for MVP

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| External video URLs only | Avoids storage complexity for MVP | ✓ Good |
| Free enrollment for MVP, payment gating phase 2 | Unblocks platform launch | ✓ Good |
| Seed content via scripts, no admin CMS for MVP | Fastest path to functional platform | ✓ Good |
| Enrollment check server-side, redirect unenrolled users | Security, no client-side guard needed | ✓ Good |
| Markdown as whitespace-pre-wrap | No extra dependency | ⚠️ Revisit (may need MDX later) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 after GSD initialization (Phases 1-4 already complete)*
