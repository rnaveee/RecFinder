export default {
  async fetch(request) {
    const ua = request.headers.get("user-agent") || "";
    const isCrawler =
      ua.includes("facebookexternalhit") || ua.includes("instagram");

    if (isCrawler) {
      const url = new URL(request.url);

      // Let asset requests pass through — crawlers also fetch og:image with their UA
      const isAsset = /\.(png|jpg|jpeg|gif|webp|svg|ico|js|css|woff2?)$/i.test(url.pathname);
      if (!isAsset) {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>RecFinder</title>
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="RecFinder" />
  <meta property="og:title" content="RecFinder" />
  <meta property="og:description" content="Find and join local pickup games, open gyms, scrimmages, and drop-ins near you." />
  <meta property="og:image" content="https://recfinder.ca/og-image.png" />
  <meta property="og:image:secure_url" content="https://recfinder.ca/og-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url.origin + url.pathname}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="RecFinder" />
  <meta name="twitter:description" content="Find and join local pickup games, open gyms, scrimmages, and drop-ins near you." />
  <meta name="twitter:image" content="https://recfinder.ca/og-image.png" />
</head>
<body></body>
</html>`;
        return new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    }

    return fetch(request);
  },
};
