import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// If you use `request` you don't need the type
export async function POST(req: NextRequest) {
  // Get the user ID from the session
  const { userId } = getAuth(req);
  // get request body

  if (!userId) return NextResponse.redirect("/sign-in");

  // The user attributes to update
  //  get params from request body
  const params = await req.json();
  console.log("POST ~ params:", params);

  const updatedUser = await clerkClient.users.updateUser(userId, params);
  // refetch the user to get the updated data
  await clerkClient.users.getUser(userId);

  return NextResponse.json({ updatedUser });
}
