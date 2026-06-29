import figmaTokens from "./figma-tokens.json";

export function createFigmaTokensResponse(): Response {
  return new Response(JSON.stringify(figmaTokens, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
