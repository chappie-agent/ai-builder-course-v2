import Link from "next/link";

const footerLinks = [
  {
    heading: "Learn",
    links: [
      { label: "Curriculum", href: "/#curriculum" },
      { label: "Modules", href: "/#modules" },
      { label: "Cases", href: "/cases" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      // TODO: replace with real Community URL when available
      { label: "Community", href: "/contact" },
      // TODO: replace with real OpenClaw URL when available
      { label: "OpenClaw", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      // TODO: replace with real About page URL when available
      { label: "About", href: "/contact" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
];

export const SiteFooter = () => {
  return (
    <footer className="w-full border-t border-[#e8dfd0]/40 bg-[#faf7f2]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2c231a] text-[10px] font-bold text-[#f5f0e8]">
                AI
              </span>
              <span className="font-semibold text-[#2c231a]">AI Builder Course</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6b5c4c]/70">
              A premium AI course for builders who want to ship real products
              with modern AI tools and workflows.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#8b7355]">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6b5c4c]/70 transition-colors hover:text-[#2c231a]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#e8dfd0]/40 pt-8 sm:flex-row">
          <p className="text-xs text-[#8b7355]/60">
            &copy; {new Date().getFullYear()} AI Builder Course. All rights reserved.
          </p>
          <p className="text-xs text-[#8b7355]/40">
            Crafted with care
          </p>
        </div>
      </div>
    </footer>
  );
};
