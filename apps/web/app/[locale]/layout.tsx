import "./styles.css";
import { AnalyticsProvider } from "@repo/analytics/provider";
import type { ReactNode } from "react";

interface LocaleLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
}

const LocaleLayout = async ({ children }: LocaleLayoutProperties) => {
  return <AnalyticsProvider>{children}</AnalyticsProvider>;
};

export default LocaleLayout;
