export const dynamic = 'force-dynamic';

import { auth } from "@repo/auth/server";
import { UserButton } from "@repo/auth/client";
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
  CodeIcon,
  ImageIcon,
  LayersIcon,
  SettingsIcon,
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
    <div className="flex min-h-screen flex-col bg-[#faf7f2]">
      {/* ─── Top Navigation ─── */}
      <header className="sticky top-0 z-30 border-b border-[#e8dfd0] bg-[#faf7f2]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          {/* Left: Logo + nav */}
          <div className="flex items-center gap-6">
            <Link href="/courses" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2c231a]">
                <SparklesIcon className="h-4 w-4 text-[#c4956a]" />
              </div>
              <span className="text-sm font-semibold text-[#2c231a]">AI Builder</span>
            </Link>
            <nav className="flex items-center gap-1">
              <span className="rounded-md bg-[#2c231a]/5 px-3 py-1.5 text-sm font-medium text-[#2c231a]">
                Courses
              </span>
            </nav>
          </div>

          {/* Right: Settings + User */}
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#8b7355] transition-colors hover:bg-[#e8dfd0] hover:text-[#2c231a]"
            >
              <SettingsIcon className="h-4 w-4" />
            </Link>
            <UserButton
              appearance={{
                elements: {
                  rootBox: "flex",
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* ─── Page Content ─── */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#2c231a]">Courses</h1>
          <p className="mt-1 text-sm text-[#8b7355]">
            Ontdek alle beschikbare cursussen en start met leren.
          </p>
        </div>

        {/* Course Grid */}
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
                {/* Thumbnail with title overlay */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#2c231a] via-[#3d3127] to-[#4a3f33]" />
                  )}

                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/10" />

                  {/* Title at top */}
                  <div className="absolute top-0 left-0 right-0 p-3">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Badge className="border-0 bg-white/20 text-[10px] text-white backdrop-blur-sm px-1.5 py-0.5">
                        {course.tier === "FREE" ? "Free" : course.tier === "MINI" ? "Mini" : "Full"}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-white drop-shadow-sm line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  {/* Stats at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-2 text-[10px] text-white/70">
                      <span className="flex items-center gap-0.5">
                        <LayersIcon className="h-3 w-3" />
                        {totalModules} module{totalModules !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <BookOpenIcon className="h-3 w-3" />
                        {totalLessons} lessen
                      </span>
                      {totalMinutes > 0 && (
                        <span className="flex items-center gap-0.5">
                          <ClockIcon className="h-3 w-3" />
                          {Math.round(totalMinutes / 60)}h
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar at very bottom */}
                  {isEnrolled && progressPercent > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                      <div
                        className="h-full bg-[#c4956a] transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Description + status below thumbnail */}
                <div className="flex flex-1 flex-col gap-2 p-3">
                  {course.description && (
                    <p className="line-clamp-2 text-xs text-[#8b7355]">
                      {course.description}
                    </p>
                  )}

                  {/* Status */}
                  <div className="mt-auto">
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
                {/* Thumbnail with title overlay */}
                <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${course.gradient}`}>
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, ${course.accentColor}40 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${course.accentColor}30 0%, transparent 50%)`,
                  }} />

                  {/* Gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />

                  {/* Title at top */}
                  <div className="absolute top-0 left-0 right-0 p-3">
                    <div className="mb-1.5">
                      <Badge className="border-0 bg-[#c4956a]/80 text-[10px] text-white px-1.5 py-0.5">
                        Coming Soon
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-white drop-shadow-sm line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  {/* Stats at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-2 text-[10px] text-white/70">
                      <span className="flex items-center gap-0.5">
                        <LayersIcon className="h-3 w-3" />
                        {course.modules} modules
                      </span>
                      <span className="flex items-center gap-0.5">
                        <BookOpenIcon className="h-3 w-3" />
                        {course.lessons} lessen
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description + status below */}
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <p className="line-clamp-2 text-xs text-[#8b7355]">
                    {course.description}
                  </p>
                  <div className="mt-auto">
                    <span className="text-[10px] font-medium text-[#c4956a]">
                      Binnenkort beschikbaar
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default CoursesPage;
