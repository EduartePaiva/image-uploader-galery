import { ModeToggle } from "@/components/ThemeModeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
    return (
        <header className="container h-20 mb-10 self-center flex items-center gap-4">
            <h1 className="font-semibold text-4xl tracking-wider mr-auto">Gallery</h1>
            <ModeToggle />
            <UserButton />
        </header>
    )
}