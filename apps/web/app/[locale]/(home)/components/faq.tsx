import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";
import Link from "next/link";

const faqItems = [
  {
    question: "Is this course for beginners or more advanced builders?",
    answer:
      "It is designed for ambitious beginners, creators, developers, and founders who want a practical path into building with AI. The focus is on real application, not abstract theory.",
  },
  {
    question: "Will I learn more than prompting?",
    answer:
      "Yes. Prompting is only one piece. The course also covers AI-assisted development, OpenClaw, agents, automation, workflows, image generation, video generation, and turning ideas into shippable products.",
  },
  {
    question: "Do I need to know how to code already?",
    answer:
      "Not necessarily. Some parts are very accessible, while other tracks go deeper into product building and development. The point is to help you build further from where you are now.",
  },
  {
    question: "Is this mainly theory or practical work?",
    answer:
      "Strongly practical. The goal is that you leave with clearer workflows, stronger building confidence, and concrete outcomes you can actually use or show.",
  },
  {
    question: "What kind of projects will I make?",
    answer:
      "Think landing pages, AI workflows, agent systems, content engines, product concepts, automation flows, and portfolio-worthy capstone style projects.",
  },
  {
    question: "Can this also help my business or team?",
    answer:
      "Yes. Besides individual learning, the course direction can also support founders, operators, and teams that want to apply AI in a practical and scalable way.",
  },
];

export const FAQ = () => {
  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 shadow-sm sm:rounded-[3rem] sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:p-12">
          <div className="reveal-up">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#8b7355]">
              FAQ
            </p>
            <h2 className="max-w-md text-3xl font-medium leading-tight tracking-tight text-[#2c231a] sm:text-4xl md:text-5xl">
              Questions people often ask before they join
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#6b5c4c]/75 md:text-lg">
              A few clear answers to help you understand how the course feels, who it is for, and what kind of outcomes to expect.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-[#cfb89e]/70 bg-white/70 px-5 py-2.5 text-sm font-medium text-[#2c231a] transition-colors hover:bg-white"
              >
                Ask your own question
              </Link>
            </div>
          </div>

          <div className="reveal-up-delay">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={item.question}
                  className="overflow-hidden rounded-[1.25rem] border border-[#e8dfd0]/60 bg-white/75 px-5"
                  style={{ animationDelay: `${140 + index * 70}ms` }}
                >
                  <AccordionTrigger className="text-left text-base font-medium text-[#2c231a] hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-[#6b5c4c]/78 sm:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};
