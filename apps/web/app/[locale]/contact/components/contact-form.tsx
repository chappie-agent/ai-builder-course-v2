"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import type { Dictionary } from "@repo/internationalization";
import { Check, Mail, MoveRight, Sparkles } from "lucide-react";

interface ContactFormProps {
  dictionary: Dictionary;
}

export const ContactForm = ({ dictionary }: ContactFormProps) => {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#e8dfd0]/60 bg-gradient-to-br from-[#f5f0e8] via-[#ede6da] to-[#e8dfd0] px-6 py-14 shadow-sm sm:rounded-[3rem] sm:px-12 md:px-16 md:py-20">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#8b7355]">
            Contact
          </p>
          <h1 className="max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Let’s design your next AI build
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6b5c4c]/80 md:text-lg">
            Whether you want a course question answered, a tailored training,
            or a smarter AI workflow for your business, this is the right place
            to start.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Check,
                title: "Practical guidance",
                description: "Clear answers focused on real building, not abstract theory.",
              },
              {
                icon: Sparkles,
                title: "Visual thinking",
                description: "Shape concepts into flows, interfaces, and concrete next steps.",
              },
              {
                icon: Mail,
                title: "Fast follow-up",
                description: "Use the form to start a conversation around training or implementation.",
              },
              {
                icon: Check,
                title: "AI-first strategy",
                description: "Explore automation, agents, OpenClaw, and practical AI systems.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[#dbcab7]/60 bg-white/50 p-5"
              >
                <item.icon className="h-5 w-5 text-[#8b7355]" />
                <h3 className="mt-4 text-lg font-medium text-[#2c231a]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b5c4c]/75">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 shadow-sm sm:rounded-[3rem] sm:p-8 md:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8b7355]">
            Start the conversation
          </p>
          <div className="mt-6 space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="firstname">{dictionary.web.contact.hero.form.firstName}</Label>
              <Input id="firstname" type="text" className="h-12 rounded-xl border border-[#d8c8b5] bg-white px-4 outline-none focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastname">{dictionary.web.contact.hero.form.lastName}</Label>
              <Input id="lastname" type="text" className="h-12 rounded-xl border border-[#d8c8b5] bg-white px-4 outline-none focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="h-12 rounded-xl border border-[#d8c8b5] bg-white px-4 outline-none focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal">What do you want to build?</Label>
              <textarea
                id="goal"
                className="min-h-36 rounded-[1.25rem] border border-[#d8c8b5] bg-white px-4 py-3 text-sm text-[#2c231a] outline-none"
                placeholder="Tell me about the course question, automation, workflow, or AI build you want help with."
              />
            </div>
            <Button className="h-12 w-full gap-2 rounded-full bg-[#2c231a] text-[#f5f0e8] hover:bg-[#3d3127]">
              {dictionary.web.contact.hero.form.cta}
              <MoveRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
