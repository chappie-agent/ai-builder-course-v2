"use server";

import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  await database.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, status: "ACTIVE" },
    update: { status: "ACTIVE" },
  });

  const course = await database.course.findUnique({
    where: { id: courseId },
    select: { slug: true },
  });

  if (course) {
    revalidatePath(`/courses/${course.slug}`);
  }
  revalidatePath("/");
}

export async function markLessonComplete(lessonId: string, courseSlug: string, lessonSlug: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  await database.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, completed: true, completedAt: new Date() },
    update: { completed: true, completedAt: new Date() },
  });

  revalidatePath(`/courses/${courseSlug}/lessons/${lessonSlug}`);
  revalidatePath("/");
}

export async function getCourseProgress(courseId: string): Promise<number> {
  const { userId } = await auth();

  if (!userId) {
    return 0;
  }

  const course = await database.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              progress: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return 0;
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  if (allLessons.length === 0) {
    return 0;
  }

  const completed = allLessons.filter((l) =>
    l.progress.some((p) => p.completed)
  ).length;

  return Math.round((completed / allLessons.length) * 100);
}
