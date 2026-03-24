"use client";

import { useState } from "react";
import {
  BookOpenIcon,
  DownloadIcon,
  FileTextIcon,
  MessageSquareIcon,
  PenLineIcon,
  SparklesIcon,
} from "lucide-react";

interface LessonTabsProps {
  summaryContent: React.ReactNode;
  lessonId: string;
}

const tabs = [
  { id: "overzicht", label: "Overzicht", icon: BookOpenIcon },
  { id: "notities", label: "Notities", icon: PenLineIcon },
  { id: "extras", label: "Extra's", icon: SparklesIcon },
  { id: "feedback", label: "Feedback", icon: MessageSquareIcon },
] as const;

type TabId = (typeof tabs)[number]["id"];

export const LessonTabs = ({ summaryContent, lessonId }: LessonTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("overzicht");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-[#e8dfd0]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm transition-colors relative ${
                isActive
                  ? "text-[#2c231a] font-medium"
                  : "text-[#8b7355] hover:text-[#2c231a]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2c231a] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="pt-5">
        {activeTab === "overzicht" && summaryContent}

        {activeTab === "notities" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#2c231a]">Jouw notities</p>
              <span className="text-xs text-[#8b7355]">Automatisch opgeslagen</span>
            </div>
            <textarea
              placeholder="Schrijf hier je notities voor deze les..."
              className="w-full min-h-[200px] rounded-xl border border-[#e8dfd0] bg-white p-4 text-sm text-[#2c231a] placeholder:text-[#c4b5a0] focus:border-[#8b7355] focus:outline-none focus:ring-1 focus:ring-[#8b7355]/20 resize-y"
            />
            <p className="text-xs text-[#c4b5a0]">
              Tip: gebruik markdown voor opmaak. Je notities worden per les opgeslagen.
            </p>
          </div>
        )}

        {activeTab === "extras" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[#2c231a]">Bestanden & Prompts</p>

            {/* Downloads section */}
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-[#8b7355]">Downloads</p>
              <div className="space-y-1.5">
                {[
                  { name: "Lesmateriaal (PDF)", size: "2.4 MB" },
                  { name: "Presentatie slides", size: "5.1 MB" },
                ].map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-3 rounded-lg border border-[#e8dfd0] bg-white p-3 transition-colors hover:bg-[#faf7f2] cursor-pointer"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0e9dd]">
                      <FileTextIcon className="h-4 w-4 text-[#8b7355]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#2c231a]">{file.name}</p>
                      <p className="text-xs text-[#c4b5a0]">{file.size}</p>
                    </div>
                    <DownloadIcon className="h-4 w-4 text-[#8b7355]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Prompts section */}
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-[#8b7355]">Prompts</p>
              <div className="space-y-1.5">
                {[
                  { name: "Basis prompt template", desc: "Een goed startpunt voor je eerste AI prompt" },
                  { name: "Chain-of-thought prompt", desc: "Laat het model stap voor stap redeneren" },
                ].map((prompt) => (
                  <div
                    key={prompt.name}
                    className="rounded-lg border border-[#e8dfd0] bg-white p-3 transition-colors hover:bg-[#faf7f2] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <SparklesIcon className="h-3.5 w-3.5 text-[#c4956a]" />
                      <p className="text-sm font-medium text-[#2c231a]">{prompt.name}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-[#8b7355] ml-5.5">{prompt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[#2c231a]">Hoe vond je deze les?</p>
              <p className="mt-0.5 text-xs text-[#8b7355]">
                Je feedback helpt ons het lesmateriaal te verbeteren.
              </p>
            </div>

            {/* Rating */}
            <div className="flex gap-2">
              {["😕", "😐", "🙂", "😊", "🤩"].map((emoji, i) => (
                <button
                  key={emoji}
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e8dfd0] text-lg transition-colors hover:bg-[#f0e9dd] hover:border-[#c4b5a0]"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Feedback text */}
            <textarea
              placeholder="Heb je suggesties of opmerkingen? Laat het ons weten..."
              className="w-full min-h-[120px] rounded-xl border border-[#e8dfd0] bg-white p-4 text-sm text-[#2c231a] placeholder:text-[#c4b5a0] focus:border-[#8b7355] focus:outline-none focus:ring-1 focus:ring-[#8b7355]/20 resize-y"
            />

            <button
              type="button"
              className="rounded-full bg-[#2c231a] px-4 py-2 text-sm font-medium text-[#f5f0e8] transition-colors hover:bg-[#3d3127]"
            >
              Verstuur feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
