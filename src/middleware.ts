import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook", "/courses", "/not-found"],
  ignoredRoutes: [
    "/((?!api|trpc))(_next.*|.+.[w]+$)",
    "/api/uploadthing",
    "/api/webhook",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
