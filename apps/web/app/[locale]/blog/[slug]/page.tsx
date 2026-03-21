import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NavBar } from "../../(home)/components/nav-bar";
import { SiteFooter } from "../../(home)/components/site-footer";
import { blogPosts, getPostBySlug } from "../data";

interface BlogPostProperties {
  readonly params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: BlogPostProperties): Promise<Metadata> => {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post.title,
    description: post.description,
  });
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  return blogPosts.map(({ slug }) => ({ slug }));
};

const BlogPost = async ({ params }: BlogPostProperties) => {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[linear-gradient(180deg,#d6c4b4_0%,#eee5da_18%,#f7f2ea_42%,#fbf8f3_100%)] px-4 pt-28 pb-16 text-[#2c231a] sm:px-6 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[#d7c7b4]/70 bg-white/70 px-4 py-2 text-sm text-[#6b5c4c] backdrop-blur-sm transition-colors hover:text-[#2c231a]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to blog
          </Link>

          <article className="mt-6 overflow-hidden rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 shadow-sm sm:rounded-[3rem] sm:p-10 md:p-14">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#8b7355]">
              <span>{post.category}</span>
              <span>{post.date}</span>
              <span>{post.readingTime}</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#6b5c4c]/80 md:text-lg">
              {post.description}
            </p>
            <div className="mt-8 h-72 rounded-[2rem] border border-[#e8dfd0]/60 bg-[radial-gradient(circle_at_top_left,#d8c2aa,transparent_35%),linear-gradient(135deg,#f8f2ea,#eadac6,#d9c3a6)] sm:h-96" />

            <div className="mt-10 max-w-3xl space-y-6 text-base leading-8 text-[#4f4337] md:text-lg">
              {post.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default BlogPost;
