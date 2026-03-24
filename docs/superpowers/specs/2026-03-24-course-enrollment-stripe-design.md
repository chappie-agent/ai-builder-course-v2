# Course Enrollment & Stripe Payments Design

**Date:** 2026-03-24
**Status:** Approved

## Problem

Users can currently enroll in courses without payment. There is no payment processing, no tier-based access enforcement, and no bundle purchasing. The enrollment flow needs to support paid courses via Stripe Checkout with proper access control.

## Decisions

| Aspect | Decision |
|--------|----------|
| Pricing model | Per-course, one-time payment |
| Per-course price | €197 (configurable per course) |
| Bundle | All courses for €600 |
| Free content | First module of each course is always free (intro + first real lesson) |
| Payment platform | Stripe Checkout (one-time payments, not subscriptions) |
| Free flow | Account → module 1 immediately available |
| Paid flow | Course/pricing page → Stripe Checkout → auto-enrolled on success |
| Bundle flow | Pricing page → Stripe Checkout (bundle product) → enrolled in all published courses |

## Architecture

### Data Model Changes

**Course model** — remove the `tier` enum. Each course has a `price` (in cents) and a `stripePriceId`:

```
Course
  + stripePriceId  String?      // Stripe Price ID for this course
  - tier           CourseTier   // REMOVE — no longer needed
  ~ price          Int @default(0) // Price in cents (19700 = €197.00)
```

**Remove `CourseTier` enum** entirely. Access is now binary: you paid for the course or you didn't.

**New: Bundle model** — represents an "all courses" package:

```
Bundle
  id              String   @id @default(uuid())
  name            String   // "Alle Cursussen"
  price           Int      // 60000 (€600.00 in cents)
  stripePriceId   String?  // Stripe Price ID for the bundle
  active          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
```

When a bundle is purchased, the webhook creates Enrollment records for every published course.

**New: PurchaseType enum and Payment model:**

```
enum PurchaseType {
  SINGLE
  BUNDLE
}

model Payment {
  id                    String       @id @default(uuid())
  userId                String
  stripeSessionId       String       @unique
  stripePaymentIntentId String?
  amount                Int          // in cents
  currency              String       @default("eur")
  purchaseType          PurchaseType
  courseId              String?      // null for bundle purchases
  bundleId              String?      // null for single purchases
  createdAt             DateTime     @default(now())

  enrollments Enrollment[]
}
```

**Enrollment model** — add payment reference:

```
Enrollment
  + paymentId  String?  // FK to Payment (null = free module access)
  + payment    Payment? @relation(fields: [paymentId], references: [id])
```

**Enrollment status lifecycle:**
- `ACTIVE` — user has access (via payment or free content)
- `COMPLETED` — user finished all lessons
- `CANCELLED` — access revoked (e.g., chargeback, admin action)

### Lesson Access Rules

Free content is determined by **module order**, not lesson order. This avoids ambiguity since lesson `order` is scoped per-module:

1. **Module with order 1** (first module) → all lessons always accessible, no enrollment needed
2. **Module with order 2+** → all lessons require active enrollment (paid)

This means the first module serves as the free preview: it contains the course intro/overview AND the first real lesson(s). Everything beyond module 1 is paid.

Implementation: a single helper function `canAccessLesson(lesson, enrollment)` that checks `lesson.module.order === 1` for free access, otherwise checks enrollment status. Used by both the lesson page (server-side gate) and the course overview (UI lock icons).

**Data migration:** Update seed data to ensure Module 1 of each course contains both the intro content and at least one real lesson.

### Stripe Integration

**Products to create in Stripe:**
- One Price per course (€197, one-time, EUR)
- One Price for the bundle (€600, one-time, EUR)

**Checkout flow:**

1. User clicks "Buy" on course page or pricing page
2. If user is not authenticated → redirect to sign-in, then back to checkout
3. Server action creates a Stripe Checkout Session:
   - `mode: "payment"` (one-time, not subscription)
   - `metadata: { userId, courseId }` or `{ userId, purchaseType: "bundle" }`
   - `success_url` → `/courses/{slug}?session_id={CHECKOUT_SESSION_ID}` or `/courses?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url` → back to course/pricing page
   - `customer_creation: "always"` — creates a Stripe Customer for payment history
4. User completes payment on Stripe-hosted checkout
5. Stripe sends `checkout.session.completed` webhook

**Webhook handler (`checkout.session.completed`):**

