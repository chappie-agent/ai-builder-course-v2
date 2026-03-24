export const dynamic = 'force-dynamic';

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Progress } from "@repo/design-system/components/ui/progress";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { markLessonComplete, markLessonIncomplete } from "@/app/actions/course";
import { UserButton } from "@repo/auth/client";
import { SidebarToggle } from "./sidebar-toggle";
import { MarkdownRenderer } from "./markdown-renderer";
import { LessonTabs } from "./lesson-tabs";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  ClockIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  LayersIcon,
  PlayCircleIcon,
  SettingsIcon,
  SignalIcon,
  UsersIcon,
} from "lucide-react";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const lesson = await database.lesson.findFirst({
    where: { slug: lessonSlug, module: { course: { slug } } },
    select: { title: true },
  }).catch((e) => { console.error('DB_QUERY_ERROR:', e); return null; });
  return { title: lesson?.title ?? "Lesson" };
}

const LessonPage = async ({ params }: LessonPageProps) => {
  const { slug, lessonSlug } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Verify enrollment
  const enrollment = await database.enrollment.findFirst({
    where: {
      userId,
      course: { slug },
      status: { in: ["ACTIVE", "COMPLETED"] },
    },
  }).catch((e) => { console.error('DB_QUERY_ERROR:', e); return null; });

  if (!enrollment) {
    redirect(`/courses/${slug}`);
  }

  // Fetch lesson with full course context for navigation
  const lesson = await database.lesson.findFirst({
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
                    select: { id: true, title: true, slug: true, order: true, duration: true },
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
  }).catch((e) => { console.error('DB_QUERY_ERROR:', e); return null; });

  if (!lesson) {
    notFound();
  }

  const isCompleted = lesson.progress.some((p) => p.completed);
  const course = lesson.module.course;

  // Build flat ordered lesson list for prev/next navigation
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  // Progress stats
  const progressIds = await database.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: allLessons.map((l) => l.id) },
      completed: true,
    },
    select: { lessonId: true },
  }).catch((e) => { console.error('DB_QUERY_ERROR:', e); return []; });
  const completedIds = new Set(progressIds.map((p) => p.lessonId));
  const progressPercent =
    allLessons.length > 0
      ? Math.round((completedIds.size / allLessons.length) * 100)
      : 0;

  return (
    <div className="flex h-screen overflow-hidden lg:flex-row">
      {/* ─── Left sidebar: Course Content ─── */}
      <aside className="lesson-sidebar flex w-full shrink-0 flex-col border-b border-[#e8dfd0] bg-[#faf7f2] lg:w-[300px] lg:border-b-0 lg:border-r transition-all duration-200 [[data-sidebar-collapsed=true]_&]:lg:w-0 [[data-sidebar-collapsed=true]_&]:lg:overflow-hidden [[data-sidebar-collapsed=true]_&]:lg:border-r-0">
          {/* Sidebar header */}
          <div className="flex items-center justify-between border-b border-[#e8dfd0] px-5 py-4">
            <h2 className="font-semibold text-[#2c231a]">Course Content</h2>
            <span className="text-xs text-[#8b7355]">
              {completedIds.size}/{allLessons.length}
            </span>
          </div>

          {/* Module list */}
          <div className="divide-y divide-[#e8dfd0] overflow-y-auto lg:flex-1">
            {course.modules.map((mod) => {
              const modLessons = allLessons.filter((l) => l.moduleId === mod.id);
              const modCompleted = modLessons.filter((l) => completedIds.has(l.id)).length;
              const modTotal = modLessons.length;
              const modDuration = mod.lessons.reduce((acc, l) => acc + (l.duration ?? 0), 0);

              return (
                <details
                  key={mod.id}
                  open={mod.id === lesson.module.id}
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
                      const isCurrent = l.id === lesson.id;
                      const isDone = completedIds.has(l.id);
                      return (
                        <li key={l.id}>
                          <Link
                            href={`/courses/${slug}/lessons/${l.slug}`}
                            className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                              isCurrent
                                ? "border-l-2 border-[#8b7355] bg-[#f0e9dd] font-medium text-[#2c231a]"
                                : "hover:bg-[#f5f0e8]"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2Icon className="h-4 w-4 shrink-0 text-green-600" />
                            ) : isCurrent ? (
                              <PlayCircleIcon className="h-4 w-4 shrink-0 text-[#8b7355]" />
                            ) : (
                              <CircleIcon className="h-4 w-4 shrink-0 text-[#c4b5a0]" />
                            )}
                            <span className={isDone && !isCurrent ? "text-[#8b7355]" : ""}>
                              {l.title}
                            </span>
                            {l.duration && (
                              <span className="ml-auto text-xs tabular-nums text-[#8b7355]/60">
                                {Math.floor(l.duration / 60)}m
                              </span>
                            )}
                          </Link>
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

      {/* ─── Main content (video + lesson info) ─── */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Breadcrumbs + progress bar */}
        <div className="shrink-0 border-b border-[#e8dfd0] bg-[#faf7f2]">
          <div className="flex items-center gap-2 px-4 py-2">
            <SidebarToggle />
            <nav className="flex items-center gap-1.5 text-sm">
              <Link href={`/courses/${slug}`} className="text-[#8b7355] hover:text-[#2c231a] transition-colors">
                Courses
              </Link>
              <span className="text-[#c4b5a0]">›</span>
              <Link href={`/courses/${slug}`} className="text-[#8b7355] hover:text-[#2c231a] transition-colors">
                {course.title}
              </Link>
              <span className="text-[#c4b5a0]">›</span>
              <span className="font-medium text-[#2c231a] truncate max-w-[300px]">{lesson.title}</span>
            </nav>
          </div>
          <div className="flex items-center gap-3 border-t border-[#e8dfd0]/50 px-4 py-1.5">
            <span className="text-xs text-[#8b7355]">
              {completedIds.size}/{allLessons.length} lessons
            </span>
            <Progress value={progressPercent} className="flex-1" />
            <span className="text-xs tabular-nums text-[#8b7355]">
              {progressPercent}%
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Video Player */}
            <div className="w-full overflow-hidden rounded-2xl bg-[#2c231a]">
              {(() => {
                // Convert youtube watch URLs to embed URLs
                let embedUrl = lesson.videoUrl;
                if (lesson.videoUrl?.includes("youtube.com/watch")) {
                  const videoId = new URL(lesson.videoUrl).searchParams.get("v");
                  if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }

                const hasRealVideo = embedUrl &&
                  !embedUrl.includes("placeholder") &&
                  (embedUrl.includes("/embed/") || embedUrl.includes("vimeo.com") || embedUrl.includes("loom.com"));

                return hasRealVideo ? (
                  <iframe
                    src={embedUrl!}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={lesson.title}
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center">
                    <div className="text-center">
                      <PlayCircleIcon className="mx-auto mb-2 h-12 w-12 text-[#c4b5a0]/40" />
                      <p className="text-sm text-[#c4b5a0]">
                        Video wordt binnenkort toegevoegd
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Lesson header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm text-[#8b7355]">
                    {lesson.module.title}
                  </span>
                  {lesson.duration && (
                    <>
                      <span className="text-[#c4b5a0]">·</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(lesson.duration / 60)}m
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
              </div>

              {isCompleted ? (
                <form
                  action={async () => {
                    "use server";
                    await markLessonIncomplete(lesson.id, slug, lessonSlug);
                  }}
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className="shrink-0 border-[#e8dfd0] hover:bg-[#f0e9dd]"
                  >
                    <CheckCircle2Icon className="mr-2 h-4 w-4 text-green-600" />
                    Voltooid
                  </Button>
                </form>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await markLessonComplete(lesson.id, slug, lessonSlug);
                  }}
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className="shrink-0 border-[#e8dfd0] hover:bg-[#f0e9dd]"
                  >
                    <CheckCircle2Icon className="mr-2 h-4 w-4" />
                    Markeer als voltooid
                  </Button>
                </form>
              )}
            </div>

            {/* Tabs: Overzicht, Notities, Extra's, Feedback */}
            <LessonTabs
              lessonId={lesson.id}
              summaryContent={
                <div className="space-y-5">
                  {/* Lesson description / content */}
                  {lesson.content && (
                    <div>
                      <p className="mb-3 text-sm font-semibold text-[#2c231a]">Over deze les</p>
                      <MarkdownRenderer content={lesson.content} />
                    </div>
                  )}

                  {/* Course stats */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[#e8dfd0] pt-4">
                    <div className="flex items-center gap-1.5">
                      <BookOpenIcon className="h-3.5 w-3.5 text-[#8b7355]" />
                      <span className="text-xs text-[#6b5c4c]">
                        {allLessons.length} lessen
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <LayersIcon className="h-3.5 w-3.5 text-[#8b7355]" />
                      <span className="text-xs text-[#6b5c4c]">
                        {course.modules.length} modules
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="h-3.5 w-3.5 text-[#8b7355]" />
                      <span className="text-xs text-[#6b5c4c]">
                        {(() => {
                          const totalMin = allLessons.reduce((acc, l) => acc + (l.duration ?? 0), 0);
                          return totalMin > 0 ? `${Math.round(totalMin / 60)}u totaal` : "—";
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCapIcon className="h-3.5 w-3.5 text-[#8b7355]" />
                      <span className="text-xs text-[#6b5c4c]">Certificaat</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UsersIcon className="h-3.5 w-3.5 text-[#8b7355]" />
                      <span className="text-xs text-[#6b5c4c]">Community</span>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-[#e8dfd0] pt-4">
              {prevLesson ? (
                <Button asChild variant="outline" className="border-[#e8dfd0] hover:bg-[#f0e9dd]">
                  <Link href={`/courses/${slug}/lessons/${prevLesson.slug}`}>
                    <ChevronLeftIcon className="mr-2 h-4 w-4" />
                    {prevLesson.title}
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="ghost" className="text-[#8b7355] hover:text-[#2c231a]">
                  <Link href={`/courses/${slug}`}>
                    <ChevronLeftIcon className="mr-2 h-4 w-4" />
                    Back to Course
                  </Link>
                </Button>
              )}

              {nextLesson ? (
                <Button asChild className="rounded-full bg-[#2c231a] text-[#f5f0e8] hover:bg-[#3d3127]">
                  <Link href={`/courses/${slug}/lessons/${nextLesson.slug}`}>
                    {nextLesson.title}
                    <ChevronRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="border-[#e8dfd0] hover:bg-[#f0e9dd]">
                  <Link href={`/courses/${slug}`}>
                    Course Complete!
                    <ChevronRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
