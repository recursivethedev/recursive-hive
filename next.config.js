/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "placekitten.com",
      "gateway.pinata.cloud",
      "ipfs.io",
      "cloudflare-ipfs.com",
      "hexagon-ipfs.b-cdn.net",
      "hexagon.mypinata.cloud",
    ],
  }
};

module.exports = nextConfig;
