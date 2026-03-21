import { withCMS } from "@repo/cms/next-config";
import { withToolbar } from "@repo/feature-flags/lib/toolbar";
import { config, withAnalyzer } from "@repo/next-config";
import { withLogging, withSentry } from "@repo/observability/next-config";
import type { NextConfig } from "next";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "@/env";

const projectDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = join(projectDirectory, "../..");

let nextConfig: NextConfig = withToolbar(
  withLogging({
    ...config,
    outputFileTracingRoot: workspaceRoot,
    turbopack: {
      root: workspaceRoot,
    },
  })
);

nextConfig.images?.remotePatterns?.push({
  protocol: "https",
  hostname: "assets.basehub.com",
});

if (process.env.NODE_ENV === "production") {
  const redirects: NextConfig["redirects"] = async () => [
    {
      source: "/legal",
      destination: "/legal/privacy",
      statusCode: 301,
    },
  ];

  nextConfig.redirects = redirects;
}

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

export default withCMS(nextConfig);
