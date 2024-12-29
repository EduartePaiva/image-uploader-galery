"use client";

import { useUser } from "@clerk/nextjs";
import { Skeleton } from "./ui/skeleton";

export default function HowMuchImages() {
    const { user } = useUser();

    function generateMetadata() {
        if (user != undefined) {
            const userPlan = user.publicMetadata.user_plan ?? "free";
            let userAllowedImages = 100;

            switch (userPlan) {
                case "free":
                    userAllowedImages = 100;
                    break;
            }
            return <span>{userAllowedImages - (user.publicMetadata.user_images_count ?? 0)}</span>;
        }
        return (
            <Skeleton className="w-8 text-center inline-block">
                <span>&nbsp;</span>
            </Skeleton>
        );
    }

    return <span className="text-lg">You can upload {generateMetadata()} images</span>;
}
