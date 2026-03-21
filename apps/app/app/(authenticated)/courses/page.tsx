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
  });

  return (
    <>
      <Header page="Catalog" pages={["Courses"]} />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Course Catalog</h2>
          <p className="text-muted-foreground">
            {courses.length} course{courses.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-8 text-center">
            <div>
              <p className="text-lg font-medium">No courses available yet</p>
              <p className="text-muted-foreground text-sm">
                Check back soon for new content.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <div className="bg-muted aspect-video rounded-t-lg" />
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
