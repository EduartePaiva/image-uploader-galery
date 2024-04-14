"use client"
import { UserButton, useUser } from "@clerk/nextjs"
import { Skeleton } from "./ui/skeleton"

export default function ShowUserButton() {
    const { isLoaded } = useUser()
    return (
        <div className="w-8 h-8 rounded-full">
            {isLoaded ? (
                <UserButton />
            ) : (
                <Skeleton className="w-full h-full rounded-full"></Skeleton>
            )}
        </div>
    )
}
