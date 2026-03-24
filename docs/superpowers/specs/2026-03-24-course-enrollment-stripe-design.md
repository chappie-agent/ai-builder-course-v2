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
| Free content | Intro video (order 0) + first lesson (order 1) per course — always accessible |
| Payment platform | Stripe Checkout (one-time payments, not subscriptions) |
| Free flow | Account → intro + lesson 1 immediately available |
| Paid flow | Course/pricing page → Stripe Checkout → auto-enrolled on success |
| Bundle flow | Pricing page → Stripe Checkout (bundle product) → enrolled in all published courses |

## Architecture

### Data Model Changes

**Course model** — remove the `tier` enum. Each course simply has a `price` and a `stripePriceId`:

```
Course
  + stripePriceId  String?   // Stripe Price ID for this course
  - tier           CourseTier // REMOVE — no longer needed
  price            Float      // €197 default, 0 for free courses
```

**Remove `CourseTier` enum** entirely. Access is now binary: you paid for the course or you didn't.

**New: Bundle model** — represents an "all courses" package:

```
Bundle
  id              String   @id @default(uuid())
  name            String   // "Alle Cursussen"
  price           Float    // 600
  stripePriceId   String?  // Stripe Price ID for the bundle
  active          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
```

When a bundle is purchased, the webhook creates Enrollment records for every published course.

**Enrollment model** — add payment tracking:

```
Enrollment
  + stripeSessionId    String?  // Checkout Session ID that created this enrollment
  + paidAmount         Float?   // Amount paid (null = free enrollment)
  + purchaseType       String?  // "single" | "bundle"
```

### Lesson Access Rules

Simple, deterministic rules based on lesson order within a module:

1. **Lesson order 0** (intro/overview) → always accessible, no enrollment needed
2. **Lesson order 1** (first real lesson) → always accessible, no enrollment needed
3. **Lesson order 2+** → requires active enrollment (paid)

Implementation: a single helper function `canAccessLesson(lesson, enrollment)` used by both the lesson page (server-side gate) and the course overview (UI lock icons).

### Stripe Integration

**Products to create in Stripe:**
- One Price per course (€197, one-time, EUR)
- One Price for the bundle (€600, one-time, EUR)

**Checkout flow:**

1. User clicks "Buy" on course page or pricing page
2. Server action creates a Stripe Checkout Session:
   - `mode: "payment"` (one-time, not subscription)
   - `metadata: { userId, courseId }` or `{ userId, type: "bundle" }`
   - `success_url` → `/courses/{slug}?payment=success` or `/courses?payment=success`
   - `cancel_url` → back to course/pricing page
3. User completes payment on Stripe-hosted checkout
4. Stripe sends `checkout.session.completed` webhook

**Webhook handler (`checkout.session.completed`):**

1. Verify signature
2. Read metadata (`userId`, `courseId` or `type: "bundle"`)
3. If single course: create Enrollment for that course
4. If bundle: create Enrollment for all published courses
5. Store `stripeSessionId` and `paidAmount` on each Enrollment

**Existing webhook** at `apps/api/app/webhooks/payments/route.ts` already handles signature verification. Extend it with enrollment creation logic.

### Access Control Enforcement

Currently access control is visual-only. This design adds real enforcement:

**Server-side (lesson page):**
```
1. Fetch lesson with its order
2. If lesson.order <= 1 → allow (free content)
3. If user has active enrollment for this course → allow
4. Otherwise → redirect to course page with upsell
```

**Client-side (course overview):**
- Lessons with order <= 1: no lock icon, clickable
- Lessons with order >= 2 without enrollment: lock icon, click shows "Buy this course" prompt

### Pages & Components

**Modified:**
- **Course detail page** (`/courses/[slug]`) — show "Buy this course - €197" button for non-enrolled users. Show lock/unlock state per lesson.
- **Pricing page** (`/[locale]/pricing`) — update from 3 tiers to 2 options: per-course (€197) and bundle (€600). Remove FREE/MINI/FULL tier cards.
- **Lesson page** (`/courses/[slug]/lessons/[lessonSlug]`) — add server-side access check with redirect.

**New:**
- **Checkout success page** or inline success state on course page
- **`createCheckoutSession` server action** — creates Stripe Checkout Session

### Bundle Purchase Flow

1. User visits pricing page, clicks "Alle cursussen - €600"
2. `createCheckoutSession` with `type: "bundle"` in metadata
3. Stripe Checkout → payment
4. Webhook: enumerate all published courses, create Enrollment for each
5. Redirect to `/courses?payment=success`

**Future courses:** A bundle purchase covers courses published at time of purchase. If new courses are added later, the user does NOT automatically get access. This keeps it simple and fair.

## Non-Goals

- Subscriptions / recurring billing
- Refund handling (handle manually via Stripe Dashboard)
- Coupon/discount codes (can add later via Stripe Coupons)
- Invoice generation
- Multi-currency support (EUR only)
- Team/group purchases
- Upgrade path from single course to bundle (can add later)

## Error Handling

- **Payment fails:** Stripe Checkout handles retries. No enrollment created.
- **Webhook fails:** Stripe retries webhooks for up to 3 days. Enrollment created on successful retry.
- **Double payment:** Enrollment upsert (unique on userId+courseId) prevents duplicates.
- **User not found:** Webhook logs error, does not create enrollment. Admin resolves manually.

## Testing Strategy

- Unit test `canAccessLesson` helper with all combinations
- Integration test webhook handler with mock Stripe events
- E2E: free lesson access without enrollment
- E2E: paid lesson blocked without enrollment
- E2E: checkout → webhook → enrollment → lesson accessible
