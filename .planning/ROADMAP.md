# Roadmap: AI Builder Course Platform

## Milestone 1 — Course Platform MVP

**Goal:** Functional course delivery platform where students can browse, enroll, watch lessons, and track progress.

---

### Phase 1: Data Model + Prisma Schema ✓
**Goal:** Extend the Prisma schema with all course-related models.
**Status:** Complete

Deliverables:
- Course, Module, Lesson, Enrollment, LessonProgress models in schema
- CourseTier enum (FREE/MINI/FULL), EnrollmentStatus enum
- All relations defined and indexed

---

### Phase 2: Seed Data ✓
**Goal:** Populate the database with sample course content.
**Status:** Complete (script written; DB migration pending environment)

Deliverables:
- Seed script at `packages/database/prisma/seed.ts`
- Sample course with modules and lessons including video URLs

---

### Phase 3: Course Catalog + Detail Pages ✓
**Goal:** Build the course browsing experience.
**Status:** Complete

Deliverables:
- `/courses` — catalog with tier badges and course cards
- `/courses/[slug]` — detail page with module/lesson structure and enroll CTA

---

### Phase 4: Lesson Viewer + Progress Tracking + Dashboard ✓
**Goal:** Full learning experience end-to-end.
**Status:** Complete

Deliverables:
- `/courses/[slug]/lessons/[lessonSlug]` — lesson viewer with video, content, sidebar
- Server actions: enrollInCourse, markLessonComplete, getCourseProgress
- Dashboard updated with enrolled courses, progress bars, continue learning

---

### Phase 5: Database + Deploy
**Goal:** Get the platform running in production with real data.
**Status:** Pending

Tasks:
- Run `prisma migrate dev` against live Neon/Postgres database
- Run seed script to populate sample course data
- Verify full flow in Vercel preview: browse → enroll → watch → complete
- Review mobile responsiveness and loading/error states
- Deploy to production

Requirements covered: INFRA-01, INFRA-02

---

### Phase 6: Stripe Payment Gate (Milestone 2 seed)
**Goal:** Gate MINI and FULL tier courses behind Stripe payments.
**Status:** Not started

Tasks:
- Checkout flow for MINI (€47) and FULL (€497) tiers
- Webhook handler: create Enrollment on successful payment
- Free tier enrollment remains free
- Update course detail page with payment CTA for non-free tiers

Requirements covered: PAY-01, PAY-02, PAY-03

---

## Future Milestones

- **Milestone 2**: Admin CMS for content management (ADMIN-01 through ADMIN-03)
- **Milestone 3**: Community features (Liveblocks, €97/month tier)
- **Milestone 4**: Course completion certificates, email notifications
- **Milestone 5**: AI enhancements (summaries, recommendations)

---
*Roadmap initialized: 2026-03-22*
*Current phase: Phase 5 (Phase 5 pending, Phases 1-4 complete)*
