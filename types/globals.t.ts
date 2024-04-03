export { };

declare global {
    interface UserPublicMetadata {
        user_plan?: "free"
        user_images_count?: number;
    }
}