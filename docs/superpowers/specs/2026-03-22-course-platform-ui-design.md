# Course Platform UI Redesign

**Date:** 2026-03-22
**Status:** Approved
**Scope:** UI/UX redesign of the `apps/app` course platform — design system, navigation, lesson pages, curriculum overview, presentation mode, and gamification.

---

## 1. Design System — Warm Brown-Beige Theme

The app currently uses default neutral/grayscale shadcn/ui tokens. The design system must be updated to match the marketing site (`apps/web`) warm brown-beige palette.

**Color token mapping** — the existing `globals.css` uses `oklch()`. Override these CSS custom properties in `:root`:

| CSS Property | Hex Reference | OKLCH Value | Usage |
|-------------|---------------|-------------|-------|
| `--background` | `#faf7f2` | `oklch(0.97 0.01 80)` | Page background |
| `--foreground` | `#2c231a` | `oklch(0.22 0.03 60)` | Primary text |
| `--primary` | `#2c231a` | `oklch(0.22 0.03 60)` | Buttons, headers |
| `--primary-foreground` | `#f5f0e8` | `oklch(0.95 0.01 80)` | Text on primary buttons |
| `--secondary` | `#f5f0e8` | `oklch(0.95 0.01 80)` | Card backgrounds |
| `--secondary-foreground` | `#2c231a` | `oklch(0.22 0.03 60)` | Text on cards |
| `--muted` | `#f5f0e8` | `oklch(0.95 0.01 80)` | Muted backgrounds |
| `--muted-foreground` | `#8b7355` | `oklch(0.55 0.06 65)` | Secondary text, accents |
| `--accent` | `#f5f0e8` | `oklch(0.95 0.01 80)` | Hover backgrounds |
| `--accent-foreground` | `#2c231a` | `oklch(0.22 0.03 60)` | Accent text |
| `--card` | `#ffffff` | `oklch(1 0 0)` | Card surfaces |
| `--card-foreground` | `#2c231a` | `oklch(0.22 0.03 60)` | Card text |
| `--border` | `#e8dfd0` | `oklch(0.90 0.02 75)` | Borders |
| `--ring` | `#8b7355` | `oklch(0.55 0.06 65)` | Focus rings |
| `--sidebar` | `#2c231a` | `oklch(0.22 0.03 60)` | Sidebar background |
| `--sidebar-foreground` | `#f5f0e8` | `oklch(0.95 0.01 80)` | Sidebar text |
| `--sidebar-accent` | `#3d3128` | `oklch(0.28 0.03 55)` | Sidebar hover/active |
| `--sidebar-accent-foreground` | `#f5f0e8` | `oklch(0.95 0.01 80)` | Sidebar active text |
| `--sidebar-border` | `#3d3128` | `oklch(0.28 0.03 55)` | Sidebar dividers |

**Dark theme:** Remove the `.dark` overrides entirely. The app uses a single warm theme — no dark/light toggle needed. The sidebar is inherently dark (`#2c231a`), the content area is light (`#faf7f2`).

**Locked state:** Apply `opacity: 0.5` on the element (via Tailwind `opacity-50`), not a color token.

**Typography:** Geist Sans for UI, Geist Mono for code blocks and durations.

**Buttons:** Dark brown (`#2c231a`) with light text (`#f5f0e8`), `rounded-full` style matching marketing site.

---

## 2. Sidebar — Curriculum Navigation

**Current state:** Generic SaaS menu with placeholder items (Playground, Models, Documentation, Projects, Settings, Webhooks, etc.).

**New design:** The sidebar becomes the curriculum itself.

**Structure:**
```
Course title ("AI Builder Course")
├── Overall progress bar (40%)
├── Module 1: AI Foundations ✓
│   ├── ✓ How LLMs Work
│   ├── ✓ Prompting Strategies
│   └── ✓ Choosing the Right Model
├── Module 2: Building with AI ▶ (active)
│   ├── ✓ AI SDK Setup
│   ├── ● Streaming Chat (current)
│   └── ○ Tool Calling
├── Module 3: Shipping AI Products 🔒 (locked, dimmed)
├── ─────────────────
├── ⚙ Instellingen
└── ? Support
```

**Behavior:**
- Modules are collapsible sections
- Active module is expanded by default
- Current lesson is highlighted with background color
- Completed lessons show `✓` in accent color
- Locked modules are visible but at 50% opacity with lock icon
- Footer contains only Settings and Support

