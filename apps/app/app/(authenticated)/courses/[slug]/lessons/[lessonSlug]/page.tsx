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

        <div className="mx-auto w-full max-w-3xl p-6">
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

          {lesson.content && <MarkdownRenderer content={lesson.content} />}

          {slides && slides.length > 0 && (
            <div className="mt-6">
              <PresentationButton
                slides={slides}
                lessonTitle={lesson.title}
              />
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            {prevLesson ? (
              <Button asChild variant="outline" className="rounded-full">
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
