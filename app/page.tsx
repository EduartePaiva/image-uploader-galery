import BackToTopButton from "@/components/back-to-top-button";

import Footer from "./footer";
import Header from "./header";
import Main from "./main";

export default function Home() {
    return (
        <div className="grid min-h-screen grid-rows-[min-content_1fr_80px]">
            <Header />
            <Main />
            <Footer />
            <BackToTopButton />
        </div>
    );
}