**Data fetching architecture:**
- The authenticated layout (`apps/app/app/(authenticated)/layout.tsx`) is a server component. It fetches the course structure (modules, lessons) and user progress, then passes this data as props to the sidebar.
- Create a wrapper server component `CurriculumSidebarWrapper` that queries the database and renders the client-side `CurriculumSidebar`.
- The current lesson is determined by parsing `usePathname()` in the client component (matching the `lessonSlug` from the URL).
- For now, the sidebar is hardcoded to a single course (the first published course). Multi-course support is out of scope.

**Mobile behavior:** On mobile, the sidebar collapses into a drawer (existing `SidebarProvider` behavior). The curriculum navigation is accessible via a hamburger menu.

**OrganizationSwitcher:** Remove from the sidebar. Replace with the course title and progress bar.

**Files to modify:** `apps/app/app/(authenticated)/components/sidebar.tsx`, `apps/app/app/(authenticated)/layout.tsx`

---

## 3. Startpage — Curriculum Overview

**Route:** `/` (authenticated root, replaces current dashboard)

After login, students see the full curriculum with their progress. This replaces the current dashboard with its "Continue Learning" / "My Courses" / "Discover Courses" sections.

**Layout:**
- **Breadcrumb:** "Curriculum"
- **Header:** Course title, stats (modules count, lesson count, total duration), "Ga verder" button (jumps to current lesson)
- **Progress bar:** Full-width showing overall completion percentage
- **Module list:** Collapsible cards in order
  - **Completed module:** Accent-colored checkmark badge, all lessons visible with ✓
  - **In-progress module:** Bordered with accent color, shows lesson status (completed/current/upcoming), "Huidige les" badge on current lesson
  - **Locked module:** 50% opacity, lock icon, "Upgrade voor toegang" text, not expandable

**Each lesson item shows:** Status icon, title, duration (in Geist Mono)

**Files to modify:** `apps/app/app/(authenticated)/page.tsx`

---

## 4. Lesson Page — Video + Content

**Route:** `/courses/[slug]/lessons/[lessonSlug]`

**Layout (top to bottom):**

1. **Breadcrumb bar:** `Curriculum → [Module name] → [Lesson title]` — white background, warm border bottom
2. **Video area (conditional):** Dark background (`#1a1510`), 16:9 aspect ratio, centered play button. Only rendered when lesson has a `videoUrl`.
3. **Lesson header:** Title (large), module name + duration (muted), "Markeer als voltooid" button (dark, rounded-full). After completion: shows a badge instead of button.
4. **Rich content area:** Content is stored as **Markdown** in the existing `Lesson.content` text field (no schema change needed). Rendered using `react-markdown` with `remark-gfm` for GitHub-flavored Markdown support. Custom components map:
   - Headings → styled with warm palette
   - Code blocks → dark background (`#2c231a`), Geist Mono, with `rehype-highlight` for syntax highlighting
   - Images → rendered with `next/image` where possible, with optional captions via alt text
   - **Assignment blocks** → use a custom Markdown convention: blockquotes starting with `> **Opdracht:**` are rendered as accent-bordered cards with the `📝 Opdracht` label
   - "Bekijk slides" button (rendered below content, only if `lesson.slides` is non-null)
5. **Lesson navigation:** Previous/Next buttons at bottom. Previous = outline style, Next = filled dark style.

**When no video:** The lesson starts directly with the content area (no empty video container).

**Files to modify:** `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/page.tsx`

---

## 5. Presentation Mode — Fullscreen Slides

**Trigger:** "📊 Bekijk slides" button on the lesson page. Opens as a fullscreen overlay/modal.

**Layout:**
- **Top bar:** Lesson title + "Slides" label, close button (✕)
- **Slide area:** Centered slide card on dark background (`#2c231a`). Slide content on light card (`#f5f0e8`) with title, visual/diagram area, and supporting text.
- **Navigation:** Previous/Next buttons, dot indicators showing current position, slide counter ("2 / 5")
- **Keyboard support:** Left/right arrow keys, Escape to close

**Data model consideration:** Slides need to be stored per lesson. Options:
- A) JSON array field on the Lesson model (simplest, slides are structured data)
- B) Separate `Slide` model related to Lesson

**Recommendation:** Option A — a `slides` JSON field on Lesson. Each slide is `{ title: string, content: string, imageUrl?: string }`. This avoids schema complexity and slides are tightly coupled to lessons.

