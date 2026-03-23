# Requirements: AI Builder Course Platform

**Defined:** 2026-03-22
**Core Value:** Students can access enrolled courses, watch video lessons in sequence, and clearly see their progress

## v1 Requirements

### Data Model

- [x] **DATA-01**: Course model with title, slug, description, price, tier (FREE/MINI/FULL), published flag
- [x] **DATA-02**: Module model with title, description, order linked to Course
- [x] **DATA-03**: Lesson model with title, slug, videoUrl, content, duration, order linked to Module
- [x] **DATA-04**: Enrollment model linking userId (Clerk) to Course
- [x] **DATA-05**: LessonProgress model tracking userId + lessonId completion

### Course Catalog

- [x] **CAT-01**: Catalog page (`/courses`) lists all published courses
- [x] **CAT-02**: Course cards show title, description, price, tier badge
- [x] **CAT-03**: Course cards link to course detail page

### Course Detail

- [x] **DETAIL-01**: Detail page (`/courses/[slug]`) shows course overview
- [x] **DETAIL-02**: Module and lesson structure displayed in order
- [x] **DETAIL-03**: Enroll CTA for unenrolled users (free enrollment)
- [x] **DETAIL-04**: "Continue learning" link for enrolled users with progress

### Lesson Viewer

- [x] **LESSON-01**: Lesson page (`/courses/[slug]/lessons/[lessonSlug]`) with video embed
- [x] **LESSON-02**: Markdown content rendered below video
- [x] **LESSON-03**: Previous / Next lesson navigation
- [x] **LESSON-04**: Lesson sidebar with module/lesson list and completion indicators
- [x] **LESSON-05**: Unenrolled users redirected to course detail

### Progress Tracking

- [x] **PROG-01**: "Mark as complete" button creates LessonProgress record
- [x] **PROG-02**: Course progress calculated as (completed / total) × 100
- [x] **PROG-03**: Progress indicators shown in lesson sidebar

### Student Dashboard

- [x] **DASH-01**: Dashboard shows enrolled courses with progress bars
- [x] **DASH-02**: "Continue learning" CTA per course links to next incomplete lesson
- [x] **DASH-03**: Course discovery section for unenrolled courses
- [x] **DASH-04**: Empty state for users with no enrollments

### Infrastructure

- [ ] **INFRA-01**: Prisma migration run against live database
- [ ] **INFRA-02**: Database seeded with at least 1 sample course (modules + lessons)

## v2 Requirements

### Payments

- **PAY-01**: Stripe payment gate for MINI tier (€47) courses
- **PAY-02**: Stripe payment gate for FULL tier (€497-697) courses
- **PAY-03**: Enrollment auto-created after successful payment
- **PAY-04**: Payment receipt/confirmation email via Resend

### Admin

- **ADMIN-01**: Admin UI for creating/editing courses
- **ADMIN-02**: Admin UI for managing modules and lessons
- **ADMIN-03**: Admin can publish/unpublish courses

### Community

- **COMM-01**: Per-lesson discussion/comments (Liveblocks)
- **COMM-02**: Community membership tier (€97/month)
- **COMM-03**: Community access gated by active subscription

### Polish

- **POLISH-01**: Course completion certificate generation
- **POLISH-02**: Email notifications (enrollment, milestone, completion)
- **POLISH-03**: AI-powered lesson summaries

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile native app | Web-first; browser is sufficient |
| Video hosting/upload | External URLs only (YouTube/Loom/Vimeo) |
| Custom video player | Browser default sufficient for MVP |
| Multi-instructor support | Solo instructor product |
| Course reviews/ratings | Not needed for MVP launch |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 through DATA-05 | Phase 1 | Complete |
| CAT-01 through CAT-03 | Phase 3 | Complete |
| DETAIL-01 through DETAIL-04 | Phase 3 | Complete |
| LESSON-01 through LESSON-05 | Phase 4 | Complete |
| PROG-01 through PROG-03 | Phase 4 | Complete |
| DASH-01 through DASH-04 | Phase 4 | Complete |
| INFRA-01 | Phase 5 | Pending |
| INFRA-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Complete: 18
- Pending: 2 (INFRA-01, INFRA-02 — need live DB)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after GSD initialization — Phases 1-4 already implemented*
