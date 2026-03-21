import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Progress } from "@repo/design-system/components/ui/progress";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "./components/header";
import { ArrowRightIcon, BookOpenIcon, PlayCircleIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your learning dashboard",
};

const tierVariant = {
  FREE: "secondary",
  MINI: "outline",
  FULL: "default",
} as const;

const App = async () => {
  const { userId, orgId } = await auth();

  if (!orgId || !userId) {
    notFound();
  }

  // Fetch enrollments with course + progress data
  const enrollments = await database.enrollment.findMany({
    where: {
      userId,
      status: { in: ["ACTIVE", "COMPLETED"] },
    },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
                include: {
                  progress: {
                    where: { userId },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  // Build progress data per course
  const coursesWithProgress = enrollments.map((enrollment) => {
    const allLessons = enrollment.course.modules.flatMap((m) => m.lessons);
    const completedCount = allLessons.filter((l) =>
      l.progress.some((p) => p.completed)
    ).length;
    const totalCount = allLessons.length;
    const percent =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const nextLesson = allLessons.find((l) => !l.progress.some((p) => p.completed));

    return {
      enrollment,
      course: enrollment.course,
      completedCount,
      totalCount,
      percent,
      nextLesson,
    };
  });

  // "Continue where you left off"
  const continueItem = coursesWithProgress.find(
    (c) => c.nextLesson && c.percent < 100
  );

  // Discovery courses not yet enrolled in
  const enrolledCourseIds = enrollments.map((e) => e.courseId);
  const discoveryCourses = await database.course.findMany({
    where: {
      published: true,
      id: { notIn: enrolledCourseIds.length > 0 ? enrolledCourseIds : [""] },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header page="Dashboard" pages={["Home"]} />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        {/* Continue Learning Banner */}
        {continueItem && (
          <div>
            <h2 className="mb-3 text-lg font-semibold">Continue Learning</h2>
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="flex items-center justify-between gap-4 p-6">
                <div className="min-w-0 flex-1">
                  <p className="text-primary-foreground/70 mb-1 text-sm">
                    {continueItem.course.title}
                  </p>
                  <p className="truncate font-semibold">
                    {continueItem.nextLesson?.title}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress
                      value={continueItem.percent}
                      className="bg-primary-foreground/20 flex-1 [&>div]:bg-primary-foreground"
                    />
                    <span className="text-primary-foreground/70 text-sm tabular-nums">
                      {continueItem.percent}%
                    </span>
                  </div>
                </div>
                <Button asChild variant="secondary" className="shrink-0">
                  <Link
                    href={`/courses/${continueItem.course.slug}/lessons/${continueItem.nextLesson?.slug}`}
                  >
                    <PlayCircleIcon className="mr-2 h-4 w-4" />
                    Resume
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Courses */}
        {coursesWithProgress.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Courses</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/courses">
                  Browse catalog
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coursesWithProgress.map(
                ({ course, percent, completedCount, totalCount, nextLesson }) => (
                  <Link
                    key={course.id}
                    href={
                      nextLesson && percent < 100
                        ? `/courses/${course.slug}/lessons/${nextLesson.slug}`
                        : `/courses/${course.slug}`
                    }
                    className="group"
                  >
                    <Card className="h-full transition-shadow group-hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="mb-1 flex items-center justify-between">
                          <Badge variant={tierVariant[course.tier]}>
                            {course.tier === "FREE"
                              ? "Free"
                              : course.tier === "MINI"
                                ? "Mini"
                                : "Full"}
                          </Badge>
                          {percent === 100 && (
                            <Badge variant="secondary" className="text-green-600">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="line-clamp-1 text-base">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {completedCount}/{totalCount} lessons
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Progress value={percent} className="h-1.5" />
                      </CardContent>
                    </Card>
                  </Link>
                )
              )}
            </div>
          </div>
        )}

        {/* Discover Courses */}
        {discoveryCourses.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {coursesWithProgress.length === 0 ? "Start Learning" : "Explore More"}
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/courses">
                  View all
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {discoveryCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    <div className="bg-muted aspect-video rounded-t-lg" />
                    <CardHeader>
                      <Badge variant={tierVariant[course.tier]} className="w-fit">
                        {course.tier === "FREE"
                          ? "Free"
                          : course.tier === "MINI"
                            ? "Mini"
                            : "Full"}
                      </Badge>
                      <CardTitle className="line-clamp-2 text-base">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {coursesWithProgress.length === 0 && discoveryCourses.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <div>
              <BookOpenIcon className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
              <p className="text-lg font-medium">No courses available yet</p>
              <p className="text-muted-foreground text-sm">
                Check back soon for new content.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
