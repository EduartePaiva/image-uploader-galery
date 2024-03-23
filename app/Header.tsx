import { UserButton } from "@clerk/nextjs";

export default function Header() {
    return (
        <header className="self-center flex justify-end pl-12 pr-12">
            <UserButton
                afterSignOutUrl="/sign-in"
                afterSwitchSessionUrl="/"
            />
        </header>
    )
}