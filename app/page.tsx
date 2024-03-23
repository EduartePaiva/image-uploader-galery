import UploadImage from "@/components/UploadImage";
import Header from "./Header";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="min-h-screen grid grid-rows-[50px_1fr_80px]">
      <Header />
      <main className="">
        <UploadImage />
      </main>
      <Footer />
    </div>
  );
}
