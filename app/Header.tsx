import { UserButton } from "@clerk/nextjs";

export default function Header() {
    return (
        <header className="container h-20 mb-10 self-center flex justify-between items-center">
            <h1 className="font-semibold text-4xl tracking-wider">Gallery</h1>
            <UserButton
                afterSignOutUrl="/sign-in"
                afterSwitchSessionUrl="/"
            />
        </header>
    )
}