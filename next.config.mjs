/** @type {import('next').NextConfig} */
import million from "million/compiler";

const nextConfig = {
  env: {
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "spotlight-modern.highfivethemes.com",
        port: "",
        pathname: "/content/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/sign-in(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default million.next(nextConfig);
