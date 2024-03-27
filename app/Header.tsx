import { UserButton } from "@clerk/nextjs";

export default function Header() {
    return (
        <header className="container h-20 self-center flex justify-between items-center">
            <h1>Gallery</h1>
            <UserButton
                afterSignOutUrl="/sign-in"
                afterSwitchSessionUrl="/"
            />
        </header>
    )
}