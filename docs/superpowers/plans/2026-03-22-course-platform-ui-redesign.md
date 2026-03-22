# Course Platform UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the app from a generic SaaS dashboard into a warm, focused course platform with curriculum navigation, Markdown lesson rendering, fullscreen presentation mode, and gamification.

**Architecture:** 7 sequential tasks that build on each other. Start with schema + design tokens (foundation), then sidebar, curriculum page, lesson page, presentation modal, and finally cleanup. Each task produces a working commit.

**Tech Stack:** Next.js 16 (App Router), Prisma 7, shadcn/ui, Tailwind CSS v4, react-markdown, remark-gfm, rehype-highlight, Geist fonts.

**Spec:** `docs/superpowers/specs/2026-03-22-course-platform-ui-design.md`

---

## File Structure

| File | Responsibility |
|------|---------------|
| `packages/design-system/styles/globals.css` | Warm brown-beige color tokens (oklch) |
| `packages/database/prisma/schema.prisma` | Add `icon` to Module, `slides` to Lesson |
| `packages/database/index.ts` | Export `Slide` type |
| `packages/database/prisma/seed.ts` | Add icons, slides, and Markdown content |
| `apps/app/app/(authenticated)/layout.tsx` | Fetch course data, pass to sidebar wrapper |
| `apps/app/app/(authenticated)/components/sidebar.tsx` | Curriculum navigation (replaces SaaS menu) |
| `apps/app/app/(authenticated)/components/header.tsx` | Update breadcrumbs with Dutch labels and links |
| `apps/app/app/(authenticated)/page.tsx` | Curriculum overview (replaces dashboard) |
| `apps/app/app/(authenticated)/courses/page.tsx` | Redirect to `/` |
| `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/page.tsx` | Updated lesson page with Markdown rendering |
| `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/components/presentation-modal.tsx` | New: fullscreen slide viewer |
| `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/components/markdown-renderer.tsx` | New: custom react-markdown with warm styling |

---

### Task 1: Schema Changes + Design Tokens

**Files:**
- Modify: `packages/database/prisma/schema.prisma:52-65` (Module model)
- Modify: `packages/database/prisma/schema.prisma:67-84` (Lesson model)
- Modify: `packages/database/index.ts`
- Modify: `packages/design-system/styles/globals.css`

- [ ] **Step 1: Add `icon` field to Module and `slides` field to Lesson in schema.prisma**

In `packages/database/prisma/schema.prisma`, add to Module model (after `order` field):

```prisma
model Module {
  id          String   @id @default(uuid())
  courseId    String
  title       String
  description String?
  order       Int
  icon        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  course  Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons Lesson[]

  @@index([courseId])
}
```

Add to Lesson model (after `duration` field):

```prisma
model Lesson {
  id        String   @id @default(uuid())
  moduleId  String
  title     String
  slug      String
  order     Int
  videoUrl  String?
  content   String?  @db.Text
  duration  Int?
  slides    Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  module   Module           @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  progress LessonProgress[]

  @@unique([moduleId, slug])
  @@index([moduleId])
}
```

- [ ] **Step 2: Export Slide type from packages/database/index.ts**

Add after the `export * from "./generated/client";` line:

```typescript
export type Slide = {
  title: string;
  content: string;
  imageUrl?: string;
};
```

- [ ] **Step 3: Generate Prisma client and push schema to database**

Run: `cd packages/database && npx prisma generate && npx prisma db push`
Expected: Prisma Client generated successfully, schema synced to database. The `icon` field on Module and `slides` field on Lesson are now available.

- [ ] **Step 4: Replace color tokens in globals.css**

Replace the entire `:root` block in `packages/design-system/styles/globals.css` with warm brown-beige tokens. Replace the `.dark` block with the same values (single theme, no dark mode switching).

