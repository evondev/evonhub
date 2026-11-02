import { NextResponse, type NextRequest } from "next/server";

// App chạy được code trên máy, nên chỉ nhận request gửi tới đúng localhost.
// Chặn DNS rebinding: một trang web lạ trỏ tên miền của nó về 127.0.0.1 thì Host vẫn là tên miền lạ.
const allowedHostnames = new Set(["localhost", "127.0.0.1", "[::1]"]);

function readHostname(hostHeader: string | null) {
  if (!hostHeader) return "";
  if (hostHeader.startsWith("[")) return hostHeader.slice(0, hostHeader.indexOf("]") + 1);

  return hostHeader.split(":")[0];
}

export function proxy(request: NextRequest) {
  const hostname = readHostname(request.headers.get("host"));

  if (!allowedHostnames.has(hostname)) {
    return new NextResponse("evon-lab chỉ mở trên localhost.", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
