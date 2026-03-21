import { authMiddleware } from "@repo/auth/proxy";
import { internationalizationMiddleware } from "@repo/internationalization/proxy";
import { parseError } from "@repo/observability/error";
import { secure } from "@repo/security";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/proxy";
import { createNEMO } from "@rescale/nemo";
import { type NextProxy, type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|ingest|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};

const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

const arcjetMiddleware = async (request: NextRequest) => {
  if (!env.ARCJET_KEY || env.ARCJET_KEY.includes("placeholder")) {
    return;
  }

  try {
    await secure(
      [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
        "CATEGORY:MONITOR",
      ],
      request
    );
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 403 });
  }
};

const composedMiddleware = createNEMO(
  {},
  {
    before: [internationalizationMiddleware, arcjetMiddleware],
  }
);

const hasRealClerkKey =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder");

const baseMiddleware = async (request: NextRequest, event: Parameters<NextProxy>[1]) => {
  const headersResponse = securityHeaders();
  const middlewareResponse = await composedMiddleware(
    request as unknown as NextRequest,
    event
  );

  return middlewareResponse || headersResponse;
};

const middleware = hasRealClerkKey
  ? authMiddleware(async (_auth, request, event) => {
      return baseMiddleware(request as unknown as NextRequest, event);
    })
  : (async (request: NextRequest, event: Parameters<NextProxy>[1]) => {
      return baseMiddleware(request, event);
    });

export default middleware as unknown as NextProxy;