`:root` values:
```css
:root {
  --background: oklch(0.97 0.01 80);
  --foreground: oklch(0.22 0.03 60);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.03 60);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.03 60);
  --primary: oklch(0.22 0.03 60);
  --primary-foreground: oklch(0.95 0.01 80);
  --secondary: oklch(0.95 0.01 80);
  --secondary-foreground: oklch(0.22 0.03 60);
  --muted: oklch(0.95 0.01 80);
  --muted-foreground: oklch(0.55 0.06 65);
  --accent: oklch(0.95 0.01 80);
  --accent-foreground: oklch(0.22 0.03 60);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --success: oklch(0.55 0.06 65);
  --border: oklch(0.90 0.02 75);
  --input: oklch(0.90 0.02 75);
  --ring: oklch(0.55 0.06 65);
  --chart-1: oklch(0.55 0.06 65);
  --chart-2: oklch(0.65 0.05 70);
  --chart-3: oklch(0.45 0.04 55);
  --chart-4: oklch(0.75 0.04 75);
  --chart-5: oklch(0.35 0.03 50);
  --radius: 0.625rem;
  --sidebar: oklch(0.22 0.03 60);
  --sidebar-foreground: oklch(0.95 0.01 80);
  --sidebar-primary: oklch(0.95 0.01 80);
  --sidebar-primary-foreground: oklch(0.22 0.03 60);
  --sidebar-accent: oklch(0.28 0.03 55);
  --sidebar-accent-foreground: oklch(0.95 0.01 80);
  --sidebar-border: oklch(0.28 0.03 55);
  --sidebar-ring: oklch(0.55 0.06 65);

  --font-weight-bold: 700;
}
```

`.dark` block — set identical values (no dark mode):
```css
.dark {
  --background: oklch(0.97 0.01 80);
  --foreground: oklch(0.22 0.03 60);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.03 60);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.03 60);
  --primary: oklch(0.22 0.03 60);
  --primary-foreground: oklch(0.95 0.01 80);
  --secondary: oklch(0.95 0.01 80);
  --secondary-foreground: oklch(0.22 0.03 60);
  --muted: oklch(0.95 0.01 80);
  --muted-foreground: oklch(0.55 0.06 65);
  --accent: oklch(0.95 0.01 80);
  --accent-foreground: oklch(0.22 0.03 60);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --success: oklch(0.55 0.06 65);
  --border: oklch(0.90 0.02 75);
  --input: oklch(0.90 0.02 75);
  --ring: oklch(0.55 0.06 65);
  --chart-1: oklch(0.55 0.06 65);
  --chart-2: oklch(0.65 0.05 70);
  --chart-3: oklch(0.45 0.04 55);
  --chart-4: oklch(0.75 0.04 75);
  --chart-5: oklch(0.35 0.03 50);
  --sidebar: oklch(0.22 0.03 60);
  --sidebar-foreground: oklch(0.95 0.01 80);
  --sidebar-primary: oklch(0.95 0.01 80);
  --sidebar-primary-foreground: oklch(0.22 0.03 60);
  --sidebar-accent: oklch(0.28 0.03 55);
  --sidebar-accent-foreground: oklch(0.95 0.01 80);
  --sidebar-border: oklch(0.28 0.03 55);
  --sidebar-ring: oklch(0.55 0.06 65);
}
```

Also update the prose typography plugin to use warm code block styling:
```css
--tw-prose-pre-bg: oklch(0.22 0.03 60);
--tw-prose-pre-code: oklch(0.75 0.04 75);
```

- [ ] **Step 5: Commit**

```bash
git add packages/database/prisma/schema.prisma packages/database/index.ts packages/design-system/styles/globals.css
git commit -m "feat: add warm design tokens and schema fields for slides/icons"
```

---

### Task 2: Install Dependencies

**Files:**
- Modify: `apps/app/package.json`

- [ ] **Step 1: Install react-markdown and plugins**

Run from project root:
```bash
cd apps/app && npm install react-markdown remark-gfm rehype-highlight
```

- [ ] **Step 2: Verify installation**

Run: `cat apps/app/package.json | grep -E "react-markdown|remark-gfm|rehype-highlight"`
Expected: All three packages listed in dependencies.

- [ ] **Step 3: Commit**

```bash
git add apps/app/package.json package-lock.json
git commit -m "feat: add react-markdown with gfm and syntax highlighting"
```

---

### Task 3: Curriculum Sidebar

**Files:**
- Modify: `apps/app/app/(authenticated)/layout.tsx`
- Rewrite: `apps/app/app/(authenticated)/components/sidebar.tsx`

- [ ] **Step 1: Update layout.tsx to fetch course data and pass to sidebar**

Replace `apps/app/app/(authenticated)/layout.tsx` with:

