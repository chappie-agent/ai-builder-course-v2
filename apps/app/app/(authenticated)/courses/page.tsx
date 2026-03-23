export const dynamic = 'force-dynamic';

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Progress } from "@repo/design-system/components/ui/progress";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ClockIcon,
  GraduationCapIcon,
  LayersIcon,
  PlayCircleIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Courses",
  description: "Ontdek alle beschikbare cursussen",
};

const CoursesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const courses = await database.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, duration: true },
          },
        },
      },
      enrollments: {
        where: { userId },
        select: { status: true },
      },
    },
  }).catch((e) => { console.error('DB_QUERY_ERROR:', e); return []; });

  // Get progress for enrolled courses
  const allLessonIds = courses.flatMap((c) =>
    c.modules.flatMap((m) => m.lessons.map((l) => l.id))
  );
  const completedProgress = allLessonIds.length > 0
    ? await database.lessonProgress.findMany({
        where: { userId, lessonId: { in: allLessonIds }, completed: true },
        select: { lessonId: true },
      }).catch(() => [])
    : [];
  const completedSet = new Set(completedProgress.map((p) => p.lessonId));

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="border-b border-[#e8dfd0] bg-[#faf7f2] px-6 py-5">
        <h1 className="text-2xl font-semibold tracking-tight text-[#2c231a]">Courses</h1>
        <p className="mt-1 text-sm text-[#8b7355]">
          Ontdek alle beschikbare cursussen en start met leren.
        </p>
      </div>

      {/* Course Grid */}
      <div className="flex-1 p-6">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpenIcon className="mb-3 h-10 w-10 text-[#c4b5a0]" />
            <p className="text-lg font-medium text-[#2c231a]">Geen cursussen beschikbaar</p>
            <p className="text-sm text-[#8b7355]">Kom snel terug voor nieuwe content.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              const totalModules = course.modules.length;
              const totalMinutes = course.modules.reduce(
                (acc, m) => acc + m.lessons.reduce((a, l) => a + (l.duration ?? 0), 0), 0
              );
              const isEnrolled = course.enrollments.some(
                (e) => e.status === "ACTIVE" || e.status === "COMPLETED"
              );
              const courseLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
              const courseCompleted = courseLessonIds.filter((id) => completedSet.has(id)).length;
              const progressPercent = totalLessons > 0
                ? Math.round((courseCompleted / totalLessons) * 100)
                : 0;
              const isComplete = progressPercent === 100 && totalLessons > 0;

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#e8dfd0] bg-white transition-all duration-200 hover:border-[#c4b5a0] hover:shadow-lg hover:shadow-[#2c231a]/5"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-[#2c231a]">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2c231a] to-[#4a3f33]">
                        <GraduationCapIcon className="h-12 w-12 text-[#c4b5a0]/40" />
                      </div>
                    )}

                    {/* Tier badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="border-0 bg-black/60 text-white backdrop-blur-sm">
                        {course.tier === "FREE" ? "Free" : course.tier === "MINI" ? "Mini" : "Full"}
                      </Badge>
                    </div>

                    {/* Play overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/20">
                      <div className="scale-0 rounded-full bg-white/90 p-3 shadow-lg transition-transform duration-200 group-hover:scale-100">
                        <PlayCircleIcon className="h-8 w-8 text-[#2c231a]" />
                      </div>
                    </div>

                    {/* Progress bar at bottom of thumbnail */}
                    {isEnrolled && progressPercent > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                        <div
                          className="h-full bg-[#c4956a] transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold text-[#2c231a] group-hover:text-[#8b7355] transition-colors">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-[#8b7355]">
                        {course.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="mt-3 flex items-center gap-3 text-xs text-[#8b7355]/70">
                      <span className="flex items-center gap-1">
                        <LayersIcon className="h-3.5 w-3.5" />
                        {totalModules} module{totalModules !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpenIcon className="h-3.5 w-3.5" />
                        {totalLessons} lessen
                      </span>
                      {totalMinutes > 0 && (
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {Math.round(totalMinutes / 60)}h
                        </span>
                      )}
                    </div>

                    {/* Enrollment status / progress */}
                    <div className="mt-auto pt-3">
                      {isEnrolled ? (
                        <div className="flex items-center gap-2">
                          {isComplete ? (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                              <CheckCircle2Icon className="h-3.5 w-3.5" />
                              Voltooid
                            </div>
                          ) : (
                            <>
                              <Progress
                                value={progressPercent}
                                className="flex-1 h-1.5 bg-[#e8dfd0] [&>div]:bg-[#c4956a]"
                              />
                              <span className="text-xs tabular-nums text-[#8b7355]">
                                {progressPercent}%
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-[#8b7355]">
                          Start cursus →
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
