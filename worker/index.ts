import { DurableObject } from "cloudflare:workers";
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  PAGE_VIEW_COUNTER: DurableObjectNamespace<PageViewCounter>;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const COUNTER_KEY = "pageViews";
const counterHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
};

export class PageViewCounter extends DurableObject<Env> {
  async current() {
    const stored = await this.ctx.storage.get<number>(COUNTER_KEY);
    return stored ?? 0;
  }

  async increment() {
    const next = (await this.current()) + 1;
    await this.ctx.storage.put(COUNTER_KEY, next);
    return next;
  }
}

async function handlePageViews(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET" && request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: { ...counterHeaders, Allow: "GET, POST" } });
  }

  const origin = request.headers.get("Origin");
  const url = new URL(request.url);
  if (request.method === "POST" && origin && origin !== url.origin) {
    return Response.json({ error: "Cross-origin requests are not allowed" }, { status: 403, headers: counterHeaders });
  }

  try {
    const counter = env.PAGE_VIEW_COUNTER.getByName("site-total");
    const count = request.method === "POST" ? await counter.increment() : await counter.current();
    return Response.json({ count }, { headers: counterHeaders });
  } catch (error) {
    console.error("Page-view counter failed", error);
    return Response.json({ error: "Counter temporarily unavailable" }, { status: 503, headers: counterHeaders });
  }
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/page-views") {
      return handlePageViews(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