```tsx
import { auth, currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import { SidebarProvider } from "@repo/design-system/components/ui/sidebar";
import { showBetaFeature } from "@repo/feature-flags";
import { secure } from "@repo/security";
import type { ReactNode } from "react";
import { env } from "@/env";
import { GlobalSidebar } from "./components/sidebar";

interface AppLayoutProperties {
  readonly children: ReactNode;
}

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(["CATEGORY:PREVIEW"]);
  }

  const user = await currentUser();
  const { redirectToSignIn, userId } = await auth();
  const betaFeature = await showBetaFeature();

  if (!user || !userId) {
    return redirectToSignIn();
  }

  // Fetch the first published course with modules, lessons, and user progress
  const course = await database.course.findFirst({
    where: { published: true },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              duration: true,
              progress: {
                where: { userId },
                select: { completed: true },
              },
            },
          },
        },
      },
    },
  }).catch((e) => { console.error('DB_QUERY_ERROR:', e); return null; });

  return (
    <SidebarProvider>
      <GlobalSidebar course={course}>
        {betaFeature && (
          <div className="m-4 rounded-full bg-blue-500 p-1.5 text-center text-sm text-white">
            Beta feature now available
          </div>
        )}
        {children}
      </GlobalSidebar>
    </SidebarProvider>
  );
};

export default AppLayout;
```

- [ ] **Step 2: Rewrite sidebar.tsx as curriculum navigation**

Replace `apps/app/app/(authenticated)/components/sidebar.tsx` entirely with:

```tsx
"use client";

import { UserButton } from "@repo/auth/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import { Progress } from "@repo/design-system/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@repo/design-system/components/ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleIcon,
  HelpCircleIcon,
  LockIcon,
  PlayCircleIcon,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface LessonData {
  id: string;
  title: string;
  slug: string;
  order: number;
  duration: number | null;
  progress: { completed: boolean }[];
}

interface ModuleData {
  id: string;
  title: string;
  description: string | null;
  order: number;
  icon?: string | null;
  lessons: LessonData[];
}

interface CourseData {
  id: string;
  title: string;
  slug: string;
  modules: ModuleData[];
}

interface GlobalSidebarProperties {
  readonly children: ReactNode;
  readonly course: CourseData | null;
}

export const GlobalSidebar = ({ children, course }: GlobalSidebarProperties) => {
  const pathname = usePathname();

  if (!course) {
    return (
      <>
        <Sidebar variant="inset">
          <SidebarHeader className="p-4">
            <p className="text-sm text-sidebar-foreground/60">Laden...</p>
          </SidebarHeader>
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </>
    );
  }

  // Calculate progress
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) =>
    l.progress.some((p) => p.completed)
  ).length;
  const totalCount = allLessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Determine current lesson from URL
  const lessonSlugMatch = pathname.match(/\/lessons\/([^/]+)/);
  const currentLessonSlug = lessonSlugMatch?.[1] ?? null;

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader className="p-4">
          <Link href="/" className="block">
            <h2 className="font-semibold text-sm text-sidebar-foreground truncate">
              {course.title}
            </h2>
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <Progress
              value={progressPercent}
              className="flex-1 h-1.5 bg-sidebar-accent [&>div]:bg-sidebar-foreground/60"
            />
            <span className="text-[10px] tabular-nums text-sidebar-foreground/50">
              {progressPercent}%
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {course.modules.map((module) => {
                const moduleLessonsCompleted = module.lessons.filter((l) =>
                  l.progress.some((p) => p.completed)
                ).length;
                const isModuleComplete = moduleLessonsCompleted === module.lessons.length && module.lessons.length > 0;
                const hasCurrentLesson = module.lessons.some((l) => l.slug === currentLessonSlug);
                const isLocked = false; // Visual-only for now, future: check access

                return (
                  <Collapsible
                    key={module.id}
                    defaultOpen={hasCurrentLesson || (!isModuleComplete && !isLocked)}
                    asChild
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full justify-between",
                            isLocked && "opacity-50 cursor-not-allowed"
                          )}
                          disabled={isLocked}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            {isLocked ? (
                              <LockIcon className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40" />
                            ) : isModuleComplete ? (
                              <CheckCircle2Icon className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/60" />
                            ) : (
                              <PlayCircleIcon className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/60" />
                            )}
                            <span className="truncate text-xs font-medium">
                              {module.title}
                            </span>
                          </span>
                          <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {module.lessons.map((lesson) => {
                            const isComplete = lesson.progress.some((p) => p.completed);
                            const isCurrent = lesson.slug === currentLessonSlug;

                            return (
                              <SidebarMenuSubItem key={lesson.id}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isCurrent}
                                >
                                  <Link
                                    href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                                    className="flex items-center gap-2"
                                  >
                                    {isComplete ? (
                                      <CheckCircle2Icon className="h-3 w-3 shrink-0 text-sidebar-foreground/60" />
                                    ) : isCurrent ? (
                                      <CircleIcon className="h-3 w-3 shrink-0 fill-sidebar-foreground text-sidebar-foreground" />
                                    ) : (
                                      <CircleIcon className="h-3 w-3 shrink-0 text-sidebar-foreground/30" />
                                    )}
                                    <span className="truncate text-xs">{lesson.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>

          {/* Footer nav */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/settings">
                      <Settings2Icon className="h-4 w-4" />
                      <span>Instellingen</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/support">
                      <HelpCircleIcon className="h-4 w-4" />
                      <span>Support</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserButton
                appearance={{
                  elements: {
                    rootBox: "flex overflow-hidden w-full",
                    userButtonBox: "flex-row-reverse",
                    userButtonOuterIdentifier: "truncate pl-0",
                  },
                }}
                showName
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};
```

