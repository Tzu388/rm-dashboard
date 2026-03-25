// ============================================================
// RM Dashboard — Cloudflare Worker Proxy
// Deploy at: workers.cloudflare.com (free, 100k req/day)
// ============================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Allowed upstream domains (whitelist for security)
const ALLOWED = [
  "query1.finance.yahoo.com",
  "query2.finance.yahoo.com",
  "api.frankfurter.app",
  "api.coingecko.com",
  "api.rss2json.com",
  "feeds.reuters.com",
  "www.mas.gov.sg",
  "api.fiscaldata.treasury.gov",
];

export default {
  async fetch(request) {
    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // ── /proxy?url=<encoded> ──────────────────────────────
    if (url.pathname === "/proxy") {
      const target = url.searchParams.get("url");
      if (!target) {
        return new Response(JSON.stringify({ error: "Missing url param" }), {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      let targetUrl;
      try {
        targetUrl = new URL(decodeURIComponent(target));
      } catch {
        return new Response(JSON.stringify({ error: "Invalid URL" }), {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      // Security: only proxy whitelisted domains
      if (!ALLOWED.some((d) => targetUrl.hostname.endsWith(d))) {
        return new Response(JSON.stringify({ error: "Domain not allowed" }), {
          status: 403,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      try {
        const upstream = await fetch(targetUrl.toString(), {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; RMDashboard/1.0)",
            Accept: "application/json, text/xml, */*",
          },
          cf: { cacheTtl: 60, cacheEverything: true }, // Cache 60s at edge
        });

        const contentType = upstream.headers.get("content-type") || "application/json";
        const body = await upstream.text();

        return new Response(body, {
          status: upstream.status,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=60",
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 502,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }
    }

    // ── /rss?url=<encoded> — converts RSS to JSON ─────────
    if (url.pathname === "/rss") {
      const target = url.searchParams.get("url");
      if (!target) {
        return new Response(JSON.stringify({ error: "Missing url" }), {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      try {
        const rssRes = await fetch(decodeURIComponent(target), {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; RMDashboard/1.0)" },
          cf: { cacheTtl: 300 },
        });
        const xml = await rssRes.text();

        // Simple XML→JSON parser for RSS
        const items = [];
        const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
        for (const match of itemMatches) {
          const block = match[1];
          const get = (tag) => {
            const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
            return m ? (m[1] || m[2] || "").trim() : "";
          };
          items.push({
            title: get("title"),
            description: get("description").replace(/<[^>]+>/g, "").slice(0, 200),
            link: get("link"),
            pubDate: get("pubDate"),
            category: get("category"),
          });
          if (items.length >= 10) break;
        }

        return new Response(JSON.stringify({ items }), {
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300",
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message, items: [] }), {
          status: 502,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }
    }

    // ── health check ──────────────────────────────────────
    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response(
        JSON.stringify({ status: "ok", service: "RM Dashboard Proxy", version: "1.0" }),
        { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  },
};
