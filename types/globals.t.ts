export {}

declare global {
    interface UserPublicMetadata {
        user_plan?: "free"
        user_images_count?: number
    }

    namespace NodeJS {
        export interface ProcessEnv {
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
            CLERK_SECRET_KEY: string
            MY_AWS_BUCKET_NAME: string
            MY_AWS_BUCKET_REGION: string
            MY_AWS_ACCESS_KEY: string
            MY_AWS_SECRET_ACCESS_KEY: string
            MY_AWS_LAMBDA_NAME: string
            MY_AWS_LAMBDA_REGION: string
            MY_AWS_PROCESSED_IMAGES_BUCKET_NAME: string
            NEXT_PUBLIC_CLERK_SIGN_IN_URL: string
            NEXT_PUBLIC_CLERK_SIGN_UP_URL: string
            NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string
            NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string
            DATABASE_URL: string
        }
    }
}
