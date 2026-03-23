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
  BotIcon,
  CheckCircle2Icon,
  ClockIcon,
  ImageIcon,
  LayersIcon,
  SparklesIcon,
  VideoIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Courses",
  description: "Ontdek alle beschikbare cursussen",
};

// Coming soon courses (static, not from DB)
const comingSoonCourses = [
  {
    id: "coming-soon-media",
    title: "AI Media Creation",
    description: "Leer AI-gegenereerde afbeeldingen en video's maken voor je projecten en content.",
    icon: ImageIcon,
    secondaryIcon: VideoIcon,
    gradient: "from-[#4a3528] via-[#5c432e] to-[#3d2b1e]",
    accentColor: "#c4956a",
    modules: 4,
    lessons: 16,
  },
  {
    id: "coming-soon-agents",
    title: "AI Agents & Skills",
    description: "Bouw je eigen AI-agents en custom skills voor Claude Code en Cowork.",
    icon: BotIcon,
    secondaryIcon: WrenchIcon,
    gradient: "from-[#2c2c1a] via-[#3d3b22] to-[#2a281a]",
    accentColor: "#a0956a",
    modules: 5,
    lessons: 20,
  },
];

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Real courses from DB */}
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
                className="group flex flex-col overflow-hidden rounded-xl border border-[#e8dfd0] bg-white transition-all duration-200 hover:border-[#c4b5a0] hover:shadow-md hover:shadow-[#2c231a]/5"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2c231a] via-[#3d3127] to-[#4a3f33]">
                      <div className="relative">
                        <ZapIcon className="h-8 w-8 text-[#c4956a]/50" />
                        <SparklesIcon className="absolute -top-2 -right-3 h-4 w-4 text-[#c4b5a0]/40" />
                      </div>
                    </div>
                  )}

                  {/* Tier badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="border-0 bg-black/50 text-[10px] text-white backdrop-blur-sm px-1.5 py-0.5">
                      {course.tier === "FREE" ? "Free" : course.tier === "MINI" ? "Mini" : "Full"}
                    </Badge>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/10" />

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
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="text-sm font-semibold text-[#2c231a] group-hover:text-[#8b7355] transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-[#8b7355]">
                      {course.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-[#8b7355]/60">
                    <span className="flex items-center gap-0.5">
                      <LayersIcon className="h-3 w-3" />
                      {totalModules}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <BookOpenIcon className="h-3 w-3" />
                      {totalLessons}
                    </span>
                    {totalMinutes > 0 && (
                      <span className="flex items-center gap-0.5">
                        <ClockIcon className="h-3 w-3" />
                        {Math.round(totalMinutes / 60)}h
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="mt-auto pt-2">
                    {isEnrolled ? (
                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <div className="flex items-center gap-1 text-[10px] font-medium text-green-600">
                            <CheckCircle2Icon className="h-3 w-3" />
                            Voltooid
                          </div>
                        ) : progressPercent > 0 ? (
                          <>
                            <Progress
                              value={progressPercent}
                              className="flex-1 h-1 bg-[#e8dfd0] [&>div]:bg-[#c4956a]"
                            />
                            <span className="text-[10px] tabular-nums text-[#8b7355]">
                              {progressPercent}%
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] font-medium text-[#8b7355]">
                            Start cursus →
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-medium text-[#c4956a]">
                        Bekijk cursus →
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Coming Soon courses */}
          {comingSoonCourses.map((course) => {
            const Icon = course.icon;
            const SecondaryIcon = course.secondaryIcon;

            return (
              <div
                key={course.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#e8dfd0] bg-white opacity-75 transition-all duration-200 hover:opacity-90"
              >
                {/* Thumbnail */}
                <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${course.gradient}`}>
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="relative">
                      <Icon className="h-8 w-8" style={{ color: `${course.accentColor}80` }} />
                      <SecondaryIcon
                        className="absolute -top-1.5 -right-3 h-4 w-4"
                        style={{ color: `${course.accentColor}50` }}
                      />
                    </div>
                  </div>

                  {/* Coming soon badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="border-0 bg-[#c4956a]/80 text-[10px] text-white px-1.5 py-0.5">
                      Coming Soon
                    </Badge>
                  </div>

                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, ${course.accentColor}40 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${course.accentColor}30 0%, transparent 50%)`,
                  }} />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="text-sm font-semibold text-[#2c231a] line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="mt-0.5 line-clamp-2 text-xs text-[#8b7355]">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-[#8b7355]/60">
                    <span className="flex items-center gap-0.5">
                      <LayersIcon className="h-3 w-3" />
                      {course.modules}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <BookOpenIcon className="h-3 w-3" />
                      {course.lessons}
                    </span>
                  </div>

                  {/* Coming soon label */}
                  <div className="mt-auto pt-2">
                    <span className="text-[10px] font-medium text-[#c4956a]">
                      Binnenkort beschikbaar
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
