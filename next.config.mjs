/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cho phép build ra thư mục khác để không đè .next của dev server đang chạy:
  // NEXT_DIST_DIR=.next-verify npm run build
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
        // Ảnh mẫu cho trang xem trước dashboard ở dev
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        // Ảnh chân dung mẫu cho trang xem trước hồ sơ ở dev
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/api/portraits/**",
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
        // Ảnh thumbnail video giới thiệu khi khóa chưa có ảnh bìa
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**",
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

export default nextConfig;
