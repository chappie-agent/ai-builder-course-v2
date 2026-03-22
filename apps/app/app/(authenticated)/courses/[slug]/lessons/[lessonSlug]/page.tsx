export const dynamic = "force-dynamic";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Slide } from "@repo/database";
import { Button } from "@repo/design-system/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { markLessonComplete, markLessonIncomplete } from "@/app/actions/course";
import { Header } from "../../../../components/header";
import { MarkdownRenderer } from "./components/markdown-renderer";
import { PresentationButton } from "./components/presentation-modal";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  PlayCircleIcon,
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

  const allLessons = lesson.module.course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

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
        {/* Video section - prominent, full width */}
        {lesson.videoUrl && (
          <div className="w-full bg-[#1a1510]">
            <div className="relative">
              <iframe
                src={lesson.videoUrl}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          </div>
        )}

        {/* No video: show a visual header instead */}
        {!lesson.videoUrl && (
          <div className="w-full bg-[#2c231a] px-6 py-12">
            <div className="mx-auto flex max-w-3xl items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3d3128]">
                <BookOpenIcon className="h-7 w-7 text-[#c4956a]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#c4956a]">
                  {lesson.module.title}
                </p>
                <h1 className="text-xl font-semibold text-[#f5f0e8]">
                  {lesson.title}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="mx-auto w-full max-w-3xl px-6 py-6">
          {/* Lesson info bar */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="flex flex-col gap-1">
              {lesson.videoUrl && (
                <h1 className="text-xl font-semibold tracking-tight">{lesson.title}</h1>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpenIcon className="h-3.5 w-3.5" />
                  {lesson.module.title}
                </span>
                {lesson.duration && (
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-3.5 w-3.5" />
                    <span className="font-mono">{lesson.duration} min</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <PlayCircleIcon className="h-3.5 w-3.5" />
                  Les {currentIndex + 1} van {allLessons.length}
                </span>
              </div>
            </div>

            {/* Completion toggle */}
            {isCompleted ? (
              <form
                action={async () => {
                  "use server";
                  await markLessonIncomplete(lesson.id, slug, lessonSlug);
                }}
              >
                <Button type="submit" variant="secondary" className="shrink-0 rounded-full">
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
                <Button type="submit" className="shrink-0 rounded-full">
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                  Markeer als voltooid
                </Button>
              </form>
            )}
          </div>

          {/* Presentation slides button */}
          {slides && slides.length > 0 && (
            <div className="mb-6">
              <PresentationButton
                slides={slides}
                lessonTitle={lesson.title}
              />
            </div>
          )}

          {/* Lesson content */}
          {lesson.content && <MarkdownRenderer content={lesson.content} />}

          {/* Previous / Next navigation */}
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            {prevLesson ? (
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/courses/${slug}/lessons/${prevLesson.slug}`}>
                  <ChevronLeftIcon className="mr-2 h-4 w-4" />
                  Vorige les
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" className="text-muted-foreground">
                <Link href="/">
                  <ChevronLeftIcon className="mr-2 h-4 w-4" />
                  Curriculum
                </Link>
              </Button>
            )}

            {nextLesson ? (
              <Button asChild className="rounded-full">
                <Link href={`/courses/${slug}/lessons/${nextLesson.slug}`}>
                  Volgende les
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
