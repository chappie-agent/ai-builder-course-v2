import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/design-system/components/ui/breadcrumb";
import { Separator } from "@repo/design-system/components/ui/separator";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import { Fragment, type ReactNode } from "react";

interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface HeaderProps {
  children?: ReactNode;
  page: string;
  pages: (string | BreadcrumbEntry)[];
}

export const Header = ({ pages, page, children }: HeaderProps) => (
  <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card">
    <div className="flex items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-2 h-4" orientation="vertical" />
      <Breadcrumb>
        <BreadcrumbList>
          {pages.map((entry, index) => {
            const label = typeof entry === "string" ? entry : entry.label;
            const href = typeof entry === "string" ? undefined : entry.href;
            return (
              <Fragment key={label}>
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem className="hidden md:block">
                  {href ? (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    {children}
  </header>
);
