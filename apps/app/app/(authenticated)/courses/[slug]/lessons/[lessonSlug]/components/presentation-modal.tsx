"use client";

import type { Slide } from "@repo/database";
import { Button } from "@repo/design-system/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PresentationIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface PresentationButtonProps {
  slides: Slide[];
  lessonTitle: string;
}

export const PresentationButton = ({ slides, lessonTitle }: PresentationButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setCurrentSlide(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose, handlePrev, handleNext]);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => setIsOpen(true)}
      >
        <PresentationIcon className="mr-2 h-4 w-4" />
        Bekijk slides
      </Button>
    );
  }

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#2c231a]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#3d3128] px-6 py-3">
        <p className="text-sm text-[#c4b5a0]">
          {lessonTitle} — Slides
        </p>
        <button
          onClick={handleClose}
          className="text-[#c4b5a0] hover:text-[#f5f0e8] transition-colors"
          type="button"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Slide content */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-2xl rounded-xl bg-[#f5f0e8] p-8 text-[#2c231a]">
          <h2 className="mb-4 text-center text-xl font-bold">{slide.title}</h2>
          {slide.imageUrl && (
            <div className="mb-4 overflow-hidden rounded-lg">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full"
              />
            </div>
          )}
          <p className="text-center leading-relaxed text-[#6b5c4c]">
            {slide.content}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-[#3d3128] px-6 py-3">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="text-sm text-[#c4b5a0] hover:text-[#f5f0e8] disabled:opacity-30 transition-colors"
          type="button"
        >
          <ChevronLeftIcon className="mr-1 inline h-4 w-4" />
          Vorige
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === currentSlide ? "bg-[#c4b5a0]" : "bg-[#3d3128]"
              }`}
              type="button"
              aria-label={`Slide ${i + 1}`}
            />
          ))}
          <span className="ml-2 text-xs tabular-nums text-[#8b7355]">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          className="text-sm text-[#c4b5a0] hover:text-[#f5f0e8] disabled:opacity-30 transition-colors"
          type="button"
        >
          Volgende
          <ChevronRightIcon className="ml-1 inline h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
