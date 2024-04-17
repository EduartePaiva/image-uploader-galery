import Header from "./Header"
import Footer from "./Footer"
import Main from "./Main"
import BackToTopButton from "@/components/BackToTopButton"

export default function Home() {
    return (
        <div className="min-h-screen grid grid-rows-[min-content_1fr_80px]">
            <Header />
            <Main />
            <Footer />
            <BackToTopButton />
        </div>
    )
}
