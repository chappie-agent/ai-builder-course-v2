"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Modules", href: "/#modules" },
  { label: "Cases", href: "/cases" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const NavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-4 right-0 left-0 z-50 px-4 sm:top-6 sm:mx-auto sm:w-fit sm:px-0">
      {/* Desktop pill nav */}
      <div className="hidden items-center gap-1 rounded-full border border-[#e8dfd0]/60 bg-white/80 px-2 py-1.5 shadow-sm backdrop-blur-md sm:flex">
        <Link
          href="/"
          className="mr-2 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-[#2c231a]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2c231a] text-[10px] font-bold text-[#f5f0e8]">
            AI
          </span>
          AI Builder Course
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="rounded-full px-4 py-1.5 text-sm text-[#6b5c4c] transition-colors hover:bg-[#f5f0e8] hover:text-[#2c231a]"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/enroll"
          className="ml-1 rounded-full bg-[#2c231a] px-5 py-1.5 text-sm font-medium text-[#f5f0e8] transition-colors hover:bg-[#3d3127]"
        >
          Enroll
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="relative flex justify-end sm:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8dfd0]/60 bg-white/80 shadow-sm backdrop-blur-md"
          aria-label="Toggle menu"
        >
          {open ? (
            <X className="h-5 w-5 text-[#2c231a]" />
          ) : (
            <Menu className="h-5 w-5 text-[#2c231a]" />
          )}
        </button>

        {open && (
          <div className="absolute top-14 right-0 z-50 flex w-[min(18rem,calc(100vw-2rem))] flex-col gap-1 rounded-2xl border border-[#e8dfd0]/60 bg-white/95 p-3 shadow-lg backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm text-[#6b5c4c] transition-colors hover:bg-[#f5f0e8]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/enroll"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-[#2c231a] px-4 py-2.5 text-center text-sm font-medium text-[#f5f0e8]"
            >
              Enroll now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
