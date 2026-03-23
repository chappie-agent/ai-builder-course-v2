import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { Audience } from "./components/audience";
import { CTA } from "./components/cta";
import { Curriculum } from "./components/curriculum";
import { FAQ } from "./components/faq";
import { Hero } from "./components/hero";
import { Instructor } from "./components/instructor";
import { Modules } from "./components/modules";
import { NavBar } from "./components/nav-bar";
import { SiteFooter } from "./components/site-footer";
import { SocialProof } from "./components/social-proof";

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.home.meta);
};

const Home = async ({ params }: HomeProps) => {
  await params;

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[linear-gradient(180deg,#d6c4b4_0%,#eee5da_18%,#f7f2ea_42%,#fbf8f3_100%)] text-[#2c231a]">
        <Hero />
        <Audience />
        <Modules />
        <Curriculum />
        <Instructor />
        <SocialProof />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
};

export default Home;
