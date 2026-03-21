# MVP Requirements

## Data Model

### Prisma Schema Additions

New models to add to the existing Prisma schema:

- **Course** — title, slug, description, thumbnail, price, published, createdAt, updatedAt
- **Module** — title, description, order, courseId, createdAt, updatedAt
- **Lesson** — title, slug, description, videoUrl, content (markdown), order, moduleId, createdAt, updatedAt
- **Enrollment** — userId (Clerk), courseId, enrolledAt, completedAt (nullable)
- **LessonProgress** — userId (Clerk), lessonId, completedAt, createdAt

### Relationships

- Course has many Modules (ordered)
- Module has many Lessons (ordered)
- Course has many Enrollments
- Enrollment belongs to Course and User
- LessonProgress belongs to Lesson and User

---

## Phase 1 MVP Features

### Course Catalog Page (`/courses`)
- List all published courses
- Show title, thumbnail, description, price
- Link to course detail page

### Course Detail Page (`/courses/[slug]`)
- Show course overview, modules, and lessons
- Show enrollment CTA (or "Continue" if enrolled)
- List modules with lesson counts

### Lesson Page (`/courses/[slug]/lessons/[lessonSlug]`)
- Video player (embed from video URL)
- Markdown content rendered below video
- "Mark as complete" button
- Navigation to next/previous lesson
- Sidebar showing module/lesson list with completion indicators

### Student Dashboard (`/dashboard` or `/`)
- List enrolled courses
- Show progress percentage per course
- "Continue learning" CTA for each

### Progress Tracking
- Mark individual lessons as complete
- Calculate course progress: (completed lessons / total lessons) × 100
- Store per-user per-lesson completion records

---

## Phase 2 (Later — Not MVP)

- Stripe payment flow for course purchases
- Community features (discussion, Q&A)
- Course completion certificates
- Admin dashboard for content management
- Email notifications (enrollment confirmation, progress milestones)

---

## Constraints

- Auth via Clerk (already configured) — use Clerk `userId` as the user identifier
- Database via Prisma (already configured) — extend existing schema
- No new auth system needed
- Stripe already installed but payments are Phase 2
- All course content hosted externally (video via URL embed, e.g. Loom/Vimeo/YouTube)
