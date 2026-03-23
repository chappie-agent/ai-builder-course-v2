import { UserProfile } from "@repo/auth/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instellingen",
};

const SettingsPage = () => {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[#2c231a]">
          Instellingen
        </h1>
        <p className="mt-1 text-sm text-[#8b7355]">
          Beheer je account en voorkeuren.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#e8dfd0] bg-white">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "shadow-none border-0 w-full",
              navbar: "hidden",
              pageScrollBox: "p-0",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
