/** @type {import('next').NextConfig} */
import million from "million/compiler";

const nextConfig = {
  // Cho phép build ra thư mục khác để không đè .next của dev server đang chạy:
  // NEXT_DIST_DIR=.next-verify npm run build
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
      {
        protocol: "https",
        hostname: "evonhub.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "qr.sepay.vn",
        port: "",
        pathname: "/img**",
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
