# Roadmap

## Milestone 1 — Course Platform MVP

### Phase 1: Data Model + Prisma Schema
**Goal**: Extend the Prisma schema with all course-related models.

Tasks:
- Add `Course`, `Module`, `Lesson`, `Enrollment`, `LessonProgress` models
- Define all relations (Course→Module→Lesson, Enrollment, LessonProgress)
- Run migration
- Verify schema compiles and migration succeeds

Deliverable: Database schema ready for seeding and application use.

---

### Phase 2: Seed Data
**Goal**: Populate the database with a sample course so the UI has content to display.

Tasks:
- Create a seed script in `/apps/app/prisma/seed.ts` (or reuse existing seed location)
- Add 1 sample course with 2–3 modules, each with 2–3 lessons
- Lessons include a video URL (e.g. a public YouTube/Loom URL) and markdown content
- Run seed and verify data in database

Deliverable: Sample course data queryable from the app.

---

### Phase 3: Course Catalog + Detail Pages
**Goal**: Build the public-facing course browsing experience.

Tasks:
- `/courses` — catalog page listing all published courses (Server Component)
- `/courses/[slug]` — course detail page with module/lesson list
- Fetch data via Prisma in Server Components
- Basic styling with Tailwind/shadcn/ui
- Link to lesson pages (even if not yet built)

Deliverable: Browsable course catalog in the app.

---

### Phase 4: Lesson Viewer
**Goal**: Build the lesson viewing experience with video and content.

Tasks:
- `/courses/[slug]/lessons/[lessonSlug]` — lesson page
- Embed video player (iframe for YouTube/Loom/Vimeo)
- Render markdown lesson content below video
- Lesson sidebar: module/lesson list with navigation
- Previous / Next lesson navigation

Deliverable: Students can watch lessons and read content.

---

### Phase 5: Progress Tracking
**Goal**: Let students mark lessons complete and track their progress.

Tasks:
- "Mark as complete" button on lesson page (Server Action)
- Create/update `LessonProgress` record for current user + lesson
- Calculate course progress percentage (completed / total)
- Show progress bar on course detail and dashboard
- Visual completion indicators in lesson sidebar (checkmark)

Deliverable: Students can track their own progress through a course.

---

### Phase 6: Student Dashboard
**Goal**: Give students a home screen showing their enrolled courses and progress.

Tasks:
- Update `/` (or `/dashboard`) with enrolled courses section
- Show course card with title, thumbnail, progress bar, "Continue" CTA
- Query `Enrollment` + `LessonProgress` for current user
- Empty state for users with no enrollments

Deliverable: Personalized student home screen.

---

### Phase 7: Polish + Deploy
**Goal**: Ensure the platform is production-ready and deployed.

Tasks:
- Review all pages for mobile responsiveness
- Add loading states and error boundaries
- Verify Clerk auth gates (only enrolled users can access lessons)
- Smoke test the full flow: browse → enroll (free) → watch → complete
- Deploy to Vercel and verify production

Deliverable: Course platform live in production.

---

## Future Milestones (Not Planned Yet)

- **Milestone 2**: Stripe payment flow for paid courses
- **Milestone 3**: Community features (discussion, Q&A per lesson)
- **Milestone 4**: Admin dashboard for content management
- **Milestone 5**: Certificates and gamification
