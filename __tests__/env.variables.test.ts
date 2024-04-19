import { expect, test } from "vitest"
import { z } from "zod"

const envSchema = z.object({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    AWS_BUCKET_NAME: z.string(),
    AWS_BUCKET_REGION: z.string(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_LAMBDA_NAME: z.string(),
    AWS_LAMBDA_REGION: z.string(),
    AWS_PROCESSED_IMAGES_BUCKET_NAME: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),
    DATABASE_URL: z.string(),
})

export type envTypes = z.infer<typeof envSchema>

/**
 * @vitest-environment node
 */
test("Testing environment variables", () => {
    const envs = process.env
    console.log(envs)
    expect(envSchema.safeParse(envs).success).toBeTruthy()
})
