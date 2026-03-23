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
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@repo/design-system/components/ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleIcon,
  LockIcon,
  PlayCircleIcon,
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

  // On all /courses pages, hide — these pages have their own navigation
  const isCoursesPage = pathname.startsWith("/courses");

  if (isCoursesPage) {
    return <div className="flex min-h-screen w-full flex-col">{children}</div>;
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        {/* Header: Course Content title + progress */}
        <SidebarHeader className="border-b border-sidebar-accent px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="block">
              <h2 className="text-sm font-semibold text-sidebar-foreground">
                Cursusinhoud
              </h2>
            </Link>
            <span className="text-[11px] font-medium tabular-nums text-sidebar-foreground/50">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <Progress
              value={progressPercent}
              className="flex-1 h-1.5 bg-sidebar-accent [&>div]:bg-[#c4956a]"
            />
            <span className="text-[10px] font-medium tabular-nums text-sidebar-foreground/50">
              {progressPercent}%
            </span>
          </div>
        </SidebarHeader>

        {/* Module list */}
        <SidebarContent className="px-2 py-2">
          <div className="flex flex-col gap-1">
            {course.modules.map((module) => {
              const moduleLessonsCompleted = module.lessons.filter((l) =>
                l.progress.some((p) => p.completed)
              ).length;
              const moduleTotalLessons = module.lessons.length;
              const isModuleComplete = moduleLessonsCompleted === moduleTotalLessons && moduleTotalLessons > 0;
              const hasCurrentLesson = module.lessons.some((l) => l.slug === currentLessonSlug);
              const isLocked = false;

              // Total duration for module
              const moduleDuration = module.lessons.reduce((sum, l) => sum + (l.duration ?? 0), 0);

              return (
                <Collapsible
                  key={module.id}
                  defaultOpen={hasCurrentLesson || (!isModuleComplete && !isLocked)}
                >
                  <div className="rounded-lg">
                    {/* Module header */}
                    <CollapsibleTrigger
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent/50",
                        isLocked && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={isLocked}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {isLocked ? (
                            <LockIcon className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40" />
                          ) : isModuleComplete ? (
                            <CheckCircle2Icon className="h-3.5 w-3.5 shrink-0 text-[#c4956a]" />
                          ) : (
                            <PlayCircleIcon className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/50" />
                          )}
                          <span className="truncate text-xs font-semibold text-sidebar-foreground">
                            {module.title}
                          </span>
                        </div>
                        <p className="mt-0.5 ml-5.5 text-[10px] text-sidebar-foreground/40">
                          {moduleLessonsCompleted}/{moduleTotalLessons}
                          {moduleDuration > 0 && (
                            <> &middot; {moduleDuration} min</>
                          )}
                        </p>
                      </div>
                      <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40 transition-transform duration-200 group-data-[state=open]:rotate-180 data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>

                    {/* Lessons */}
                    <CollapsibleContent>
                      <div className="mt-0.5 flex flex-col gap-0.5 pb-1">
                        {module.lessons.map((lesson) => {
                          const isComplete = lesson.progress.some((p) => p.completed);
                          const isCurrent = lesson.slug === currentLessonSlug;

                          return (
                            <Link
                              key={lesson.id}
                              href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                              className={cn(
                                "group flex items-center gap-2.5 rounded-md px-3 py-2 text-xs transition-colors",
                                isCurrent
                                  ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                              )}
                            >
                              {/* Status icon */}
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                                {isComplete ? (
                                  <CheckCircle2Icon className="h-4 w-4 text-[#c4956a]" />
                                ) : isCurrent ? (
                                  <CircleIcon className="h-4 w-4 fill-sidebar-foreground text-sidebar-foreground" />
                                ) : (
                                  <CircleIcon className="h-4 w-4 text-sidebar-foreground/25" />
                                )}
                              </span>

                              {/* Lesson title + duration */}
                              <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                                <span className="truncate">
                                  {String(lesson.order).padStart(2, "0")}: {lesson.title}
                                </span>
                                {lesson.duration && (
                                  <span className="shrink-0 text-[10px] tabular-nums text-sidebar-foreground/35">
                                    {lesson.duration} min
                                  </span>
                                )}
                              </div>

                              {/* Play icon on hover for non-completed */}
                              {!isComplete && !isCurrent && (
                                <PlayCircleIcon className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/30 opacity-0 transition-opacity group-hover:opacity-100" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </SidebarContent>

        {/* Footer: user */}
        <SidebarFooter className="border-t border-sidebar-accent px-3 py-3">
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
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
