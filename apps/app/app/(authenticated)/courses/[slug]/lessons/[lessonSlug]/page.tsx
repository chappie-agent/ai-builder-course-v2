import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Progress } from "@repo/design-system/components/ui/progress";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { markLessonComplete } from "@/app/actions/course";
import { Header } from "../../../../components/header";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
  });
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
  });

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
  });

  if (!lesson) {
    notFound();
  }

  const isCompleted = lesson.progress.some((p) => p.completed);

  // Build flat ordered lesson list for prev/next navigation
  const allLessons = lesson.module.course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id }))
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
  });
  const completedIds = new Set(progressIds.map((p) => p.lessonId));
  const progressPercent =
    allLessons.length > 0
      ? Math.round((completedIds.size / allLessons.length) * 100)
      : 0;

  const course = lesson.module.course;

  return (
    <>
      <Header page={lesson.title} pages={["Courses", course.title]} />
      <div className="flex flex-1 flex-col gap-0">
        {/* Progress bar */}
        <div className="flex items-center gap-3 border-b border-[#e8dfd0] bg-[#faf7f2] px-4 py-2">
          <span className="text-xs text-[#8b7355]">
            {completedIds.size}/{allLessons.length} lessons
          </span>
          <Progress value={progressPercent} className="flex-1" />
          <span className="text-xs tabular-nums text-[#8b7355]">
            {progressPercent}%
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-6 p-4">
          {/* Video Player */}
          <div className="reveal-up w-full overflow-hidden rounded-2xl bg-[#2c231a]">
            {lesson.videoUrl ? (
              <iframe
                src={lesson.videoUrl}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            ) : (
              <div className="flex aspect-video items-center justify-center">
                <p className="text-sm text-[#c4b5a0]">
                  No video available for this lesson
                </p>
              </div>
            )}
          </div>

          {/* Lesson header */}
          <div className="reveal-up-delay flex items-start justify-between gap-4">
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
              <Badge variant="secondary" className="shrink-0 border-[#e8dfd0]">
                <CheckCircle2Icon className="mr-1 h-3 w-3 text-green-600" />
                Completed
              </Badge>
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
                  Mark as Complete
                </Button>
              </form>
            )}
          </div>

          {/* Lesson Content */}
          {lesson.content && (
            <div className="reveal-up-delay-2 prose max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {lesson.content}
              </div>
            </div>
          )}

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
    </>
  );
};

export default LessonPage;
