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
                const isLocked = false; // Visual-only for now

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
