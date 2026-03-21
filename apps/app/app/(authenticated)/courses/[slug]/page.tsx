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
import { Header } from "../../components/header";
import { CheckCircle2Icon, CircleIcon, PlayCircleIcon } from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await database.course.findUnique({ where: { slug } }).catch(() => null);
  return {
    title: course?.title ?? "Course",
    description: course?.description,
  };
}

const tierVariant = {
  FREE: "secondary",
  MINI: "outline",
  FULL: "default",
} as const;

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
  }).catch(() => null);

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
    }).catch(() => []);
    completedLessonIds = new Set(progress.map((p) => p.lessonId));
  }

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const completedCount = completedLessonIds.size;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const firstLesson = course.modules[0]?.lessons[0];

  return (
    <>
      <Header page={course.title} pages={["Courses"]} />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        {/* Course Hero */}
        <div className="reveal-up overflow-hidden rounded-2xl bg-[#2c231a] p-6 sm:p-8">
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
                  <Link href={firstLesson ? `/courses/${slug}/lessons/${firstLesson.slug}` : "#"}>
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
        <div className="reveal-up-delay">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Curriculum</h2>
          <div className="space-y-3">
            {course.modules.map((module) => (
              <Card key={module.id} className="border-[#e8dfd0]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{module.title}</CardTitle>
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
                          {isEnrolled ? (
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
                            <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm">
                              <CircleIcon className="h-4 w-4 shrink-0 text-[#c4b5a0]" />
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailPage;
