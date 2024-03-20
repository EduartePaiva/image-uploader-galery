'use client'

import triggerRustLambda from "@/actions/triggerRustLambda";
import UploadImage from "@/components/UploadImage";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="">
      <UserButton
        afterSignOutUrl="/sign-in"
        afterSwitchSessionUrl="/"
      />
      <UploadImage />

      <Button onClick={() => triggerRustLambda("my image")}>trigger lambda</Button>
    </main>
  );
}
