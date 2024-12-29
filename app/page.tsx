import Header from "./header";
import Footer from "./footer";
import Main from "./main";
import BackToTopButton from "@/components/back-to-top-button";

export default function Home() {
    return (
        <div className="min-h-screen grid grid-rows-[min-content_1fr_80px]">
            <Header />
            <Main />
            <Footer />
            <BackToTopButton />
        </div>
    );
}
