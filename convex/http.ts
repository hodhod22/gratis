// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/storage/:storageId",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const storageId = url.pathname.split("/").pop();
    if (!storageId) {
      return new Response("Missing storageId", { status: 400 });
    }
    const storageUrl = await ctx.storage.getUrl(storageId as any);
    if (!storageUrl) {
      return new Response("File not found", { status: 404 });
    }
    // Omdirigera till den faktiska fil-URL:en från Convex CDN
    return Response.redirect(storageUrl);
  }),
});

export default http;
