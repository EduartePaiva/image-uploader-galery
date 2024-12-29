import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { ZodError, z } from "zod";

config();

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "production"]),
        DATABASE_URL: z.string().url(),
        DB_MIGRATING: z
            .string()
            .refine((s) => s === "true" || s === "false")
            .transform((s) => s === "true")
            .optional(),
        MY_AWS_BUCKET_REGION: z.string(),
        MY_AWS_ACCESS_KEY: z.string(),
        MY_AWS_SECRET_ACCESS_KEY: z.string(),
        MY_AWS_LAMBDA_NAME: z.string(),
        MY_AWS_LAMBDA_REGION: z.string(),
        MY_AWS_PROCESSED_IMAGES_BUCKET_NAME: z.string(),
        MY_AWS_BUCKET_NAME: z.string()
    },
    onValidationError: (error: ZodError) => {
        console.error("❌ Invalid environment variables:", error.flatten().fieldErrors);
        process.exit(1);
    },
    emptyStringAsUndefined: true,
    // eslint-disable-next-line n/no-process-env
    experimental__runtimeEnv: process.env,
});
