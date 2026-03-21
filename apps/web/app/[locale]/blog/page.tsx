import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "../(home)/components/nav-bar";
import { SiteFooter } from "../(home)/components/site-footer";
import { blogPosts } from "./data";

interface BlogProps {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: BlogProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.blog.meta);
};

const BlogIndex = async () => {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[linear-gradient(180deg,#d6c4b4_0%,#eee5da_18%,#f7f2ea_42%,#fbf8f3_100%)] px-4 pt-28 pb-16 text-[#2c231a] sm:px-6 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <section className="overflow-hidden rounded-[2rem] border border-[#e8dfd0]/60 bg-gradient-to-br from-[#f5f0e8] via-[#ede6da] to-[#e8dfd0] px-6 py-16 shadow-sm sm:rounded-[3rem] sm:px-12 md:px-16 md:py-20 lg:px-24">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#8b7355]">
              Journal
            </p>
            <h1 className="max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Notes on building with AI
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6b5c4c]/80 md:text-lg">
              Practical thoughts on AI-assisted development, OpenClaw, agents,
              workflows, automation, and shipping products with more clarity.
            </p>
          </section>

          <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group overflow-hidden rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-8 ${index === 0 ? "md:col-span-2 xl:col-span-2" : ""}`}
              >
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-[#8b7355]">
                  <span>{post.category}</span>
                  <span>{post.readingTime}</span>
                </div>
                <div className="mt-6 h-56 rounded-[1.5rem] border border-[#e8dfd0]/60 bg-[radial-gradient(circle_at_top_left,#d8c2aa,transparent_38%),linear-gradient(135deg,#f6efe6,#eee0cf,#e0cfbc)]" />
                <p className="mt-6 text-sm text-[#8b7355]">{post.date}</p>
                <h2 className="mt-2 text-2xl font-medium tracking-tight text-[#2c231a] transition-colors group-hover:text-[#5d4a38] sm:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6b5c4c]/75 sm:text-base">
                  {post.description}
                </p>
              </Link>
            ))}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default BlogIndex;
