import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="w-full h-screen flex items-center justify-center">
        <SignIn />
      </div>
    </>
  );
}
