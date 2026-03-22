export const dynamic = "force-dynamic";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Slide } from "@repo/database";
import { Button } from "@repo/design-system/components/ui/button";
import { Separator } from "@repo/design-system/components/ui/separator";
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
  LayersIcon,
  PlayCircleIcon,
  SlidersHorizontalIcon,
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

      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-6 pt-6">
          {/* 1. Large lesson title */}
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {lesson.title}
          </h1>

          {/* 2. Stats row below title */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <LayersIcon className="h-4 w-4 text-[#c4956a]" />
              {lesson.module.title}
            </span>
            {lesson.duration && (
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-[#c4956a]" />
                {lesson.duration} min
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <PlayCircleIcon className="h-4 w-4 text-[#c4956a]" />
              Les {currentIndex + 1} van {allLessons.length}
            </span>
          </div>
        </div>

        {/* 3. Video player - large, with rounded corners */}
        {lesson.videoUrl && (
          <div className="mx-auto mt-5 w-full max-w-4xl px-6">
            <div className="overflow-hidden rounded-xl bg-[#1a1510]">
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

        {/* No video: show visual header */}
        {!lesson.videoUrl && (
          <div className="mx-auto mt-5 w-full max-w-4xl px-6">
            <div className="flex items-center gap-5 rounded-xl bg-[#2c231a] px-8 py-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#3d3128]">
                <BookOpenIcon className="h-8 w-8 text-[#c4956a]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#c4956a]">
                  Lesmateriaal
                </p>
                <p className="mt-1 text-sm text-[#c4b5a0]">
                  Deze les bevat tekstuele content en oefeningen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Action bar below video */}
        <div className="mx-auto mt-4 w-full max-w-4xl px-6">
          <div className="flex items-center justify-between">
            {/* Left: slides button */}
            <div className="flex items-center gap-2">
              {slides && slides.length > 0 && (
                <PresentationButton
                  slides={slides}
                  lessonTitle={lesson.title}
                />
              )}
            </div>

            {/* Right: completion toggle */}
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
        </div>

        {/* Divider */}
        <div className="mx-auto mt-4 w-full max-w-4xl px-6">
          <Separator />
        </div>

        {/* 5. Content area */}
        <div className="mx-auto w-full max-w-4xl px-6 py-6">
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
