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
