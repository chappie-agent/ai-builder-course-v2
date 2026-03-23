import {
  HelpCircleIcon,
  MailIcon,
  MessageSquareIcon,
  BookOpenIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support",
};

const supportOptions = [
  {
    icon: BookOpenIcon,
    title: "Documentatie",
    description: "Bekijk onze handleidingen en veelgestelde vragen.",
    href: "/courses",
    linkText: "Naar documentatie",
  },
  {
    icon: MessageSquareIcon,
    title: "Community",
    description: "Stel vragen en deel kennis met andere studenten.",
    href: "#",
    linkText: "Binnenkort beschikbaar",
    disabled: true,
  },
  {
    icon: MailIcon,
    title: "Contact",
    description: "Neem direct contact op met ons supportteam.",
    href: "mailto:support@chappie.ai",
    linkText: "Stuur een e-mail",
  },
];

const SupportPage = () => {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[#2c231a]">
          Support
        </h1>
        <p className="mt-1 text-sm text-[#8b7355]">
          Heb je hulp nodig? We helpen je graag verder.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {supportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.title}
              className="flex flex-col rounded-2xl border border-[#e8dfd0] bg-white p-5 transition-colors hover:border-[#c4b5a0]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f0e8]">
                <Icon className="h-5 w-5 text-[#8b7355]" />
              </div>
              <h3 className="text-sm font-semibold text-[#2c231a]">
                {option.title}
              </h3>
              <p className="mt-1 flex-1 text-xs text-[#8b7355]">
                {option.description}
              </p>
              {option.disabled ? (
                <span className="mt-3 text-xs font-medium text-[#c4b5a0]">
                  {option.linkText}
                </span>
              ) : (
                <Link
                  href={option.href}
                  className="mt-3 text-xs font-medium text-[#c4956a] transition-colors hover:text-[#8b7355]"
                >
                  {option.linkText} →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-[#e8dfd0] bg-[#faf7f2] p-5">
        <div className="flex items-start gap-3">
          <HelpCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#8b7355]" />
          <div>
            <h3 className="text-sm font-semibold text-[#2c231a]">
              Veelgestelde vragen
            </h3>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm font-medium text-[#2c231a]">
                  Hoe reset ik mijn voortgang?
                </p>
                <p className="mt-0.5 text-xs text-[#8b7355]">
                  Je kunt bij elke les op "Voltooid" klikken om de status te
                  toggelen.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#2c231a]">
                  Kan ik offline lessen volgen?
                </p>
                <p className="mt-0.5 text-xs text-[#8b7355]">
                  Op dit moment is een internetverbinding vereist om lessen te
                  volgen.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#2c231a]">
                  Hoe krijg ik toegang tot premium modules?
                </p>
                <p className="mt-0.5 text-xs text-[#8b7355]">
                  Upgrade je account via de cursuspagina om toegang te krijgen
                  tot alle modules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
