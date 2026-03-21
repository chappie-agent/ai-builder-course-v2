import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { NavBar } from "../(home)/components/nav-bar";
import { SiteFooter } from "../(home)/components/site-footer";
import { ContactForm } from "./components/contact-form";

interface ContactProps {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: ContactProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.contact.meta);
};

const Contact = async ({ params }: ContactProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[linear-gradient(180deg,#d6c4b4_0%,#eee5da_18%,#f7f2ea_42%,#fbf8f3_100%)] px-4 pt-28 pb-16 text-[#2c231a] sm:px-6 md:pt-32 md:pb-24">
        <ContactForm dictionary={dictionary} />
      </main>
      <SiteFooter />
    </>
  );
};

export default Contact;
