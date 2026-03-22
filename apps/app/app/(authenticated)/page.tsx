export const dynamic = "force-dynamic";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design-system/components/ui/collapsible";
import { Progress } from "@repo/design-system/components/ui/progress";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "./components/header";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleIcon,
  LockIcon,
  PlayCircleIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Curriculum",
  description: "Jouw leertraject",
};

const CurriculumPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const course = await database.course
    .findFirst({
      where: { published: true },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                progress: {
                  where: { userId },
                  select: { completed: true },
                },
              },
            },
          },
        },
      },
    })
    .catch((e) => {
      console.error("DB_QUERY_ERROR:", e);
      return null;
    });

  if (!course) {
    return (
      <>
        <Header page="Curriculum" pages={[]} />
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="text-center">
            <BookOpenIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium">Geen cursussen beschikbaar</p>
            <p className="text-sm text-muted-foreground">Kom snel terug voor nieuwe content.</p>
          </div>
        </div>
      </>
    );
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedLessonIds = new Set(
    allLessons.filter((l) => l.progress.some((p) => p.completed)).map((l) => l.id)
  );
  const totalCount = allLessons.length;
  const completedCount = completedLessonIds.size;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextLesson = allLessons.find((l) => !completedLessonIds.has(l.id));
  const totalMinutes = allLessons.reduce((sum, l) => sum + (l.duration ?? 0), 0);

  return (
    <>
      <Header page="Curriculum" pages={[]} />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {course.modules.length} modules &middot; {totalCount} lessen &middot; &plusmn;{totalMinutes} min
            </p>
          </div>
          {nextLesson && (
            <Button asChild className="shrink-0 rounded-full">
              <Link href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}>
                <PlayCircleIcon className="mr-2 h-4 w-4" />
                Ga verder
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Progress value={progressPercent} className="flex-1 h-2" />
          <span className="text-sm tabular-nums text-muted-foreground font-mono">
            {progressPercent}%
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {course.modules.map((module) => {
            const moduleLessons = module.lessons;
            const moduleCompleted = moduleLessons.filter((l) =>
              completedLessonIds.has(l.id)
            ).length;
            const isModuleComplete = moduleCompleted === moduleLessons.length && moduleLessons.length > 0;
            const moduleProgress = moduleLessons.length > 0
              ? Math.round((moduleCompleted / moduleLessons.length) * 100)
              : 0;
            const isLocked = false;
            const hasInProgress = !isModuleComplete && moduleCompleted > 0;

            return (
              <Collapsible key={module.id} defaultOpen={!isModuleComplete && !isLocked}>
                <div
                  className={`rounded-xl border bg-card p-4 ${
                    isLocked
                      ? "opacity-50"
                      : hasInProgress
                        ? "border-muted-foreground"
                        : "border-border"
                  }`}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between gap-3" disabled={isLocked}>
                    <div className="flex items-center gap-3 min-w-0">
                      {isLocked ? (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-base">
                          <LockIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ) : isModuleComplete ? (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-primary-foreground text-base shadow-md" style={{ background: "linear-gradient(135deg, #8b7355, #a08b6e)" }}>
                          {module.icon ?? "✓"}
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground text-base text-muted-foreground/50">
                          {module.icon ?? `${moduleProgress}%`}
                        </div>
                      )}
                      <div className="min-w-0 text-left">
                        <p className="font-semibold text-sm truncate">
                          Module {module.order}: {module.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isLocked
                            ? `${moduleLessons.length} lessen · Upgrade voor toegang`
                            : isModuleComplete
                              ? `${moduleLessons.length} lessen · Voltooid`
                              : `${moduleCompleted} van ${moduleLessons.length} lessen`}
                        </p>
                      </div>
                    </div>
                    {!isLocked && (
                      <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>

                  {!isLocked && (
                    <CollapsibleContent>
                      <div className="mt-3 border-t border-border pt-3 flex flex-col gap-1">
                        {moduleLessons.map((lesson) => {
                          const isComplete = completedLessonIds.has(lesson.id);
                          const isCurrent = nextLesson?.id === lesson.id;

                          return (
                            <Link
                              key={lesson.id}
                              href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary ${
                                isCurrent ? "bg-secondary font-medium" : ""
                              }`}
                            >
                              {isComplete ? (
                                <CheckCircle2Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                              ) : isCurrent ? (
                                <CircleIcon className="h-4 w-4 shrink-0 fill-foreground text-foreground" />
                              ) : (
                                <CircleIcon className="h-4 w-4 shrink-0 text-border" />
                              )}
                              <span className="flex-1 truncate">{lesson.title}</span>
                              {lesson.duration && (
                                <span className="text-xs tabular-nums text-muted-foreground font-mono">
                                  {lesson.duration} min
                                </span>
                              )}
                              {isCurrent && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  Huidige les
                                </Badge>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  )}
                </div>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CurriculumPage;
