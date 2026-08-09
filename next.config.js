/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    // Product art (character frames, objects, tilesets) is static once
    // generated — never overwritten in place, only added/replaced wholesale.
    // Without this, Vercel's default `max-age=0, must-revalidate` forces a
    // revalidation request on every reference, and AnimatedCharacter's
    // 150ms frame-cycling interval turns that into a request storm per
    // open tab (this is what blew through the account's Edge Request quota).
    return [
      {
        source: "/characters/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/objects/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/tilesets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
}

module.exports = nextConfig