The existing webhook at `apps/api/app/webhooks/payments/route.ts` will be **rewritten** (not extended). The current Clerk customer-scan pattern is replaced with direct `userId` from session metadata:

1. Verify webhook signature (keep existing pattern)
2. Read `userId` from `session.metadata` (not from Clerk customer scan)
3. Create `Payment` record
4. If single course (`metadata.courseId` present): create Enrollment for that course
5. If bundle (`metadata.purchaseType === "bundle"`): create Enrollment for all published courses, store course IDs in Payment metadata for audit
6. Link enrollments to Payment record

**Remove the existing `enrollInCourse` server action** for paid courses. Replace with:
- `enrollInFreeCourse(courseId)` — only works if `course.price === 0`
- `createCheckoutSession(courseId | "bundle")` — creates Stripe Checkout for paid courses/bundles

This prevents the payment bypass where users could call the old `enrollInCourse` action directly.

### Access Control Enforcement

Currently access control is visual-only. This design adds real enforcement:

**Server-side (lesson page):**
```
1. Fetch lesson with its module (including module.order)
2. If lesson.module.order === 1 → allow (free module)
3. If user has active enrollment for this course → allow
4. Otherwise → redirect to course page with upsell
```

**Client-side (course overview):**
- Module 1 lessons: no lock icon, clickable
- Module 2+ lessons without enrollment: lock icon, click shows "Buy this course" prompt

### Pages & Components

**Modified:**
- **Course detail page** (`/courses/[slug]`) — show "Buy - €197" button for non-enrolled users. Show lock/unlock state per module. Remove old `enrollInCourse` form action.
- **Pricing page** (`/[locale]/pricing`) — replace 3 tier cards with 2 options: per-course (€197) and bundle (€600). Remove FREE/MINI/FULL structure. Remove team enrollment section (non-goal). Update CTAs to trigger checkout.
- **Lesson page** (`/courses/[slug]/lessons/[lessonSlug]`) — add server-side access check with redirect.

**New:**
- **Checkout success handler** — verify `session_id` param server-side on course page, show success state
- **`createCheckoutSession` server action** — creates Stripe Checkout Session
- **`enrollInFreeCourse` server action** — replaces old `enrollInCourse` for free courses only

### Bundle Purchase Flow

1. User visits pricing page, clicks "Alle cursussen - €600"
2. If not authenticated → sign-in → back to pricing
3. `createCheckoutSession` with `purchaseType: "bundle"` in metadata
4. Stripe Checkout → payment
5. Webhook: create Payment, enumerate all published courses, create Enrollment for each
6. Redirect to `/courses?session_id={CHECKOUT_SESSION_ID}`

**Future courses:** A bundle purchase covers courses published at time of purchase. The webhook stores the list of enrolled course IDs in the Payment record for audit. This is an acceptable edge case given courses are published infrequently.

## Non-Goals

- Subscriptions / recurring billing
- Refund handling (handle manually via Stripe Dashboard)
- Coupon/discount codes (can add later via Stripe Coupons)
- Invoice generation
- Multi-currency support (EUR only)
- Team/group purchases
- Upgrade path from single course to bundle (can add later)
- Stripe Customer portal

## Error Handling

- **Payment fails:** Stripe Checkout handles retries. No enrollment created.
- **Webhook fails:** Stripe retries webhooks for up to 3 days. Enrollment created on successful retry.
- **Double payment:** Enrollment upsert (unique on userId+courseId) prevents duplicates. Payment record always created for audit.
- **User not found:** Webhook logs error, does not create enrollment. Admin resolves manually.
- **Double-click on buy button:** Disable button after first click. Stripe handles duplicate sessions gracefully.

## Migration Steps

1. Create Prisma migration: remove `CourseTier` enum, change `price` to Int (cents), add `Bundle`, `Payment`, `PurchaseType` enum, update `Enrollment`
2. Data migration: convert existing price values from Float euros to Int cents
3. Update seed data: remove `tier` references, ensure Module 1 has intro + first lesson content
4. Remove old `enrollInCourse` server action, replace with gated alternatives

## Testing Strategy

- Unit test `canAccessLesson` helper with all combinations (free module, paid module, enrolled, not enrolled)
- Unit test `enrollInFreeCourse` rejects paid courses
- Integration test webhook handler with mock Stripe events (single + bundle)
- Integration test: verify old `enrollInCourse` action no longer exists
- E2E: free module lessons accessible without enrollment
- E2E: paid module lessons blocked without enrollment
- E2E: checkout → webhook → enrollment → paid lesson accessible
