import HowMuchImages from "@/components/how-much-images";
import ShowUserButton from "@/components/show-user-button";
import { ModeToggle } from "@/components/theme-mode-toggle";

export default function Header() {
    return (
        <header className="container mb-10 flex h-20 items-center gap-4 self-center">
            <h1 className="mr-auto text-4xl font-semibold tracking-wider">Gallery</h1>
            <HowMuchImages />
            <ModeToggle />
            <ShowUserButton />
        </header>
    );
}
