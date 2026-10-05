import type { SignIn } from "@clerk/nextjs";
import type { ComponentProps } from "react";

/** Bộ chỉnh giao diện của form Clerk (SignIn, SignUp dùng chung một dạng) */
export type ClerkAppearance = ComponentProps<typeof SignIn>["appearance"];
