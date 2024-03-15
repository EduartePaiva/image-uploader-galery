import UploadImage from "@/components/UploadImage";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="">
      <UserButton
        afterSignOutUrl="/sign-in"
        afterSwitchSessionUrl="/"
      />
      <UploadImage />
    </main>
  );
}
