export const dynamic = 'force-dynamic';

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Progress } from "@repo/design-system/components/ui/progress";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { enrollInCourse } from "@/app/actions/course";
import { UserButton } from "@repo/auth/client";
import { SidebarToggle } from "./lessons/[lessonSlug]/sidebar-toggle";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleIcon,
  HelpCircleIcon,
  LockIcon,
  PlayCircleIcon,
  SettingsIcon,
} from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await database.course.findUnique({ where: { slug } }).catch((e) => { console.error('DB_QUERY_ERROR:', e); return null; });
  return {
    title: course?.title ?? "Course",
    description: course?.description,
  };
}

const CourseDetailPage = async ({ params }: CourseDetailPageProps) => {
  const { slug } = await params;
  const { userId } = await auth();

  const course = await database.course.findUnique({
    where: { slug, published: true },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
      enrollments: userId
        ? { where: { userId } }
        : false,
    },
  }).catch((e) => { console.error('DB_QUERY_ERROR:', e); return null; });

  if (!course) {
    notFound();
  }

  const isEnrolled = userId
    ? course.enrollments.some((e) => e.status === "ACTIVE" || e.status === "COMPLETED")
    : false;

  // Get lesson progress for enrolled users
  let completedLessonIds = new Set<string>();
  if (isEnrolled && userId) {
    const allLessonIds = course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );
    const progress = await database.lessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: allLessonIds },
        completed: true,
      },
      select: { lessonId: true },
    }).catch((e) => { console.error('DB_QUERY_ERROR:', e); return []; });
    completedLessonIds = new Set(progress.map((p) => p.lessonId));
  }

  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
  );
  const totalLessons = allLessons.length;
  const completedCount = completedLessonIds.size;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const firstLesson = course.modules[0]?.lessons[0];
  // Find first incomplete lesson for "Continue Learning" button
  const nextIncompleteLesson = allLessons.find((l) => !completedLessonIds.has(l.id));
  const continueLesson = nextIncompleteLesson ?? firstLesson;

  return (
    <div className="flex h-screen overflow-hidden lg:flex-row">
      {/* ─── Left sidebar: Course Content ─── */}
      <aside className="lesson-sidebar flex w-full shrink-0 flex-col border-b border-[#e8dfd0] bg-[#faf7f2] lg:w-[300px] lg:border-b-0 lg:border-r transition-all duration-200 [[data-sidebar-collapsed=true]_&]:lg:w-0 [[data-sidebar-collapsed=true]_&]:lg:overflow-hidden [[data-sidebar-collapsed=true]_&]:lg:border-r-0">
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-[#e8dfd0] px-5 py-4">
          <h2 className="font-semibold text-[#2c231a]">Course Content</h2>
          <span className="text-xs text-[#8b7355]">
            {completedCount}/{totalLessons}
          </span>
        </div>

        {/* Module list */}
        <div className="divide-y divide-[#e8dfd0] overflow-y-auto lg:flex-1">
          {course.modules.map((mod) => {
            const modLessons = allLessons.filter((l) => l.moduleId === mod.id);
            const modCompleted = modLessons.filter((l) => completedLessonIds.has(l.id)).length;
            const modTotal = modLessons.length;
            const modDuration = mod.lessons.reduce((acc, l) => acc + (l.duration ?? 0), 0);

            return (
              <details
                key={mod.id}
                open
                className="group"
              >
                <summary className="flex cursor-pointer items-center gap-3 px-5 py-3.5 text-sm hover:bg-[#f0e9dd] [&::-webkit-details-marker]:hidden">
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-[#8b7355] transition-transform group-open:rotate-0 -rotate-90" />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-[#2c231a]">{mod.title}</p>
                    <p className="text-xs text-[#8b7355]">
                      {modCompleted}/{modTotal}
                      {modDuration > 0 && <> · {Math.round(modDuration / 60)} min</>}
                    </p>
                  </div>
                </summary>
                <ul className="border-t border-[#e8dfd0]/50 bg-white/50">
                  {modLessons.map((l) => {
                    const isDone = completedLessonIds.has(l.id);
                    return (
                      <li key={l.id}>
                        {isEnrolled ? (
                          <Link
                            href={`/courses/${slug}/lessons/${l.slug}`}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-[#f5f0e8]"
                          >
                            {isDone ? (
                              <CheckCircle2Icon className="h-4 w-4 shrink-0 text-green-600" />
                            ) : (
                              <CircleIcon className="h-4 w-4 shrink-0 text-[#c4b5a0]" />
                            )}
                            <span className={isDone ? "text-[#8b7355]" : ""}>
                              {l.title}
                            </span>
                            {l.duration && (
                              <span className="ml-auto text-xs tabular-nums text-[#8b7355]/60">
                                {Math.floor(l.duration / 60)}m
                              </span>
                            )}
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 px-5 py-2.5 text-sm text-[#8b7355]/60">
                            <CircleIcon className="h-4 w-4 shrink-0 text-[#c4b5a0]" />
                            <span>{l.title}</span>
                            {l.duration && (
                              <span className="ml-auto text-xs tabular-nums text-[#8b7355]/40">
                                {Math.floor(l.duration / 60)}m
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </details>
            );
          })}
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-[#e8dfd0] px-4 py-3">
          <div className="flex flex-col gap-1">
            <Link
              href="/settings"
              className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-[#6b5c4c] transition-colors hover:bg-[#f0e9dd] hover:text-[#2c231a]"
            >
              <SettingsIcon className="h-4 w-4" />
              Instellingen
            </Link>
            <Link
              href="/support"
              className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-[#6b5c4c] transition-colors hover:bg-[#f0e9dd] hover:text-[#2c231a]"
            >
              <HelpCircleIcon className="h-4 w-4" />
              Support
            </Link>
          </div>
          <div className="mt-3 border-t border-[#e8dfd0] pt-3">
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
          </div>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Breadcrumbs */}
        <div className="shrink-0 border-b border-[#e8dfd0] bg-[#faf7f2]">
          <div className="flex items-center gap-2 px-6 py-2">
            <SidebarToggle />
            <nav className="flex items-center gap-1.5 text-sm">
              <Link href="/courses" className="text-[#8b7355] hover:text-[#2c231a] transition-colors">
                Courses
              </Link>
              <span className="text-[#c4b5a0]">›</span>
              <span className="font-medium text-[#2c231a]">{course.title}</span>
            </nav>
          </div>
        </div>

        {/* Main content area with padding */}
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Course Hero */}
          <div className="overflow-hidden rounded-2xl bg-[#2c231a] p-6 sm:p-8">
            <div className="mb-3 flex items-center gap-2">
              <Badge className="border-[#4a3f33] bg-[#362d22] text-[#c4b5a0] hover:bg-[#4a3f33]">
                {course.tier === "FREE" ? "Free" : course.tier === "MINI" ? "Mini" : "Full"}
              </Badge>
              <span className="text-sm text-[#c4b5a0]/60">
                {totalLessons} lesson{totalLessons !== 1 ? "s" : ""} · {course.modules.length} module{course.modules.length !== 1 ? "s" : ""}
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-medium tracking-tight text-[#f5f0e8]">{course.title}</h1>
            <p className="max-w-2xl text-[#c4b5a0]/80">{course.description}</p>

            <div className="mt-6 flex items-center gap-4">
              {isEnrolled ? (
                <>
                  <Button
                    asChild
                    className="rounded-full bg-[#f5f0e8] text-[#2c231a] hover:bg-white"
                  >
                    <Link href={continueLesson ? `/courses/${slug}/lessons/${continueLesson.slug}` : "#"}>
                      <PlayCircleIcon className="mr-2 h-4 w-4" />
                      {completedCount > 0 ? "Continue Learning" : "Start Course"}
                    </Link>
                  </Button>
                  <div className="flex max-w-sm flex-1 items-center gap-3">
                    <Progress value={progressPercent} className="flex-1 bg-white/10 [&>div]:bg-[#c4b5a0]" />
                    <span className="text-sm tabular-nums text-[#c4b5a0]">
                      {progressPercent}%
                    </span>
                  </div>
                </>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await enrollInCourse(course.id);
                  }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-full bg-[#f5f0e8] text-[#2c231a] hover:bg-white"
                  >
                    Enroll Now — {course.tier === "FREE" ? "Free" : `${course.tier}`}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Curriculum */}
          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Curriculum</h2>
            <div className="space-y-3">
              {course.modules.map((module) => {
                // Module 1 (order=1) is always accessible for FREE tier
                // Module 2+ requires MINI or FULL tier
                const isModuleFree = module.order === 1;
                const isModuleLocked = !isEnrolled || (!isModuleFree && course.tier === "FREE");
                // For now, enrolled users get all modules (tier enforcement is visual preview)
                const canAccess = isEnrolled;

                return (
                  <Card
                    key={module.id}
                    className={`border-[#e8dfd0] ${isModuleLocked && !isEnrolled ? "opacity-75" : ""}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{module.title}</CardTitle>
                        {!isModuleFree && (
                          <Badge variant="outline" className="text-[10px] border-[#e8dfd0] text-[#8b7355]">
                            Premium
                          </Badge>
                        )}
                        {!canAccess && (
                          <LockIcon className="h-3.5 w-3.5 text-[#c4b5a0]" />
                        )}
                      </div>
                      {module.description && (
                        <p className="text-sm text-muted-foreground">
                          {module.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {module.lessons.map((lesson) => {
                          const isDone = completedLessonIds.has(lesson.id);
                          return (
                            <li key={lesson.id}>
                              {canAccess ? (
                                <Link
                                  href={`/courses/${slug}/lessons/${lesson.slug}`}
                                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-200 hover:bg-[#f0e9dd]"
                                >
                                  {isDone ? (
                                    <CheckCircle2Icon className="h-4 w-4 shrink-0 text-green-600" />
                                  ) : (
                                    <CircleIcon className="h-4 w-4 shrink-0 text-[#c4b5a0]" />
                                  )}
                                  <span>{lesson.title}</span>
                                  {lesson.duration && (
                                    <span className="ml-auto tabular-nums text-muted-foreground">
                                      {Math.floor(lesson.duration / 60)}m
                                    </span>
                                  )}
                                </Link>
                              ) : (
                                <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm opacity-60">
                                  <LockIcon className="h-4 w-4 shrink-0 text-[#c4b5a0]" />
                                  <span className="text-muted-foreground">{lesson.title}</span>
                                  {lesson.duration && (
                                    <span className="ml-auto tabular-nums text-muted-foreground">
                                      {Math.floor(lesson.duration / 60)}m
                                    </span>
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
