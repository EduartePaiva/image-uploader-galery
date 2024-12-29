import type { UserResource } from "@clerk/types";

export function canUserUploadImage(user: UserResource | null | undefined): boolean {
    if (user === undefined || user === null) return false;
    if (
        user.publicMetadata.user_images_count === undefined ||
        user.publicMetadata.user_plan === undefined
    )
        // this true is because a user exists, but the public metadata is undefined because he never uploaded
        return true;
    let howMuchUserCanHave = 100;
    switch (user.publicMetadata.user_plan) {
        case "free":
            howMuchUserCanHave = 100;
            break;
        default:
            return false;
    }
    return user.publicMetadata.user_images_count < howMuchUserCanHave;
}
