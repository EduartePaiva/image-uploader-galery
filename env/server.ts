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
    },
    onValidationError: (error: ZodError) => {
        console.error("❌ Invalid environment variables:", error.flatten().fieldErrors);
        process.exit(1);
    },
    emptyStringAsUndefined: true,
    experimental__runtimeEnv: process.env,
});
