export const dynamic = 'force-dynamic';

import { database } from "@repo/database";
import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/header";

export const metadata: Metadata = {
  title: "Course Catalog",
  description: "Browse all available courses",
};

const tierVariant = {
  FREE: "secondary",
  MINI: "outline",
  FULL: "default",
} as const;

const CoursesPage = async () => {
  const courses = await database.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { modules: true },
      },
    },
  }).catch(() => []);

  return (
    <>
      <Header page="Catalog" pages={["Courses"]} />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="reveal-up">
          <h2 className="text-2xl font-semibold tracking-tight">Course Catalog</h2>
          <p className="text-muted-foreground">
            {courses.length} course{courses.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="reveal-up-delay flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[#e8dfd0] p-8 text-center">
            <div>
              <p className="text-lg font-medium">No courses available yet</p>
              <p className="text-muted-foreground text-sm">
                Check back soon for new content.
              </p>
            </div>
          </div>
        ) : (
          <div className="reveal-up-delay grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group"
              >
                <Card className="h-full border-[#e8dfd0] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_rgba(112,83,55,0.10)]">
                  <div className="aspect-video rounded-t-lg bg-gradient-to-br from-[#f5f0e8] via-[#ede6da] to-[#e8dfd0]" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={tierVariant[course.tier]}>
                        {course.tier === "FREE"
                          ? "Free"
                          : course.tier === "MINI"
                            ? "Mini"
                            : "Full"}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {course._count.modules} module
                        {course._count.modules !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CoursesPage;
