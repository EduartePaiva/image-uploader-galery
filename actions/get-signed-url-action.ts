"use server";

import db from "@/db";
import { images } from "@/db/schema";
import { env } from "@/env/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth, clerkClient } from "@clerk/nextjs/server";
import crypto from "crypto";
import { z } from "zod";
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
    region: env.MY_AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: env.MY_AWS_ACCESS_KEY,
        secretAccessKey: env.MY_AWS_SECRET_ACCESS_KEY,
    },
});

const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const maxFileSize = 1024 * 1024 * 10; //10MB

const zodSchema = z.object({
    type: z.string(),
    size: z.number(),
    checksum: z.string(),
    x1: z.string(),
    y1: z.string(),
    portraitWidth: z.string(),
    portraitHight: z.string(),
});

export default async function getSignedURL(unparsedGetSignedParams: z.infer<typeof zodSchema>) {
    try {
        const { checksum, portraitHight, portraitWidth, size, type, x1, y1 } =
            zodSchema.parse(unparsedGetSignedParams);
        const { userId } = await auth();
        if (!userId) {
            return { failure: "Not authenticated" };
        }

        //validate the user plan
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        let { user_images_count, user_plan } = user.publicMetadata;
        if (user_plan === undefined) user_plan = "free";
        if (user_images_count === undefined) user_images_count = 0;
        if (user_plan === "free" && user_images_count >= 100) {
            return { failure: "User already have 100 images" };
        }

        if (!acceptedTypes.includes(type)) {
            return { failure: "Invalid file type" };
        }
        if (size > maxFileSize) {
            return { failure: "File too large" };
        }

        const imageName = generateFileName();

        const putObjectCommand = new PutObjectCommand({
            Bucket: env.MY_AWS_BUCKET_NAME,
            Key: imageName,
            ContentType: type,
            ContentLength: size,
            ChecksumSHA256: checksum,
            Metadata: {
                x1,
                y1,
                portraitWidth,
                portraitHight,
            },
        });
        // the metadata will be used to associate data with s3 later
        const signedURLPromise = getSignedUrl(s3, putObjectCommand, {
            expiresIn: 60,
        });

        const postIdPromise = db
            .insert(images)
            .values({
                imageURL: imageName,
                userId,
            })
            .returning({ postId: images.id })
            .then((val) => val[0].postId);

        const [signedURL, postId] = await Promise.all([signedURLPromise, postIdPromise]);

        if (!postId || postId === "") {
            return { failure: "Error creating post draft" };
        }

        //await clerk finish the starting job
        return { success: { url: signedURL, postId } };
    } catch (err) {
        return { failure: `${err}` };
    }
}
