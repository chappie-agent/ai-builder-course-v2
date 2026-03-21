"use client";

import type { ReactNode } from "react";

interface NotificationsProviderProperties {
  children: ReactNode;
  userId: string;
}

// Knock notifications disabled — no provider needed
export const NotificationsProvider = ({
  children,
}: NotificationsProviderProperties) => {
  return <>{children}</>;
};