- [ ] **Step 3: Verify it compiles**

Run: `cd apps/app && npx next build 2>&1 | head -30`
Expected: No TypeScript errors related to sidebar or layout.

- [ ] **Step 4: Commit**

```bash
git add apps/app/app/\(authenticated\)/layout.tsx apps/app/app/\(authenticated\)/components/sidebar.tsx
git commit -m "feat: replace SaaS sidebar with curriculum navigation"
```

---

### Task 4: Curriculum Overview Page

**Files:**
- Rewrite: `apps/app/app/(authenticated)/page.tsx`
- Modify: `apps/app/app/(authenticated)/components/header.tsx`
- Modify: `apps/app/app/(authenticated)/courses/page.tsx`

- [ ] **Step 1: Update header.tsx to support linked breadcrumbs**

Replace `apps/app/app/(authenticated)/components/header.tsx`:

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/design-system/components/ui/breadcrumb";
import { Separator } from "@repo/design-system/components/ui/separator";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import { Fragment, type ReactNode } from "react";

interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface HeaderProps {
  children?: ReactNode;
  page: string;
  pages: (string | BreadcrumbEntry)[];
}

export const Header = ({ pages, page, children }: HeaderProps) => (
  <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card">
    <div className="flex items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-2 h-4" orientation="vertical" />
      <Breadcrumb>
        <BreadcrumbList>
          {pages.map((entry, index) => {
            const label = typeof entry === "string" ? entry : entry.label;
            const href = typeof entry === "string" ? undefined : entry.href;
            return (
              <Fragment key={label}>
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem className="hidden md:block">
                  {href ? (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    {children}
  </header>
);
```

- [ ] **Step 2: Rewrite page.tsx as curriculum overview**

Replace `apps/app/app/(authenticated)/page.tsx` entirely:

```tsx
export const dynamic = "force-dynamic";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import { Progress } from "@repo/design-system/components/ui/progress";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "./components/header";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleIcon,
  LockIcon,
  PlayCircleIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Curriculum",
  description: "Jouw leertraject",
};

const CurriculumPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const course = await database.course
    .findFirst({
      where: { published: true },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                progress: {
                  where: { userId },
                  select: { completed: true },
                },
              },
            },
          },
        },
      },
    })
    .catch((e) => {
      console.error("DB_QUERY_ERROR:", e);
      return null;
    });

  if (!course) {
    return (
      <>
        <Header page="Curriculum" pages={[]} />
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="text-center">
            <BookOpenIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium">Geen cursussen beschikbaar</p>
            <p className="text-sm text-muted-foreground">Kom snel terug voor nieuwe content.</p>
          </div>
        </div>
      </>
    );
  }

  // Calculate progress
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedLessonIds = new Set(
    allLessons.filter((l) => l.progress.some((p) => p.completed)).map((l) => l.id)
  );
  const totalCount = allLessons.length;
  const completedCount = completedLessonIds.size;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Find the next incomplete lesson for "Ga verder"
  const nextLesson = allLessons.find((l) => !completedLessonIds.has(l.id));

  // Total duration
  const totalMinutes = allLessons.reduce((sum, l) => sum + (l.duration ?? 0), 0);

  return (
    <>
      <Header page="Curriculum" pages={[]} />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-4">
        {/* Course header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {course.modules.length} modules &middot; {totalCount} lessen &middot; &plusmn;{totalMinutes} min
            </p>
          </div>
          {nextLesson && (
            <Button asChild className="shrink-0 rounded-full">
              <Link href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}>
                <PlayCircleIcon className="mr-2 h-4 w-4" />
                Ga verder
              </Link>
            </Button>
          )}
        </div>

        {/* Overall progress */}
        <div className="flex items-center gap-3">
          <Progress value={progressPercent} className="flex-1 h-2" />
          <span className="text-sm tabular-nums text-muted-foreground font-mono">
            {progressPercent}%
          </span>
        </div>

        {/* Module list */}
        <div className="flex flex-col gap-3">
          {course.modules.map((module) => {
            const moduleLessons = module.lessons;
            const moduleCompleted = moduleLessons.filter((l) =>
              completedLessonIds.has(l.id)
            ).length;
            const isModuleComplete = moduleCompleted === moduleLessons.length && moduleLessons.length > 0;
            const moduleProgress = moduleLessons.length > 0
              ? Math.round((moduleCompleted / moduleLessons.length) * 100)
              : 0;
            const isLocked = false; // Visual-only for now
            const hasInProgress = !isModuleComplete && moduleCompleted > 0;

            return (
              <Collapsible key={module.id} defaultOpen={!isModuleComplete && !isLocked}>
                <div
                  className={`rounded-xl border bg-card p-4 ${
                    isLocked
                      ? "opacity-50"
                      : hasInProgress
                        ? "border-muted-foreground"
                        : "border-border"
                  }`}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between gap-3" disabled={isLocked}>
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Badge with module icon */}
                      {isLocked ? (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-base">
                          <LockIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ) : isModuleComplete ? (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted-foreground text-primary-foreground text-base shadow-md" style={{ background: "linear-gradient(135deg, #8b7355, #a08b6e)" }}>
                          {module.icon ?? "✓"}
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground text-base text-muted-foreground/50">
                          {module.icon ?? `${moduleProgress}%`}
                        </div>
                      )}
                      <div className="min-w-0 text-left">
                        <p className="font-semibold text-sm truncate">
                          Module {module.order}: {module.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isLocked
                            ? `${moduleLessons.length} lessen · Upgrade voor toegang`
                            : isModuleComplete
                              ? `${moduleLessons.length} lessen · Voltooid`
                              : `${moduleCompleted} van ${moduleLessons.length} lessen`}
                        </p>
                      </div>
                    </div>
                    {!isLocked && (
                      <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    )}
                  </CollapsibleTrigger>

                  {!isLocked && (
                    <CollapsibleContent>
                      <div className="mt-3 border-t border-border pt-3 flex flex-col gap-1">
                        {moduleLessons.map((lesson) => {
                          const isComplete = completedLessonIds.has(lesson.id);
                          const isCurrent = nextLesson?.id === lesson.id;

                          return (
                            <Link
                              key={lesson.id}
                              href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary ${
                                isCurrent ? "bg-secondary font-medium" : ""
                              }`}
                            >
                              {isComplete ? (
                                <CheckCircle2Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                              ) : isCurrent ? (
                                <CircleIcon className="h-4 w-4 shrink-0 fill-foreground text-foreground" />
                              ) : (
                                <CircleIcon className="h-4 w-4 shrink-0 text-border" />
                              )}
                              <span className="flex-1 truncate">{lesson.title}</span>
                              {lesson.duration && (
                                <span className="text-xs tabular-nums text-muted-foreground font-mono">
                                  {lesson.duration} min
                                </span>
                              )}
                              {isCurrent && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  Huidige les
                                </Badge>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  )}
                </div>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CurriculumPage;
```

- [ ] **Step 3: Redirect /courses to /**

Replace `apps/app/app/(authenticated)/courses/page.tsx`:

```tsx
import { redirect } from "next/navigation";

const CoursesRedirect = () => {
  redirect("/");
};

export default CoursesRedirect;
```

- [ ] **Step 4: Verify compilation**

Run: `cd apps/app && npx next build 2>&1 | head -30`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add apps/app/app/\(authenticated\)/page.tsx apps/app/app/\(authenticated\)/components/header.tsx apps/app/app/\(authenticated\)/courses/page.tsx
git commit -m "feat: curriculum overview replaces dashboard, /courses redirects to /"
```

---

### Task 5: Markdown Renderer + Updated Lesson Page

**Files:**
- Create: `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/components/markdown-renderer.tsx`
- Modify: `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/page.tsx`

- [ ] **Step 1: Create markdown-renderer.tsx**

Create `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/components/markdown-renderer.tsx`:

```tsx
"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Children, isValidElement, type ReactNode } from "react";

/** Recursively extract text from React children */
function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (isValidElement(node)) {
    return extractText(node.props.children);
  }
  if (Array.isArray(node)) {
    return Children.toArray(node).map(extractText).join("");
  }
  return "";
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-8 mb-4 text-2xl font-bold tracking-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 mb-3 text-xl font-semibold tracking-tight">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 mb-2 text-lg font-semibold">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-[#2c231a] p-4 text-sm font-mono text-[#c4b5a0]">
      {children}
    </pre>
  ),
  code: ({ children, className }) => {
    // Inline code vs block code
    if (className) {
      // Block code (has language class from rehype-highlight)
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="rounded bg-secondary px-1.5 py-0.5 text-sm font-mono">
        {children}
      </code>
    );
  },
  blockquote: ({ children }) => {
    // Check if this is an assignment block by extracting text from React nodes
    const text = extractText(children);
    if (text.includes("Opdracht:")) {
      return (
        <div className="my-4 rounded-r-lg border-l-4 border-muted-foreground bg-secondary p-4">
          <p className="mb-1 text-sm font-semibold text-muted-foreground">📝 Opdracht</p>
          <div className="text-sm">{children}</div>
        </div>
      );
    }
    return (
      <blockquote className="my-4 border-l-4 border-border pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    );
  },
  img: ({ src, alt }) => (
    <figure className="my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src ?? ""}
        alt={alt ?? ""}
        className="w-full rounded-lg border border-border"
      />
      {alt && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  hr: () => <hr className="my-6 border-border" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
};

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => (
  <div className="max-w-none text-sm leading-relaxed">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  </div>
);
```

- [ ] **Step 2: Update lesson page with Markdown rendering and Dutch labels**

Replace `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/page.tsx` entirely:

```tsx
export const dynamic = "force-dynamic";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Slide } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { markLessonComplete } from "@/app/actions/course";
import { Header } from "../../../../components/header";
import { MarkdownRenderer } from "./components/markdown-renderer";
import { PresentationButton } from "./components/presentation-modal";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const lesson = await database.lesson
    .findFirst({
      where: { slug: lessonSlug, module: { course: { slug } } },
      select: { title: true },
    })
    .catch(() => null);
  return { title: lesson?.title ?? "Les" };
}

const LessonPage = async ({ params }: LessonPageProps) => {
  const { slug, lessonSlug } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Verify enrollment
  const enrollment = await database.enrollment
    .findFirst({
      where: {
        userId,
        course: { slug },
        status: { in: ["ACTIVE", "COMPLETED"] },
      },
    })
    .catch(() => null);

  if (!enrollment) {
    redirect(`/courses/${slug}`);
  }

  // Fetch lesson with full course context
  const lesson = await database.lesson
    .findFirst({
      where: {
        slug: lessonSlug,
        module: { course: { slug } },
      },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  orderBy: { order: "asc" },
                  include: {
                    lessons: {
                      orderBy: { order: "asc" },
                      select: { id: true, title: true, slug: true, order: true },
                    },
                  },
                },
              },
            },
          },
        },
        progress: {
          where: { userId },
          select: { completed: true },
        },
      },
    })
    .catch(() => null);

  if (!lesson) {
    notFound();
  }

  const isCompleted = lesson.progress.some((p) => p.completed);
  const slides = (lesson.slides as Slide[] | null) ?? null;

  // Build flat lesson list for navigation
  const allLessons = lesson.module.course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const course = lesson.module.course;

  return (
    <>
      <Header
        page={lesson.title}
        pages={[
          { label: "Curriculum", href: "/" },
          { label: lesson.module.title },
        ]}
      />
      <div className="flex flex-1 flex-col">
        {/* Video (conditional) */}
        {lesson.videoUrl && (
          <div className="w-full bg-[#1a1510]">
            <iframe
              src={lesson.videoUrl}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        )}

        {/* Content area */}
        <div className="mx-auto w-full max-w-3xl p-6">
          {/* Lesson header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {lesson.module.title}
                {lesson.duration && (
                  <>
                    {" "}&middot;{" "}
                    <span className="font-mono">{lesson.duration} min</span>
                  </>
                )}
              </p>
            </div>

            {isCompleted ? (
              <Badge variant="secondary" className="shrink-0">
                <CheckCircle2Icon className="mr-1 h-3 w-3" />
                Voltooid
              </Badge>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await markLessonComplete(lesson.id, slug, lessonSlug);
                }}
              >
                <Button type="submit" className="shrink-0 rounded-full">
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                  Markeer als voltooid
                </Button>
              </form>
            )}
          </div>

          {/* Markdown content */}
          {lesson.content && <MarkdownRenderer content={lesson.content} />}

          {/* Slides button */}
          {slides && slides.length > 0 && (
            <div className="mt-6">
              <PresentationButton
                slides={slides}
                lessonTitle={lesson.title}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            {prevLesson ? (
              <Button
                asChild
                variant="outline"
                className="rounded-full"
              >
                <Link href={`/courses/${slug}/lessons/${prevLesson.slug}`}>
                  <ChevronLeftIcon className="mr-2 h-4 w-4" />
                  {prevLesson.title}
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" className="text-muted-foreground">
                <Link href="/">
                  <ChevronLeftIcon className="mr-2 h-4 w-4" />
                  Terug naar curriculum
                </Link>
              </Button>
            )}

            {nextLesson ? (
              <Button asChild className="rounded-full">
                <Link href={`/courses/${slug}/lessons/${nextLesson.slug}`}>
                  {nextLesson.title}
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/">
                  Cursus voltooid!
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonPage;
```

- [ ] **Step 3: Commit**

```bash
git add apps/app/app/\(authenticated\)/courses/\[slug\]/lessons/\[lessonSlug\]/
git commit -m "feat: lesson page with Markdown rendering and Dutch labels"
```

---

### Task 6: Presentation Modal

**Files:**
- Create: `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/components/presentation-modal.tsx`

- [ ] **Step 1: Create presentation-modal.tsx**

Create `apps/app/app/(authenticated)/courses/[slug]/lessons/[lessonSlug]/components/presentation-modal.tsx`:

```tsx
"use client";

import type { Slide } from "@repo/database";
import { Button } from "@repo/design-system/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PresentationIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface PresentationButtonProps {
  slides: Slide[];
  lessonTitle: string;
}

export const PresentationButton = ({ slides, lessonTitle }: PresentationButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setCurrentSlide(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose, handlePrev, handleNext]);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => setIsOpen(true)}
      >
        <PresentationIcon className="mr-2 h-4 w-4" />
        Bekijk slides
      </Button>
    );
  }

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#2c231a]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#3d3128] px-6 py-3">
        <p className="text-sm text-[#c4b5a0]">
          {lessonTitle} — Slides
        </p>
        <button
          onClick={handleClose}
          className="text-[#c4b5a0] hover:text-[#f5f0e8] transition-colors"
          type="button"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Slide content */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-2xl rounded-xl bg-[#f5f0e8] p-8 text-[#2c231a]">
          <h2 className="mb-4 text-center text-xl font-bold">{slide.title}</h2>
          {slide.imageUrl && (
            <div className="mb-4 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full"
              />
            </div>
          )}
          <p className="text-center leading-relaxed text-[#6b5c4c]">
            {slide.content}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-[#3d3128] px-6 py-3">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="text-sm text-[#c4b5a0] hover:text-[#f5f0e8] disabled:opacity-30 transition-colors"
          type="button"
        >
          <ChevronLeftIcon className="mr-1 inline h-4 w-4" />
          Vorige
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === currentSlide ? "bg-[#c4b5a0]" : "bg-[#3d3128]"
              }`}
              type="button"
              aria-label={`Slide ${i + 1}`}
            />
          ))}
          <span className="ml-2 text-xs tabular-nums text-[#8b7355]">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          className="text-sm text-[#c4b5a0] hover:text-[#f5f0e8] disabled:opacity-30 transition-colors"
          type="button"
        >
          Volgende
          <ChevronRightIcon className="ml-1 inline h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/app/app/\(authenticated\)/courses/\[slug\]/lessons/\[lessonSlug\]/components/presentation-modal.tsx
git commit -m "feat: fullscreen presentation modal for lesson slides"
```

---

### Task 7: Seed Data Update + Cleanup

**Files:**
- Modify: `packages/database/prisma/seed.ts`
- Delete unused: `apps/app/app/(authenticated)/components/search.tsx` (if imported by old sidebar)

- [ ] **Step 1: Update seed.ts with icons and sample slides**

In `packages/database/prisma/seed.ts`, add `icon` to each module and `slides` to a couple of lessons. Update the module creation to include `icon`:

Add `icon` and `slides` fields to the curriculum array. The type annotation ensures TypeScript accepts the new fields:

```typescript
import type { Slide } from '../index';

interface LessonSeed {
  title: string;
  slug: string;
  order: number;
  videoUrl: string;
  content: string;
  duration: number;
  slides?: Slide[];
}

interface ModuleSeed {
  title: string;
  description: string;
  order: number;
  icon: string;
  lessons: LessonSeed[];
}

const curriculum: ModuleSeed[] = [
  {
    title: 'AI Foundations',
    description: 'Understand the core concepts behind modern AI systems.',
    order: 1,
    icon: '🎓',
    lessons: [/* ... existing lessons unchanged ... */],
  },
  {
    title: 'Building with AI',
    description: 'Integrate AI into real applications using the Vercel AI SDK.',
    order: 2,
    icon: '🔧',
    lessons: [/* ... existing lessons, add slides to "Streaming Chat Interface" (see below) ... */],
  },
  {
    title: 'Shipping AI Products',
    description: 'Take your AI application from prototype to production.',
    order: 3,
    icon: '🚀',
    lessons: [/* ... existing lessons unchanged ... */],
  },
];
```

Note: The existing seed imports from `'../generated'`. Update the import at the top of the file:
```typescript
import { PrismaClient } from '../generated';
import type { Slide } from '../index';
```
Since `index.ts` uses `"server-only"`, and the seed runs as a script (not in Next.js), add the `Slide` type directly to `seed.ts` instead of importing from `index.ts`:
```typescript
type Slide = { title: string; content: string; imageUrl?: string };
```

Add `slides` to the "Streaming Chat Interface" lesson (order 2 in module 2):
```typescript
slides: [
  {
    title: 'Wat is Streaming?',
    content: 'Server-Sent Events sturen tokens één voor één naar de client, zodat de gebruiker direct tekst ziet verschijnen.',
  },
  {
    title: 'De useChat Hook',
    content: 'useChat beheert berichten, status, en streaming automatisch. Je hoeft alleen een API endpoint op te geven.',
  },
  {
    title: 'Server-side: streamText',
    content: 'streamText() geeft een StreamResponse terug die je direct als Response kunt retourneren vanuit een Route Handler.',
  },
  {
    title: 'Best Practices',
    content: 'Gebruik altijd error boundaries rond chat components. Toon een loading state tijdens het streamen. Cache waar mogelijk.',
  },
],
```

Update the module upsert to include `icon`:
```typescript
create: {
  id: `seed-module-${moduleData.order}`,
  courseId: course.id,
  title: moduleData.title,
  description: moduleData.description,
  order: moduleData.order,
  icon: moduleData.icon,
},
update: {
  title: moduleData.title,
  description: moduleData.description,
  order: moduleData.order,
  icon: moduleData.icon,
},
```

And lesson upsert to include `slides`:
```typescript
create: {
  moduleId: module.id,
  title: lessonData.title,
  slug: lessonData.slug,
  order: lessonData.order,
  videoUrl: lessonData.videoUrl,
  content: lessonData.content,
  duration: lessonData.duration,
  slides: lessonData.slides ?? undefined,
},
update: {
  title: lessonData.title,
  order: lessonData.order,
  videoUrl: lessonData.videoUrl,
  content: lessonData.content,
  duration: lessonData.duration,
  slides: lessonData.slides ?? undefined,
},
```

- [ ] **Step 2: Remove the Search component import from sidebar (if it still exists)**

Check if `apps/app/app/(authenticated)/components/search.tsx` is still imported anywhere. If the new sidebar no longer imports it, it can stay as an unused file for now — no need to delete.

- [ ] **Step 3: Remove ModeToggle from sidebar footer**

The new sidebar already omits the `ModeToggle` since we use a single warm theme. Verify the import is removed from `sidebar.tsx`.

- [ ] **Step 4: Verify full build**

Run: `cd apps/app && npx next build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add packages/database/prisma/seed.ts
git commit -m "feat: seed data with module icons and sample slides"
```

---

## Post-Implementation Checklist

After all tasks are complete:

- [ ] Re-seed the database: `cd packages/database && npx prisma db seed` (schema was already pushed in Task 1)
- [ ] Start dev server: `cd apps/app && npm run dev`
- [ ] Verify: warm color theme loads, sidebar shows curriculum, curriculum page shows modules, lesson page renders Markdown, slides modal works