**TypeScript type** (defined in `packages/database/index.ts` alongside Prisma exports):
```typescript
export type Slide = {
  title: string;
  content: string; // Plain text (short, slide-sized)
  imageUrl?: string;
};
```
Validated at runtime with a simple type guard when reading from the JSON field. No Zod needed for this simple structure.

**Files to create/modify:**
- New component: `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/components/presentation-modal.tsx`
- Schema update: Add `slides` field to Lesson model
- Seed update: Add sample slide data

---

## 6. Gamification — Progress & Badges

**Progress bars:**
- **Curriculum page:** Overall course progress (header) + per-module progress (on each module card)
- **Sidebar:** Overall course progress (below title)
- **Lesson page:** Not needed (the breadcrumb and sidebar provide context)

Progress is calculated from `LessonProgress` records: `(completed lessons / total lessons) * 100`.

**Completion badges:**
- Displayed on the curriculum page next to completed modules
- Each module gets a unique emoji icon (configurable per module in the database)
- Completed: Gradient background with shadow, full color
- Incomplete: Dashed border, muted color, desaturated icon
- Badge data: Add an `icon` field (string, emoji) to the Module model

**Files to modify:**
- `apps/app/app/(authenticated)/page.tsx` (curriculum with badges)
- `apps/app/app/(authenticated)/components/sidebar.tsx` (progress bar)
- Schema: Add `icon` field to Module model
- Seed: Add icon emojis to sample modules

---

## 7. Schema Changes Summary

```prisma
model Module {
  // existing fields...
  icon String? // Emoji icon for completion badge (e.g., "🎓")
}

model Lesson {
  // existing fields...
  slides Json? // Array of slide objects: [{ title, content, imageUrl? }]
}
```

---

## 8. Navigation Flow

```
Login → Curriculum Overview (/)
         ├── Click lesson → Lesson Page (/courses/[slug]/lessons/[lessonSlug])
         │                   ├── Breadcrumbs → back to Curriculum or Module
         │                   ├── Sidebar → jump to any lesson
         │                   ├── "Bekijk slides" → Presentation Modal (overlay)
         │                   └── Previous/Next → adjacent lessons
         ├── "Ga verder" → Current lesson
         └── Locked module → Shows upgrade prompt (no navigation)
```

---

## 9. Language

All UI labels are in **Dutch** (matching the marketing site). Examples: "Ga verder", "Markeer als voltooid", "Bekijk slides", "Huidige les", "Instellingen". No i18n framework needed for now — hardcoded Dutch strings. The existing English labels in the codebase will be replaced.

---

## 10. Existing Pages — What Happens

| Route | Current | New |
|-------|---------|-----|
| `/` | Dashboard (Continue Learning, My Courses, Discover) | Curriculum overview |
| `/courses` | Course catalog grid | Redirect to `/` (curriculum is the homepage) |
| `/courses/[slug]` | Course detail with enrollment | Keep for enrollment flow (first-time access). After enrollment, redirect to curriculum. |
| `/courses/[slug]/lessons/[lessonSlug]` | Lesson viewer | Updated lesson viewer (same route, new styling/layout) |

The existing server actions in `apps/app/app/actions/course.ts` (`enrollInCourse`, `markLessonComplete`, `getCourseProgress`) remain unchanged — they already provide the correct functionality.

---

## 11. Out of Scope (Future Work)

- Stripe payment integration and package management
- Module-level access control enforcement (locked modules are visual-only for now)
- Admin panel for content management
- Trial/proefperiode logic
- Streak counter and advanced gamification
- Community features
- Content authoring via Sanity Studio

---

## 12. Files Affected

| File | Change |
|------|--------|
| `packages/design-system/styles/globals.css` | Override color tokens to warm palette |
| `apps/app/app/(authenticated)/components/sidebar.tsx` | Replace SaaS menu with curriculum nav |
| `apps/app/app/(authenticated)/page.tsx` | Replace dashboard with curriculum overview |
| `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/page.tsx` | Update lesson page layout and styling |
| `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/components/presentation-modal.tsx` | New: fullscreen slide viewer |
| `packages/database/prisma/schema.prisma` | Add `icon` to Module, `slides` to Lesson |
| `packages/database/prisma/seed.ts` | Add icons and sample slides |
| `apps/app/app/(authenticated)/layout.tsx` | May need breadcrumb provider |
| `apps/app/app/(authenticated)/courses/page.tsx` | Remove or redirect (curriculum is now the homepage) |
