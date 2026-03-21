"use client";

import type { ReactNode } from "react";

interface NotificationsProviderProps {
  children: ReactNode;
  theme?: string;
  userId: string;
}

// Knock notifications disabled — no-op passthrough
export const NotificationsProvider = ({
  children,
}: NotificationsProviderProps) => {
  return <>{children}</>;
};
